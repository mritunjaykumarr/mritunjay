/* =========================================
   scripts.js — Mritunjay Kumar Portfolio
   ========================================= */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 900);
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

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

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
    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
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
    const icon = card.querySelector('.cert-thumb i').className;
    certModalTitle.textContent = h4.textContent;
    certModalIssuer.textContent = span.textContent;
    certModalIcon.innerHTML = `<i class="${icon}"></i>`;
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
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
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
  const R = Math.min(W, H) / 2 - 50;

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
  const duration = 1200;
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
      ctx.strokeStyle = 'rgba(56,189,248,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, 1);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = 'rgba(56,189,248,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Filled area
    ctx.beginPath();
    skills.forEach((s, i) => {
      const pt = getPoint(i, s.value * p);
      i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(56,189,248,0.18)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots
    skills.forEach((s, i) => {
      const pt = getPoint(i, s.value * p);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    });

    // Labels (always at full position)
    ctx.font = '600 13px Syne, sans-serif';
    ctx.fillStyle = '#7890a8';
    skills.forEach((s, i) => {
      const pt = getPoint(i, 1.2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.label, pt.x, pt.y);
    });

    if (progress < 1) requestAnimationFrame(draw);
  }

  // Trigger when visible
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
  submitBtn.textContent = 'Sending...';
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
      formStatus.textContent = 'Message sent ✓';
      formStatus.style.color = '#4ade80';
      contactForm.reset();
    } else {
      throw new Error('Failed');
    }
  } catch {
    formStatus.textContent = 'Something went wrong. Please try again.';
    formStatus.style.color = '#f87171';
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});
