require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log("gemini-1.5-flash SUCCESS");
  } catch(e) {
    console.error("1.5-flash ERROR:", e.message);
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("hello");
    console.log("gemini-pro SUCCESS");
  } catch(e) {
    console.error("pro ERROR:", e.message);
  }
}
run();
