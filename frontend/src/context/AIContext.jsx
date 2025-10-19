import { GoogleGenerativeAI } from '@google/generative-ai'
import { createContext, useState } from 'react'

export const AIContext = createContext()

const AiContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [
        {
          text: `Hello! I'm MindBot, your health wellness assistant. How can I help you today?`,
        },
      ],
    },
  ])
  const [loading, setLoading] = useState(false)

  const runChat = async (prompt) => {
    try {
      const genai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
      const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })

      // Format history as a string
      const historyText = messages
        .map(
          (msg) =>
            `${msg.role === 'user' ? 'User' : 'MindBot'}: ${msg.parts[0].text}`
        )
        .join('\n\n')

      // Create the full prompt with system instructions and chat history
      const fullPrompt = `
You are a health wellness assistant named MindBot. You are here to help users with their mental health. 
You are not a therapist, but you can provide information and resources related to mental health. 
You can also suggest relaxation techniques, mindfulness exercises, and coping strategies.
You should always encourage users to seek professional help if they are in crisis or need immediate support.
Limit your responses to 100 words or less. And try to be concise and clear.

CHAT HISTORY:
${historyText}

User: ${prompt}

MindBot:`

      // Simple generation call
      const result = await model.generateContent(fullPrompt)
      const response = result.response

      console.log('Response from Gemini:', response)
      return response.text()
    } catch (error) {
      console.error('Error in Gemini API call:', error)
      return "I'm sorry, I encountered an error processing your request. Please try again later."
    }
  }

  const onSent = async (prompt) => {
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { role: 'user', parts: [{ text: prompt }] },
    ])
    setLoading(true)

    try {
      // Get AI response
      const response = await runChat(prompt)

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: response }] },
      ])
    } catch (error) {
      console.error('Error in chat:', error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [
            { text: "I'm sorry, I encountered an error. Please try again." },
          ],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AIContext.Provider value={{ messages, loading, onSent }}>
      {children}
    </AIContext.Provider>
  )
}

export default AiContextProvider
