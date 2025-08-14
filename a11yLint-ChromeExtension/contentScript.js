console.log("Hello from content script!", window.location.href);

// Results storage
const accessibilityResults = {
    contrast: [],
    images: [],
    videos: [],
    audio: [],
    language: [],
    smallFonts: []
};

// --- Helper: Convert RGB(A) string to array ---
function parseRGB(color) {
    const match = color.match(/\d+/g);
    return match ? match.slice(0, 3).map(Number) : [255, 255, 255];
}

// --- Helper: Relative luminance (WCAG) ---
function luminance([r, g, b]) {
    const toLinear = c => {
        c /= 255;
        return (c <= 0.03928) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// --- Helper: Contrast ratio ---
function contrastRatio(fg, bg) {
    const L1 = luminance(parseRGB(fg));
    const L2 = luminance(parseRGB(bg));
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// --- Find real background color (walks up DOM) ---
function getEffectiveBackgroundColor(el) {
    let current = el;
    while (current && current !== document.documentElement) {
        const style = getComputedStyle(current);
        const bg = style.backgroundColor;
        const hasImage = style.backgroundImage !== 'none';

        if ((bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') || hasImage) {
            return { color: bg, hasImage };
        }
        current = current.parentElement;
    }
    return { color: 'rgb(255, 255, 255)', hasImage: false };
}

// --- Main contrast check ---
function checkContrast() {
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
        const style = getComputedStyle(el);
        const fg = style.color;
        const { color: bg, hasImage } = getEffectiveBackgroundColor(el);

        if (hasImage) return; // Skip background images

        const ratio = contrastRatio(fg, bg);

        // WCAG thresholds
        const fontSize = parseFloat(style.fontSize);
        const isBold = style.fontWeight >= 700 || style.fontWeight === 'bold';
        const largeText = (fontSize >= 18) || (isBold && fontSize >= 14);
        const minRatio = largeText ? 3 : 4.5;

        if (ratio < minRatio) {
            el.style.outline = '2px solid red';
            accessibilityResults.contrast.push({
                element: el,
                fgColor: fg,
                bgColor: bg,
                ratio: ratio.toFixed(2),
                fontSize,
                isBold,
                text: (el.innerText || el.textContent || "").trim()
            });
        }
    });
}

// --- Check for images, video, and audio ---
function checkForVideoAndImagesAndAudio() {
    // Images
    document.querySelectorAll("img").forEach(image => {
        let issueFound = false;

        // Missing alt
        if (!image.hasAttribute("alt")) {
            image.style.setProperty("border", "3px solid red", "important");
            accessibilityResults.images.push({ type: "missing-alt", src: image.src });
            issueFound = true;
        }

        // Complex image needs more description
        const alt = image.getAttribute("alt") || "";
        const imgHeight = image.height;
        const imgWidth = image.width;
        const fileName = image.src.toLowerCase();
        const classes = image.className.toLowerCase();
        const inFigure = !!image.closest("figure");
        const isLarge = imgWidth >= 250 || imgHeight >= 250;
        const looksLikeChart = /chart|graph|diagram|infographic/.test(fileName + " " + classes);
        const altShort = alt.split(" ").length < 10;

        if ((isLarge || looksLikeChart || inFigure) && altShort) {
            image.style.setProperty("border", "3px solid orange", "important");
            accessibilityResults.images.push({ type: "complex-image-short-alt", src: image.src });
            issueFound = true;
        }
    });

    // Videos
    document.querySelectorAll("video").forEach(video => {
        const hasControls = video.hasAttribute("controls");
        const hasCaption = video.querySelector("track[kind='captions']");

        if (video.hasAttribute("autoplay")) {
            video.style.setProperty("border", "3px solid orange", "important");
            accessibilityResults.videos.push({ type: "autoplay", src: video.src });
        }
        if (!hasControls) {
            video.style.setProperty("border", "3px solid red", "important");
            accessibilityResults.videos.push({ type: "missing-controls", src: video.src });
        }
        if (!hasCaption) {
            video.style.setProperty("border", "3px solid orange", "important");
            accessibilityResults.videos.push({ type: "missing-captions", src: video.src });
        }
    });

    // Audios
    document.querySelectorAll("audio").forEach(audio => {
        const hasControls = audio.hasAttribute("controls");
        const hasTranscriptId = audio.hasAttribute("aria-describedby");

        if (audio.hasAttribute("autoplay")) {
            audio.style.setProperty("border", "3px solid orange", "important");
            accessibilityResults.audio.push({ type: "autoplay", src: audio.src });
        }
        if (!hasControls) {
            audio.style.setProperty("border", "3px solid red", "important");
            accessibilityResults.audio.push({ type: "missing-controls", src: audio.src });
        }
        if (!hasTranscriptId) {
            audio.style.setProperty("border", "3px solid orange", "important");
            accessibilityResults.audio.push({ type: "missing-transcript", src: audio.src });
        }
    });
}

// --- Check for text & language ---
function checkForTextAndContent() {
    // Language
    const lang = document.documentElement.getAttribute("lang");
    const valid = /^[a-z]{2}(-[A-Z]{2})?$/.test(lang || "");
    if (!valid) {
        accessibilityResults.language.push("No valid language detected for the page");
    }

    // Small fonts
    document.querySelectorAll("*").forEach(el => {
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size && size < 12) {
            accessibilityResults.smallFonts.push({
                element: el,
                fontSize: size,
                text: (el.innerText || el.textContent || "").trim().slice(0, 40)
            });
        }
    });

    // Contrast
    checkContrast();
}

// --- Feature runner ---
function runFeature(optionId) {
    switch (optionId) {
        case "opt1":
            checkForVideoAndImagesAndAudio();
            break;
        case "opt2":
            checkForTextAndContent();
            break;
        case "opt3":
            console.log("option 3 is being run");
            break;
        default:
            console.log("No Logic to be run here");
            break;
    }
}



// --- Listener ---
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "RUN_FEATURES") {
        message.options.forEach(optionId => {
            runFeature(optionId);
        });

        // // Send results back
        // chrome.runtime.sendMessage({
        //     type: "ACCESSIBILITY_RESULTS",
        //     data: accessibilityResults
        // });
    }
});
