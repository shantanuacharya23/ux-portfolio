console.log("Website loaded successfully (II O III)");

// ------------------------------ Contact Popup Card (RIGHT CLICK MANIPULATION) ------------------------------
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

    // Trigger animation frame safely
    requestAnimationFrame(() => {
        card.classList.add("show");
    });
});

document.addEventListener("click", function (e) {
    const card = document.getElementById("contact-card");

    // If click is outside the card → close it smoothly
    if (!card.contains(e.target)) {
        card.classList.remove("show");

        setTimeout(() => {
            card.style.display = "none";
        }, 200);
    }
});

// ------------------------------ PORTFOLIO CASE STUDY MODAL MANAGEMENT ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const portfolioCards = document.querySelectorAll(".portfolio-card");
    const pdfModal = document.getElementById("pdf-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const pdfViewer = document.getElementById("pdf-viewer");
    const pdfModalTitle = document.getElementById("pdf-modal-title");
    const pdfFallbackLink = document.getElementById("pdf-download-fallback");

    portfolioCards.forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.tagName === 'A') return;

            const relativePdfUrl = card.getAttribute("data-pdf");
            const caseStudyTitle = card.querySelector(".portfolio-card-title").textContent;

            // PRODUCTION SERVER ARCHITECTURE (Active: Optimized for live public deployment)
            if (relativePdfUrl) {
                pdfModalTitle.textContent = `Case Study: ${caseStudyTitle}`;

                // Construct an absolute URL (required by cloud rendering engines)
                const absolutePdfUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + relativePdfUrl;
                
                // Securely wrap your absolute PDF path inside Google's optimized web viewer engine
                const cloudViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`;

                // Update attributes
                pdfViewer.setAttribute("src", cloudViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                // Activate display states
                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background body scroll disruption
            }

            /*
            // TEMPORARY LOCAL PC TESTING CODE (Commented out for live launch)
            if (relativePdfUrl) {
                pdfModalTitle.textContent = `Case Study: ${caseStudyTitle}`;

                pdfViewer.setAttribute("src", relativePdfUrl); 
                pdfFallbackLink.setAttribute("href", relativePdfUrl);

                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
            */
        });
    });

    // Handle View CV button click to display inline within the existing modal framework
    const cvLink = document.querySelector(".cv-link");
    if (cvLink) {
        cvLink.addEventListener("click", (e) => {
            e.preventDefault(); // Stop browser from jumping or opening a new tab
            
            const relativePdfUrl = cvLink.getAttribute("data-pdf");
            const cvTitle = cvLink.getAttribute("data-title");

            if (relativePdfUrl) {
                pdfModalTitle.textContent = cvTitle;

                // PRODUCTION SERVER ARCHITECTURE (Active: Optimized for live public deployment)
                const absolutePdfUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + relativePdfUrl;
                const cloudViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`;
                
                pdfViewer.setAttribute("src", cloudViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                /*
                // TEMPORARY LOCAL PC TESTING CODE (Commented out for live launch)
                pdfViewer.setAttribute("src", relativePdfUrl); 
                pdfFallbackLink.setAttribute("href", relativePdfUrl);
                */

                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    }

    // Close Modal Handler
    const closeModal = () => {
        pdfModal.classList.remove("active");
        document.body.style.overflow = ""; // Restore window viewport scrolling
        
        // Clear viewport target to terminate background connection instances cleanly
        setTimeout(() => {
            pdfViewer.setAttribute("src", "");
        }, 300);
    };

    closeModalBtn.addEventListener("click", closeModal);

    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pdfModal.classList.contains("active")) {
            closeModal();
        }
    });
});

// Set current auto-updating dynamic year context in footer
document.getElementById("year").textContent = new Date().getFullYear();