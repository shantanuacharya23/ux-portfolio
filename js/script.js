console.log("shantanuacharya.in website loaded successfully (II O III)");

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
    const modalDownloadBtn = document.getElementById("modal-download-cv-btn"); // NEW: Defines the download button

    // Change 1: Add 'index' to the loop function so JavaScript knows which card was clicked
    portfolioCards.forEach((card, index) => {
        // 1. YOUR EXISTING MOUSE CLICK LISTENER
        card.addEventListener("click", (e) => {
            if (e.target.tagName === 'A') return;

            const relativePdfUrl = card.getAttribute("data-pdf");
            const caseStudyTitle = card.querySelector(".portfolio-card-title").textContent;

            // NEW: Self-Hosted Mozilla PDF.js Architecture
            if (relativePdfUrl) {
                pdfModalTitle.textContent = `Case Study: ${caseStudyTitle}`;

                // 1. Define the actual PDF path
                const absolutePdfUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + relativePdfUrl;
                
                // Point the viewer directly to the .pdf file, force it to page 1, and force it to fill the width
                const localViewerUrl = `pdfjs/web/viewer.html?file=${encodeURIComponent(absolutePdfUrl)}#page=1&zoom=page-width`;

                // Update attributes (Using replace to prevent history corruption)
                pdfViewer.contentWindow.location.replace(localViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                // Change 2: Dynamic width logic based on the card's numerical position
                if (index === 3) {
                    // The 4th card (MindMeld Concept - Index 3)
                    pdfViewer.style.width = "85%";
                } else {
                    // All other cards (Indexes 0, 1, 2, 4)
                    pdfViewer.style.width = "95%";
                }
                
                pdfViewer.style.margin = "0 auto";
                pdfViewer.style.display = "block";

                // Activate display states
                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden";

                // NEW: Security lock - Hide download button for Case Studies
                modalDownloadBtn.style.display = "none";
                
                // NEW: Inject a fake history state to trap the mobile back button
                history.pushState({ modalOpen: true }, "", window.location.href);
            }
        });

        // 2. THE NEW KEYBOARD ACCESSIBILITY LISTENER
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // Stops the browser from accidentally scrolling down
                card.click();       // Automatically fires the mouse click logic written above
            }
        });
    });

    // Handle View CV button click to display inline within the existing modal framework
    const cvLink = document.querySelector(".cv-link");
    if (cvLink) {
        cvLink.addEventListener("click", (e) => {
            e.preventDefault(); // Stop browser from jumping or opening a new tab
            
            const relativePdfUrl = cvLink.getAttribute("data-pdf");
            const cvTitle = cvLink.getAttribute("data-title");
            
            // NEW: Self-Hosted Mozilla PDF.js Architecture
            if (relativePdfUrl) {
                // Fix: Use cvTitle instead of the undefined caseStudyTitle
                pdfModalTitle.textContent = cvTitle;

                // 1. Define the actual PDF path
                const absolutePdfUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + relativePdfUrl;
                
                // Point the viewer directly to the .pdf file, force it to page 1
                const localViewerUrl = `pdfjs/web/viewer.html?file=${encodeURIComponent(absolutePdfUrl)}#page=1`;

                // Update attributes (Using replace to prevent history corruption)
                pdfViewer.contentWindow.location.replace(localViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                // NEW: Restore the iframe to 100% width for the CV
                pdfViewer.style.width = "100%";
                pdfViewer.style.margin = "0";

                // Activate display states
                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden";

                // NEW: Reveal the download button and pass the PDF source
                modalDownloadBtn.style.display = "flex"; 
                modalDownloadBtn.setAttribute("href", absolutePdfUrl);

                // NEW: Inject a fake history state to trap the mobile back button
                history.pushState({ modalOpen: true }, "", window.location.href);
            }
        });
    }

    // Close Modal Handler
    const closeModal = (isPopState = false) => {
        pdfModal.classList.remove("active");
        document.body.style.overflow = ""; // Restore window viewport scrolling

        // NEW: Reset download button visibility
        modalDownloadBtn.style.display = "none";
        
        // Strip focus to ensure clean accessibility state
        if (document.activeElement) {
            document.activeElement.blur();
        }
        
        // Clear viewport target to terminate background connection instances cleanly
        setTimeout(() => {
            pdfViewer.contentWindow.location.replace("about:blank");
        }, 300);

        // If closed via UI (X button, Esc key, clicking background), 
        // we must manually pop the fake history state we created.
        if (isPopState !== true && history.state && history.state.modalOpen) {
            history.back();
        }
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

    // NEW: Listen for the mobile device Back button (or browser back button)
    window.addEventListener("popstate", () => {
        if (pdfModal.classList.contains("active")) {
            // Passing 'true' tells closeModal that the history stack has already been popped natively
            closeModal(true); 
        }
    });

    // --- NEW: URL Parameter Modal Auto-Trigger ---
    const urlParams = new URLSearchParams(window.location.search);
    const targetCase = urlParams.get('case');

    if (targetCase) {
        // A small 250ms delay ensures the DOM is painted and listeners are fully active before firing the modal
        setTimeout(() => {
            if (targetCase === 'opsbridge' && portfolioCards[0]) {
                portfolioCards[0].click(); // Triggers the 1st card (OpsBridge)
            } else if (targetCase === 'auditiq' && portfolioCards[1]) {
                portfolioCards[1].click(); // Triggers the 2nd card (AuditIQ)
            } else if (targetCase === 'kpmg' && portfolioCards[2]) {
                portfolioCards[2].click(); // Triggers the 3rd card (KPMG)
            }
        }, 250);
    }
});

