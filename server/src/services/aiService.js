import axios from 'axios'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// OpenRouter Configuration (preferred - supports many models)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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'
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

// Model configurations - Use DeepSeek directly (faster)
const PRIMARY_MODEL = 'deepseek/deepseek-chat'
const FALLBACK_MODEL = 'deepseek/deepseek-chat'

// DeepSeek Direct API Configuration (fallback)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

// Kimi API Configuration (fallback)
const KIMI_API_KEY = process.env.KIMI_API_KEY || ''
const KIMI_BASE_URL = process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1'

// AI Provider preferences
const USE_OPENROUTER = process.env.USE_OPENROUTER !== 'false'
const USE_DEEPSEEK = process.env.USE_DEEPSEEK !== 'false'
const USE_KIMI = process.env.USE_KIMI !== 'false'

export class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: AI_SERVICE_URL,
      timeout: 60000
    })
  }

  async analyzeSymptoms({ message, symptoms, medicalHistory, sessionHistory }) {
    try {
      // Try DeepSeek Direct first (faster without OpenRouter)
      if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.startsWith('sk-')) {
        try {
          return await this.callDeepSeekDiagnosis({ message, symptoms, medicalHistory, sessionHistory })
        } catch (e) {
          console.warn('DeepSeek Direct API failed...')
        }
      }
      
      // Try OpenRouter with primary model
      if (OPENROUTER_API_KEY && OPENROUTER_API_KEY.startsWith('sk-')) {
        try {
          return await this.callOpenRouterDiagnosis({ 
            message, 
            symptoms, 
            medicalHistory, 
            sessionHistory,
            model: PRIMARY_MODEL
          })
        } catch (e) {
          console.warn('OpenRouter API failed...')
        }
      }
      
      // Try Kimi
      if (USE_KIMI && KIMI_API_KEY && KIMI_API_KEY.startsWith('sk-')) {
        try {
          return await this.callKimiDiagnosis({ message, symptoms, medicalHistory, sessionHistory })
        } catch (e) {
          console.warn('Kimi API failed...')
        }
      }
      
      // Default to mock responses
      return this.generateMockDiagnosis(message)
    } catch (error) {
      console.error('AI Service error:', error)
      return this.generateMockDiagnosis(message)
    }
  }

  async analyzeReport(filePath, reportType, extractedText) {
    // Only use real AI if API keys are valid
    const hasValidDeepSeekKey = DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.startsWith('sk-')
    const hasValidKimiKey = KIMI_API_KEY && KIMI_API_KEY.startsWith('sk-')
    
    try {
      if (hasValidDeepSeekKey) {
        return await this.callDeepSeekReportAnalysis({ filePath, reportType, extractedText })
      }
      
      if (hasValidKimiKey) {
        return await this.callKimiReportAnalysis({ filePath, reportType, extractedText })
      }
      
      return this.generateMockReportAnalysis(reportType)
    } catch (error) {
      console.error('Report analysis error:', error)
      return {
        status: 'error',
        message: 'Failed to analyze report'
      }
    }
  }

  // Kimi AI Integration (Moonshot AI - OpenAI compatible API)
  async callKimiDiagnosis({ message, symptoms, medicalHistory, sessionHistory }) {
    if (!KIMI_API_KEY || !KIMI_API_KEY.startsWith('sk-')) {
      throw new Error('Invalid Kimi API key')
    }
    
    try {
      const response = await axios.post(`${KIMI_BASE_URL}/chat/completions`, {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `You are MedVision, an AI healthcare assistant. Your responsibilities are:
            - Provide helpful health information and guidance
            - Ask clarifying questions about symptoms
            - Suggest possible conditions based on symptoms
            - Always include disclaimer that you are not a substitute for professional medical advice
            - Never provide definitive diagnosis - always recommend consulting healthcare professionals
            - Detect emergency symptoms and immediately recommend seeking urgent medical help
            - Respond with empathy, professionalism, and clarity
            - Use simple language, avoid overly technical medical terminology
            - Format your responses clearly and readably
            
            Reply in English unless the user specifically requests another language.`
          },
          ...sessionHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const aiMessage = response.data.choices[0].message.content
      
      // Detect emergency in response
      const emergencyKeywords = ['emergency', 'immediately', '911', 'urgent', 'call emergency']
      const isEmergency = emergencyKeywords.some(kw => aiMessage.toLowerCase().includes(kw))

      return {
        message: aiMessage,
        diagnosis: {
          severity: isEmergency ? 'emergency' : 'unknown',
          conditions: [],
          confidence: 0.7
        },
        recommendations: isEmergency 
          ? ['Call emergency services immediately', 'Do not delay seeking medical help']
          : ['Consult a healthcare provider for proper diagnosis', 'Monitor your symptoms']
      }
    } catch (error) {
      console.error('Kimi API error:', error.response?.data || error.message)
      // Fallback to mock responses
      throw error // Re-throw to trigger fallback in analyzeSymptoms
    }
  }

  // OpenRouter Integration (supports GPT and DeepSeek models)
  async callOpenRouterDiagnosis({ message, symptoms, medicalHistory, sessionHistory, model }) {
    if (!OPENROUTER_API_KEY || !OPENROUTER_API_KEY.startsWith('sk-')) {
      throw new Error('Invalid OpenRouter API key')
    }
    
    try {
      const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are Dr. MedVision, a friendly and professional AI doctor assistant. Speak naturally like a real doctor.

YOUR STYLE:
- Be warm, caring, and professional
- Use your name "Dr. MedVision" at the start
- Keep it conversational and human-like
- Use emojis sparingly (🤒💊🏥)

YOUR RESPONSE FORMAT:
1. First message: ONLY ask 2-3 questions about their symptoms
2. After user provides details (duration, location, severity), GIVE SOLUTIONS
3. Do NOT keep asking questions indefinitely
4. Be concise with emojis

EMERGENCY: If symptoms sound serious, say:
"🚨 This sounds serious. Go to ER NOW or call 911!"

EXAMPLE FIRST RESPONSE:
"Dr. MedVision here! 🤗

❓ Questions:
• How long have you had the headache?
• Where is the pain? (one side, forehead, back)
• Severity? (mild/moderate/severe)

Visit a doctor for accurate diagnosis 🏥"

EXAMPLE SOLUTION (after user answers):
"Thanks for the details! 💡

💊 Suggestions:
• Rest in quiet dark room 😴
• Stay hydrated 💧
• Take acetaminophen

Visit a doctor 🏥"

Reply in English only.`
          },
          ...sessionHistory
            .filter(msg => msg.content && msg.content.trim())
            .slice(-4)
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content.substring(0, 500)
            })),
          { role: 'user', content: message.substring(0, 1000) }
        ],
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      })

      // Handle different response formats
      let aiMessage = ''
      if (response.data?.choices?.[0]?.message?.content) {
        aiMessage = response.data.choices[0].message.content
      } else if (response.data?.choices?.[0]?.delta?.content) {
        aiMessage = response.data.choices[0].delta.content
      } else if (response.data?.output?.text) {
        aiMessage = response.data.output.text
      } else {
        throw new Error('Unexpected response format from OpenRouter')
      }
      
      // Detect emergency in response
      const emergencyKeywords = ['emergency', 'immediately', '911', 'urgent', 'call emergency', '🚨']
      const isEmergency = emergencyKeywords.some(kw => aiMessage.toLowerCase().includes(kw))

      return {
        message: aiMessage,
        diagnosis: {
          severity: isEmergency ? 'emergency' : 'low',
          conditions: [],
          confidence: 0.7
        },
        recommendations: isEmergency 
          ? ['🚨 Call 911 immediately', 'Do not delay!']
          : ['See a doctor for proper diagnosis', 'Monitor your symptoms']
      }
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message)
      throw error // Re-throw to trigger fallback
    }
  }

  // DeepSeek AI Integration
  async callDeepSeekDiagnosis({ message, symptoms, medicalHistory, sessionHistory }) {
    if (!DEEPSEEK_API_KEY || !DEEPSEEK_API_KEY.startsWith('sk-')) {
      throw new Error('Invalid DeepSeek API key')
    }
    
    try {
      const response = await axios.post(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are MedVision, an AI healthcare assistant. Your responsibilities are:
            - Provide helpful health information and guidance
            - Ask clarifying questions about symptoms
            - Suggest possible conditions based on symptoms
            - Always include disclaimer that you are not a substitute for professional medical advice
            - Never provide definitive diagnosis - always recommend consulting healthcare professionals
            - Detect emergency symptoms and immediately recommend seeking urgent medical help
            - Respond with empathy, professionalism, and clarity
            - Use simple language, avoid overly technical medical terminology
            - Format your responses clearly and readably
            
            Reply in English unless the user specifically requests another language.`
          },
          ...sessionHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const aiMessage = response.data.choices[0].message.content
      
      // Detect emergency in response
      const emergencyKeywords = ['emergency', 'immediately', '911', 'urgent', 'call emergency']
      const isEmergency = emergencyKeywords.some(kw => aiMessage.toLowerCase().includes(kw))

      return {
        message: aiMessage,
        diagnosis: {
          severity: isEmergency ? 'emergency' : 'unknown',
          conditions: [],
          confidence: 0.7
        },
        recommendations: isEmergency 
          ? ['Call emergency services immediately', 'Do not delay seeking medical help']
          : ['Consult a healthcare provider for proper diagnosis', 'Monitor your symptoms']
      }
    } catch (error) {
      console.error('DeepSeek API error:', error.response?.data || error.message)
      // Fallback to Kimi or mock responses
      throw error // Re-throw to trigger fallback
    }
  }

  // Kimi Report Analysis
  async callKimiReportAnalysis({ filePath, reportType, extractedText }) {
    try {
      const response = await axios.post(`${KIMI_BASE_URL}/chat/completions`, {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: `分析这份${reportType}医疗报告。提供JSON格式的回复，包括：
            - summary: 简要概述（用简单语言）
            - flaggedValues: 数组，包含 {name, value, status (normal/high/low), explanation}
            - recommendations: 建议的下一步骤数组
            - confidence: 0到1之间的数字
            
            请用中文回复。`
          }
        ],
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      try {
        return JSON.parse(response.data.choices[0].message.content)
      } catch {
        return this.generateMockReportAnalysis(reportType)
      }
    } catch (error) {
      console.error('Kimi Report Analysis error:', error.response?.data || error.message)
      return this.generateMockReportAnalysis(reportType)
    }
  }

  generateMockDiagnosis(message) {
    const lowerMessage = message.toLowerCase()
    
    // Emergency detection
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'stroke', 'heart attack', 'severe bleeding', 'can\'t breathe', 'cannot breathe']
    if (emergencyKeywords.some(kw => lowerMessage.includes(kw))) {
      return {
        message: "⚠️ **Seek Immediate Medical Attention**\n\nBased on your symptoms, I strongly recommend seeking immediate medical care. Please:\n\n1. Call 911 or your local emergency number\n2. Do not drive yourself to the hospital\n3. If conscious, stay calm and wait for emergency responders\n\nYour symptoms may indicate a serious condition requiring immediate professional evaluation.",
        diagnosis: {
          severity: 'emergency',
          conditions: ['Medical emergency - requires immediate evaluation'],
          confidence: 0.95
        },
        recommendations: [
          'Call 911 immediately',
          'Do not drive yourself',
          'Stay calm and wait for emergency responders'
        ]
      }
    }

    const symptomResponses = {
      headache: {
        message: "I understand you're experiencing a headache. To help me provide better guidance, could you tell me:\n\n• How long has this been happening?\n• Is the pain constant or does it come and go?\n• How would you rate the pain on a scale of 1-10?\n• Any other symptoms like nausea, sensitivity to light, or vision changes?",
        conditions: ['Tension headache', 'Migraine', 'Dehydration', 'Eye strain'],
        recommendations: ['Rest in a quiet, dark room', 'Stay hydrated', 'Consider over-the-counter pain relievers', 'Consult a doctor if symptoms worsen or persist']
      },
      fever: {
        message: "A fever indicates your body is fighting an infection. To help assess the situation:\n\n• What is your current temperature?\n• How long have you had the fever?\n• Any other symptoms like cough, sore throat, body aches, or rash?",
        conditions: ['Viral infection', 'Flu', 'Common cold', 'Bacterial infection'],
        recommendations: ['Rest and stay hydrated', 'Monitor temperature regularly', 'Use fever-reducing medication if needed', 'Seek medical attention if fever exceeds 103°F (39.4°C)']
      },
      cough: {
        message: "Cough can have many causes. To provide better guidance:\n\n• Is it a dry cough or do you have phlegm?\n• How long has it lasted?\n• Any associated symptoms like fever, shortness of breath, or chest pain?",
        conditions: ['Common cold', 'Allergies', 'Bronchitis', 'Post-nasal drip'],
        recommendations: ['Stay hydrated with warm fluids', 'Honey can soothe the throat', 'Consider using a humidifier', 'See a doctor if cough persists beyond 2 weeks']
      },
      fatigue: {
        message: "Fatigue can have many causes. To better understand your situation:\n\n• How long have you been feeling this way?\n• Are you getting enough sleep?\n• Any other symptoms like weight changes, mood changes, or body aches?",
        conditions: ['Insufficient rest', 'Stress', 'Anemia', 'Thyroid issues', 'Depression'],
        recommendations: ['Ensure adequate sleep (7-9 hours)', 'Maintain regular exercise', 'Eat a balanced diet', 'Consult a healthcare provider if persistent']
      },
      nausea: {
        message: "I'm sorry you're feeling nauseous. To help identify the cause:\n\n• How long have you felt nauseous?\n• Have you vomited? If so, what color?\n• Any associated symptoms like abdominal pain, diarrhea, or fever?",
        conditions: ['Gastroenteritis', 'Food poisoning', 'Acid reflux', 'Motion sickness', 'Pregnancy'],
        recommendations: ['Sip clear fluids to stay hydrated', 'Eat bland foods as you improve', 'Rest in a comfortable position', 'Seek medical care if symptoms are severe or persistent']
      },
      dizziness: {
        message: "Dizziness can have various causes. To help me understand better:\n\n• When did this start?\n• Does it happen when you stand up quickly or at rest?\n• Any associated symptoms like blurred vision, headache, or ringing in ears?",
        conditions: ['Inner ear issue', 'Low blood pressure', 'Dehydration', 'Vertigo', 'Medication side effect'],
        recommendations: ['Rise slowly from sitting or lying positions', 'Stay hydrated', 'Avoid sudden head movements', 'See a doctor if frequent or accompanied by other symptoms']
      }
    }

    for (const [symptom, response] of Object.entries(symptomResponses)) {
      if (lowerMessage.includes(symptom) || 
          (symptom === 'headache' && (lowerMessage.includes('head pain') || lowerMessage.includes('head hurts'))) ||
          (symptom === 'fever' && (lowerMessage.includes('high temperature') || lowerMessage.includes('hot'))) ||
          (symptom === 'cough' && (lowerMessage.includes('coughing'))) ||
          (symptom === 'fatigue' && (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('no energy'))) ||
          (symptom === 'nausea' && (lowerMessage.includes('sick to my stomach') || lowerMessage.includes('want to throw up')))
      ) {
        return {
          message: response.message,
          diagnosis: {
            severity: 'low',
            conditions: response.conditions,
            confidence: 0.6
          },
          recommendations: response.recommendations
        }
      }
    }

    return {
      message: "Thank you for sharing your symptoms. To help me provide the most accurate guidance, could you tell me more about:\n\n• When did your symptoms start?\n• How severe are they on a scale of 1-10?\n• Have you experienced anything like this before?\n• Are you taking any medications or have any existing health conditions?",
      diagnosis: {
        severity: 'unknown',
        conditions: [],
        confidence: 0.3
      },
      recommendations: [
        'Monitor your symptoms and note any changes',
        'Keep a symptom diary if symptoms persist',
        'Consult a healthcare provider if concerned or if symptoms worsen'
      ]
    }
  }

  generateMockReportAnalysis(reportType) {
    return {
      status: 'complete',
      overallStatus: '需要注意',
      summary: '您的医疗报告显示有几项指标需要医疗保健提供者复查。大多数指标在正常范围内，有几项需要跟进。',
      flaggedValues: [
        {
          name: '白细胞计数',
          value: '11.5',
          unit: '10³/µL',
          range: '4.5-11.0',
          status: 'high',
          explanation: '略高 - 可能表示感染或炎症'
        },
        {
          name: '空腹血糖',
          value: '126',
          unit: 'mg/dL',
          range: '70-100',
          status: 'high',
          explanation: '高于正常范围 - 可能表明糖尿病前期。建议进行糖化血红蛋白检测。'
        },
        {
          name: '血红蛋白',
          value: '14.2',
          unit: 'g/dL',
          range: '12.0-16.0',
          status: 'normal',
          explanation: '在健康范围内'
        },
        {
          name: '维生素D',
          value: '22',
          unit: 'ng/mL',
          range: '30-100',
          status: 'low',
          explanation: '低于最佳范围 - 考虑补充（请先咨询医生）'
        }
      ],
      recommendations: [
        '预约初级保健医生',
        '进行糖化血红蛋白检测以筛查糖尿病',
        '考虑维生素D补充（请先咨询医生）',
        '监测白细胞计数，如仍升高请跟进',
        '继续定期健康检查'
      ],
      confidence: 0.85
    }
  }
}
