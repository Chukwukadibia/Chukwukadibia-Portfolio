import { initNavigation } from "./modules/navigation.js";
import { initFaq } from "./modules/faq.js";
import { initContactForm } from "./modules/contact-form.js";
import { initNavHighlight } from "./modules/nav-highlight.js";

document.addEventListener("DOMContentLoaded", () => {

    initNavigation();

    initFaq();

    initContactForm();

    initNavHighlight();

});