/* ==========================================================================
   DEEKSHANA C S — PORTFOLIO INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initScrollCounters();
  initTypewriter();
});

/* ===================== 0. TYPEWRITER ANIMATION ===================== */
const typewriterWords = ['builds.', 'Creates.', 'Speaks.', 'Excels.'];
let twIndex = 0, twChar = 0, twDeleting = false;

function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  tickTypewriter(el);
}

function tickTypewriter(el) {
  const word = typewriterWords[twIndex];

  if (!twDeleting) {
    twChar++;
    el.textContent = word.substring(0, twChar);
    if (twChar === word.length) {
      // pause then start deleting
      setTimeout(() => { twDeleting = true; tickTypewriter(el); }, 1800);
      return;
    }
    setTimeout(() => tickTypewriter(el), 95);
  } else {
    twChar--;
    el.textContent = word.substring(0, twChar);
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % typewriterWords.length;
      setTimeout(() => tickTypewriter(el), 320);
      return;
    }
    setTimeout(() => tickTypewriter(el), 55);
  }
}

/* ===================== 1. THEME TOGGLE ===================== */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

/* ===================== 2. CUSTOM CURSOR ===================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverables = document.querySelectorAll(
    'a, button, .project-feature-card, .gallery-item, .cert-card, .value-card, .exp-card, .skill-group-card'
  );
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ===================== 3. NAVBAR SCROLL SHRINK ===================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth active link highlight
  const sections = document.querySelectorAll('section[id], div[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ===================== 4. MOBILE MENU ===================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Animate hamburger lines
    const spans = btn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ===================== 5. SCROLL REVEAL ===================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseFloat(delay) * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Add stagger delays to grid children
  document.querySelectorAll('.skills-grid, .certs-grid, .exp-timeline, .about-values, .projects-list').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.dataset.delay = (i * 0.1).toFixed(1);
    });
  });

  items.forEach(el => observer.observe(el));
}

/* ===================== 6. COUNTER ANIMATION ===================== */
function initScrollCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimal || '0');
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let count = 0;

  const timer = setInterval(() => {
    current += increment;
    count++;
    if (count >= steps) {
      clearInterval(timer);
      el.textContent = (decimals > 0 ? target.toFixed(decimals) : Math.round(target)) + suffix;
    } else {
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
    }
  }, duration / steps);
}

/* ===================== 7. PROJECT FILTER ===================== */
function filterProjects(category, btnEl) {
  // Update buttons
  document.querySelectorAll('#projectFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('#projectsList .project-feature-card').forEach(card => {
    const cat = card.dataset.category;
    if (category === 'all' || cat === category) {
      card.style.display = 'grid';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    } else {
      card.style.display = 'none';
    }
  });
}

