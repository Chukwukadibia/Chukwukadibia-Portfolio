/**
 * ==========================================
 * FAQ Module
 * Benjamin Chukwukadibia Portfolio
 * ==========================================
 *
 * Single-item accordion: opening one FAQ item closes any other
 * open item, using the native <details>/<summary> "toggle" event.
 * No animation logic here - open/close relies entirely on the
 * browser's native <details> behavior; visual transitions (chevron
 * rotation, border color) are handled in faq.css via [open].
 */

/* ==========================================
   Initialization
========================================== */

/**
 * Initialize the FAQ accordion.
 */
export function initFaq() {

    const items = document.querySelectorAll(".faq-item");

    if (!items.length) return;

    items.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) return;

            closeOthers(item, items);

        });

    });

}

/**
 * Close every FAQ item except the one just opened.
 */
function closeOthers(openedItem, items) {

    items.forEach((item) => {

        if (item !== openedItem && item.open) {

            item.open = false;

        }

    });

}
