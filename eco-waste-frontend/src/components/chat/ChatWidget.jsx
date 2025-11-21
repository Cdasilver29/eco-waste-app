import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, ThumbsUp, ThumbsDown, Minimize2 } from 'lucide-react';
import { toggleChat, addMessage, setSessionId, setLoading } from '../../store/slices/chatSlice';
import { chatAPI } from '../../services/api';
import { socket } from '../../services/socket';

const ChatWidget = () => {
  const dispatch = useDispatch();
  const { messages, sessionId, isOpen, loading } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      createSession();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real time assistant messages
  useEffect(() => {
    socket.on('assistant_message', text => {
      dispatch(addMessage({
        role: 'assistant',
        content: text,
        timestamp: Date.now()
      }));
      dispatch(setLoading(false));
    });

    socket.on('assistant_typing', () => {
      dispatch(setLoading(true));
    });

    return () => {
      socket.off('assistant_message');
      socket.off('assistant_typing');
    };
  }, [dispatch]);

  const createSession = async () => {
    try {
      const res = await chatAPI.createSession();
      const id = res.data.data.sessionId;

      dispatch(setSessionId(id));
      socket.emit('join_session', id);

      dispatch(addMessage({
        role: 'assistant',
        content: 'Hi, I’m your eco assistant. How can I help you today',
        timestamp: Date.now()
      }));
    } catch (err) {
      console.log('Session creation failed');
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput('');

    dispatch(addMessage({
      role: 'user',
      content: text,
      timestamp: Date.now()
    }));

    dispatch(setLoading(true));

    socket.emit('user_message', {
      sessionId,
      message: text
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleChat())}
            className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl z-50"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  🌱
                </div>
                <div>
                  <h3 className="font-bold">Eco Assistant</h3>
                  <p className="text-xs text-green-100">Here when you need me</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => dispatch(toggleChat())} className="p-2 hover:bg-white/20 rounded-lg">
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button onClick={() => dispatch(toggleChat())} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                    {msg.role === 'assistant' && i === messages.length - 1 && !loading && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <button className="text-xs text-gray-500 hover:text-green-600">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="text-xs text-gray-500 hover:text-red-600">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-green-600 text-white p-2 rounded-full disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;