// ------------------------------ HERO SCROLL TRIGGER ------------------------------
const scrollTrigger = document.getElementById("scroll-trigger");

if (scrollTrigger) {
    scrollTrigger.addEventListener("click", () => {
        const portfolioSection = document.getElementById("portfolio");

        if (portfolioSection) {
            portfolioSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}

// ------------------------------ BACK TO TOP BUTTON ------------------------------
const backToTopBtn = document.getElementById("backToTopBtn");
const connectSection = document.getElementById("connect");

window.addEventListener("scroll", () => {
    // Get the full geometric dimensions of the Let's Connect section
    const connectRect = connectSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight;
    
    // Check if the user is on a mobile device (matching your 768px CSS breakpoint)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        // MOBILE LOGIC: Dynamically calculate a smooth 0 to 1 opacity fade as the user enters the target zone
        const targetPoint = triggerPoint + 150;
        
        if (connectRect.bottom <= targetPoint) {
            // Unhide the element structurally so it can accept styling adjustments
            backToTopBtn.classList.add("show");
            
            // Calculate how many pixels deep into the 150px zone the user has traveled
            const travelDistance = targetPoint - connectRect.bottom;
            
            // Map the progress linearly to a fractional percentage between 0.0 and 1.0
            let mappedOpacity = travelDistance / 175; // 175px is double the fade zone to create a smoother transition
            
            // Enforce safe boundary clamps so the value never bugs out under extreme scrolling forces
            if (mappedOpacity < 0) mappedOpacity = 0;
            if (mappedOpacity > 1) mappedOpacity = 1;
            
            // Apply the real-time opacity directly to the DOM element
            backToTopBtn.style.opacity = mappedOpacity;
        } else {
            // Cleanly clear styles and drop display visibility when outside the zone
            backToTopBtn.classList.remove("show");
            backToTopBtn.style.opacity = "";
        }
    } else {
        // DESKTOP LOGIC: Added a 120px offset so the user must scroll deeper into the let's connect section, for better UX
        if (connectRect.top <= triggerPoint - 120) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Set current auto-updating dynamic year context in footer
document.getElementById("year").textContent = new Date().getFullYear();

// ------------------------------ SECURITY: BLOCK PRINT KEYSTROKES ------------------------------
// Neutering the global print function
window.print = function() { return false; };

window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log("Print function fully disabled.");
    }
}, true);

// ------------------------------ PERFORMANCE: SMART IDLE PREFETCHING ------------------------------
window.addEventListener("load", () => {
    
    const initPrefetch = () => {
        // Delay the heavy downloads by 4 seconds to guarantee PageSpeed Insights 
        // finishes its audit and the mobile processor is completely relaxed.
        setTimeout(() => {
            const resourcesToPrefetch = [
                "pdfjs/build/pdf.mjs",           
                "pdfjs/build/pdf.worker.mjs",    
                "pdfs/cs1-shantanuacharya-x7k9p2m.pdf?v=2",
                "pdfs/cs2-shantanuacharya-v4b8n1q.pdf?v=2",
                "pdfs/cs3-shantanuacharya-j9f3c8z.pdf?v=2",
                "pdfs/cs4-shantanuacharya-t2w5r7y.pdf?v=2",
                "pdfs/cs5-shantanuacharya-h6d4m9p.pdf?v=2",
                "pdfs/shantanu_acharya_cv.pdf"
            ];

            resourcesToPrefetch.forEach(url => {
                const link = document.createElement("link");
                link.rel = "prefetch";
                link.href = url;
                document.head.appendChild(link);
            });
            
            console.log("Smart prefetching initiated: Case studies caching in the background.");
        }, 4000); 
    };

    // Ask the browser to wait until the main thread is completely idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initPrefetch);
    } else {
        initPrefetch();
    }
});

// ------------------------------ SECURITY: EMAIL OBFUSCATION ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const secureMailLinks = document.querySelectorAll(".secure-mail");
    
    secureMailLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Stops the page from jumping to the top
            
            // Reconstruct the email address only when clicked
            const user = this.getAttribute("data-user");
            const domain = this.getAttribute("data-domain");
            const action = this.getAttribute("data-action");
            
            const constructedEmail = user + "@" + domain;
            
            // Route to the correct email client
            if (action === "gmail") {
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${constructedEmail}`, "_blank");
            } else {
                window.location.href = `mailto:${constructedEmail}`;
            }
        });
    });
});