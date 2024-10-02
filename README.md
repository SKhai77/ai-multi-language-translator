# AI Multi-Language Translator

A web-based application that translates text between multiple languages (English, Chinese, Spanish, Hindi, and Myanmar) with an option for reverse translation. The app utilizes OpenAI's GPT-4 model via the LangChain framework to handle the translations and provides real-time feedback in a clean, user-friendly interface. The application includes rate limiting to prevent excessive requests and informs users about their remaining requests.

---

## Features

- Supports translation from **English** to:
  - **Chinese**
  - **Spanish**
  - **Hindi**
  - **Myanmar**
- **Reverse translation** option (translate back to English)
- **Rate Limiting**:
  - Limits each IP to 100 requests per 15 minutes
  - Displays remaining requests to the user
  - Informs users when the limit is exceeded and how long to wait
- Clean, responsive user interface with loading indicators
- In-memory caching of translations to avoid redundant requests
- Secure and efficient backend using **Node.js**, **Express**, and **Helmet** for security
- Detailed logging of requests and errors using **Winston** and **Morgan**

---

## User Story

AS A developer  
I WANT an AI-powered multi-language translation application  
SO THAT I can translate text from English to different languages and back efficiently using an AI-powered model.

---

## Acceptance Criteria

GIVEN an AI-powered translation application  
WHEN a user selects a target language and inputs text  
THEN the application provides the translation from English to the target language in real-time  
WHEN the reverse translation option is selected  
THEN the application translates the input text back to English  
WHEN the user exceeds the allowed number of translation requests  
THEN the application informs the user and indicates how long to wait before making a new request

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Logging](#logging)
6. [File Structure](#file-structure)
7. [API Endpoint](#api-endpoint)
8. [Rate Limiting](#rate-limiting)
9. [Error Handling](#error-handling)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

---

## Technologies Used

- **Frontend**:
  - HTML5, CSS3 (Responsive design)
  - Vanilla JavaScript (DOM Manipulation, Fetch API)
- **Backend**:
  - **Node.js** with **Express** for routing and server-side logic
  - **OpenAI API** via **LangChain** for GPT-4 powered translations
  - **Helmet** for securing HTTP headers
  - **Express Rate Limit** for rate limiting middleware
- **Other Tools**:
  - **dotenv** for environment variables
  - **Morgan** and **Winston** for logging
  - **nodemon** for development (optional)

---

## Installation

To set up the AI Multi-Language Translator locally, follow these steps:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (version >=14.x).
- **npm**: Node package manager comes with Node.js; ensure it's up to date.
- **OpenAI API Key**: You need a valid OpenAI API key to use the translation features.

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/multi-language-translator.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd ai-multi-language-translator
   ```

3. **Install Dependencies:**

   Install the necessary Node.js dependencies:

   ```bash
   npm install
   ```

---

## Configuration

Create a `.env` file in the project root directory and add your environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your actual OpenAI API key.

### Optional: Adjust the OpenAI model and temperature settings in the `config/config.js` file:

```config
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.25
```

### Configure Rate Limiting (optional):

In `config/config.js`, you can adjust the rate limiting settings:

```javascript
rateLimit: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}
```

---

## Usage

1. **Start the Server:**

   To start the Express server and serve the application:

   ```bash
   npm run start
   ```

   or for development:

   ```bash
   npm run dev
   ```

2. **Access the Application:**

   Once the server is running, open your web browser and navigate to:

   ```bash
   http://localhost:3000
   ```

3. **Perform Translations:**

   - Enter the text you want to translate in English.
   - Select a target language from the dropdown menu.
   - Optionally, check the Reverse Translation box to translate the result back into English.
   - Click the Translate button.
   - View the translation result and your remaining requests.

---

## Logging

- The application uses **Winston** for logging, and logs are written to an `app.log` file.
- Whenever the application is running, the `app.log` file will be created in the root directory (if it doesn't already exist) and will store logs such as request details, errors, and other important events.

  You can find the log file at:

  ```bash
  /project-root/app.log
  ```

- The logs include information about incoming requests, successful translations, errors, and more. This can be useful for debugging or monitoring purposes.

---

## File Structure

```bash
/project-root
  ├── /.vscode            # VSCode-specific settings
  │    └── settings.json  # Spell-check configuration
  ├── /config             # Logger and other configurations
  │    ├── config.js      # Configuration file
  │    └── logger.js      # Winston logger configuration
  ├── /public             # Contains all public-facing files
  │    ├── index.html     # Main HTML file
  │    ├── styles.css     # CSS file for styling
  │    └── script.js      # JavaScript for front-end logic
  ├── /src                # Contains server-side code
  │    └── server.js      # Main server file
  ├── .env                # Environment variables
  ├── .gitignore          # Git ignore file
  ├── app.log             # Log file created by Winston
  ├── license             # MIT License information
  ├── package-lock.json   # Lockfile for installed dependencies
  ├── package.json        # npm package file
  └── README.md           # Project documentation

```

---

## API Endpoint

### POST `/translate`

Handles translation requests.

#### Request Body:

```json
{
  "question": "Your text to translate",
  "targetLanguage": "Target language",
  "reverse": true or false
}
```

#### Response:

##### Success (200):

```json
{
  "result": "Translated text"
}
```

##### Error (4xx or 5xx):

```json
{
  "error": "Error message"
}
```

---

## Rate Limiting

- Each IP address is limited to **100 requests per 15 minutes**.
- The application displays the **remaining number of requests** after each translation.
- If the rate limit is exceeded, users receive a message indicating how long they need to wait before making a new request.
- **Headers related to rate limiting:**
  - `RateLimit-Limit`: Maximum number of requests allowed.
  - `RateLimit-Remaining`: Number of requests left in the current window.
  - `RateLimit-Reset`: Time when the current window resets in UTC epoch seconds.
  - `Retry-After`: Number of seconds to wait before making a new request.

---

## Error Handling

### Client-Side Validation:

- Checks if the input text is provided before sending a request.
- Displays informative error messages for missing inputs.

### Server-Side Validation:

- Validates request parameters.
- Returns appropriate HTTP status codes and error messages.

### Network and Server Errors:

- Handles network errors gracefully.
- Provides user-friendly messages for unexpected errors.

---

## Future Enhancements

- **Additional Language Support**: Expand the available languages for translation.
- **User Authentication**: Add login/logout functionality for personalized translation history.
- **Speech-to-Text and Text-to-Speech**: Implement speech translation capabilities.
- **Translation History**: Allow users to save and view past translations.
- **Caching Improvements**: Enhance the caching strategy to store more translations efficiently.

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcomed.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add SomeFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](./license).

---

## Acknowledgments

- [OpenAI](https://openai.com/) for the GPT-4 model.
- [LangChain](https://github.com/hwchase17/langchain) for the language model framework.
- [Express.js](https://expressjs.com/) for the web framework.
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) for rate limiting middleware.
- [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan) for logging.
