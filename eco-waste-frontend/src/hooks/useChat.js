/ src/hooks/useChat.js
import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await chatService.createSession();
        setSessionId(response.sessionId);
      } catch (err) {
        console.error('Failed to create chat session:', err);
      }
    };

    initSession();
  }, []);

  const sendMessage = async (message) => {
    if (!sessionId || !message.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);
      
      const response = await chatService.sendMessage(sessionId, message);
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      return response;
    } catch (err) {
      setError(err.message);
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await chatService.clearHistory(sessionId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const loadHistory = async () => {
    if (!sessionId) return;
    
    try {
      const response = await chatService.getHistory(sessionId);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearHistory,
    loadHistory
  };
};


