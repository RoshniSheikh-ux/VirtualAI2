if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition. Please use Google Chrome or another supported browser.");
}

let assistantButton = document.querySelector(".chatbot-icon-container"); // Changed variable name
let btn2 = document.querySelector(".chatbot-icon-container"); // New variable for mobile and desktop button control
let isListening = false; // Track the listening state
let isSpeaking = false;  // Track the speaking state
let debounceTimer;

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false;  // Listen for one result at a time
recognition.interimResults = false;  // Avoid partial responses

// Function to speak and control the assistant's state
function speak(text) {
    return new Promise((resolve) => {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "hi-GB";

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

    await takeCommand(transcript);

    // Restart recognition after speaking ends
    if (isListening && !isSpeaking) {
        recognition.start();
    }
};

// Restart recognition when it ends
recognition.onend = () => {
    if (isListening && !isSpeaking) {
        console.log("Restarting recognition...");
        recognition.start();
    }
};

// Toggle listening on button click
assistantButton.addEventListener("click", async () => {
    isListening = !isListening; // Toggle listening state

    if (isListening) {
        await wishMe();  // Greet and start listening
        recognition.start();
    } else {
        recognition.stop();
    }
});

// Handle commands with the same stop logic
async function takeCommand(message) {
    const lowerCaseMessage = message.toLowerCase(); // Normalize input for comparison
    console.log(`Heard: ${lowerCaseMessage}`);

    if (lowerCaseMessage.includes('hello')) {
        await speak("Hello, how can I help you?");
    } else if (lowerCaseMessage.includes('go to classes page') || lowerCaseMessage.includes('open classes page')) {
        pageSwitcher("classes.html");
    } else if (lowerCaseMessage.includes('go to contact page')) {
        pageSwitcher("contact.html");
    } else if (lowerCaseMessage.includes('go to home page') || lowerCaseMessage.includes('go to homepage')) {
        pageSwitcher("index.html");
    } else if (lowerCaseMessage.includes('go to courses page') || lowerCaseMessage.includes('open courses page')) {
        pageSwitcher("courses.html");
    } else if (lowerCaseMessage.includes('go to blog page') || lowerCaseMessage.includes('open blog page')) {
        pageSwitcher("Blog.html");
    } else if (lowerCaseMessage.includes('what is your name') || lowerCaseMessage.includes('tumhara name kya hai')) {
        await speak("My name is Edith. I am a virtual assistant at this page.");
    } else if (lowerCaseMessage.includes('who made you')) {
        await speak("I am made by SmartCoderRahis for assistance on his website.");
    } else if (lowerCaseMessage.includes('tumko kisne banaya hai')) {
        await speak("Mujhe Smart Coder Rahis dwaraa banaya gaya hai. Mai ek Virtual Assistant hoo!");
    } else if (lowerCaseMessage.includes('what can you do') || lowerCaseMessage.includes('tell me your capability')) {
        await speak("I can assist you through this page. I can do lots of things except the things which are in the developing phase.");
    } else if (lowerCaseMessage.includes('tum kya kar sakti ho')) {
        await speak("Mai iss website ko apke voice se control karne me madad kar sakti hoon!");
    } else if (lowerCaseMessage.includes('stop') || lowerCaseMessage.includes('goodbye') || lowerCaseMessage.includes('go to hell')) {
        await speak("I am gonna sleep now. Goodbye!");
        simulateClick(assistantButton); // Programmatically click the button
        simulateCloseButtonClick(); // Programmatically click the close button
    } else {
        await speak("I am sorry! I am currently in the developing phase. Sorry for the inconvenience.");
    }
}

// Function to programmatically click the button
function simulateClick(element) {
    const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
    setTimeout(() => {
        element.dispatchEvent(event); // Trigger the click
        console.log("Button clicked programmatically.");
    }, 500);
}

// Function to programmatically click the close button
function simulateCloseButtonClick() {
    const closeButton = document.querySelector(".close-btn");
    if (closeButton) {
        const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
        closeButton.dispatchEvent(event); // Trigger the close button click
        console.log("Close button clicked programmatically.");
    }
}

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

recognition.onend = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (isListening && !isSpeaking) recognition.start(); // Restart recognition after a delay
    }, 500);
};

// Button event listeners for both mobile and desktop
btn2.addEventListener("touchstart", toggleListening); // Mobile
btn2.addEventListener("click", toggleListening); // Desktop

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isListening && !isSpeaking) {
        recognition.start(); // Restart when the page regains focus
    }
});
