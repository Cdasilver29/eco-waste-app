// controllers/chatSocketController.js
const axios = require('axios');

exports.generateAIResponse = async (sessionId, text) => {
  try {
    const res = await axios.post(process.env.AI_MODEL_URL, {
      sessionId,
      message: text
    });

    return res.data.data.message;
  } catch (e) {
    console.error("AI error", e);
    return "Sorry, I couldn't process that.";
  }
};
