/* scripts.js
   Full interactions: loader, menu, theme, tabs, tilt, filters, modal,
   cert carousel, radar chart, testimonials, contact fake send, scroll reveal
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- LOADER ---------- */
  const loader = document.getElementById('pageLoader');
  const site = document.getElementById('site');

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 380ms ease';
      setTimeout(() => {
        loader.style.display = 'none';
        site?.classList.remove('hidden');
      }, 420);
    }
  }, 850);

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
/* ---------- REAL-TIME CLOCK ---------- */
  const clockElement = document.getElementById('real-time-clock');

  function updateClock() {
    const now = new Date();
    
    // Format date as: Mon, 29 Sep
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);

    // Format time as: 06:21:59 PM
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

    if (clockElement) {
      clockElement.textContent = `${formattedDate} | ${formattedTime}`;
    }
  }

  updateClock(); // Run once immediately
  setInterval(updateClock, 1000); // Update every second
/* ---------- GENERIC IMAGE MODAL (for Projects & Certs) ---------- */
  const imageModal = document.getElementById('imageModal');
  
  // This one listener works for both project and certificate buttons
  document.querySelectorAll('.open-modal').forEach(button => {
    button.addEventListener('click', () => {
      const title = button.dataset.title;
      const desc = button.dataset.desc; // This will be undefined for certs, which is fine
      const img = button.dataset.img;

      imageModal.querySelector('#modalTitle').textContent = title;
      imageModal.querySelector('#modalImg').src = img;
      
      // Only show the description paragraph if there is a description
      const descEl = imageModal.querySelector('#modalDesc');
      if (desc) {
        descEl.textContent = desc;
        descEl.style.display = 'block';
      } else {
        descEl.style.display = 'none';
      }
      
      imageModal.classList.remove('hidden');
      imageModal.setAttribute('aria-hidden', 'false');
    });
  });

  // This close logic remains the same
  imageModal?.querySelector('#closeModal')?.addEventListener('click', () => {
    imageModal.classList.add('hidden');
    imageModal.setAttribute('aria-hidden', 'true');
  });

  // This also remains the same
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageModal && !imageModal.classList.contains('hidden')) {
        imageModal.classList.add('hidden');
        imageModal.setAttribute('aria-hidden', 'true');
      }
    }
  });
  /* ---------- NAV / MOBILE ---------- */

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  /* ---------- THEME TOGGLE (light/dark) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  let dark = true;
  themeToggle?.addEventListener('click', () => {
    dark = !dark;
    const root = document.documentElement;
    if (!dark) {
      root.style.setProperty('--bg', '#ffffff');
      root.style.setProperty('--text', '#111111');
      root.style.setProperty('--muted', '#444444');
      root.style.setProperty('--glass', 'rgba(0,0,0,0.03)');
      root.style.setProperty('--body-bg', '#f5f5f5');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--input-border', '#e0e0e0');
      root.style.setProperty('--soft-shadow', '0 8px 30px rgba(0,0,0,0.08)');
      themeToggle.textContent = '☼';
    } else {
      root.style.setProperty('--bg', '#0b0b0b');
      root.style.setProperty('--text', '#f5f5f5');
      root.style.setProperty('--muted', '#bdbdbd');
      root.style.setProperty('--glass', 'rgba(255,255,255,0.03)');
      root.style.setProperty('--body-bg', 'linear-gradient(180deg, #050505, #0b0b0b, #0c0c0c)');
      root.style.setProperty('--card-bg', 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))');
      root.style.setProperty('--input-border', 'rgba(255,255,255,0.04)');
      root.style.setProperty('--soft-shadow', '0 8px 30px rgba(2,6,23,0.6)');
      themeToggle.textContent = '☾';
    }
  });

  /* ---------- TABS (About) ---------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- TILT (simple 3D) ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * -10;
      const ry = (x - 0.5) * 14;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.style.boxShadow = '0 30px 70px rgba(2,6,23,0.6)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* ---------- PROJECT FILTERS ---------- */
  const filters = document.getElementById('projectFilters');
  filters?.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('#projectsGrid .project').forEach(p => {
        const t = p.dataset.type;
        if (f === 'all' || f === t) p.style.display = '';
        else p.style.display = 'none';
      });
    });
  });

  // project modal open
  const projectModal = document.getElementById('projectModal');
  document.querySelectorAll('.open-project').forEach(b => {
    b.addEventListener('click', () => {
      const title = b.dataset.title;
      const desc = b.dataset.desc;
      const img = b.dataset.img;
      projectModal.querySelector('#modalTitle').textContent = title;
      projectModal.querySelector('#modalDesc').textContent = desc;
      projectModal.querySelector('#modalImg').src = img;
      projectModal.classList.remove('hidden');
      projectModal.setAttribute('aria-hidden', 'false');
    });
  });
  projectModal?.querySelector('#closeModal')?.addEventListener('click', () => {
    projectModal.classList.add('hidden');
    projectModal.setAttribute('aria-hidden', 'true');
  });

  /* ---------- CERTIFICATION CAROUSEL ---------- */
  /* ---------- CERTIFICATION CAROUSEL ---------- */
