// script.js

document.addEventListener("DOMContentLoaded", () => {
  const inputTextArea = document.getElementById("inputText");
  const translateButton = document.getElementById("translateButton");
  const targetLanguageSelect = document.getElementById("targetLanguage");
  const reverseTranslationCheckbox =
    document.getElementById("reverseTranslation");
  const resultDiv = document.getElementById("result");
  const rateLimitInfo = document.getElementById("rateLimitInfo"); // Element to display remaining requests
  const loader = document.createElement("div");
  loader.className = "loader";

  translateButton.addEventListener("click", async () => {
    const inputText = inputTextArea.value.trim();
    const targetLanguage = targetLanguageSelect.value;
    const reverseTranslation = reverseTranslationCheckbox.checked;

    if (!inputText) {
      showError("Please enter some text to translate.");
      return;
    }

    showLoader();

    try {
      console.log("Sending translation request...");

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

      // Get the RateLimit-Remaining header
      const remainingRequests = response.headers.get("RateLimit-Remaining");

      if (remainingRequests !== null) {
        displayRemainingRequests(remainingRequests);
      }

      if (response.status === 429) {
        // Handle rate limit exceeded
        const data = await response.json();
        const retryAfter = response.headers.get("Retry-After");
        const minutes = Math.ceil(retryAfter / 60);

        showError(`${data.error} Please try again after ${minutes} minute(s).`);
        rateLimitInfo.textContent += ` | Try again after ${minutes} minute(s).`;
        return;
      }

      if (!response.ok) {
        // Handle other HTTP errors
        const data = await response.json();
        showError(data.error || "An error occurred. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.result) {
        showResult(data.result);
      } else {
        showError("Translation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("A network error occurred. Please try again later.");
    } finally {
      hideLoader();
    }
  });

  function showLoader() {
    loader.innerHTML = "Translating...";
    resultDiv.innerHTML = "";
    resultDiv.appendChild(loader);
  }

  function hideLoader() {
    if (loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  function showResult(result) {
    resultDiv.innerHTML = `<p><strong>Translation:</strong></p><p>${result}</p>`;
  }

  function showError(message) {
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
  }

  function displayRemainingRequests(remaining) {
    rateLimitInfo.textContent = `Remaining Requests: ${remaining}`;
  }
});
