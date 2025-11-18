// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, options);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('message', (data) => {
      setLastMessage(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const sendMessage = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const subscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const unsubscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    socket: socketRef.current
  };
};
