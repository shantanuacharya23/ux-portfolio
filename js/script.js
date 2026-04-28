console.log("Website loaded successfully (II O III)");

// ------------------------------ Contact Popup Card STARTS ------------------------------
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    const card = document.getElementById("contact-card");
    const padding = 10;
    const cardWidth = 240;
    const cardHeight = 130;

    let x = e.clientX;
    let y = e.clientY;

    if (x + cardWidth > window.innerWidth) {
        x = window.innerWidth - cardWidth - padding;
    }

    if (y + cardHeight > window.innerHeight) {
        y = window.innerHeight - cardHeight - padding;
    }

    card.style.left = x + "px";
    card.style.top = y + "px";
    card.style.display = "block";

    // Trigger animation
    requestAnimationFrame(() => {
        card.classList.add("show");
    });
});

document.addEventListener("click", function (e) {
    const card = document.getElementById("contact-card");

    // If click is outside the card → hide it
    if (!card.contains(e.target)) {
        card.classList.remove("show");

        setTimeout(() => {
            card.style.display = "none";
        }, 200);
    }
});
// ------------------------------ Contact Popup Card ENDS ------------------------------

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();