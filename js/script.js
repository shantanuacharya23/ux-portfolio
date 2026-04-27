// Currently no JS required
// Keeping file for future enhancements (animations, interactions, etc.)
console.log("Website loaded successfully");

// Disable right click + show custom tooltip
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    const tooltip = document.getElementById("custom-tooltip");

    // Position tooltip at mouse location
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";

    // Show tooltip
    tooltip.style.opacity = "1";

    // Hide after 2 seconds
    setTimeout(() => {
        tooltip.style.opacity = "0";
    }, 3000);
});