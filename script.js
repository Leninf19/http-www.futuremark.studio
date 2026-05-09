/* ── MOBILE MENU ── */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const header = document.querySelector("header");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuBtn.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

/* ── HEADER SCROLL STATE ── */

window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
}, { passive: true });

/* ── ACTIVE NAV LINK ── */

const currentFile = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a:not(.nav-cta):not(.nav-drop-link)").forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.split("#")[0] === currentFile) {
    link.classList.add("nav-active");
  }
});

/* ── KEYBOARD: close menu/dropdown on Escape ── */

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (navLinks && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    menuBtn && menuBtn.classList.remove("active");
    menuBtn && menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

/* ── SCROLL REVEAL ── */

const revealItems = document.querySelectorAll(
  ".service-card, .process-step, .preview-card, .cta-box, .premium-content, .editorial-content, .intro-grid"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => {
  item.classList.add("hidden");
  revealObserver.observe(item);
});

/* ── FLOATING CARD GLOW ── */

const floatingCards = document.querySelectorAll(".floating-card");
floatingCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});

/* ── CUSTOM CURSOR ── */

const cursor = document.createElement("div");
cursor.className = "cursor";
const cursorDot = document.createElement("div");
cursorDot.className = "cursor-dot";
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 19}px, ${mouseY - 19}px)`;
  cursorDot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
}, { passive: true });

document.querySelectorAll("a, button, .service-card, .preview-card, .gallery-item, .floating-card").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("cursor-expand"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-expand"));
});

/* ── CONTACT FORM (FORMSPREE AJAX) ── */

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    const success = document.getElementById("formSuccess");

    /* Honeypot check — silently abort if bot filled the hidden field */
    const honey = contactForm.querySelector('[name="_gotcha"]');
    if (honey && honey.value) return;

    /* Client-side validation */
    const nameVal = (contactForm.querySelector('[name="name"]')?.value || "").trim();
    const emailVal = (contactForm.querySelector('[name="email"]')?.value || "").trim();
    const msgVal = (contactForm.querySelector('[name="message"]')?.value || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

    if (!nameVal || !emailVal || !msgVal || !emailOk) {
      btn.textContent = "Please fill all fields correctly";
      setTimeout(() => { btn.textContent = "Send Inquiry"; }, 3000);
      return;
    }

    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        contactForm.reset();
        success.classList.add("visible");
        btn.textContent = "Sent ✓";
        if (typeof gtag !== "undefined") {
          gtag("event", "generate_lead", {
            event_category: "Contact",
            event_label: "Contact Form Submission",
          });
        }
      } else {
        btn.textContent = "Error — Try Again";
        btn.disabled = false;
      }
    } catch {
      btn.textContent = "Error — Try Again";
      btn.disabled = false;
    }
  });
}
