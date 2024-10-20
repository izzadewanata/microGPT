Here are some explanation of the codes and functionalities. Happy reading!


### DOM Elements
The code selects HTML elements that are critical to the chat interface:
- `typingForm`: The form where users type messages.
- `chatContainer`: The container displaying the chat messages.
- `suggestions`: Predefined message suggestions.
- `toggleThemeButton` and `deleteChatButton`: Buttons to toggle between light/dark themes and delete the chat history.


### State Variables
- `userMessage`: Stores the user's current message.
- `isResponseGenerating`: Boolean that tracks whether a response is being generated.


### API Configuration
- `API_KEY` and `API_URL`: API key and URL for interacting with a generative language model (e.g., Google Gemini Pro) to get responses based on user messages.


### Functions


1. **loadDataFromLocalstorage**:
   - Loads theme (light/dark mode) and previous chat history from local storage, applying them to the page. It also scrolls the chat to the bottom.


2. **createMessageElement**:
   - Dynamically creates a new chat message (incoming or outgoing) by generating a `div` element with the content and given CSS classes.


3. **showTypingEffect**:
   - Simulates typing by gradually displaying an API response, word by word. This makes the response appear more natural. It saves the chats to local storage after the full message is displayed.


4. **generateAPIResponse**:
   - Sends the user's message to the API, fetches the response, and handles any errors. It displays the response using `showTypingEffect`.


5. **showLoadingAnimation**:
   - Shows a loading animation while the API response is being fetched, indicating to the user that the response is being generated.


6. **copyMessage**:
   - Copies the chat message text to the clipboard when the user clicks a copy icon.


7. **handleOutgoingChat**:
   - Handles sending the user's message. It validates the message, displays it, triggers the loading animation, and then resets the input field.


### Event Listeners
- **Theme Toggling**: Toggles between light and dark themes, updating local storage to persist the user's preference.
- **Deleting Chat**: Clears the chat history from the UI and local storage when the user confirms.
- **Suggestion Clicks**: Allows users to click on predefined suggestions to quickly send a message.
- **Form Submission**: Sends the message when the form is submitted (enter key).


### App Initialization
- The app is initialized by calling `loadDataFromLocalstorage` when the page loads, ensuring previous chats and the theme are restored.
