// This runs on every matching webpage
console.log("Hello from content script!", window.location.href);

function checkForVideoAndImages() {
    //Check for Images
    const imageCheck = []
    document.querySelectorAll("img").forEach(image => {

        // 1. Check for missing alt images
        if (!image.hasAttribute("alt")) {
            imageCheck.push(image)
            image.style.setProperty("border", "3px solid red", "important");
        }

        // 2. Checking for potential large images that need complex description
        const alt = image.getAttribute("alt") || ""
        const imgHeight = image.height
        const imgWidth = image.width
        const fileName = image.src.toLowerCase()
        const classes = image.className.toLowerCase()
        const inFigure = !!image.closest("figure")
        // !! to convert to a boolean value and .closest() checks if the image is in the figure element in the DOM tree

        const isLarge = imgWidth >= 250 || imgHeight >= 250
        const looksLikeChart = /chart|graph|diagram|infographic/.test(fileName + " " + classes)
        const altShort = alt.split(" ").length < 10

        if ((isLarge || looksLikeChart || inFigure) && altShort) {

            // if it is a large image or has chart or graph in the filename or class and it is in <figure> element which is used to describe multi-line alt description if any of these conditions are true along with if it has short text then this condition matches 
            // so basically we want the complex images to have proper description 

            imageCheck.push(image)
            image.style.setProperty("border", "3px solid orange", "important");
        }


    });
    console.log(`${imageCheck.length} images have missing alt tag`);

    //Check for Videos
    document.querySelectorAll("video").forEach(video => {
        // Autoplay | Controls | Caption
        const hasControls = video.getAttribute("controls")
        const hasCaption = video.getAttribute("track[kind='captions']")

        if (video.hasAttribute("autoplay")) {
            video.style.setProperty("border", "3px solid orange", "important");
            console.log("Video has autoplay enabled:", video);
        }
        if (!hasControls) {
            video.style.setProperty("border", "3px solid red", "important");
            console.log("Video Missing Control")
        }
        if (!hasCaption) {
            video.style.setProperty("border", "3px solid orange", "important");
            console.log("Video Missing Caption")
        }
    });

    //Check for Audio
    document.querySelectorAll("audio").forEach(audio => {
        // Autoplay | Controls | Transcript
        const hasControls = audio.getAttribute("controls")
        const hasTranscriptId = audio.getAttribute("aria-describeby")
        if (audio.hasAttribute("autoplay")) {
            console.log("Audio has autoplay enabled:", audio);
            audio.style.setProperty("border", "3px solid orange", "important");
        }
        if (!hasControls) {
            audio.style.setProperty("border", "3px solid red", "important");
            console.log("Audio Missing Control")
        }
        if (!hasTranscriptId) {
            audio.style.setProperty("border", "3px solid orange", "important");
            console.log("Aduio Missing Transcript")
        }
    });


}

// runFeature which runs the feature according to the optionId
function runFeature(optionId) {
    switch (optionId) {
        case "opt1":
            checkForVideoAndImages()
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

