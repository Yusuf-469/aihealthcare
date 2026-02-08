"""
Medical report analyzer using OCR and pattern matching
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
import re

@dataclass
class LabValue:
    name: str
    value: float
    unit: str
    normal_min: float
    normal_max: float
    
    @property
    def status(self) -> str:
        if self.value < self.normal_min:
            return "low"
        elif self.value > self.normal_max:
            return "high"
        return "normal"

class ReportAnalyzer:
    """Analyze medical reports using OCR and pattern matching"""
    
    # Common lab test patterns and normal ranges
    LAB_PATTERNS = {
        "hemoglobin": {
            "patterns": [r"hemoglobin\s*:?\s*([\d.]+)\s*(g/dl|g/dL)?", r"HGB\s*:?\s*([\d.]+)"],
            "unit": "g/dL",
            "normal_min": 12.0,
            "normal_max": 17.5,
            "explanation": "Measures the amount of hemoglobin in red blood cells"
        },
        "wbc": {
            "patterns": [r"WBC\s*:?\s*([\d.]+)\s*(10³/µL|10^3/uL)?", r"white\s*blood\s*cell\s*:?\s*([\d.]+)"],
            "unit": "10³/µL",
            "normal_min": 4.5,
            "normal_max": 11.0,
            "explanation": "White blood cell count - indicates immune system activity"
        },
        "platelets": {
            "patterns": [r"platelets?\s*:?\s*([\d,]+)", r"PLT\s*:?\s*([\d,]+)"],
            "unit": "10³/µL",
            "normal_min": 150,
            "normal_max": 400,
            "explanation": "Platelet count - important for blood clotting"
        },
        "glucose_fasting": {
            "patterns": [r"fasting\s*glucose\s*:?\s*([\d.]+)\s*(mg/dL)?", r"FBG\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 70,
            "normal_max": 100,
            "explanation": "Blood sugar level after fasting"
        },
        "glucose": {
            "patterns": [r"glucose\s*:?\s*([\d.]+)\s*(mg/dL)?", r"GLU\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 70,
            "normal_max": 100,
            "explanation": "Blood sugar level"
        },
        "cholesterol_total": {
            "patterns": [r"total\s*cholesterol\s*:?\s*([\d.]+)\s*(mg/dL)?", r"TC\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 0,
            "normal_max": 200,
            "explanation": "Total cholesterol level"
        },
        "ldl": {
            "patterns": [r"LDL\s*:?\s*([\d.]+)\s*(mg/dL)?", r"LDL-C\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 0,
            "normal_max": 100,
            "explanation": "\"Bad\" cholesterol - lower is better"
        },
        "hdl": {
            "patterns": [r"HDL\s*:?\s*([\d.]+)\s*(mg/dL)?", r"HDL-C\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 40,
            "normal_max": 60,
            "explanation": "\"Good\" cholesterol - higher is better"
        },
        "triglycerides": {
            "patterns": [r"triglycerides?\s*:?\s*([\d.]+)\s*(mg/dL)?", r"TG\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 0,
            "normal_max": 150,
            "explanation": "Type of fat in the blood"
        },
        "creatinine": {
            "patterns": [r"creatinine\s*:?\s*([\d.]+)\s*(mg/dL)?", r"CRE\s*:?\s*([\d.]+)"],
            "unit": "mg/dL",
            "normal_min": 0.6,
            "normal_max": 1.3,
            "explanation": "Kidney function marker"
        },
        "alt": {
            "patterns": [r"ALT\s*:?\s*([\d.]+)\s*(U/L)?", r"SGPT\s*:?\s*([\d.]+)"],
            "unit": "U/L",
            "normal_min": 7,
            "normal_max": 56,
            "explanation": "Liver enzyme - elevated may indicate liver damage"
        },
        "ast": {
            "patterns": [r"AST\s*:?\s*([\d.]+)\s*(U/L)?", r"SGOT\s*:?\s*([\d.]+)"],
            "unit": "U/L",
            "normal_min": 10,
            "normal_max": 40,
            "explanation": "Liver enzyme - elevated may indicate liver damage"
        }
    }
    
    async def analyze(self, file_path: str, report_type: str) -> Dict:
        """Analyze medical report and extract values"""
        
        # In production, this would:
        # 1. Use OCR (pytesseract, AWS Textract, or Google Vision)
        # 2. Process the extracted text
        # 3. Match patterns against known lab values
        
        # For demo, return mock analysis
        return self._mock_analysis()
    
    def extract_values(self, text: str) -> List[Dict]:
        """Extract lab values from text"""
        results = []
        
        for test_name, config in self.LAB_PATTERNS.items():
            for pattern in config["patterns"]:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    value = float(match.group(1).replace(",", ""))
                    status = "normal"
                    if value < config["normal_min"]:
                        status = "low"
                    elif value > config["normal_max"]:
                        status = "high"
                    
                    results.append({
                        "name": test_name,
                        "value": value,
                        "unit": config["unit"],
                        "normal_range": f"{config['normal_min']}-{config['normal_max']}",
                        "status": status,
                        "explanation": config["explanation"]
                    })
                    break
        
        return results
    
    def _mock_analysis(self) -> Dict:
        """Return mock analysis for demo"""
        return {
            "overall_status": "attention_needed",
            "summary": "Your blood test results show elevated glucose and white blood cell count. These findings warrant attention and should be reviewed with your healthcare provider.",
            "flagged_values": [
                {
                    "name": "White Blood Cell Count",
                    "value": 11.5,
                    "unit": "10³/µL",
                    "normal_range": "4.5-11.0",
                    "status": "high",
                    "explanation": "Slightly elevated - may indicate infection or inflammation",
                    "severity": "medium"
                },
                {
                    "name": "Fasting Glucose",
                    "value": 126,
                    "unit": "mg/dL",
                    "normal_range": "70-100",
                    "status": "high",
                    "explanation": "Above normal range - may indicate prediabetes or diabetes",
                    "severity": "high"
                },
                {
                    "name": "Hemoglobin",
                    "value": 14.2,
                    "unit": "g/dL",
                    "normal_range": "12.0-17.5",
                    "status": "normal",
                    "explanation": "Within healthy range",
                    "severity": "low"
                }
            ],
            "recommendations": [
                "Schedule appointment with primary care physician within 1-2 weeks",
                "Request HbA1c test for diabetes screening",
                "Monitor for signs of infection (fever, fatigue)",
                "Follow up on abnormal results with your doctor"
            ],
            "confidence": 0.85
        }
