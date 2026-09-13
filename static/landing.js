// Redirect all Step-1 CTA buttons to Step 2 / Question 1
document.addEventListener("DOMContentLoaded", () => {
    const ctaButtons = document.querySelectorAll(".btn.btn-primary");

    ctaButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = "index2-1.html";
        });
    });
});