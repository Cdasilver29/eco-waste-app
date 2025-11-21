// src/services/chatService.js
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class ChatService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect(userId, token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      query: { userId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup default event listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Send a message
  sendMessage(chatId, message) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return false;
    }

    this.socket.emit('send_message', {
      chatId,
      message: {
        text: message.text,
        type: message.type || 'text',
        attachments: message.attachments || [],
        timestamp: new Date().toISOString()
      }
    });

    return true;
  }

  // Listen for new messages
  onMessage(callback) {
    if (!this.socket) return;
    
    this.socket.on('new_message', callback);
    this.listeners.set('new_message', callback);
  }

  // Listen for typing indicators
  onTyping(callback) {
    if (!this.socket) return;
    
    this.socket.on('user_typing', callback);
    this.listeners.set('user_typing', callback);
  }

  // Emit typing status
  emitTyping(chatId, isTyping) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('typing', { chatId, isTyping });
  }

  // Listen for read receipts
  onMessageRead(callback) {
    if (!this.socket) return;
    
    this.socket.on('message_read', callback);
    this.listeners.set('message_read', callback);
  }

  // Mark message as read
  markAsRead(chatId, messageId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('mark_read', { chatId, messageId });
  }

  // Listen for online status
  onUserStatus(callback) {
    if (!this.socket) return;
    
    this.socket.on('user_status', callback);
    this.listeners.set('user_status', callback);
  }

  // Join a chat room
  joinChat(chatId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('join_chat', { chatId });
  }

  // Leave a chat room
  leaveChat(chatId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('leave_chat', { chatId });
  }

  // Initiate voice call
  initiateVoiceCall(chatId, recipientId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('voice_call', { chatId, recipientId, type: 'voice' });
  }

  // Initiate video call
  initiateVideoCall(chatId, recipientId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('video_call', { chatId, recipientId, type: 'video' });
  }

  // Listen for incoming calls
  onIncomingCall(callback) {
    if (!this.socket) return;
    
    this.socket.on('incoming_call', callback);
    this.listeners.set('incoming_call', callback);
  }

  // Answer call
  answerCall(callId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('answer_call', { callId });
  }

  // Reject call
  rejectCall(callId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('reject_call', { callId });
  }

  // End call
  endCall(callId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('end_call', { callId });
  }

  // Send file/image
  sendFile(chatId, file, type = 'image') {
    if (!this.socket?.connected) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.socket.emit('send_file', {
        chatId,
        file: {
          data: reader.result,
          name: file.name,
          type: type,
          size: file.size
        }
      });
    };
    reader.readAsDataURL(file);
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      // Remove all listeners
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export default new ChatService();

// API functions for REST calls
export const chatAPI = {
  // Get all conversations
  getConversations: async () => {
    try {
      const response = await fetch('/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get messages for a specific chat
  getMessages: async (chatId, page = 1, limit = 50) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Create new chat
  createChat: async (participantId) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ participantId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  },

  // Search messages
  searchMessages: async (query) => {
    try {
      const response = await fetch(`/api/chats/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
};


