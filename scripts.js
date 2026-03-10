/* =========================================
   scripts.js — Mritunjay Kumar Portfolio
   ========================================= */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1000);
});

/* ---- CUSTOM CURSOR ---- */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
document.querySelectorAll('a, button, .tilt-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursorFollower.style.width = '48px';
    cursorFollower.style.height = '48px';
    cursorFollower.style.opacity = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorFollower.style.width = '32px';
    cursorFollower.style.height = '32px';
    cursorFollower.style.opacity = '1';
  });
});

/* ---- REAL-TIME CLOCK ---- */
function updateClock() {
  const now = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = days[now.getDay()];
  const date = String(now.getDate()).padStart(2,'0');
  const month = months[now.getMonth()];
  let h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hh = String(h).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock-date').textContent = `${day}, ${date} ${month}`;
  document.getElementById('clock-time').textContent = `${hh}:${mm}:${ss} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);

/* ---- THEME TOGGLE ---- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
let currentTheme = 'dark';
themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeIcon.textContent = currentTheme === 'dark' ? '☾' : '☼';
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => navObserver.observe(section));

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((el, i) => {
    if (el.isIntersecting) {
      setTimeout(() => {
        el.target.classList.add('visible');
      }, el.target.dataset.delay || 0);
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach((el, i) => {
  revealObserver.observe(el);
});

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el, target, decimals = 0) {
  const duration = 1800;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = document.querySelectorAll('.stat-num[data-val]');
      nums.forEach(num => {
        const val = parseFloat(num.dataset.val);
        const decimals = String(num.dataset.val).includes('.') ? 1 : 0;
        animateCounter(num, val, decimals);
        num.removeAttribute('data-val');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- TABS (ABOUT) ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  });
});

/* ---- PROJECT FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card, i) => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animationDelay = (i * 0.08) + 's';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- PROJECT MODAL ---- */
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalIcon = document.getElementById('modalIcon');

document.querySelectorAll('.preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.title;
    modalDesc.textContent = btn.dataset.desc;
    modalIcon.innerHTML = `<i class="fa-solid ${btn.dataset.icon}"></i>`;
    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('modalClose').addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', e => { if (e.target === projectModal) closeProjectModal(); });
function closeProjectModal() {
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- CERT MODAL ---- */
const certModal = document.getElementById('certModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalIssuer = document.getElementById('certModalIssuer');
const certModalIcon = document.getElementById('certModalIcon');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const h4 = card.querySelector('h4');
    const span = card.querySelector('span');
    certModalTitle.textContent = h4.textContent;
    certModalIssuer.textContent = span.textContent;
    certModalIcon.innerHTML = `<i class="fa-solid fa-certificate"></i>`;
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('certModalClose').addEventListener('click', closeCertModal);
certModal.addEventListener('click', e => { if (e.target === certModal) closeCertModal(); });
function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- ESC to close modals ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeCertModal();
  }
});

/* ---- 3D TILT EFFECT ---- */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- RADAR CHART ---- */
function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 52;

  const skills = [
    { label: 'HTML', value: 0.95 },
    { label: 'CSS', value: 0.9 },
    { label: 'JavaScript', value: 0.82 },
    { label: 'React', value: 0.72 },
    { label: 'Accessibility', value: 0.78 },
    { label: 'Performance', value: 0.80 },
  ];
  const n = skills.length;
  const angleStep = (Math.PI * 2) / n;

  let progress = 0;
  const duration = 1400;
  let startTime = null;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function getPoint(i, factor) {
    const angle = angleStep * i - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * R * factor,
      y: cy + Math.sin(angle) * R * factor,
    };
  }

  function draw(ts) {
    if (!startTime) startTime = ts;
    progress = Math.min((ts - startTime) / duration, 1);
    const p = easeOut(progress);

    ctx.clearRect(0, 0, W, H);

    // Grid rings
    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const pt = getPoint(i, level / 5);
        i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === 5 ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.08)';
      ctx.lineWidth = level === 5 ? 1.5 : 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, 1);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = 'rgba(124,58,237,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Filled area
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    gradient.addColorStop(0, 'rgba(124,58,237,0.3)');
    gradient.addColorStop(1, 'rgba(57,211,83,0.06)');

    ctx.beginPath();
    skills.forEach((s, i) => {
      const pt = getPoint(i, s.value * p);
      i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(167,139,250,0.85)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots with glow
    skills.forEach((s, i) => {
      const pt = getPoint(i, s.value * p);
      // Glow
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,58,237,0.2)';
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#a78bfa';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Labels
    ctx.font = '600 12px \'Clash Display\', sans-serif';
    skills.forEach((s, i) => {
      const pt = getPoint(i, 1.25);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? '#8b90b8' : '#4a4272';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.label, pt.x, pt.y);
    });

    if (progress < 1) requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      startTime = null;
      requestAnimationFrame(draw);
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);
}
drawRadar();

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.querySelector('span').textContent = 'Sending...';
  submitBtn.disabled = true;
  formStatus.textContent = '';

  const data = {
    access_key: contactForm.querySelector('[name=access_key]').value,
    name: contactForm.querySelector('[name=name]').value,
    email: contactForm.querySelector('[name=email]').value,
    message: contactForm.querySelector('[name=message]').value,
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      formStatus.textContent = '✓ Message sent successfully!';
      formStatus.style.color = '#4ade80';
      contactForm.reset();
    } else {
      throw new Error('Failed');
    }
  } catch {
    formStatus.textContent = 'Something went wrong. Please try again.';
    formStatus.style.color = '#f87171';
  } finally {
    submitBtn.querySelector('span').textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

/* ══════════════════════════════════════
   PRICING TOGGLE
══════════════════════════════════════ */
let pricingRetainer = false;

function togglePricing() {
  pricingRetainer = !pricingRetainer;
  const toggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('toggleMonthly');
  const retainerLabel = document.getElementById('toggleRetainer');

  toggle.classList.toggle('on', pricingRetainer);
  monthlyLabel.classList.toggle('active-label', !pricingRetainer);
  retainerLabel.classList.toggle('active-label', pricingRetainer);

  // Animate price change
  document.querySelectorAll('.pricing-price').forEach(el => {
    el.style.transform = 'scale(0.85)';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = pricingRetainer ? el.dataset.retainer : el.dataset.project;
      el.style.transform = 'scale(1)';
      el.style.opacity = '1';
      el.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    }, 180);
  });

  // Toggle period labels
  document.querySelectorAll('.project-period').forEach(el => {
    el.style.display = pricingRetainer ? 'none' : 'block';
  });
  document.querySelectorAll('.retainer-period').forEach(el => {
    el.style.display = pricingRetainer ? 'block' : 'none';
  });
}
window.togglePricing = togglePricing;

// Init label state
document.addEventListener('DOMContentLoaded', () => {
  const ml = document.getElementById('toggleMonthly');
  if (ml) ml.classList.add('active-label');
});
