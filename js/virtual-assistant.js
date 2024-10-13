

// Check for speech recognition support
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition. Please use Google Chrome or another supported browser.");
}

// Get elements
const chatbotIconContainer = document.getElementById("chatbot-icon-container");
const chatPopup = document.getElementById("chat-popup");
const mainCont = document.querySelector(".main-container");
let isDragging = false;
let offsetX, offsetY;
let longPressTimeout;

// State variables
let isListening = false; // Track the listening state
let hasWished = false; // Track if the assistant has wished the user
let isSpeaking = false; // Track the speaking state

// Speech recognition setup
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false; // Listen for one result at a time
recognition.interimResults = false; // Avoid partial responses

// Function to speak and control the assistant's state
function speak(text) {
    return new Promise((resolve) => {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "en";

        // Stop recognition while speaking
        if (isListening) recognition.stop();
        isSpeaking = true;

        text_speak.onend = () => {
            console.log("Finished speaking.");
            isSpeaking = false;
            resolve(); // Resolve after speaking ends
        };

        window.speechSynthesis.speak(text_speak);
    });
}

// Function to greet based on the time of day
async function wishMe() {
    let day = new Date();
    let hrs = day.getHours();
    let greetingText;

    if (hrs >= 0 && hrs < 12) {
        greetingText = "Good Morning, How can I help you?";
    } else if (hrs >= 12 && hrs < 16) {
        greetingText = "Good Afternoon, How can I help you?";
    } else {
        greetingText = "Good Evening, How can I help you?";
    }

    await speak(greetingText); // Wait for the greeting to finish
}

// Handle speech recognition results
recognition.onresult = async (event) => {
    let transcript = event.results[event.resultIndex][0].transcript.trim();
    console.log(`Heard: ${transcript}`);

    await takeCommand(transcript); // Process the command
};

// Restart recognition when it ends
recognition.onend = () => {
    if (isListening && !isSpeaking) {
        console.log("Restarting recognition...");
        recognition.start(); // Restart recognition if the assistant is listening
    }
};

// Toggle Chat Popup
function toggleChat() {
    chatPopup.classList.toggle("show");
    mainCont.classList.toggle("blurred");
    
    // Update the border color based on the visibility of the chat
    if (chatPopup.classList.contains("show")) {
        chatbotIconContainer.style.border = "3px solid green"; // Active state
    } else {
        chatbotIconContainer.style.border = "3px solid red"; // Closed state
    }
}

// Click event for the assistant button
chatbotIconContainer.addEventListener("click", async () => {
    await startListening(); // Start listening
});

// Start listening
async function startListening() {
    if (!isListening) {
        isListening = true;
        toggleChat(); // Open the chat popup
        if (!hasWished) {
            await wishMe(); // Greet and start listening only once
            hasWished = true; // Mark as wished
        }
        recognition.start(); // Start listening
        console.log("Assistant is now listening...");
    }
}

// Stop listening
async function stopListening() {
    isListening = false;
    recognition.stop(); // Stop speech recognition
    console.log("Assistant stopped listening.");
}

// Handle commands
async function takeCommand(message) {
    const lowerCaseMessage = message.toLowerCase(); // Normalize input for comparison
    console.log(`Heard: ${lowerCaseMessage}`);

    // Define commands and responses
    if (lowerCaseMessage.includes('hello')) {
        await speak("Hello, how can I help you?");
    } else if (lowerCaseMessage.includes('go to classes page')) {
        pageSwitcher("classes.html");
    } else if (lowerCaseMessage.includes('go to contact page')) {
        pageSwitcher("contact.html");
    } else if (lowerCaseMessage.includes('go to home page')) {
        pageSwitcher("index.html");
    } else if (lowerCaseMessage.includes('go to courses page')) {
        pageSwitcher("courses.html");
    } else if (lowerCaseMessage.includes('go to blog page')) {
        pageSwitcher("Blog.html");
    } else if (lowerCaseMessage.includes('what is your name')) {
        await speak("My name is Edith. I am a virtual assistant at this page.");
    } else if (lowerCaseMessage.includes('who made you')) {
        await speak("I am made by SmartCoderRahis for assistance on his website.");
    } else if (lowerCaseMessage.includes('what can you do')) {
        await speak("I can assist you through this page. I can do lots of things except the things which are in the developing phase.");
    } else if (lowerCaseMessage.includes('stop') || lowerCaseMessage.includes('goodbye')) {
        await speak("I am gonna sleep now. Goodbye!");
    } else {
        await speak("I am sorry! I am currently in the developing phase. Sorry for the inconvenience.");
    }

    // Close chat popup after the response has been spoken
    await stopListening(); // Stop listening after responding
    toggleChat(); // Close the chat popup
}

// Start the long press detection for dragging
chatbotIconContainer.addEventListener("mousedown", (event) => {
    event.preventDefault(); // Prevent default to avoid text selection
    longPressTimeout = setTimeout(() => {
        offsetX = event.clientX - chatbotIconContainer.getBoundingClientRect().left;
        offsetY = event.clientY - chatbotIconContainer.getBoundingClientRect().top;

        isDragging = true;
        chatbotIconContainer.style.cursor = "grabbing"; // Change cursor to grabbing
        requestAnimationFrame(onMouseMove); // Start moving
        document.addEventListener("mousemove", onMouseMove);
    }, 300); // Adjust the duration for long press detection (300ms)
});

// Move the chat icon
function onMouseMove(event) {
    if (isDragging) {
        // Calculate new position
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;

        // Update position smoothly
        chatbotIconContainer.style.left = `${newX}px`;
        chatbotIconContainer.style.top = `${newY}px`;
    }
}

// End the long press and drag
document.addEventListener("mouseup", () => {
    clearTimeout(longPressTimeout); // Clear the long press timeout
    if (isDragging) {
        chatbotIconContainer.style.cursor = "grab"; // Reset cursor
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove); // Remove move event
    }
});

function pageSwitcher(pageUrl) {
    const currentPageUrl = window.location.href.split('/').pop(); // Get only the last part of the URL

    if (currentPageUrl === pageUrl) {
        speak("You are already on this page.").then(() => {
            if (isListening && !isSpeaking) recognition.start(); // Restart listening
        });
    } else {
        const pageName = pageUrl.split('.html')[0]; // Get the page name
        speak(`Opening ${pageName} page.`).then(() => {
            window.location.href = pageUrl; // Redirect to the new page
        });
    }
}
