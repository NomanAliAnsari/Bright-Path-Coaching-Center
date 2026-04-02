/* ═══════════════════════════════════════════════════════
   BrightPath Coaching Institute — script.js
   ✏️  EASY CUSTOMIZATION: Edit CONFIG object below
   ═══════════════════════════════════════════════════════ */

/* ─── SITE CONFIGURATION (Edit values here easily) ─── */
const CONFIG = {
  phone:        "917835872848",          // ✏️ Your phone number (digits only)
  whatsapp:     "917835872848",        // ✏️ Your WhatsApp (91 + number, no +)
  instituteName:"BrightPath Coaching Institute", // ✏️ Institute name
  address:      "123, Vidya Nagar, Near City Bus Stop, Jaipur, Rajasthan – 302001",
  waDefaultMsg: "Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20courses",
};

/* ─── Auto-inject phone/WhatsApp links from CONFIG ─── */
function injectContactLinks() {
  // Update all tel: links
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.href = `tel:${CONFIG.phone}`;
  });
  // Update all wa.me links
  document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
    const existing = el.href;
    // Preserve message text if any
    const msgMatch = existing.match(/\?text=(.+)/);
    const msg = msgMatch ? msgMatch[1] : CONFIG.waDefaultMsg;
    el.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  });
}

/* ════════════════════════════════════════════
   NAVBAR — Scroll & Hamburger
════════════════════════════════════════════ */
function initNavbar() {
  const navbar     = document.getElementById("navbar");
  const hamburger  = document.getElementById("hamburger");
  const navLinks   = document.getElementById("navLinks");

  // Scroll class
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
    // Prevent body scroll when menu open
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close menu on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // Highlight active section in navbar
  const sections   = document.querySelectorAll("section[id], .hero[id]");
  const navAnchors = document.querySelectorAll(".nav-link:not(.nav-cta)");

  const highlightNav = () => {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });
    navAnchors.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      link.style.color = href === current ? "var(--primary)" : "";
      link.style.background = href === current ? "var(--primary-light)" : "";
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });
}

/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
function animateCounter(el, target, prefix = "", suffix = "", duration = 1600) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "1";
        const target = parseInt(entry.target.dataset.target, 10);
        const prefix = entry.target.dataset.prefix || "";
        const suffix = entry.target.dataset.suffix || "";
        animateCounter(entry.target, target, prefix, suffix);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
function initScrollReveal() {
  // Add reveal class to elements we want to animate
  const targets = [
    ".stat-card",
    ".course-card",
    ".why-item",
    ".testi-card",
    ".contact-item",
    ".section-header",
    ".results-banner",
    ".contact-form-wrapper",
    ".contact-info",
    ".why-us-visual",
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal");
      }
    });
  });

  // Also handle stagger groups
  document.querySelectorAll(".stats-grid, .courses-grid, .testimonials-grid")
    .forEach(el => el.classList.add("reveal-stagger"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => {
    observer.observe(el);
  });
}

/* ════════════════════════════════════════════
   FORM VALIDATION & SUBMISSION
════════════════════════════════════════════ */
function initForm() {
  const form       = document.getElementById("inquiryForm");
  if (!form) return;

  const nameInput  = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const courseInput= document.getElementById("course");
  const nameError  = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const courseError= document.getElementById("courseError");
  const successBox = document.getElementById("formSuccess");
  const submitBtn  = document.getElementById("submitBtn");

  // Validators
  const validators = {
    name: (val) => {
      if (!val.trim())                        return "Name is required.";
      if (val.trim().length < 2)              return "Please enter a valid name.";
      if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return "Name should contain only letters.";
      return "";
    },
    phone: (val) => {
      if (!val.trim())                        return "Phone number is required.";
      if (!/^[6-9]\d{9}$/.test(val.trim()))  return "Enter a valid 10-digit Indian mobile number.";
      return "";
    },
    course: (val) => {
      if (!val) return "Please select a course.";
      return "";
    },
  };

  function setError(input, errorEl, msg) {
    if (msg) {
      input.classList.add("error");
      errorEl.textContent = msg;
    } else {
      input.classList.remove("error");
      errorEl.textContent = "";
    }
    return !msg;
  }

  // Live validation on blur
  nameInput.addEventListener("blur",  () => setError(nameInput,  nameError,  validators.name(nameInput.value)));
  phoneInput.addEventListener("blur", () => setError(phoneInput, phoneError, validators.phone(phoneInput.value)));
  courseInput.addEventListener("change", () => setError(courseInput, courseError, validators.course(courseInput.value)));

  // Only allow digits in phone
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validName   = setError(nameInput,   nameError,   validators.name(nameInput.value));
    const validPhone  = setError(phoneInput,  phoneError,  validators.phone(phoneInput.value));
    const validCourse = setError(courseInput, courseError, validators.course(courseInput.value));

    if (!validName || !validPhone || !validCourse) return;

    // Simulate submission (replace with actual backend/Google Forms call)
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    setTimeout(() => {
      // Redirect to WhatsApp with all details
      const name    = encodeURIComponent(nameInput.value.trim());
      const phone   = encodeURIComponent(phoneInput.value.trim());
      const course  = encodeURIComponent(courseInput.value);
      const message = document.getElementById("message")?.value.trim();
      const msgPart = message ? encodeURIComponent(" | Message: " + message) : "";

      const waText = `Hi%2C%20I%20am%20${name}%20(${phone}).%20I%27m%20interested%20in%20${course}.${msgPart}`;

      // Open WhatsApp with pre-filled details
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${waText}`, "_blank");

      // Show success
      successBox.classList.add("show");
      form.reset();
      submitBtn.textContent = "Send Inquiry →";
      submitBtn.disabled = false;

      // Hide success after 6s
      setTimeout(() => successBox.classList.remove("show"), 6000);
    }, 900);
  });
}

/* ════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (Offset for navbar)
════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        10
      ) || 70;

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ════════════════════════════════════════════
   FLOATING WA — Hide near footer (optional)
════════════════════════════════════════════ */
function initFloatingWA() {
  const btn    = document.getElementById("floatingWA");
  const footer = document.querySelector(".footer");
  if (!btn || !footer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      btn.style.opacity = entry.isIntersecting ? "0" : "1";
      btn.style.pointerEvents = entry.isIntersecting ? "none" : "auto";
    });
  }, { threshold: 0.1 });

  observer.observe(footer);
}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  injectContactLinks();
  initNavbar();
  initCounters();
  initScrollReveal();
  initForm();
  initSmoothScroll();
  initFloatingWA();
});

/* ════════════════════════════════════════════
   UTILITY — Google Forms integration (Optional)
   Uncomment and fill in your Google Form URL +
   field entry IDs to send form data there too.
════════════════════════════════════════════ */
/*
function submitToGoogleForms(name, phone, course) {
  const FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
  const params = new URLSearchParams({
    "entry.XXXXXXXX": name,   // Replace with your field entry IDs
    "entry.YYYYYYYY": phone,
    "entry.ZZZZZZZZ": course,
  });
  fetch(`${FORM_URL}?${params}`, { method: "POST", mode: "no-cors" })
    .catch(err => console.error("Google Form error:", err));
}
*/
