/* =====================================
   COSMO VISION - SKY VIEW MAXIMIZER
   ===================================== */

const skyMapWrapper = document.getElementById("skyMapWrapper");
const maximizeBtn = document.getElementById("maximizeBtn");

if (skyMapWrapper && maximizeBtn) {

    maximizeBtn.addEventListener("click", () => {

        skyMapWrapper.classList.toggle("maximized");

        if (skyMapWrapper.classList.contains("maximized")) {
            maximizeBtn.textContent = "✕";
            maximizeBtn.title = "Exit Fullscreen";
        } else {
            maximizeBtn.textContent = "⛶";
            maximizeBtn.title = "Maximize Sky View";
        }

        // Resize canvas/map after changing dimensions
        window.dispatchEvent(new Event("resize"));
    });
}

/* ESC key exits maximized view */
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (skyMapWrapper &&
            skyMapWrapper.classList.contains("maximized")) {

            skyMapWrapper.classList.remove("maximized");

            if (maximizeBtn) {
                maximizeBtn.textContent = "⛶";
                maximizeBtn.title = "Maximize Sky View";
            }

            window.dispatchEvent(new Event("resize"));
        }
    }
});