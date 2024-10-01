// Initialize the loader element
document.addEventListener("DOMContentLoaded", () => {
  const inputTextArea = document.getElementById("inputText");
  const translateButton = document.getElementById("translateButton");
  const targetLanguageSelect = document.getElementById("targetLanguage");
  const reverseTranslationCheckbox =
    document.getElementById("reverseTranslation");
  const resultDiv = document.getElementById("result");
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

      const data = await response.json();

      if (response.ok && data.result) {
        showResult(data.result);
      } else if (data.error) {
        showError(data.error);
      } else {
        showError("Translation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("An error occurred. Please try again.");
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
});
