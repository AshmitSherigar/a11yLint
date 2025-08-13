// This runs on every matching webpage
console.log("Hello from content script!", window.location.href);



// runFeature which runs the feature according to the optionId
function runFeature(optionId) {
    switch (optionId) {
        case "opt1":
            checkForVideoAndImages()
            console.log("Option 1 Logic here");
            break;
        case "opt2":
            console.log("Option 2 Logic here");
            break;
        case "opt3":
            console.log("Option 3 Logic here");
            break;
        case "opt4":
            console.log("Option 4 Logic here");
            break;
        case "opt5":
            console.log("Option 5 Logic here");
            break;

        default:
            console.log("No Logic to be run here");
            break;
    }

}

// This is a message Event listener that listens for a message checks its type and runs the function for each iterated optionId
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "RUN_FEATURES") {
        message.options.forEach(optionId => {
            runFeature(optionId)

        });

    }
})

