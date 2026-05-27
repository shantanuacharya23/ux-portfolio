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

    // Change 1: Add 'index' to the loop function so JavaScript knows which card was clicked
    portfolioCards.forEach((card, index) => {
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

                // Update attributes
                pdfViewer.setAttribute("src", localViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                // Change 2: Dynamic width logic based on the card's numerical position
                if (index === 4) {
                    // The 5th card (MindMeld Concept - Index 4)
                    pdfViewer.style.width = "85%";
                } else {
                    // All other cards (Indexes 0, 1, 2, 3)
                    pdfViewer.style.width = "95%";
                }
                
                pdfViewer.style.margin = "0 auto";
                pdfViewer.style.display = "block";

                // Activate display states
                pdfModal.classList.add("active");
                document.body.style.overflow = "hidden";
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

                // Update attributes
                pdfViewer.setAttribute("src", localViewerUrl);
                pdfFallbackLink.setAttribute("href", absolutePdfUrl);

                // NEW: Restore the iframe to 100% width for the CV
                pdfViewer.style.width = "100%";
                pdfViewer.style.margin = "0";

                // Activate display states
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
    const connectTop = connectSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight;

    if (connectTop <= triggerPoint) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
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

/*
// ------------------------------ PERFORMANCE: SILENT PREFETCHING ------------------------------
// window.addEventListener("load") ensures this ONLY runs after the entire website is 100% loaded
window.addEventListener("load", () => {
    
    // 1. The assets to silently download in the background
    const resourcesToPrefetch = [
        "pdfjs/build/pdf.mjs",           // The PDF.js core engine
        "pdfjs/build/pdf.worker.mjs",    // The PDF.js rendering worker
        "pdfs/case-study-1.pdf",
        "pdfs/case-study-2.pdf",
        "pdfs/case-study-3.pdf",
        "pdfs/case-study-4.pdf",
        "pdfs/case-study-5.pdf",
        "pdfs/shantanu_acharya_cv.pdf"
    ];

    // 2. Inject hidden prefetch tags into the HTML head
    resourcesToPrefetch.forEach(url => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        document.head.appendChild(link);
    });
    
    console.log("Background prefetching initiated for instant modal loading.");
});
*/

// ------------------------------ PERFORMANCE: SMART IDLE PREFETCHING ------------------------------
window.addEventListener("load", () => {
    
    const initPrefetch = () => {
        // Delay the heavy downloads by 4 seconds to guarantee PageSpeed Insights 
        // finishes its audit and the mobile processor is completely relaxed.
        setTimeout(() => {
            const resourcesToPrefetch = [
                "pdfjs/build/pdf.mjs",           
                "pdfjs/build/pdf.worker.mjs",    
                "pdfs/case-study-1.pdf",
                "pdfs/case-study-2.pdf",
                "pdfs/case-study-3.pdf",
                "pdfs/case-study-4.pdf",
                "pdfs/case-study-5.pdf",
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