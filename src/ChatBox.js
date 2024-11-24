// src/ChatBox.js

import React, { useState, useRef } from 'react';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);  // To scroll to the latest message
  const chatHistoryRef = useRef(null);  // For checking if user is scrolled at the bottom

  // Helper function to format multiline messages with <br> tags
  const formatMessage = (message) => {
    return message.split('\n').map((line, idx) => (
      <span key={idx}>{line}<br /></span>
    ));
  };

  const handleChange = async () => {
    if (!prompt) return; // Prevent empty input submission
    setLoading(true);

    // Add user's message to the chat
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: prompt }
    ]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'ai', content: data.response }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'error', content: "Something went wrong. Please try again." }
      ]);
    }

    setPrompt('');
    setLoading(false);
  };

  // Scroll to the bottom after each message is added, only if user is not scrolled up
  React.useEffect(() => {
    if (bottomRef.current && chatHistoryRef.current) {
      const isAtBottom = chatHistoryRef.current.scrollHeight - chatHistoryRef.current.scrollTop === chatHistoryRef.current.clientHeight;
      if (isAtBottom) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <div>
      {/* Header Section with company name */}
      <div className="header">
        LegalPro
      </div>

      <div className="chat-container">
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role}`}
            >
              <div className="message-bubble">
                {formatMessage(message.content)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything"
          />
          <button
            className="chat-send-button"
            onClick={handleChange}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
