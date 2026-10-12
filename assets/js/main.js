// Portfolio — Ilham Taufiqurrahman Salim
// Theme toggle, mobile menu, scroll reveal, active nav link, screenshot lightbox.

(function () {
  const root = document.documentElement;

  // ── Theme toggle ──
  // The initial theme is set by the inline script in <head> to avoid a flash.
  const themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const next = theme === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  themeBtn.addEventListener("click", function () {
    const theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  });

  // Follow system changes only when the visitor never picked a theme.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (err) {}
    if (!saved) applyTheme(e.matches ? "dark" : "light");
  });

  // ── Mobile menu ──
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (navLinks.classList.contains("open") && !e.target.closest(".nav")) setMenu(false);
  });

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ── Active nav link ──
  const linkById = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) {
    linkById[a.getAttribute("href").slice(1)] = a;
  });

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const link = linkById[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.values(linkById).forEach(function (a) {
            a.removeAttribute("aria-current");
          });
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  Object.keys(linkById).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // ── Screenshot lightbox ──
  // Links point to the image itself, so without JS (or without <dialog>) they still open the image.
  const lightbox = document.getElementById("lightbox");

  if (lightbox && typeof lightbox.showModal === "function") {
    const lightboxImg = lightbox.querySelector("img");

    document.querySelectorAll(".shot").forEach(function (shot) {
      shot.addEventListener("click", function (e) {
        e.preventDefault();
        const img = shot.querySelector("img");
        lightboxImg.src = shot.getAttribute("href");
        lightboxImg.alt = img ? img.alt : "";
        lightbox.showModal();
      });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
      lightbox.close();
    });

    // Close when clicking the backdrop
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("close", function () {
      lightboxImg.src = "";
    });
  }

  // ── Footer year ──
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
