// DOM Elements
// Selecting important elements from the DOM for interaction
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null; // Stores the user's input message
let isResponseGenerating = false; // Indicates if a response is currently being generated

// API configuration
const API_KEY = "AIzaSyAsEvSJ1WEU5ix3Yjuv6xQAyQRf4OBAL-g"; // API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Load theme and chat data from local storage on page load
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = localStorage.getItem("themeColor") === "light_mode";

  // Apply the stored theme
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "mode_night" : "light_mode";

  // Restore saved chats or clear the chat container
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
};

// Create a new message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes); // Add specified classes to the element
  div.innerHTML = content; // Set the inner HTML of the element
  return div;
};

// Show typing effect, word by word
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' '); // Split the text into words
  let currentWordIndex = 0;

  // Typing effect using setInterval
  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    if (currentWordIndex === words.length) {
      // Stop the typing effect when all words are displayed
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }

    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
};

// Fetch API response based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    // Send a POST request to the API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Process and display the API response
    const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
  } catch (error) {
    // Handle errors
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

// Show a loading animation
const showLoadingAnimation = () => {
  const html = `
    <div class="message-content">
      <img class="avatar" src="assets/gemini.svg" alt="Gemini avatar">
      <p class="text"></p>
      <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>
    <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>
  `;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv); // Fetch the response
};

// Copy message text to clipboard
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText); // Copy text to clipboard
  copyButton.innerText = "done"; // Indicate success
  setTimeout(() => copyButton.innerText = "content_copy", 1000); // Revert icon after 1 second
};

// Handle outgoing chat
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage; // Get user input
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;

  // Create an outgoing message element
  const html = `
    <div class="message-content">
      <img class="avatar" src="assets/user.png" alt="User avatar">
      <p class="text"></p>
    </div>
  `;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);

  typingForm.reset(); // Reset the input field
  document.body.classList.add("hide-header"); // Hide header when a message is sent
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  setTimeout(showLoadingAnimation, 100); // Show the loading animation
};

// Event listeners for theme toggle, chat deletion, and suggestion clicks
toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "mode_night");
  toggleThemeButton.innerText = isLightMode ? "mode_night" : "light_mode";
});

deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats"); // Clear chat history
    loadDataFromLocalstorage(); // Reload the chat container
  }
});

suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText; // Set user message to the suggestion
    handleOutgoingChat(); // Send the selected suggestion as a message
  });
});

// Handle form submission for typing input
typingForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  handleOutgoingChat(); // Send the user input as a message
});

// Initialize the app by loading data from local storage
loadDataFromLocalstorage();
