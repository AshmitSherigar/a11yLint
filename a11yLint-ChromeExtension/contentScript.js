console.log("a11y lint has connected to your website of url = ", window.location.href);

// Results storage
const accessibilityResults = {
    contrast: [],
    images: [],
    videos: [],
    audio: [],
    language: [],
    smallFonts: [],
    missingLabels: [],
    placeholderMisuse: [],
    requiredFields: [],
    buttonNameMissing: []
};

// --- Helper Function: Convert RGB(A) string to array ---
function parseRGB(color) {
    const match = color.match(/\d+/g);
    return match ? match.slice(0, 3).map(Number) : [255, 255, 255];
}

// --- Helper Function: Relative luminance (WCAG) ---
function luminance([r, g, b]) {
    const toLinear = c => {
        c /= 255;
        return (c <= 0.03928) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// --- Helper Function: Contrast ratio ---
function contrastRatio(fg, bg) {
    const L1 = luminance(parseRGB(fg));
    const L2 = luminance(parseRGB(bg));
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// --- Improved Contrast Checker ---
function checkContrast() {
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
        const style = getComputedStyle(el);

        if (style.visibility === 'hidden' || style.display === 'none') return;

        const text = (el.innerText || el.textContent || "").trim();
        if (!text) return;

        const fg = style.color;
        const parent = el.parentElement;
        if (!parent) return;

        const parentStyle = getComputedStyle(parent);
        const bg = parentStyle.backgroundColor;
        const hasImage = parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none';
        if (hasImage) return;

        const ratio = contrastRatio(fg, bg);

        const fontSize = parseFloat(style.fontSize);
        const isBold = style.fontWeight >= 700 || style.fontWeight === 'bold';
        const largeText = (fontSize >= 18) || (isBold && fontSize >= 14);
        const minRatio = largeText ? 3 : 4.5;

        if (ratio < minRatio) {
            accessibilityResults.contrast.push({
                element: el,
                text: text.slice(0, 50),
                fgColor: fg,
                bgColor: bg,
                ratio: ratio.toFixed(2),
                fontSize,
                isBold,
                largeText
            });
        }
    });
}

// --- Check for images, video, and audio ---
function checkForVideoAndImagesAndAudio() {
    document.querySelectorAll("img").forEach(image => {
        if (!image.hasAttribute("alt")) {
            image.style.setProperty("border", "3px solid red", "important");
            accessibilityResults.images.push({ type: "missing-alt", src: image.src });
        }

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
        }
    });

    document.querySelectorAll("video").forEach(video => {
        const hasControls = video.hasAttribute("controls");
        const hasCaption = video.querySelector("track[kind='captions']");

        if (video.hasAttribute("autoplay")) {
            accessibilityResults.videos.push({ type: "autoplay", src: video.src });
        }
        if (!hasControls) {
            accessibilityResults.videos.push({ type: "missing-controls", src: video.src });
        }
        if (!hasCaption) {
            accessibilityResults.videos.push({ type: "missing-captions", src: video.src });
        }
    });

    document.querySelectorAll("audio").forEach(audio => {
        const hasControls = audio.hasAttribute("controls");
        const hasTranscriptId = audio.hasAttribute("aria-describedby");

        if (audio.hasAttribute("autoplay")) {
            accessibilityResults.audio.push({ type: "autoplay", src: audio.src });
        }
        if (!hasControls) {
            accessibilityResults.audio.push({ type: "missing-controls", src: audio.src });
        }
        if (!hasTranscriptId) {
            accessibilityResults.audio.push({ type: "missing-transcript", src: audio.src });
        }
    });
}

// --- Check for text & language ---
function checkForTextAndContent() {
    const lang = document.documentElement.getAttribute("lang");
    const valid = /^[a-z]{2}(-[A-Z]{2})?$/.test(lang || "");
    if (!valid) {
        accessibilityResults.language.push("No valid language detected for the page");
    }

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

    checkContrast();
}

// --- Form & Label Accessibility Checks ---
function checkFormAccessibility() {
    document.querySelectorAll('input, select, textarea').forEach(input => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel) {
            accessibilityResults.missingLabels.push({
                element: input,
                type: input.type,
                name: input.name || "(no name)"
            });
        }
    });

    document.querySelectorAll('input[required], select[required], textarea[required], [aria-required="true"]').forEach(field => {
        accessibilityResults.requiredFields.push({
            element: field,
            type: field.tagName.toLowerCase(),
            name: field.name || "(no name)"
        });
    });

    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel) {
            accessibilityResults.placeholderMisuse.push({
                element: input,
                placeholder: input.getAttribute('placeholder')
            });
        }
    });

    document.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]').forEach(btn => {
        const text = (btn.innerText || btn.value || "").trim();
        const hasAriaLabel = btn.hasAttribute('aria-label') || btn.hasAttribute('aria-labelledby');

        if (!text && !hasAriaLabel) {
            accessibilityResults.buttonNameMissing.push({
                element: btn,
                html: btn.outerHTML
            });
        }
    });
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
            checkFormAccessibility();
            break;
        default:
            console.log("No Logic to be run here");
            break;
    }

    // Always display results
    console.group("Accessibility Results");
    Object.keys(accessibilityResults).forEach(key => {
        if (accessibilityResults[key].length) {
            console.log(`--- ${key} ---`);
            console.table(accessibilityResults[key]);
        }
    });
    console.groupEnd();
}

// --- Listener ---
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "RUN_FEATURES") {
        message.options.forEach(optionId => {
            runFeature(optionId);
        });
    }
});
