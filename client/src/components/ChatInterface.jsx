import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'

// Simulated AI responses for demo
const aiResponses = {
  greeting: "Hello! I'm your AI healthcare assistant. I'm here to help you understand your symptoms and guide you toward appropriate care. How are you feeling today?",
  analyzing: "I understand. Let me ask a few follow-up questions to better understand your situation...",
  mild: "Based on your symptoms, this appears to be a mild condition that may resolve on its own. However, I recommend monitoring your symptoms and seeking care if they worsen.",
  moderate: "Your symptoms suggest a condition that should be evaluated by a healthcare professional. I recommend scheduling an appointment with your doctor within the next few days.",
  severe: "⚠️ Based on your symptoms, I strongly recommend seeking immediate medical attention. Please call emergency services or go to your nearest emergency room.",
  follow_up: "To help me provide better guidance, could you tell me more about when this started and how severe it is?"
}

export function ChatInterface({ onClose }) {
  const { chatMessages, addChatMessage, setAvatarMood } = useStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    // Initial greeting
    if (chatMessages.length === 0) {
      addChatMessage({
        id: Date.now(),
        sender: 'ai',
        content: aiResponses.greeting,
        timestamp: new Date()
      })
      setAvatarMood('neutral')
    }
  }, [])

  const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Emergency keywords
    if (['chest pain', 'difficulty breathing', 'stroke', 'heart attack', 'severe bleeding', 'cant breathe'].some(k => lowerMessage.includes(k))) {
      setAvatarMood('emergency')
      return { response: aiResponses.severe, mood: 'emergency' }
    }
    
    // Concerning keywords
    if (['severe', 'intense', 'unbearable', 'worse', 'getting worse'].some(k => lowerMessage.includes(k))) {
      setAvatarMood('concerned')
      return { response: aiResponses.moderate, mood: 'concerned' }
    }
    
    // Mild symptoms
    if (['mild', 'slight', 'little', 'minor', 'better', 'improving'].some(k => lowerMessage.includes(k))) {
      setAvatarMood('reassuring')
      return { response: aiResponses.mild, mood: 'reassuring' }
    }
    
    // Default analyzing state
    setAvatarMood('analyzing')
    return { response: aiResponses.follow_up, mood: 'analyzing' }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    }
    addChatMessage(userMessage)
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const { response, mood } = analyzeMessage(input)
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: response,
        timestamp: new Date()
      }
      addChatMessage(aiMessage)
      setAvatarMood(mood)
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="glass-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0066CC 0%, #20B2AA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Symptom Checker</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#4CAF50' }}>● Online - Ready to help</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#78909C',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px',
        marginBottom: '16px'
      }}>
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            className={`chat-message ${msg.sender === 'user' ? 'user' : msg.content.includes('⚠️') ? 'emergency' : 'ai'}`}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.content}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', opacity: 0.7 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ animation: 'pulse 1s infinite', fontSize: '0.8rem' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.2s', fontSize: '0.8rem' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.4s', fontSize: '0.8rem' }}>●</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1 }}
        />
        <button 
          className="btn-primary"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          style={{ padding: '12px 20px' }}
        >
          Send
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {['Headache', 'Fever', 'Cough', 'Fatigue', 'Stomach pain'].map((symptom) => (
          <button
            key={symptom}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setInput(symptom)}
          >
            {symptom}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
