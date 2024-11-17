// Wait until the DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  // Get references to key DOM elements for user interaction
  const inputTextArea = document.getElementById("inputText");
  const translateButton = document.getElementById("translateButton");
  const targetLanguageSelect = document.getElementById("targetLanguage");
  const reverseTranslationCheckbox =
    document.getElementById("reverseTranslation");
  const resultDiv = document.getElementById("result");
  const rateLimitInfo = document.getElementById("rateLimitInfo");

  // Loader element for indicating ongoing processing
  const loader = document.createElement("div");
  loader.className = "loader";

  // Event listener for the translate button click event
  translateButton.addEventListener("click", async () => {
    // Extract input values from the text area and other elements
    const inputText = inputTextArea.value.trim();
    const targetLanguage = targetLanguageSelect.value;
    const reverseTranslation = reverseTranslationCheckbox.checked;

    // Check if input text is provided, show error if missing
    if (!inputText) {
      showError("Please enter some text to translate.");
      return;
    }

    // Display loader to indicate the translation process is in progress
    showLoader();

    try {
      console.log("Sending translation request...");

      // Make POST request to the server with translation parameters
      const response = await fetch("/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputText,
          targetLanguage,
          reverse: reverseTranslation,
        }),
      });

      console.log("Response received:", response.status);

      // Display remaining requests from rate limit headers if available
      const remainingRequests = response.headers.get("RateLimit-Remaining");
      if (remainingRequests !== null) {
        displayRemainingRequests(remainingRequests);
      }

      // Check for 429 Too Many Requests response to handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const resetEpoch = response.headers.get("RateLimit-Reset");
        const resetTime = new Date(resetEpoch * 1000); // Convert to milliseconds
        const retryTime = new Date(Date.now() + retryAfter * 1000); // Calculate retry time based on 'Retry-After'

        showError(
          `Too many requests. Try again after ${retryTime.toLocaleTimeString()} (server time).`
        );
        return;
      }

      // Handle general errors for responses that are not OK (non-2xx)
      if (!response.ok) {
        const data = await response.json();
        showError(data.error || "An error occurred. Please try again.");
        return;
      }

      // Process successful response and display the translation result
      const data = await response.json();
      if (data.result) {
        showResult(data.result);
      } else {
        showError("Translation failed. Please try again.");
      }
    } catch (error) {
      // Log and handle network or unexpected errors during the fetch call
      console.error("Error:", error);
      showError("A network error occurred. Please try again later.");
    } finally {
      // Remove the loader once translation is complete or an error occurs
      hideLoader();
    }
  });

  // Function to show loader animation during translation
  function showLoader() {
    loader.innerHTML = "Translating...";
    resultDiv.innerHTML = "";
    resultDiv.appendChild(loader);
  }

  // Function to hide the loader after translation is done
  function hideLoader() {
    if (loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  // Function to display the translation result in the result div
  function showResult(result) {
    resultDiv.innerHTML = `<p><strong>Translation:</strong></p><p>${result}</p>`;
  }

  // Function to display error messages in the result div
  function showError(message) {
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
  }

  // Function to update remaining requests info based on rate limiting headers
  function displayRemainingRequests(remaining) {
    rateLimitInfo.textContent = `Remaining Requests: ${remaining}`;
  }
});