/* ===================== 8. GALLERY FILTER ===================== */
function filterGallery(category, btnEl) {
  document.querySelectorAll('#galleryFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  document.querySelectorAll('#galleryGrid .gallery-item').forEach(item => {
    const cat = item.dataset.category;
    if (category === 'all' || cat === category) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ===================== 9. PROJECT MODAL ===================== */
const projectData = {
  cholan: {
    subtitle: 'AI-Powered Agriculture Chatbot · Telegram Bot',
    title: 'Cholan: AI Agriculture Assistant for Tamil Nadu Farmers',
    tech: ['Python', 'Telegram Bot API', 'NLP', 'Machine Learning', 'Weather APIs'],
    highlights: [
      'Trained on crop disease datasets & real-time weather APIs to deliver actionable guidance to farmers.',
      'Built a simple guided chat flow tailored for non-technical rural users with intent recognition.',
      'Served over 50,000+ farmers with 85% intent recognition accuracy in Tamil Nadu.',
      'Received recognition at state-level agricultural innovation events.'
    ],
    github: 'https://github.com/deekshanacs/Telegram-AI-Chatbot-CHOLAN-AI-'
  },
  velox: {
    subtitle: 'Computer Vision · Traffic Telemetry',
    title: 'Velox Vision — AI Traffic & Speed Enforcement Platform',
    tech: ['OpenCV', 'YOLO Object Detection', 'License Plate OCR', 'Streamlit', 'Python'],
    highlights: [
      'Multi-object vehicle detection with camera-calibrated speed estimation algorithms.',
      'Automated license plate OCR with violation logging to a structured database.',
      'Live Streamlit telemetry dashboard for real-time traffic oversight and analytics.',
      'Camera perspective calibration for accurate distance and speed measurement.'
    ],
    github: 'https://github.com/deekshanacs/Velox-Vision'
  },
  paperpilot: {
    subtitle: 'RAG System · Document Intelligence · LLM',
    title: 'PaperPilot AI — Research Assistant & RAG Chat',
    tech: ['PaddleOCR', 'FAISS Vector Store', 'Gemini API', 'Python', 'LangChain'],
    highlights: [
      'Parses PDFs, slides, and scanned documents using PaddleOCR for high-accuracy extraction.',
      'Local FAISS vector store indexing for instant semantic search across document collections.',
      'Delivers Gemini-powered RAG chat with exact page-level citations for academic integrity.',
      'Auto-generates quizzes and flashcards from document content for study support.'
    ],
    github: 'https://github.com/deekshanacs/PaperPilot-AI'
  },
  sheguard: {
    subtitle: 'Computer Vision · Image Forensics · Safety AI',
    title: 'SheGuard AI — Women Safety Platform',
    tech: ['Computer Vision', 'Deep Learning', 'Image Forgery Analysis', 'OpenCV', 'Python'],
    highlights: [
      'Identifies morphed, tampered, and deep-fake altered images in real-time.',
      'Provides forensic pixel-boundary highlights on detected tampering regions.',
      'Designed with digital safety advocacy — combating image-based harassment.',
      'Integrates with complaint evidence workflows for legal documentation.'
    ],
    github: 'https://github.com/deekshanacs/SHE_GUARD_AI_WEBTECH'
  },
  team: {
    subtitle: 'Full-Stack Enterprise System · Java Spring Boot',
    title: 'TMS — Enterprise Team Management System (Project KALAM)',
    tech: ['Java', 'Spring Boot', 'REST APIs', 'Relational Database', 'HTML/CSS'],
    highlights: [
      'Role-based access control with Admin, Manager, and Employee permission layers.',
      'Task assignment, milestone tracking, and performance analytics dashboards.',
      'Robust REST API backend built with Java Spring Boot and JPA persistence.',
      'Authentication, authorization, and audit logging for enterprise compliance.'
    ],
    github: 'https://github.com/deekshanacs/Project_KALAM'
  },
  riverai: {
    subtitle: 'IoT + Deep Learning · Real-Time Environmental AI',
    title: 'RiverAI — Real-Time River Monitoring System',
    tech: ['IoT Sensors', 'Deep Learning', 'Time-Series Analytics', 'Python', 'Data Viz'],
    highlights: [
      'Integrates continuous IoT water sensor data streams for real-time monitoring.',
      'Predicts flood risk levels using deep learning time-series models.',
      'Flags pollution anomalies and triggers automated alerts for environmental agencies.',
      'Dashboards with historical trend analysis for flood and pollution forecasting.'
    ],
    github: 'https://github.com/deekshanacs/'
  }
};

function openProjectModal(key) {
  const data = projectData[key];
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  if (!data || !modal || !content) return;

  content.innerHTML = `
    <div class="modal-tag">${data.subtitle}</div>
    <h2 class="modal-title">${data.title}</h2>
    <div class="modal-tech-row">
      ${data.tech.map(t => `<span class="modal-tech-pill">${t}</span>`).join('')}
    </div>
    <h4 class="modal-highlights-title">Key Architecture &amp; Highlights</h4>
    <div class="modal-highlight-list">
      ${data.highlights.map(h => `<div class="modal-highlight">${h}</div>`).join('')}
    </div>
    <div class="modal-actions">
      <a href="${data.github}" target="_blank" class="btn-primary">
        <i class="fa-brands fa-github"></i> View Repository
      </a>
      <button class="btn-outline" onclick="closeProjectModal()">
        Close
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('projectModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeProjectModal();
});

/* ===================== 10. GALLERY LIGHTBOX ===================== */
function openLightbox(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!modal || !img) return;

  img.src = src;
  img.alt = caption;
  if (cap) cap.textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ===================== 11. COPY EMAIL ===================== */
function copyEmail() {
  const email = 'deekshanacs8@gmail.com';
  const textEl = document.getElementById('copyEmailText');

  navigator.clipboard.writeText(email).then(() => {
    if (textEl) {
      textEl.textContent = 'Copied! ✦';
      setTimeout(() => { textEl.textContent = 'Copy Email'; }, 2200);
    }
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (textEl) {
      textEl.textContent = 'Copied! ✦';
      setTimeout(() => { textEl.textContent = 'Copy Email'; }, 2200);
    }
  });
}

/* ===================== 12. CONTACT FORM ===================== */
function handleContactSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  // Simulate submission
  const btn = form.querySelector('.btn-submit');
  if (btn) {
    btn.textContent = 'Sending…';
    btn.disabled = true;
  }

  setTimeout(() => {
    success.style.display = 'block';
    form.reset();
    if (btn) {
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
    }
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 900);
}

/* ===================== 13. KEYBOARD ESC TO CLOSE MODALS ===================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeLightbox();
  }
});
