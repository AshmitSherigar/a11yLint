const textPath = document.getElementById("featuresText");

window.addEventListener("scroll", () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const offset = 100 - (scrollPercent * 200);
    textPath.setAttribute("startOffset", Math.max(0, offset) + "%");
});

// Select all slides, dots, and buttons
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const slidesContainer = document.querySelector('.slides');
const prev = document.querySelector('.arrow-left');
const next = document.querySelector('.arrow-right');

let current = 2; // Current active slide index

// Function to update slider position and active states
function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        dots[index].classList.remove('active');

        if (index === current) {
            slide.classList.add('active');
            dots[index].classList.add('active');
        }
    });

    // Calculate the offset to center the active slide
    const offset = -current * (slides[0].offsetWidth + 20) + (slidesContainer.offsetWidth - slides[0].offsetWidth) / 2 - 10;
    slidesContainer.style.transform = `translateX(${offset}px)`;
}

// Event: Click on previous arrow
prev.addEventListener('click', () => {
    current = (current === 0) ? slides.length - 1 : current - 1;
    updateSlider();
});

// Event: Click on next arrow
next.addEventListener('click', () => {
    current = (current === slides.length - 1) ? 0 : current + 1;
    updateSlider();
});

// Event: Click on navigation dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        current = index;
        updateSlider();
    });
});

// Event: Adjust slider on window resize
window.addEventListener('resize', updateSlider);

// Initial load update
updateSlider();