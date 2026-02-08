"""
LLM service for advanced medical AI capabilities
Uses OpenAI or Anthropic for symptom analysis and report interpretation
"""

from typing import Dict, List, Optional
from loguru import logger
import os

class LLMService:
    """Service for LLM-based medical analysis"""
    
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.model = os.getenv("LLM_MODEL", "gpt-4")
    
    async def analyze_symptoms(
        self,
        message: str,
        symptoms: Optional[List[str]] = None,
        medical_history: Optional[List[str]] = None
    ) -> Dict:
        """Use LLM to analyze symptoms and provide diagnosis"""
        
        # In production, call OpenAI/Anthropic API
        # For demo, return structured mock response
        
        prompt = self._build_symptom_prompt(message, symptoms, medical_history)
        
        try:
            # Mock response for demo
            return self._mock_symptom_response(message)
        except Exception as e:
            logger.error(f"LLM analysis error: {str(e)}")
            return {
                "message": "I've analyzed your symptoms. Please consult a healthcare provider for a proper diagnosis.",
                "conditions": [],
                "recommendations": ["Consult a doctor"],
                "confidence": 0.5
            }
    
    async def check_drug_interactions(self, medications: List[str]) -> List[Dict]:
        """Check for drug interactions using LLM"""
        
        prompt = f"""
        Check for interactions between these medications: {', '.join(medications)}
        
        For each interaction found, provide:
        - medications involved
        - severity (low, medium, high)
        - description of the interaction
        - clinical significance
        
        Return as JSON array of interactions.
        """
        
        try:
            # Mock response for demo
            return self._mock_drug_interactions(medications)
        except Exception as e:
            logger.error(f"Drug interaction check error: {str(e)}")
            return []
    
    async def explain_medical_term(self, term: str, context: Optional[str] = None) -> str:
        """Explain a medical term in simple language"""
        
        prompt = f"""
        Explain this medical term in simple, easy-to-understand language:
        
        Term: {term}
        Context: {context or 'General medical context'}
        
        Provide:
        1. Simple definition
        2. What it means for the patient
        3. Any implications or next steps
        """
        
        try:
            return self._mock_term_explanation(term)
        except Exception as e:
            logger.error(f"Term explanation error: {str(e)}")
            return f"{term} is a medical term. Please consult your healthcare provider for more information."
    
    def _build_symptom_prompt(
        self,
        message: str,
        symptoms: Optional[List[str]],
        medical_history: Optional[List[str]]
    ) -> str:
        """Build prompt for symptom analysis"""
        
        prompt = f"""
        You are a medical AI assistant helping users understand their symptoms.
        Provide helpful, accurate information while always recommending professional medical advice.
        
        User's description: {message}
        
        Additional information:
        - Reported symptoms: {', '.join(symptoms) if symptoms else 'None provided'}
        - Medical history: {', '.join(medical_history) if medical_history else 'None provided'}
        
        Please provide:
        1. A helpful response acknowledging their symptoms
        2. Potential conditions that might match their symptoms
        3. Recommendations for care
        4. Follow-up questions to better understand their condition
        
        IMPORTANT: Always include a disclaimer that this is not medical advice.
        If symptoms suggest emergency (chest pain, difficulty breathing, stroke symptoms),
        immediately recommend calling emergency services.
        """
        
        return prompt
    
    def _mock_symptom_response(self, message: str) -> Dict:
        """Generate mock symptom response"""
        message_lower = message.lower()
        
        if any(kw in message_lower for kw in ['headache', 'head pain']):
            return {
                "message": "I understand you're experiencing headaches. This is a common symptom with many potential causes. Let me provide some information to help you understand what might be going on.",
                "conditions": ["Tension headache", "Migraine", "Dehydration", "Stress headache"],
                "recommendations": [
                    "Rest in a quiet, dark room",
                    "Stay hydrated",
                    "Consider over-the-counter pain relievers",
                    "Apply cold or warm compress to your head",
                    "Track when headaches occur to identify triggers"
                ],
                "follow_up_questions": [
                    "How long have you had this headache?",
                    "On a scale of 1-10, how severe is the pain?",
                    "Is the pain constant or does it come and go?",
                    "Any other symptoms like nausea or sensitivity to light?"
                ],
                "confidence": 0.65
            }
        elif any(kw in message_lower for kw in ['fever', 'temperature', 'hot']):
            return {
                "message": "A fever indicates your body is fighting an infection. Let's understand more about what you're experiencing.",
                "conditions": ["Viral infection", "Flu", "Common cold", "Bacterial infection"],
                "recommendations": [
                    "Rest and stay well hydrated",
                    "Monitor your temperature regularly",
                    "Use fever-reducing medication as directed",
                    "Seek medical care if fever exceeds 103°F (39.4°C)"
                ],
                "follow_up_questions": [
                    "What is your temperature?",
                    "How long have you had the fever?",
                    "Are you experiencing chills or sweating?",
                    "Any other symptoms like cough, sore throat, or body aches?"
                ],
                "confidence": 0.7
            }
        elif any(kw in message_lower for kw in ['cough', 'coughing']):
            return {
                "message": "Coughs can be caused by many things, from simple irritants to infections. Let me help you understand what might be causing yours.",
                "conditions": ["Common cold", "Allergies", "Bronchitis", "Post-nasal drip"],
                "recommendations": [
                    "Stay hydrated with warm fluids",
                    "Use honey to soothe throat (if over 1 year old)",
                    "Consider a humidifier in your room",
                    "Avoid smoking and secondhand smoke"
                ],
                "follow_up_questions": [
                    "How long have you been coughing?",
                    "Is it a dry cough or are you producing mucus?",
                    "What color is the mucus if any?",
                    "Any shortness of breath or wheezing?"
                ],
                "confidence": 0.6
            }
        else:
            return {
                "message": "Thank you for describing your symptoms. I want to make sure I understand correctly so I can provide the best guidance.",
                "conditions": [],
                "recommendations": [
                    "Monitor your symptoms closely",
                    "Note any changes or worsening",
                    "Consult a healthcare provider for proper diagnosis"
                ],
                "follow_up_questions": [
                    "When did your symptoms start?",
                    "How severe are your symptoms on a scale of 1-10?",
                    "Have you experienced anything like this before?",
                    "Are you taking any medications?"
                ],
                "confidence": 0.4
            }
    
    def _mock_drug_interactions(self, medications: List[str]) -> List[Dict]:
        """Generate mock drug interactions"""
        interactions = []
        
        med_names = [m.lower() for m in medications]
        
        # Common interactions
        if any('warfarin' in m for m in med_names):
            if any(nsaids := [m for m in med_names if m in ['aspirin', 'ibuprofen', 'naproxen']]):
                interactions.append({
                    "medications": ["warfarin", nsaids[0]],
                    "severity": "high",
                    "description": "Increased risk of bleeding",
                    "clinical_significance": "Blood thinners and NSAIDs both increase bleeding risk. Combination significantly elevates risk of internal bleeding.",
                    "recommendation": "Avoid this combination. Consult your doctor about alternative pain relief options."
                })
        
        if any('lisinopril' in m for m in med_names):
            if any('potassium' in m for m in med_names):
                interactions.append({
                    "medications": ["lisinopril", "potassium supplements"],
                    "severity": "medium",
                    "description": "Elevated potassium levels",
                    "clinical_significance": "ACE inhibitors like lisinopril can increase potassium retention. Supplements may lead to dangerous hyperkalemia.",
                    "recommendation": "Monitor potassium levels regularly. Discuss with your doctor."
                })
        
        if any('metformin' in m for m in med_names):
            if any('alcohol' in m for m in med_names):
                interactions.append({
                    "medications": ["metformin", "alcohol"],
                    "severity": "medium",
                    "description": "Increased risk of lactic acidosis",
                    "clinical_significance": "Both substances can affect liver function and increase risk of rare but serious lactic acidosis.",
                    "recommendation": "Limit or avoid alcohol while taking metformin. Discuss with your doctor."
                })
        
        return interactions
    
    def _mock_term_explanation(self, term: str) -> str:
        """Generate mock term explanation"""
        explanations = {
            "hemoglobin": "Hemoglobin is a protein in your red blood cells that carries oxygen throughout your body. Normal levels are 12-17.5 g/dL. Low hemoglobin can indicate anemia.",
            "glucose": "Glucose is the main type of sugar in your blood and the primary source of energy for your body's cells. Normal fasting glucose is 70-100 mg/dL.",
            "cholesterol": "Cholesterol is a waxy substance found in your blood. Your body needs it to build cells, but too much can lead to heart problems. Total cholesterol should be under 200 mg/dL.",
            "hypertension": "High blood pressure - when the force of blood against your artery walls is too high. Often called the 'silent killer' because it typically has no symptoms.",
            "diabetes": "A condition where your body can't properly regulate blood sugar. This happens when your body doesn't produce enough insulin or becomes resistant to it."
        }
        
        term_lower = term.lower()
        for key, explanation in explanations.items():
            if key in term_lower:
                return explanation
        
        return f"{term} is a medical term related to your health. Please consult your healthcare provider for a detailed explanation specific to your situation."