const certTrack = document.querySelector('.cert-track');
if (certTrack) {
    const certNext = document.getElementById('certNext');
    const certPrev = document.getElementById('certPrev');
    let certIndex = 0;

    // FIX: Updated the selector to find the new card class name
    const certCards = certTrack.querySelectorAll('.cert-card-redesigned');

    const showCert = (i) => {
        if (certCards.length === 0) return;
        // The gap in the new CSS is 24px
        const cardWidth = certCards[0].offsetWidth + 24;
        certTrack.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    };

    certNext?.addEventListener('click', () => {
        if (certCards.length === 0) return;
        const numVisible = Math.floor(certTrack.offsetWidth / (certCards[0].offsetWidth + 24));
        // Ensure we don't scroll past the last possible item
        certIndex = Math.min(certIndex + 1, certCards.length - numVisible);
        showCert(certIndex);
    });

    certPrev?.addEventListener('click', () => {
        if (certCards.length === 0) return;
        certIndex = Math.max(certIndex - 1, 0);
        showCert(certIndex);
    });
}
  /* ---------- TESTIMONIALS ---------- */
  const testSlides = document.querySelectorAll('.test-slide');
  if (testSlides.length > 0) {
    const testNext = document.getElementById('testNext');
    const testPrev = document.getElementById('testPrev');
    let tIdx = 0;
    const showTest = (i) => {
      testSlides.forEach(s => s.classList.remove('active'));
      if (testSlides[i]) testSlides[i].classList.add('active');
    };
    testNext?.addEventListener('click', () => { tIdx = (tIdx + 1) % testSlides.length; showTest(tIdx); });
    testPrev?.addEventListener('click', () => { tIdx = (tIdx - 1 + testSlides.length) % testSlides.length; showTest(tIdx); });
    setInterval(() => { tIdx = (tIdx + 1) % testSlides.length; showTest(tIdx); }, 6000);
  }

  /* ---------- RADAR CHART ---------- */
  (function renderRadar() {
    const canvas = document.getElementById('skillsRadar');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const centerX = W / 2, centerY = H / 2;
    const labels = ['HTML', 'CSS', 'JS', 'React', 'Accessibility', 'Performance'];
    const values = [88, 82, 78, 72, 80, 75];
    const max = 100;
    const rings = 5;
    ctx.clearRect(0, 0, W, H);

    function polar(i, radius) {
      const angle = (Math.PI * 2) * (i / labels.length) - Math.PI / 2;
      return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
    }

    for (let r = rings; r >= 1; r--) {
      const rad = (Math.min(W, H) / 2 - 40) * (r / rings);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(142,208,255,0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const outer = Math.min(W, H) / 2 - 40;
    ctx.font = '14px Inter, system-ui';
    ctx.fillStyle = 'rgba(245,245,245,0.9)';
    labels.forEach((lab, i) => {
      const p = polar(i, outer + 14);
      const p2 = polar(i, outer);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'rgba(142,208,255,0.05)';
      ctx.stroke();
      ctx.fillText(lab, p.x - 12, p.y + 6);
    });

    ctx.beginPath();
    values.forEach((v, i) => {
      const r = outer * (v / max);
      const pos = polar(i, r);
      if (i === 0) ctx.moveTo(pos.x, pos.y);
      else ctx.lineTo(pos.x, pos.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(142,208,255,0.14)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(142,208,255,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    values.forEach((v, i) => {
      const r = outer * (v / max);
      const pos = polar(i, r);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = 'rgba(142,208,255,0.9)';
      ctx.stroke();
    });
  })();

  /* ---------- CONTACT FORM (fake send) ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    formStatus.textContent = '';
    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      formStatus.textContent = 'Thanks — I will reply within 48 hours.';
      contactForm.reset();
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Send message'; formStatus.textContent = ''; }, 1800);
    }, 1200);
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.card, .project, .service-card, .blog-card, .profile-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = 1;
        }
    });
  }, { threshold: 0.1 });
  
  revealEls.forEach(el => {
    el.style.transition = 'all 700ms cubic-bezier(.2,.9,.2,1)';
    el.style.transform = 'translateY(18px)';
    el.style.opacity = 0;
    observer.observe(el);
  });

  /* ---------- ESC closes modal ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('projectModal');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  });
});