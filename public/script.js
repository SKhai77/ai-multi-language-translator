// Wait until the DOM is fully loaded, then get references to key DOM elements for handling user input, triggering translations, showing results, and displaying rate limit info.
document.addEventListener("DOMContentLoaded", () => {
  const inputTextArea = document.getElementById("inputText");
  const translateButton = document.getElementById("translateButton");
  const targetLanguageSelect = document.getElementById("targetLanguage");
  const reverseTranslationCheckbox =
    document.getElementById("reverseTranslation");
  const resultDiv = document.getElementById("result");
  const rateLimitInfo = document.getElementById("rateLimitInfo");
  const loader = document.createElement("div");
  loader.className = "loader";

  // Event listener for the translate button click event
  translateButton.addEventListener("click", async () => {
    // Get the input text, selected target language, and whether reverse translation is enabled
    const inputText = inputTextArea.value.trim();
    const targetLanguage = targetLanguageSelect.value;
    const reverseTranslation = reverseTranslationCheckbox.checked;

    // If the input text is empty, show an error message and stop further execution
    if (!inputText) {
      showError("Please enter some text to translate.");
      return;
    }

    // Show the loader to indicate that translation is in progress
    showLoader();

    try {
      console.log("Sending translation request...");

      // Send the translation request to the server using the fetch API
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

      // Get the remaining number of requests from the response headers
      const remainingRequests = response.headers.get("RateLimit-Remaining");
      if (remainingRequests !== null) {
        displayRemainingRequests(remainingRequests);
      }

      // If the rate limit has been exceeded (HTTP 429), show an error message and how long to wait
      if (response.status === 429) {
        const data = await response.json();
        const retryAfter = response.headers.get("Retry-After");
        const minutes = Math.ceil(retryAfter / 60);

        showError(`${data.error} Please try again after ${minutes} minute(s).`);
        rateLimitInfo.textContent += ` | Try again after ${minutes} minute(s).`;
        return;
      }

      // If the response status is not OK, handle the error (e.g., network or server issue)
      if (!response.ok) {
        const data = await response.json();
        showError(data.error || "An error occurred. Please try again.");
        return;
      }

      // Process the successful response and display the translation result
      const data = await response.json();
      if (data.result) {
        showResult(data.result);
      } else {
        showError("Translation failed. Please try again.");
      }
    } catch (error) {
      // Handle network errors or other issues during the fetch call
      console.error("Error:", error);
      showError("A network error occurred. Please try again later.");
    } finally {
      // Hide the loader once the translation is complete (either success or error)
      hideLoader();
    }
  });

  // Function to show the loader while the translation is in progress
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

  // Function to display the translation result
  function showResult(result) {
    resultDiv.innerHTML = `<p><strong>Translation:</strong></p><p>${result}</p>`;
  }

  // Function to display error messages
  function showError(message) {
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
  }

  // Function to display the remaining number of requests (rate limiting information)
  function displayRemainingRequests(remaining) {
    rateLimitInfo.textContent = `Remaining Requests: ${remaining}`;
  }
});
