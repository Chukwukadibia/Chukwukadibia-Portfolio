/**
 * ==========================================
 * Nav Highlight Module (scroll-spy)
 * Benjamin Chukwukadibia Portfolio
 * ==========================================
 *
 * Highlights the nav-link whose section is currently in view by
 * toggling aria-current="page" - navigation.css already styles that
 * attribute (underline on .nav-link[aria-current="page"]), so no new
 * CSS is needed here.
 *
 * Design notes (this broke once before, so being deliberate here):
 * - rootMargin's top offset is the *live* sticky header height, read
 *   via getBoundingClientRect() rather than hardcoded from the
 *   --header-height token, so it stays correct regardless of root
 *   font-size and doesn't need to be kept in sync with tokens.css by
 *   hand.
 * - rootMargin's bottom offset keeps the "active" band to roughly the
 *   top third of the viewport, so under normal scroll speeds only one
 *   section is inside the band at a time.
 * - When multiple sections do end up intersecting at once (possible
 *   on a fast scroll/trackpad flick), the one closest to the top of
 *   the viewport wins, rather than whichever the browser happened to
 *   report first.
 * - The last nav-linked section (Contact) sits at the very bottom of
 *   a page that can't scroll any further once you reach it, so it can
 *   never satisfy the same rootMargin band as the sections above it.
 *   A plain scroll listener force-activates it whenever the user is
 *   within a few pixels of the bottom of the page.
 */

/* ==========================================
   Constants
========================================== */

const ACTIVE_ZONE_BOTTOM_PERCENT = 60; // exclude the bottom 60% of the viewport from the active band

const BOTTOM_OF_PAGE_THRESHOLD = 4; // px of slack when detecting "scrolled to the bottom"

/* ==========================================
   Module state
========================================== */

let sectionLinkMap = new Map();

let observer = null;

/* ==========================================
   Initialization
========================================== */

/**
 * Initialize scroll-spy nav highlighting.
 */
export function initNavHighlight() {

    const header = document.querySelector(".site-header");

    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    if (!header || !navLinks.length) return;

    sectionLinkMap = buildSectionLinkMap(navLinks);

    if (!sectionLinkMap.size) return;

    observer = createObserver(header);

    sectionLinkMap.forEach((_, section) => observer.observe(section));

    window.addEventListener("scroll", handleBottomOfPage, { passive: true });

}

/**
 * Map each in-page section to its corresponding nav-link.
 */
function buildSectionLinkMap(navLinks) {

    const map = new Map();

    navLinks.forEach((link) => {

        const id = link.getAttribute("href")?.slice(1);

        const section = id ? document.getElementById(id) : null;

        if (section) map.set(section, link);

    });

    return map;

}

/**
 * Create the IntersectionObserver, offset below the sticky header.
 */
function createObserver(header) {

    const headerHeight = header.getBoundingClientRect().height;

    return new IntersectionObserver(handleIntersect, {

        rootMargin: `-${headerHeight}px 0px -${ACTIVE_ZONE_BOTTOM_PERCENT}% 0px`,

        threshold: 0,

    });

}

/* ==========================================
   Intersection handling
========================================== */

function handleIntersect(entries) {

    const visibleEntries = entries.filter((entry) => entry.isIntersecting);

    if (!visibleEntries.length) return;

    const topEntry = visibleEntries.reduce((top, entry) =>
        (entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top),
    );

    setActiveLink(topEntry.target);

}

/**
 * Force-activate the last section once the user hits the bottom of
 * the page, since a short final section can never satisfy the same
 * rootMargin band as the sections above it.
 */
function handleBottomOfPage() {

    const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - BOTTOM_OF_PAGE_THRESHOLD;

    if (!scrolledToBottom) return;

    const lastSection = [...sectionLinkMap.keys()].pop();

    if (lastSection) setActiveLink(lastSection);

}

/* ==========================================
   Helpers
========================================== */

/**
 * Mark the given section's nav-link as current, clearing all others.
 */
function setActiveLink(activeSection) {

    sectionLinkMap.forEach((link, section) => {

        if (section === activeSection) {

            link.setAttribute("aria-current", "page");

        } else {

            link.removeAttribute("aria-current");

        }

    });

}
