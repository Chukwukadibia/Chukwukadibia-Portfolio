/**
 * ==========================================
 * Contact Form Module
 * Benjamin Chukwukadibia Portfolio
 * ==========================================
 *
 * Client-side validation plus an AJAX submission to Netlify Forms.
 * The form is a real, statically-present <form data-netlify="true">
 * in index.html, so Netlify detects and registers it at build time
 * with no JS required for that part. This module only intercepts
 * the submit event to (a) validate before sending and (b) POST the
 * encoded form data in the background so the page doesn't reload,
 * showing a success/error banner instead.
 */

/* ==========================================
   Constants
========================================== */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = {

    name: (value) => (value.trim().length > 0 ? "" : "Please enter your name."),

    email: (value) => {

        if (!value.trim()) return "Please enter your email address.";

        if (!EMAIL_PATTERN.test(value.trim())) return "Please enter a valid email address.";

        return "";

    },

    message: (value) => (value.trim().length > 0 ? "" : "Please enter a message."),

};

/* ==========================================
   Initialization
========================================== */

/**
 * Initialize the contact form.
 */
export function initContactForm() {

    const form = document.querySelector(".contact-form");

    if (!form) return;

    const submitButton = form.querySelector("button[type='submit']");

    const statusEl = form.querySelector(".form-status");

    if (!submitButton || !statusEl) {

        console.warn("Contact form: submit button or status element not found.");

        return;

    }

    Object.keys(REQUIRED_FIELDS).forEach((fieldName) => {

        const field = form.elements.namedItem(fieldName);

        if (!field) return;

        field.addEventListener("input", () => {

            if (field.getAttribute("aria-invalid") === "true") {

                validateField(form, fieldName);

            }

        });

    });

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        handleSubmit(form, submitButton, statusEl);

    });

}

/* ==========================================
   Validation
========================================== */

/**
 * Validate a single field, updating its aria-invalid state and
 * error message. Returns true if the field is valid.
 */
function validateField(form, fieldName) {

    const field = form.elements.namedItem(fieldName);

    const errorEl = document.getElementById(`${fieldName}-error`);

    const validator = REQUIRED_FIELDS[fieldName];

    if (!field || !validator) return true;

    const message = validator(field.value);

    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorEl) errorEl.textContent = message;

    return !message;

}

/**
 * Validate every required field. Returns true if the whole form is valid.
 */
function validateForm(form) {

    const results = Object.keys(REQUIRED_FIELDS).map((fieldName) => validateField(form, fieldName));

    return results.every(Boolean);

}

/* ==========================================
   Submission
========================================== */

/**
 * Handle form submission: validate, then POST to Netlify Forms.
 */
async function handleSubmit(form, submitButton, statusEl) {

    setStatus(statusEl, "", null);

    if (!validateForm(form)) {

        setStatus(statusEl, "Please fix the errors above and try again.", "error");

        const firstInvalid = form.querySelector("[aria-invalid='true']");

        firstInvalid?.focus();

        return;

    }

    const honeypot = form.elements.namedItem("bot-field");

    if (honeypot && honeypot.value) {

        // Silently "succeed" for bots without actually submitting.
        setStatus(statusEl, "Thanks! Your message has been sent.", "success");

        form.reset();

        return;

    }

    setSubmitting(submitButton, true);

    try {

        const response = await fetch(form.getAttribute("action") || "/", {

            method: "POST",

            headers: { "Content-Type": "application/x-www-form-urlencoded" },

            body: encodeFormData(form),

        });

        if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

        setStatus(statusEl, "Thanks! Your message has been sent \u2014 I'll get back to you soon.", "success");

        form.reset();

        Object.keys(REQUIRED_FIELDS).forEach((fieldName) => {

            form.elements.namedItem(fieldName)?.removeAttribute("aria-invalid");

            const errorEl = document.getElementById(`${fieldName}-error`);

            if (errorEl) errorEl.textContent = "";

        });

    } catch (error) {

        console.warn("Contact form submission failed:", error);

        setStatus(
            statusEl,
            "Something went wrong sending your message. Please try again, or email me directly.",
            "error",
        );

    } finally {

        setSubmitting(submitButton, false);

    }

}

/* ==========================================
   Helpers
========================================== */

/**
 * Encode a form's fields as an application/x-www-form-urlencoded
 * string, the format Netlify Forms expects.
 */
function encodeFormData(form) {

    const data = new FormData(form);

    return new URLSearchParams(data).toString();

}

/**
 * Show or clear the form-level status banner.
 */
function setStatus(statusEl, message, variant) {

    statusEl.textContent = message;

    statusEl.classList.remove("form-status--success", "form-status--error");

    if (variant) statusEl.classList.add(`form-status--${variant}`);

}

/**
 * Toggle the submit button's loading/disabled state.
 */
function setSubmitting(submitButton, isSubmitting) {

    submitButton.disabled = isSubmitting;

    submitButton.classList.toggle("btn-loading", isSubmitting);

    submitButton.textContent = isSubmitting ? "Sending..." : "Send Message";

}
