import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';

const AIAssistantWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I\'m your EcoWaste AI Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const quickActions = [
    'How do I log waste?',
    'What are my token rewards?',
    'Find nearby facilities',
    'Track my collection',
  ];

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, 
        { id: messages.length + 1, sender: 'user', text: input },
        { id: messages.length + 2, sender: 'ai', text: 'I can help with that! Let me find the information for you...' }
      ]);
      setInput('');
    }
  };

  const handleQuickAction = (action) => {
    setMessages([...messages, 
      { id: messages.length + 1, sender: 'user', text: action },
      { id: messages.length + 2, sender: 'ai', text: 'Here\'s what I found about ' + action.toLowerCase() + '...' }
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-white" />
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-purple-100">Always here to help</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                : 'bg-white text-slate-800 border border-slate-200'
            } rounded-2xl px-4 py-3 shadow-sm`}>
              {message.sender === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                </div>
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-600 mb-2">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action)}
                className="text-xs p-2 bg-white hover:bg-purple-50 border border-slate-200 rounded-lg transition-colors text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistantWidget;