/**
 * ==========================================
 * Scroll Reveal Module
 * Benjamin Chukwukadibia Portfolio
 * ==========================================
 *
 * Fades/slides section content and grid items into view the first
 * time they scroll into the viewport. animations.css already defines
 * .reveal / .reveal.is-visible (and fully neutralizes both under
 * prefers-reduced-motion) - this module's only job is deciding which
 * elements get the .reveal treatment and flipping .is-visible at the
 * right time.
 *
 * Targets are found generically rather than hand-tagged in HTML:
 * - each section's intro/content block reveals as a single unit
 *   (see CONTENT_BLOCK_SELECTOR/EXTRA_BLOCK_SELECTOR below - section
 *   layout isn't fully consistent site-wide, so both selectors exist
 *   to cover the different DOM shapes actually in use)
 * - every .card on the page (the base class shared by every
 *   repeating item - project, teaching, tech-stack, testimonial and
 *   contact cards alike) reveals individually, staggered among
 *   siblings that share the same immediate parent
 *
 * No HTML edits were needed to wire this up, and any future section
 * that reuses the same [class$='-content']/.card conventions picks
 * up reveal animation automatically.
 */

/* ==========================================
   Constants
========================================== */

const REVEAL_THRESHOLD = 0.15;

const REVEAL_ROOT_MARGIN = "0px 0px -5% 0px";

const STAGGER_STEP_MS = 80;

const MAX_STAGGER_STEPS = 6; // caps delay on grids with many direct children

/* ==========================================
   Initialization
========================================== */

/**
 * Initialize scroll-reveal animations.
 */
export function initScrollReveal() {

    const targets = collectRevealTargets();

    if (!targets.length) return;

    targets.forEach((el) => el.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {

        // No observer support: skip the animation, just show everything.
        targets.forEach((el) => el.classList.add("is-visible"));

        return;

    }

    const observer = new IntersectionObserver(handleIntersect, {

        threshold: REVEAL_THRESHOLD,

        rootMargin: REVEAL_ROOT_MARGIN,

    });

    targets.forEach((el) => observer.observe(el));

}

/* ==========================================
   Target collection
========================================== */

/**
 * Selector for each section's intro/content block. Nesting isn't
 * consistent site-wide - some sections nest [class$="-content"]
 * inside their [class$="-grid"] (about, projects, teaching...),
 * others place it as a sibling of the grid, both direct children of
 * .container (faq, contact, process, testimonials) - so both shapes
 * are matched here.
 */
const CONTENT_BLOCK_SELECTOR =
    ".container > [class$='-content'], [class$='-grid'] > [class$='-content']";

/**
 * A handful of section "content" blocks that don't follow the
 * [class$='-content'] naming convention, revealed the same way (as a
 * single unit, no stagger).
 */
const EXTRA_BLOCK_SELECTOR = ".faq-accordion, .contact-form-container";

/**
 * Gather every element that should get the reveal treatment: section
 * intro/content blocks (revealed as a single unit) and every .card
 * on the page (revealed individually, staggered among siblings that
 * share the same immediate parent - projects, teaching, tech-stack
 * groups, testimonials, contact cards etc. all use the same base
 * .card class regardless of how deeply they're nested).
 */
function collectRevealTargets() {

    const targets = [];

    document.querySelectorAll(`${CONTENT_BLOCK_SELECTOR}, ${EXTRA_BLOCK_SELECTOR}`).forEach((el) => {

        targets.push(el);

    });

    const cardsByParent = new Map();

    document.querySelectorAll(".card").forEach((card) => {

        const parent = card.parentElement;

        if (!cardsByParent.has(parent)) cardsByParent.set(parent, []);

        cardsByParent.get(parent).push(card);

    });

    cardsByParent.forEach((cards) => {

        cards.forEach((card, index) => {

            const delayMs = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP_MS;

            card.style.setProperty("--reveal-delay", `${delayMs}ms`);

            targets.push(card);

        });

    });

    return targets;

}

/* ==========================================
   Intersection handling
========================================== */

function handleIntersect(entries, observer) {

    entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);

    });

}
