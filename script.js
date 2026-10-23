"use strict";

/* =========================================
   1. ACTIVER LES ANIMATIONS
========================================= */

// Cette classe permet de conserver les sections visibles
// si JavaScript est désactivé.
document.documentElement.classList.add("js-enabled");


document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       2. ANNÉE AUTOMATIQUE DU PIED DE PAGE
    ========================================= */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================================
       3. MENU MOBILE
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    function openMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.add("is-open");
        menuToggle.classList.add("is-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fermer le menu");
    }

    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fermer le menu après un clic sur un lien.
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        // Fermer le menu avec la touche Échap.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Fermer le menu lorsqu'on clique à l'extérieur.
        document.addEventListener("click", (event) => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // Réinitialiser le menu lorsque la fenêtre s'élargit.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });

    }


    /* =========================================
       4. DÉFILEMENT FLUIDE
    ========================================= */

    // Les liens vers les sections utilisent un défilement fluide.
    // Le CSS fournit également scroll-behavior: smooth.
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Conserver le lien de destination dans l'adresse.
            if (window.location.hash !== targetId) {
                history.pushState(null, "", targetId);
            }

        });

    });


    /* =========================================
       5. APPARITION ANIMÉE DES SECTIONS
    ========================================= */

    const revealElements = document.querySelectorAll(".reveal");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {

        // Solution de remplacement si les animations sont désactivées
        // ou si le navigateur ne prend pas en charge l'observateur.
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        // Arrêter d'observer un élément déjà affiché.
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    }


    /* =========================================
       6. LIEN ACTIF DANS LA NAVIGATION
    ========================================= */

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        const sectionId = entry.target.id;

                        navLinks.forEach((link) => {

                            const isActive =
                                link.getAttribute("href") === `#${sectionId}`;

                            link.classList.toggle("active", isActive);

                        });

                    }

                });

            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

    }

});