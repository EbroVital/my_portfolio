
"use strict";

/* =========================================================
   01 — SÉLECTION DES ÉLÉMENTS
   ========================================================= */

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navigationLinks = document.querySelectorAll(".nav-link");
const currentYear = document.querySelector("#current-year");

const mobileBreakpoint = window.matchMedia("(max-width: 850px)");

/* =========================================================
   02 — ANNÉE AUTOMATIQUE DU FOOTER
   ========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   03 — MENU MOBILE
   ========================================================= */

function setMenuState(isOpen) {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    navLinks.classList.toggle("open", isOpen);
}

if (menuToggle && navLinks) {
    // Ouvrir ou fermer le menu.
    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuState(!isOpen);
    });

    // Fermer le menu après avoir sélectionné une destination.
    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    // Fermer le menu si l'utilisateur clique ailleurs.
    document.addEventListener("click", (event) => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (
            isOpen &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    // Fermer le menu avec la touche Échap.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            setMenuState(false);
            menuToggle.focus();
        }
    });

    // Réinitialiser le menu lorsque l'on quitte le format mobile.
    mobileBreakpoint.addEventListener("change", (event) => {
        if (!event.matches) {
            setMenuState(false);
        }
    });
}

/* =========================================================
   04 — EN-TÊTE AU DÉFILEMENT
   ========================================================= */

function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

// État initial, y compris si la page est restaurée à une position donnée.
updateHeader();

/* =========================================================
   05 — LIEN ACTIF DANS LA NAVIGATION
   ========================================================= */

const sections = Array.from(navigationLinks)
    .map((link) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return null;

        const section = document.querySelector(href);

        if (!section) return null;

        return { link, section };
    })
    .filter(Boolean);

function setActiveLink(activeLink) {
    navigationLinks.forEach((link) => {
        const isActive = link === activeLink;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        a.boundingClientRect.top -
                        b.boundingClientRect.top
                );

            if (visibleSections.length === 0) return;

            const currentSection = sections.find(
                (item) => item.section === visibleSections[0].target
            );

            if (currentSection) {
                setActiveLink(currentSection.link);
            }
        },
        {
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        }
    );

    sections.forEach(({ section }) => {
        sectionObserver.observe(section);
    });
} else {
    // Solution de repli pour les navigateurs sans IntersectionObserver.
    window.addEventListener("scroll", () => {
        const referenceLine = window.innerHeight * 0.35;
        let currentSection = null;

        sections.forEach((item) => {
            const rect = item.section.getBoundingClientRect();

            if (rect.top <= referenceLine) {
                currentSection = item;
            }
        });

        if (currentSection) {
            setActiveLink(currentSection.link);
        }
    }, { passive: true });
}

/* =========================================================
   06 — ANIMATIONS AU DÉFILEMENT
   ========================================================= */

// Les éléments sont révélés progressivement à leur entrée dans l'écran.
// Le CSS existant conserve leur visibilité si JavaScript est indisponible.

const revealSelectors = [
    ".approach-section .section-heading",
    ".approach-title",
    ".approach-content",
    ".expertise-section .section-heading",
    ".expertise-section .section-intro-grid",
    ".expertise-card",
    ".expertise-note",
    ".projects-section .section-heading",
    ".projects-intro",
    ".project-entry",
    ".projects-footer",
    ".journey-section .section-heading",
    ".journey-section .section-intro-grid",
    ".journey-entry",
    ".journey-footer",
    ".contact-section .section-heading",
    ".contact-main",
    ".contact-details"
];

const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    revealElements.length > 0 &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    // Préparer les éléments avant d'activer les animations CSS.
    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });

    document.documentElement.classList.add("js-motion");
} else {
    // Pas d'animation : le contenu reste immédiatement accessible.
    revealElements.forEach((element) => {
        element.classList.add("reveal", "is-visible");
    });
}

/* =========================================================
   07 — NAVIGATION PAR ANCRES
   ========================================================= */

// Le CSS gère déjà le défilement fluide.
// Ce gestionnaire assure seulement la fermeture du menu
// pour les liens d'ancrage situés en dehors de la navigation.

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
        if (menuToggle && navLinks) {
            setMenuState(false);
        }
    });
});
