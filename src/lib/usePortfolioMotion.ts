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

    const header = document.getElementById('header');
    const loader = document.getElementById('loader');

    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-right').forEach((element) => {
        element.classList.add('visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
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
      const heroLines = gsap.utils.toArray<HTMLElement>('.hero-line[data-split-text]');
      heroLines.forEach(splitText);

      const headerSetter = header ? gsap.quickTo(header, 'y', { duration: 0.28, ease: 'power3.out' }) : null;
      const headerScale = header ? gsap.quickTo(header, 'scale', { duration: 0.28, ease: 'power3.out' }) : null;

      if (header) {
        header.classList.add('header-floating');
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate(self) {
            const shouldHide = self.direction === 1 && self.scroll() > 120;
            headerSetter?.(shouldHide ? -18 : 0);
            headerScale?.(shouldHide ? 0.98 : 1);
            header.classList.toggle('header-hidden', shouldHide);
          },
        });
      }

      if (loader) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.loader-mark', { scale: 0.68, opacity: 0, duration: 0.85 })
          .from('.loader-ring', { scale: 0.84, opacity: 0, rotate: -120, duration: 1 }, 0)
          .from('.loader-stroke circle', { strokeDashoffset: 520, duration: 1.2 }, 0.1)
          .from('.loader-particle', { scale: 0, opacity: 0, stagger: 0.08, duration: 0.45 }, 0.18)
          .from('.loader-copy > *', { y: 16, opacity: 0, stagger: 0.12, duration: 0.55 }, 0.24)
          .to('.loader-mark', { scale: 1.03, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0.5)
          .to('.loader-ring', { rotate: 360, duration: 2.3, repeat: -1, ease: 'none' }, 0)
          .to('.loader-orbit', { rotate: 360, duration: 3.5, repeat: -1, ease: 'none' }, 0);

        const finishLoader = () => {
          gsap.timeline({ onComplete: () => loader.remove() })
            .to(loader, { scale: 0.98, opacity: 0, duration: 0.7, ease: 'power2.inOut' })
            .set(loader, { display: 'none' });
        };

        if (document.readyState === 'complete') {
          window.setTimeout(finishLoader, 900);
        } else {
          window.addEventListener('load', () => window.setTimeout(finishLoader, 900), { once: true });
        }
      }

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-badge', { y: 22, opacity: 0, duration: 0.65 })
        .from('.hero-line .split-char', { yPercent: 120, rotateX: -80, opacity: 0, stagger: 0.015, duration: 0.85 }, '-=0.2')
        .from('.hero-sub', { y: 24, opacity: 0, duration: 0.7 }, '-=0.3')
        .from('.hero-btns > *', { y: 18, opacity: 0, stagger: 0.12, duration: 0.55 }, '-=0.28')
        .from('.hero-stats .stat-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.55 }, '-=0.22')
        .from('.profile-stage', { scale: 0.84, opacity: 0, duration: 0.95, ease: 'back.out(1.6)' }, 0.12)
        .from('.float-badge', { y: 18, opacity: 0, scale: 0.82, stagger: 0.1, duration: 0.6 }, 0.5);

      const revealSelectors = [
        '.reveal',
        '.reveal-right',
        '.project-card',
        '.cert-card',
        '.skill-cat',
        '.pricing-card',
        '.blog-card',
        '.timeline-item',
        '.contact-form',
        '.contact-img-card',
        '.footer',
      ];

      gsap.utils.toArray<HTMLElement>(revealSelectors.join(', ')).forEach((element) => {
        const isRight = element.classList.contains('reveal-right');
        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: isRight ? 18 : 28,
            x: isRight ? 16 : 0,
            filter: 'blur(10px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
        const title = section.querySelector<HTMLElement>('.section-title');
        const eyebrow = section.querySelector<HTMLElement>('.section-eyebrow');
        const sub = section.querySelector<HTMLElement>('.section-sub');

        if (eyebrow) {
          gsap.fromTo(
            eyebrow,
            { x: -16, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 84%', once: true },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 22, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
            {
              y: 0,
              opacity: 1,
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 82%', once: true },
            }
          );
        }

        if (sub) {
          gsap.fromTo(
            sub,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 82%', once: true },
            }
          );
        }
      });

      gsap.utils.toArray<HTMLElement>('.projects-grid .project-card').forEach((card, index) => {
        const image = card.querySelector<HTMLElement>('.proj-img img');

        gsap.fromTo(
          card,
          { y: 44, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.85,
            delay: index * 0.04,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 84%', once: true },
          }
        );

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.16 },
            {
              scale: 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      });

      gsap.utils.toArray<HTMLElement>('.contact-info-links a, .skill-tags span, .footer-tag, .proj-tags span').forEach((tag, index) => {
        gsap.fromTo(
          tag,
          { y: 14, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.02,
            ease: 'power2.out',
            scrollTrigger: { trigger: tag, start: 'top 90%', once: true },
          }
        );
      });

      gsap.to('.hero-particles span, .loader-particle', {
        y: -18,
        x: '+=8',
        repeat: -1,
        yoyo: true,
        duration: 5.5,
        stagger: 0.25,
        ease: 'sine.inOut',
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