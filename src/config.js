// Import required modules
const dotenv = require("dotenv");
dotenv.config();

// Define the configuration settings for the server and OpenAI API
const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o",
    temperature: process.env.OPENAI_TEMPERATURE || 1,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

module.exports = config;
