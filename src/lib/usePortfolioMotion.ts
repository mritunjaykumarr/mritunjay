import { useLayoutEffect } from 'react';

function splitText(element: HTMLElement) {
  if (element.dataset.splitReady === 'true') return;
  const text = element.textContent || '';
  element.dataset.splitReady = 'true';
  element.textContent = '';
  const fragment = document.createDocumentFragment();
  [...text].forEach((char) => {
    const span = document.createElement('span');
    span.className = 'split-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    fragment.appendChild(span);
  });
  element.appendChild(fragment);
}

export function usePortfolioMotion() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-right').forEach((el) => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        // Split hero text for character animation
        const heroLines = gsap.utils.toArray<HTMLElement>('.hero-line[data-split-text]');
        heroLines.forEach(splitText);

        // Hero entrance animation
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-badge', { y: 18, opacity: 0, duration: 0.6 })
          .from('.hero-line .split-char', { yPercent: 100, rotateX: -60, opacity: 0, stagger: 0.018, duration: 0.7 }, '-=0.15')
          .from('.hero-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.25')
          .from('.hero-btns > *', { y: 14, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.2')
          .from('.hero-stats .stat-item', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.18')
          .from('.profile-card', { scale: 0.88, opacity: 0, duration: 0.8, ease: 'back.out(1.4)' }, 0.15)
          .from('.float-badge', { y: 14, opacity: 0, scale: 0.85, stagger: 0.08, duration: 0.5 }, 0.5);

        // Section reveal animations
        const revealSelectors = [
          '.reveal', '.reveal-right', '.project-card', '.cert-card',
          '.skill-cat', '.pricing-card', '.blog-card', '.timeline-item',
          '.contact-form', '.contact-img-card', '.ai-panel', '.footer',
        ];

        gsap.utils.toArray<HTMLElement>(revealSelectors.join(', ')).forEach((el) => {
          const isRight = el.classList.contains('reveal-right');
          gsap.fromTo(el,
            { autoAlpha: 0, y: isRight ? 14 : 22, x: isRight ? 12 : 0 },
            {
              autoAlpha: 1, y: 0, x: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            }
          );
        });

        // Section headers
        gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
          const eyebrow = section.querySelector<HTMLElement>('.section-eyebrow');
          const title = section.querySelector<HTMLElement>('.section-title');
          const sub = section.querySelector<HTMLElement>('.section-sub');

          if (eyebrow) {
            gsap.fromTo(eyebrow, { x: -12, opacity: 0 }, {
              x: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 85%', once: true },
            });
          }
          if (title) {
            gsap.fromTo(title, { y: 18, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 84%', once: true },
            });
          }
          if (sub) {
            gsap.fromTo(sub, { y: 14, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 84%', once: true },
            });
          }
        });

        // Project card parallax
        gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
          const image = card.querySelector<HTMLElement>('.proj-img img');
          if (image) {
            gsap.fromTo(image, { scale: 1.1 }, {
              scale: 1.02, ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 },
            });
          }
        });

        // Tags stagger
        gsap.utils.toArray<HTMLElement>('.skill-tags span, .footer-tag, .proj-tags span').forEach((tag, i) => {
          gsap.fromTo(tag,
            { y: 10, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1, duration: 0.4, delay: i * 0.015,
              ease: 'power2.out',
              scrollTrigger: { trigger: tag, start: 'top 92%', once: true },
            }
          );
        });
      }, document.body);

      cleanup = () => context.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}