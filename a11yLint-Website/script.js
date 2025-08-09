const textPath = document.getElementById("featuresText");

window.addEventListener("scroll", () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const offset = 100 - (scrollPercent * 100);
    textPath.setAttribute("startOffset", Math.max(0, offset) + "%");
});