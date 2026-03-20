// controllers/aiController.js - AI-First Chatbot using Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const profile = req.user; // from protect middleware

    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    // Build user context string to pass in the system instruction
    let userContext = "";
    if (profile) {
      userContext = `User Profile Context:\nName: ${profile.name || 'Unknown'}\nWeight: ${profile.weight || 'Unknown'} kg\nFitness Goal: ${profile.fitnessGoal ? profile.fitnessGoal.replace('_', ' ') : 'Unknown'}\nWater Goal: ${profile.waterGoal || 'Unknown'} glasses\nCalories Goal: ${profile.caloriesGoal || 'Unknown'} kcal.\n\n`;
    }

    // The strong system prompt designed to make the AI act like ChatGPT
    const systemInstruction = 
      "You are a friendly, helpful, and highly intelligent AI Fitness Assistant.\n" +
      "CRITICAL RULES:\n" +
      "1. Understand intent intelligently: Handle typos, broken English, short phrases, and casual language effortlessly. Do not treat input rigidly.\n" +
      "2. Never say 'I don't understand', 'Please clarify', or 'Can you repeat'. Make your best assumption about what the user means based on context, and answer confidently.\n" +
      "3. Be human-like: Keep responses conversational, concise, and helpful. Use examples when appropriate.\n" +
      "4. Context Memory: Remember previous messages when answering. If the user says 'diet' then 'for weight loss' in the next message, combine them.\n" +
      "5. Always try to provide a concrete answer, even if the query is vague. Give suggestions based on the user's focus.\n" +
      "6. Format: Use plain text with emojis where appropriate. Break up paragraphs if needed, but don't output markdown formatting unless helpful.\n" +
      userContext;

    // The Gemini 2.5 model is recommended for general text and chat tasks
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction 
    });

    // Format the history from frontend (which is usually [{text, sender}, ...] ) into Gemini format [{role, parts: [{text}]}]
    let formattedHistory = [];
    if (history && Array.isArray(history)) {
      let tempHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || '' }]
      }));
      
      if (tempHistory.length > 0 && tempHistory[0].role === 'model') {
        tempHistory.unshift({ role: 'user', parts: [{ text: 'Hi' }] });
      }
      
      // Ensure strict alternation (user -> model -> user -> model...)
      let expectedRole = 'user';
      for (const msg of tempHistory) {
        if (msg.role === expectedRole) {
          formattedHistory.push(msg);
          expectedRole = expectedRole === 'user' ? 'model' : 'user';
        } else if (formattedHistory.length > 0) {
          // Combine consecutive messages of the same role
          formattedHistory[formattedHistory.length - 1].parts[0].text += '\n' + msg.parts[0].text;
        }
      }
    }

    // Start chat with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500, // Keep responses relatively concise
        temperature: 0.7,     // Balanced creativity and coherence
      }
    });

    // Send the latest user message
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText.trim() });
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ reply: "Oops! I ran into a slight issue processing your request. Please try again or rephrase your question." });
  }
};
