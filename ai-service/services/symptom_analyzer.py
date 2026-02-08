"""
Rule-based symptom analyzer for fallback and quick analysis
"""

from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class SymptomPattern:
    keywords: List[str]
    severity: str
    recommendations: List[str]
    conditions: List[str]

class SymptomAnalyzer:
    """Rule-based symptom analysis using pattern matching"""
    
    def __init__(self):
        self.patterns = {
            "headache": SymptomPattern(
                keywords=["headache", "head pain", "migraine", "head hurts"],
                severity="low",
                recommendations=[
                    "Rest in a quiet, dark room",
                    "Stay hydrated",
                    "Consider over-the-counter pain relievers",
                    "Apply cold or warm compress",
                    "If symptoms persist > 72 hours, consult a doctor"
                ],
                conditions=["Tension headache", "Migraine", "Dehydration headache"]
            ),
            "fever": SymptomPattern(
                keywords=["fever", "temperature", "high temperature", "hot"],
                severity="moderate",
                recommendations=[
                    "Rest and stay hydrated",
                    "Monitor temperature regularly",
                    "Use fever-reducing medication if needed",
                    "Seek medical attention if fever exceeds 103°F (39.4°C)",
                    "Seek immediate attention for fever with rash or confusion"
                ],
                conditions=["Viral infection", "Flu", "Bacterial infection"]
            ),
            "cough": SymptomPattern(
                keywords=["cough", "coughing", "dry cough", "productive cough"],
                severity="low",
                recommendations=[
                    "Stay hydrated with warm fluids",
                    "Use honey to soothe throat (not for children under 1)",
                    "Consider a humidifier",
                    "See a doctor if cough persists more than 2 weeks",
                    "Seek immediate care for cough with blood or breathing difficulty"
                ],
                conditions=["Common cold", "Allergies", "Bronchitis"]
            ),
            "fatigue": SymptomPattern(
                keywords=["fatigue", "tired", "exhausted", "no energy", "weak"],
                severity="low",
                recommendations=[
                    "Ensure adequate sleep (7-9 hours)",
                    "Stay hydrated",
                    "Eat a balanced diet",
                    "Light exercise may help",
                    "Consult doctor if fatigue persists > 2 weeks"
                ],
                conditions=["Lack of sleep", "Stress", "Depression", "Anemia"]
            ),
            "nausea": SymptomPattern(
                keywords=["nausea", "nauseous", "feel sick", "want to vomit"],
                severity="low",
                recommendations=[
                    "Rest and avoid strong odors",
                    "Sip clear fluids slowly",
                    "Eat bland foods when able",
                    "Ginger may help",
                    "Seek care if severe or accompanied by severe pain"
                ],
                conditions=["Gastroenteritis", "Food poisoning", "Pregnancy"]
            ),
            "chest_pain": SymptomPattern(
                keywords=["chest pain", "chest pressure", "chest tightness"],
                severity="emergency",
                recommendations=[
                    "Call 911 immediately",
                    "Chew aspirin if not allergic (325mg)",
                    "Sit or lie down in comfortable position",
                    "Do not drive yourself to hospital",
                    "Wait for emergency responders"
                ],
                conditions=["Heart attack", "Angina", "Costochondritis"]
            ),
            "breathing": SymptomPattern(
                keywords=["difficulty breathing", "shortness of breath", "cant breathe", "wheezing"],
                severity="emergency",
                recommendations=[
                    "Call 911 immediately",
                    "Sit upright and try to stay calm",
                    "Use prescribed inhaler if available",
                    "Loosen tight clothing",
                    "If available, use emergency oxygen"
                ],
                conditions=["Asthma attack", "COPD exacerbation", "Pulmonary embolism"]
            )
        }
        
        self.emergency_keywords = [
            "chest pain", "difficulty breathing", "stroke", "heart attack",
            "severe bleeding", "unconscious", "cant breathe", "can't breathe",
            "slurred speech", "face drooping", "arm weakness"
        ]
    
    def analyze(self, message: str) -> Dict:
        """Analyze message for symptoms"""
        message_lower = message.lower()
        
        # Check for emergency
        if any(kw in message_lower for kw in self.emergency_keywords):
            return {
                "severity": "emergency",
                "conditions": ["Medical emergency suspected"],
                "recommendations": [
                    "Call 911 immediately",
                    "Do not drive yourself",
                    "Stay calm and wait for help"
                ],
                "is_emergency": True
            }
        
        # Match symptoms
        for symptom_name, pattern in self.patterns.items():
            if any(kw in message_lower for kw in pattern.keywords):
                return {
                    "severity": pattern.severity,
                    "conditions": pattern.conditions,
                    "recommendations": pattern.recommendations,
                    "matched_symptom": symptom_name
                }
        
        # No match
        return {
            "severity": "unknown",
            "conditions": [],
            "recommendations": [
                "Monitor your symptoms",
                "Consult a healthcare provider for proper diagnosis"
            ],
            "matched_symptom": None
        }
    
    def get_follow_up_questions(self, symptom: str) -> List[str]:
        """Get follow-up questions for better diagnosis"""
        questions = {
            "headache": [
                "How long have you had this headache?",
                "Where is the pain located?",
                "Is it constant or does it come and go?",
                "On a scale of 1-10, how severe is the pain?"
            ],
            "fever": [
                "What is your temperature?",
                "How long have you had the fever?",
                "Are you experiencing any other symptoms?",
                "Have you been in contact with anyone sick?"
            ],
            "cough": [
                "How long have you been coughing?",
                "Is it a dry cough or are you bringing up mucus?",
                "Do you have any other symptoms?",
                "Have you been exposed to smoke or allergens?"
            ],
            "fatigue": [
                "How long have you been feeling fatigued?",
                "Are you getting enough sleep?",
                "Any changes in appetite or weight?",
                "Any stress or life changes recently?"
            ]
        }
        
        return questions.get(symptom, [
            "When did your symptoms start?",
            "How severe are your symptoms?",
            "Are your symptoms getting worse?",
            "Any other symptoms to report?"
        ])
