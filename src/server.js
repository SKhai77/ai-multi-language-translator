const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan"); // Morgan for logging HTTP requests
const logger = require("../logger.js"); // Winston logger
const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const path = require("path");
const config = require("./config.js");

const app = express();

// Middleware to parse JSON and apply security headers
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP if needed for external API calls
  })
);

// Configure Morgan to log HTTP requests and pipe logs to Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Pipe Morgan logs into Winston
    },
  })
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Initialize OpenAI model using settings from config.js
const model = new ChatOpenAI({
  openAIApiKey: config.openai.apiKey,
  temperature: config.openai.temperature,
  model: config.openai.model,
});

// Define prompt templates for translation and reverse translation
const prompt = new PromptTemplate({
  template: `Translate the following text from English to {targetLanguage}: "{question}"`,
  inputVariables: ["question", "targetLanguage"],
});

const reversePrompt = new PromptTemplate({
  template: `Translate the following text from {targetLanguage} back to English: "{question}"`,
  inputVariables: ["question", "targetLanguage"],
});

// In-memory cache to store translations (avoid repeated calls)
const cache = new Map();

// Function to handle translation
const translate = async (input, targetLanguage, reverse) => {
  const cacheKey = `${input}_${targetLanguage}_${reverse}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const promptTemplate = reverse ? reversePrompt : prompt;
    const promptInput = await promptTemplate.format({
      question: input,
      targetLanguage,
    });

    // Send request to OpenAI API
    const res = await model.invoke(promptInput);

    const parsedResult = res.content.trim();
    cache.set(cacheKey, parsedResult); // Cache the result
    logger.info(`Translation successful: ${parsedResult}`); // Log successful translations
    return parsedResult;
  } catch (err) {
    logger.error("Model invocation failed:", err);

    // Handle specific error if OpenAI API Key is invalid
    if (err.message.includes("Invalid API Key")) {
      throw new Error(
        "Translation failed due to invalid API key. Please check your OpenAI API configuration."
      );
    }

    throw new Error("Translation failed. Please try again later.");
  }
};

// POST route to handle translation requests
app.post("/translate", async (req, res) => {
  const { question, targetLanguage, reverse } = req.body;

  // Ensure required parameters are present
  if (!question || !targetLanguage) {
    return res.status(400).json({
      error:
        "Invalid request parameters. Please provide both question and target language.",
    });
  }

  try {
    const result = await translate(question, targetLanguage, reverse);
    logger.info(`Translation request processed for: ${question}`);
    res.json({ result });
  } catch (error) {
    logger.error("Error during translation:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack); // Log the error using Winston
  res.status(500).send("Something went wrong!");
});

// Start the server on the specified port in config.js
app.listen(config.app.port, () => {
  logger.info(`Server is running on http://localhost:${config.app.port}`);
});
