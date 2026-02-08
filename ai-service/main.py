"""
MedVision AI Service
FastAPI service for medical AI capabilities:
- Symptom diagnosis
- Medical report analysis (OCR + Vision)
- Drug interaction checking
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from contextlib import asynccontextmanager
import uuid
import os
from loguru import logger

from services.symptom_analyzer import SymptomAnalyzer
from services.report_analyzer import ReportAnalyzer
from services.llm_service import LLMService

# Configure logging
logger.remove()
logger.add(
    "logs/ai_service.log",
    rotation="500 MB",
    retention="10 days",
    level="INFO"
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("MedVision AI Service starting up...")
    yield
    logger.info("MedVision AI Service shutting down...")

app = FastAPI(
    title="MedVision AI Service",
    description="Medical AI capabilities for diagnosis and report analysis",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
symptom_analyzer = SymptomAnalyzer()
report_analyzer = ReportAnalyzer()
llm_service = LLMService()

# Enums
class SeverityLevel(str, Enum):
    low = "low"
    moderate = "moderate"
    high = "high"
    emergency = "emergency"

class ValueStatus(str, Enum):
    low = "low"
    normal = "normal"
    high = "high"

# Request/Response Models
class SymptomRequest(BaseModel):
    message: str
    symptoms: Optional[List[str]] = None
    medical_history: Optional[List[str]] = None
    age: Optional[int] = None
    sex: Optional[str] = None

class DiagnosisResponse(BaseModel):
    message: str
    diagnosis: Dict[str, Any]
    recommendations: List[str]
    follow_up_questions: Optional[List[str]] = None
    confidence: float

class ReportAnalysisRequest(BaseModel):
    report_type: str = "general"
    user_id: Optional[str] = None

class FlaggedValue(BaseModel):
    name: str
    value: str
    unit: str
    normal_range: str
    status: ValueStatus
    explanation: str
    severity: SeverityLevel

class ReportAnalysisResponse(BaseModel):
    status: str
    overall_status: SeverityLevel
    summary: str
    flagged_values: List[FlaggedValue]
    recommendations: List[str]
    raw_text: Optional[str] = None
    confidence: float

class DrugInteractionRequest(BaseModel):
    medications: List[str]

class DrugInteractionResponse(BaseModel):
    has_interactions: bool
    interactions: List[Dict[str, Any]]
    warnings: List[str]

# API Routes

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/api/diagnose", response_model=DiagnosisResponse)
async def diagnose_symptoms(request: SymptomRequest):
    """
    Analyze symptoms and provide potential diagnoses
    """
    logger.info(f"Received symptom analysis request: {request.message[:100]}...")
    
    try:
        # Check for emergency keywords
        emergency_keywords = [
            "chest pain", "difficulty breathing", "stroke", "heart attack",
            "severe bleeding", "cant breathe", "can't breathe", "unconscious"
        ]
        
        message_lower = request.message.lower()
        is_emergency = any(kw in message_lower for kw in emergency_keywords)
        
        if is_emergency:
            return DiagnosisResponse(
                message="⚠️ Based on your symptoms, I strongly recommend seeking immediate medical attention. Please call emergency services (911) or go to your nearest emergency room.",
                diagnosis={
                    "severity": "emergency",
                    "conditions": ["Medical emergency suspected"],
                    "confidence": 0.95
                },
                recommendations=[
                    "Call 911 immediately",
                    "Do not drive yourself to the hospital",
                    "If conscious, stay calm and wait for emergency responders"
                ],
                follow_up_questions=None,
                confidence=0.95
            )
        
        # Use LLM for diagnosis
        diagnosis = await llm_service.analyze_symptoms(
            message=request.message,
            symptoms=request.symptoms,
            medical_history=request.medical_history
        )
        
        # Use rule-based analyzer for additional insights
        rule_based = symptom_analyzer.analyze(request.message)
        
        # Combine results
        combined_recommendations = list(set(
            diagnosis.get("recommendations", []) + 
            rule_based.get("recommendations", [])
        ))
        
        return DiagnosisResponse(
            message=diagnosis.get("message", "I've analyzed your symptoms."),
            diagnosis={
                "severity": rule_based.get("severity", "unknown"),
                "conditions": diagnosis.get("conditions", []),
                "confidence": diagnosis.get("confidence", 0.5)
            },
            recommendations=combined_recommendations,
            follow_up_questions=diagnosis.get("follow_up_questions"),
            confidence=diagnosis.get("confidence", 0.5)
        )
        
    except Exception as e:
        logger.error(f"Diagnosis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Diagnosis failed")

@app.post("/api/analyze-report", response_model=ReportAnalysisResponse)
async def analyze_medical_report(
    file: UploadFile = File(...),
    report_type: str = "general"
):
    """
    Analyze uploaded medical report (PDF, image, etc.)
    """
    logger.info(f"Received report analysis request: {file.filename}")
    
    try:
        # Save file temporarily
        temp_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
        content = await file.read()
        
        with open(temp_path, "wb") as f:
            f.write(content)
        
        # Analyze report
        analysis = await report_analyzer.analyze(temp_path, report_type)
        
        # Clean up
        os.remove(temp_path)
        
        return ReportAnalysisResponse(
            status="complete",
            overall_status=analysis.get("overall_status", "unknown"),
            summary=analysis.get("summary", ""),
            flagged_values=[
                FlaggedValue(
                    name=fv["name"],
                    value=fv["value"],
                    unit=fv["unit"],
                    normal_range=fv["normal_range"],
                    status=ValueStatus(fv["status"]),
                    explanation=fv["explanation"],
                    severity=SeverityLevel(fv["severity"])
                )
                for fv in analysis.get("flagged_values", [])
            ],
            recommendations=analysis.get("recommendations", []),
            raw_text=analysis.get("raw_text"),
            confidence=analysis.get("confidence", 0.8)
        )
        
    except Exception as e:
        logger.error(f"Report analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Report analysis failed")

@app.post("/api/drug-interactions", response_model=DrugInteractionResponse)
async def check_drug_interactions(request: DrugInteractionRequest):
    """
    Check for drug interactions
    """
    logger.info(f"Checking drug interactions for: {request.medications}")
    
    try:
        # Use LLM to check interactions
        interactions = await llm_service.check_drug_interactions(request.medications)
        
        warnings = [i for i in interactions if i.get("severity") == "high"]
        
        return DrugInteractionResponse(
            has_interactions=len(interactions) > 0,
            interactions=interactions,
            warnings=warnings
        )
        
    except Exception as e:
        logger.error(f"Drug interaction check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Drug interaction check failed")

@app.post("/api/explain-medical-terms")
async def explain_medical_term(term: str, context: Optional[str] = None):
    """
    Explain medical terms in simple language
    """
    try:
        explanation = await llm_service.explain_medical_term(term, context)
        return {"term": term, "explanation": explanation}
    except Exception as e:
        logger.error(f"Medical term explanation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Explanation failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
