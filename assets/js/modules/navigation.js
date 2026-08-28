/**
 * ==========================================
 * Navigation Module
 * Benjamin Chukwukadibia Portfolio
 * ==========================================
 */

/* ==========================================
   Constants
========================================== */

const HEADER_SCROLL_OFFSET = 20;

const MOBILE_BREAKPOINT = 768;

/* ==========================================
   Initialization
========================================== */

/**
 * Initialize navigation.
 */
export function initNavigation() {

    const nav = createNavigation();

    if (!nav) return;

    bindEvents(nav);

    initScrollState(nav);

}

/**
 * Cache navigation elements.
 */
function createNavigation() {

    const header = document.querySelector(".site-header");

    const toggle = document.querySelector(".nav-toggle");

    const menu = document.querySelector(".nav-menu");

    const links = menu?.querySelectorAll("a") ?? [];

    const firstLink = links[0] ?? null;

    if (!header || !toggle || !menu) {

        console.warn("Navigation elements not found.");

        return null;

    }

    return {

        header,

        toggle,

        menu,

        links,

        firstLink,

        body: document.body

    };

}

/* ==========================================
   Event Registration
========================================== */

/**
 * Register navigation events.
 */
function bindEvents(nav) {

    nav.toggle.addEventListener("click", () => {

        toggleMenu(nav);

    });

    nav.links.forEach((link) => {

        link.addEventListener("click", () => {

            closeMenu(nav);

        });

    });

    nav.menu.addEventListener("click", (event) => {

        if (event.target !== nav.menu) return;

        closeMenu(nav);

    });

    window.addEventListener("resize", () => {

        handleResize(nav);

    });

    document.addEventListener("keydown", (event) => {

        handleKeydown(event, nav);

    });

}

/**
 * Register scroll events.
 */
function bindScrollEvents(nav) {

    window.addEventListener("scroll", () => {

        updateHeader(nav);

    });

}

/* ==========================================
   Scroll Management
========================================== */

/**
 * Initialize header scroll state.
 */
function initScrollState(nav) {

    bindScrollEvents(nav);

    updateHeader(nav);

}

/**
 * Update header appearance based on scroll position.
 */
function updateHeader(nav) {

    const isScrolled = window.scrollY > HEADER_SCROLL_OFFSET;

    nav.header.classList.toggle("scrolled", isScrolled);

}

/* ==========================================
   Resize Management
========================================== */

/**
 * Close the mobile menu when resizing to desktop.
 */
function handleResize(nav) {

    if (window.innerWidth >= MOBILE_BREAKPOINT) {

        closeMenu(nav);

    }

}

/**
 * Handle keyboard shortcuts.
 */
function handleKeydown(event, nav) {

    if (event.key !== "Escape") return;

    if (!nav.menu.classList.contains("is-open")) return;

    closeMenu(nav);

}

/* ==========================================
   Menu Actions
========================================== */

/**
 * Toggle the mobile menu.
 */
function toggleMenu(nav) {

    const isOpen = nav.menu.classList.contains("is-open");

    if (isOpen) {

        closeMenu(nav);

        return;

    }

    openMenu(nav);

}

/**
 * Open the mobile menu.
 */
function openMenu(nav) {

    nav.menu.classList.add("is-open");

    nav.menu.setAttribute("aria-hidden", "false");

    nav.body.classList.add("menu-open");

    nav.toggle.classList.add("is-active");

    nav.toggle.setAttribute("aria-expanded", "true");

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile) {

        nav.firstLink?.focus();

    }

}

/**
 * Close the mobile menu.
 */
function closeMenu(nav) {

    nav.menu.classList.remove("is-open");

    nav.menu.setAttribute("aria-hidden", "true");

    nav.body.classList.remove("menu-open");

    nav.toggle.classList.remove("is-active");

    nav.toggle.setAttribute("aria-expanded", "false");

    nav.toggle.focus();

}