import React, { useState, useRef, useEffect, useContext } from 'react'
import styled from 'styled-components'
import send_icon from '../img/send_icon.png'
import user_icon from '../img/user_icon.png'
import gemini_icon from '../img/gemini_icon.png'
import { brain } from '../utils/Icons'
import { AIContext } from '../context/AIContext'

const Mental = () => {
  const { onSent, messages, loading } = useContext(AIContext)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (input.trim() === '') return
    onSent(input)
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <MentalStyled>
      <div className='chat-container'>
        <div className='nav'>
          <div className='icon'>{brain}</div>
          <h3>Mental Wellness Assistant</h3>
        </div>

        <div className='messages-container'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === 'user'
                  ? 'message user-message'
                  : 'message assistant-message'
              }>
              <img
                src={message.role === 'user' ? user_icon : gemini_icon}
                alt=''
              />
              <p
                dangerouslySetInnerHTML={{ __html: message.parts[0].text }}></p>
            </div>
          ))}

          {loading && (
            <div className='message assistant-message'>
              <img
                src={gemini_icon}
                alt=''
              />
              <div className='loader'>
                <hr />
                <hr />
                <hr />
              </div>
            </div>
          )}

          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        <div className='input-container'>
          <div className='search-box'>
            <input
              type='text'
              placeholder='Share your thoughts or ask for guidance...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className='send-button'>
              <img
                src={send_icon}
                alt='Send'
              />
            </button>
          </div>
          <p className='bottom-info'>
            Your conversations are private and confidential
          </p>
        </div>
      </div>
    </MentalStyled>
  )
}

const MentalStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: rgba(252, 246, 249, 0.78);
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: rgba(252, 246, 249, 0.78)
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .nav {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    background-color: white;
    z-index: 10;
  }

  .icon {
    color: #4b0082;
    font-size: 24px;
    margin-right: 10px;
  }

  .nav h3 {
    color: #4b0082;
    padding: 2px 4px;
    font-size: 22px;
    font-weight: 600;
    margin: 0;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .messages-container::-webkit-scrollbar {
    width: 5px;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background-color: rgba(75, 0, 130, 0.2);
    border-radius: 3px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .message {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    max-width: 70%;
  }

  .user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .user-message p {
    background-color: rgba(75, 0, 130, 0.08);
    border-radius: 15px;
    border-top-right-radius: 2px;
  }

  .assistant-message p {
    background-color: #f5f5f5;
    border-radius: 15px;
    border-top-left-radius: 2px;
  }

  .message p {
    padding: 12px 15px;
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
  }

  .message img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }

  .input-container {
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
    background-color: white;
    z-index: 10;
  }

  .search-box {
    display: flex;
    align-items: center;
    background-color: #f0f4f9;
    padding: 7px 15px;
    border-radius: 50px;
  }

  .search-box input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 9px;
    font-size: 16px;
  }

  .send-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    padding: 5px;
  }

  .send-button:hover {
    transform: scale(1.1);
  }

  .send-button img {
    width: 24px;
  }

  .bottom-info {
    font-size: 13px;
    margin: 10px 0 0;
    text-align: center;
    color: #888;
  }

  .loader {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .loader hr {
    border-radius: 4px;
    border: none;
    background-color: #f6f7f8;
    background: linear-gradient(to right, #d5a8ff, #f6f7f8, #d5a8ff);
    background-size: 800px 50px;
    height: 12px;
    animation: loader 3s infinite linear;
    margin: 0;
  }

  @keyframes loader {
    0% {
      background-position: -800px 0px;
    }
    100% {
      background-position: 800px 0px;
    }
  }

  @media (max-width: 768px) {
    .message {
      max-width: 85%;
    }

    .nav h3 {
      font-size: 18px;
    }

    .search-box input {
      font-size: 14px;
    }
  }
`

export default Mental
