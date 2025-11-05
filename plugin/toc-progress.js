var RevealTocProgress = function() {
    "use strict";

    // Plugin State
    let tocEntries = [];
    let tocContainer = null;
    let revealInstance = null;

    const defaults = {};

    /**
     * Helper to check if the TOC view should be visible on the current slide.
     */
    function shouldTocBeVisible(h, v) {
        if (h === 0 && v === 0) {
            return false;
        }

        const currentSlide = revealInstance.getSlide(h, v);
        if (currentSlide && currentSlide.getAttribute('data-no-toc-view') === 'true') {
            return false;
        }

        return true;
    }

    /**
     * Gathers all slides marked with 'data-toc-entry="true"'.
     */
    function collectTocEntries(reveal) {
        tocEntries = [];
        const slides = reveal.getSlides();

        slides.forEach((slide) => {
            if (slide.getAttribute('data-toc-entry') === 'true') {
                const entryText = slide.dataset.title || slide.querySelector('h1, h2, h3')?.textContent || `Section ${tocEntries.length + 1}`;

                tocEntries.push({
                    element: slide,
                    index: reveal.getIndices(slide),
                    text: entryText
                });
            }
        });
    }

    /**
     * Creates and injects the TOC container into the DOM.
     */
    function createTocView(reveal) {
        tocContainer = document.createElement('div');
        tocContainer.id = 'toc-progress-view';
        // Note: All sizing and positioning styles are now handled by CSS

        tocEntries.forEach((entry) => {
            const entryEl = document.createElement('div');
            entryEl.classList.add('toc-progress-entry');
            entryEl.textContent = entry.text;
            tocContainer.appendChild(entryEl);
        });

        reveal.getRevealElement().appendChild(tocContainer);
    }

    /**
     * Handler for the 'slidechanged' event.
     */
    function onSlideChange(event) {
        updateTocView(event.indexh, event.indexv);
    }

    /**
     * Updates the visual state and visibility of the TOC.
     */
    function updateTocView(currentH, currentV) {
        if (!tocContainer) return;

        if (shouldTocBeVisible(currentH, currentV)) {
            tocContainer.style.opacity = '1';
        } else {
            tocContainer.style.opacity = '0';
        }

        let activeTocEntryIndex = -1;

        // Find the active index
        for (let i = tocEntries.length - 1; i >= 0; i--) {
            const entryIndices = tocEntries[i].index;

            if (entryIndices.h < currentH || (entryIndices.h === currentH && (entryIndices.v ?? 0) <= currentV)) {
                activeTocEntryIndex = i;
                break;
            }
        }

        // Update the visual state using CSS classes
        tocContainer.querySelectorAll('.toc-progress-entry').forEach((el, i) => {
            el.classList.remove('active', 'passed');

            if (i === activeTocEntryIndex) {
                el.classList.add('active'); // Currently active/last passed section
            } else if (i < activeTocEntryIndex) {
                el.classList.add('passed'); // Passed sections
            }
            // Future sections have no class (rely on default #toc-progress-view color)
        });
    }

    return {
        id: "toc-progress",

        init: function(reveal) {
            revealInstance = reveal;
            const config = { ...defaults, ...reveal.getConfig().tocProgress };

            collectTocEntries(reveal);
            createTocView(reveal);

            reveal.on('slidechanged', onSlideChange);

            // Initial check on 'ready'
            reveal.on('ready', () => {
                const indices = reveal.getIndices();
                updateTocView(indices.h, indices.v);
            });
        },

        destroy: function(reveal) {
            if (tocContainer && tocContainer.parentNode) {
                tocContainer.parentNode.removeChild(tocContainer);
                tocContainer = null;
            }
            if (revealInstance) {
                 revealInstance.off('slidechanged', onSlideChange);
                 revealInstance.off('ready', updateTocView); // Clean up ready listener if possible
            }
            tocEntries = [];
            revealInstance = null;
        }
    };
}();

