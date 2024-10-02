# Multi-Language Translator

A web-based application that translates text between multiple languages (English, Chinese, Spanish, Hindi, and Myanmar) with an option for reverse translation. The app utilizes OpenAI's GPT model to handle the translations and provides real-time feedback in a clean, user-friendly interface.

## Features

- Supports translation from **English** to:
  - **Chinese**
  - **Spanish**
  - **Hindi**
  - **Myanmar**
- **Reverse translation** option (translate back to English)
- Clean, responsive user interface
- Real-time translation feedback with loading indicators
- In-memory caching of translations to avoid redundant requests
- Secure and efficient backend using **Node.js**, **Express**, and **Helmet** for security

## User Story

AS A developer  
I WANT an AI-powered multi-language translation application  
SO THAT I can translate text from English to different languages and back efficiently using an AI-powered model.

## Acceptance Criteria

GIVEN an AI-powered translation application  
WHEN a user selects a target language and inputs text  
THEN the application provides the translation from English to the target language in real-time  
WHEN the reverse translation option is selected  
THEN the application translates the input text back to English

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Usage](#usage)
5. [File Structure](#file-structure)
6. [Future Enhancements](#future-enhancements)
7. [Contributing](#contributing)
8. [License](#license)

## Technologies Used

- **Frontend**:
  - HTML5, CSS3 (Responsive design)
  - Vanilla JavaScript (DOM Manipulation, Fetch API)
- **Backend**:
  - **Node.js** with **Express** for routing and server-side logic
  - **OpenAI API** for GPT-powered translations
  - **LangChain** for prompt management
  - **Helmet** for securing HTTP headers
- **Other Tools**:
  - **dotenv** for environment variables
  - **morgan** and **winston** for logging

## Installation

To set up the Multi-Language Translator locally, follow these steps:

### Prerequisites

- **Node.js**: Make sure you have Node.js installed (version >=14.x).
- **npm**: Node package manager comes with Node.js, but ensure it's up to date.

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/multi-language-translator.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd multi-language-translator
   ```

3. **Install Dependencies:**

   Install the necessary Node.js dependencies:

   ```bash
   npm install
   ```

4. **Setup Environment Variables:**

   Create a `.env` file in the root directory and add your OpenAI API key:

   ```bash
   OPENAI_API_KEY=your_openai_api_key
   ```

   Replace `your_openai_api_key` with your actual OpenAI API key.

## Scripts

Add the following scripts to your **package.json** file to make it easier to start your application:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

- **start**: Starts the server in production mode.
- **dev**: Starts the server in development mode using `nodemon`, which will automatically restart the server on code changes.

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

   - Select a language from the dropdown, enter text in English, and click the **Translate** button.
   - Optionally, check the **Reverse Translation** box to translate the result back into English.

## Logging

- The application uses **Winston** for logging, and logs are written to an `app.log` file.
- Whenever the application is running, the `app.log` file will be created in the root directory (if it doesn't already exist) and will store logs such as request details, errors, and other important events.

  You can find the log file at:

  ```bash
  /project-root/app.log
  ```

- The logs include information about incoming requests, successful translations, errors, and more. This can be useful for debugging or monitoring purposes.

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
  ├── package-lock.json   # Lockfile for installed dependencies
  ├── package.json        # npm package file
  └── README.md           # Project documentation

```

## Future Enhancements

- **Additional Language Support**: Expand the available languages for translation.
- **User Authentication**: Add login/logout functionality for personalized translation history.
- **Speech-to-Text and Text-to-Speech**: Implement speech translation capabilities.
- **Translation History**: Allow users to save and view past translations.
- **Caching Improvements**: Enhance the caching strategy to store more translations efficiently.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcomed.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add SomeFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
