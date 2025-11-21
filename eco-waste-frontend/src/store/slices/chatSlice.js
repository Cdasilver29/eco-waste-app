import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    sessionId: null,
    isOpen: false,
    loading: false,
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    addMessage: (state, action) => {
      const msg = action.payload;

      // force timestamp to be serializable
      const safeMessage = {
        ...msg,
        timestamp: typeof msg.timestamp === 'string' || typeof msg.timestamp === 'number'
          ? msg.timestamp
          : Date.now(),
      };

      state.messages.push(safeMessage);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.sessionId = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleChat, setSessionId, addMessage, clearMessages, setLoading } = chatSlice.actions;
export default chatSlice.reducer;
