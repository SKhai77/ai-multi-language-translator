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
    temperature: process.env.OPENAI_TEMPERATURE || 0.4,
  },
  rateLimit: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  },
};

module.exports = config;
