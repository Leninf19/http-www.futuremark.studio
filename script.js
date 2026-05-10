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

/* ── VISIBILITY SECTION ── */

(function initVisibility() {
  const visGrid  = document.getElementById('visGrid');
  const visHub   = document.getElementById('visHub');
  const visSvg   = document.getElementById('visSvg');
  const nodes    = document.querySelectorAll('.vis-node');

  if (!visGrid || !visHub || !visSvg || !nodes.length) return;

  /* Staggered scroll reveal */
  const revealEls = document.querySelectorAll('.vis-header, .vis-node, .vis-cta');
  const delays    = [0, 100, 175, 250, 325, 400, 500];

  revealEls.forEach((el, i) => {
    el.classList.add('hidden');
    el.style.transitionDelay = `${delays[i] !== undefined ? delays[i] : i * 80}ms`;
  });

  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  revealEls.forEach((el) => staggerObs.observe(el));

  /* Custom cursor expand on nodes */
  const cur = document.querySelector('.cursor');
  if (cur) {
    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => cur.classList.add('cursor-expand'));
      node.addEventListener('mouseleave', () => cur.classList.remove('cursor-expand'));
    });
  }

  /* SVG connector lines */
  function drawLines() {
    visSvg.innerHTML = '';
    if (window.innerWidth <= 768) return;

    const bodyRect  = visGrid.parentElement.getBoundingClientRect();
    const hubCore   = visHub.querySelector('.vis-hub-core');
    if (!hubCore) return;
    const hubRect   = hubCore.getBoundingClientRect();
    const hx        = hubRect.left - bodyRect.left + hubRect.width  / 2;
    const hy        = hubRect.top  - bodyRect.top  + hubRect.height / 2;

    nodes.forEach((node, i) => {
      const dot = node.querySelector('.vis-dot');
      if (!dot) return;
      const dotRect = dot.getBoundingClientRect();
      const dx = dotRect.left - bodyRect.left + dotRect.width  / 2;
      const dy = dotRect.top  - bodyRect.top  + dotRect.height / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', hx);
      line.setAttribute('y1', hy);
      line.setAttribute('x2', dx);
      line.setAttribute('y2', dy);
      line.setAttribute('class', 'vis-line');
      line.setAttribute('data-idx', i);
      visSvg.appendChild(line);
    });
  }

  /* Activate / deactivate */
  function setActive(node, on, idx) {
    node.classList.toggle('is-active', on);
    const line = visSvg.querySelector(`[data-idx="${idx}"]`);
    if (line) line.classList.toggle('is-active', on);
  }

  const isMobile = () => window.innerWidth <= 768;

  nodes.forEach((node, i) => {
    /* Desktop hover */
    node.addEventListener('mouseenter', () => { if (!isMobile()) setActive(node, true,  i); });
    node.addEventListener('mouseleave', () => { if (!isMobile()) setActive(node, false, i); });

    /* Mobile tap toggle */
    node.addEventListener('click', () => {
      if (isMobile()) {
        const wasActive = node.classList.contains('is-active');
        nodes.forEach((n, j) => setActive(n, false, j));
        if (!wasActive) setActive(node, true, i);
      }
    });
  });

  /* Draw on section enter + on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLines, 80);
  }, { passive: true });

  const visSection = document.querySelector('.visibility-section');
  if (visSection) {
    const enterObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          drawLines();
          enterObs.unobserve(visSection);
        }
      });
    }, { threshold: 0.12 });
    enterObs.observe(visSection);
  } else {
    setTimeout(drawLines, 150);
  }
})();

/* ── HOME NAV LINK (mobile only) ── */

(function injectHomeLink() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  const link = document.createElement('a');
  link.href = 'index.html';
  link.textContent = 'Home';
  link.className = 'nav-home-link';
  const current = window.location.pathname.split('/').pop() || 'index.html';
  if (current === 'index.html' || current === '') link.classList.add('nav-active');
  nav.insertBefore(link, nav.firstChild);

  link.addEventListener('click', () => {
    nav.classList.remove('active');
    const btn = document.getElementById('menuBtn');
    if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('menu-open');
  });
})();

/* ── BACK TO TOP ── */

(function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

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
