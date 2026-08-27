import { useEffect } from 'react';

export function usePortfolioMotion() {
  useEffect(() => {
    // Ensure all reveal elements are immediately visible and never trapped in autoAlpha: 0
    const elements = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-right, .project-card, .cert-card, .skill-cat, .pricing-card, .blog-card, .timeline-item, .footer'
    );
    elements.forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }, []);
}