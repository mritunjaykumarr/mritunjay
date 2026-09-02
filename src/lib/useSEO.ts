import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://mritify.online';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'Mritunjay Kumar Portfolio';

/**
 * Dynamic SEO hook — updates document head meta tags per-page.
 * Reverts to defaults on unmount so navigation always shows correct meta.
 */
export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      canonical,
      ogImage = DEFAULT_OG_IMAGE,
      ogType = 'website',
      jsonLd,
    } = config;

    // --- Title ---
    document.title = title;

    // --- Meta helpers ---
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // --- Standard meta ---
    setMeta('name', 'description', description);
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // --- Canonical ---
    const canonicalUrl = canonical || `${BASE_URL}${window.location.pathname}`;
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // --- Open Graph ---
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'en_US');

    // --- Twitter ---
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:creator', '@mritunjay2025');

    // --- JSON-LD ---
    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('type', 'application/ld+json');
        scriptEl.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Cleanup: remove the dynamic JSON-LD on unmount
    return () => {
      const dynamicScript = document.querySelector('script[data-seo-jsonld]');
      if (dynamicScript) dynamicScript.remove();
    };
  }, [config]);
}

// --- Pre-built SEO configs per page ---

export const SEO_CONFIGS = {
  home: {
    title: 'Mritunjay Kumar | Full Stack Developer & AI Engineer — mritify.online',
    description:
      'Mritunjay Kumar — expert full stack developer and AI engineer crafting premium, high-performance web experiences. React, Node.js, TypeScript specialist. Hire top developer in India.',
    keywords:
      'Mritunjay Kumar, mritify, Full Stack Developer, AI Engineer, React Developer, Node.js Developer, TypeScript Developer, Web Developer India, Software Engineer, Portfolio, Hire Developer, Best Developer India, Shopify Developer, MERN Stack',
    canonical: `${BASE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: BASE_URL,
          description: 'Portfolio of Mritunjay Kumar — full stack developer and AI engineer.',
          publisher: { '@type': 'Person', name: 'Mritunjay Kumar' },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'Person',
          name: 'Mritunjay Kumar',
          url: BASE_URL,
          image: `${BASE_URL}/assets/profile1.jpg`,
          jobTitle: 'Full Stack Developer & AI Engineer',
          description:
            'Full Stack Developer specializing in React.js, Shopify, Node.js, TypeScript, and AI integrations.',
          worksFor: {
            '@type': 'Organization',
            name: 'Epigroww Global',
          },
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: "Vinayaka Mission's Research Foundation - University",
          },
          knowsAbout: [
            'React', 'TypeScript', 'JavaScript', 'Shopify', 'Node.js',
            'Express.js', 'MongoDB', 'Next.js', 'AI', 'Machine Learning',
            'HTML', 'CSS', 'Supabase', 'PostgreSQL',
          ],
          sameAs: [
            'https://github.com/mritunjaykumarr',
            'https://www.linkedin.com/in/mritunjay-kumar-22a7a828b',
            'https://www.instagram.com/princegupta.dev/',
            'https://x.com/mritunjay2025',
          ],
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Bihar',
            addressCountry: 'IN',
          },
        },
      ],
    },
  } satisfies SEOConfig,

  about: {
    title: 'About Mritunjay Kumar | Full Stack Developer Journey & Story',
    description:
      'Learn about Mritunjay Kumar — a passionate full stack developer with expertise in React, Node.js, TypeScript, and AI. Discover his journey, philosophy, values, and milestones.',
    keywords:
      'About Mritunjay Kumar, Developer Story, Full Stack Journey, React Expert, Node.js Expert, Developer Philosophy, Career Milestones, Web Developer India',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Mritunjay Kumar',
      description: 'Full journey and story of Mritunjay Kumar as a full stack developer.',
      url: `${BASE_URL}/about`,
      mainEntity: {
        '@type': 'Person',
        name: 'Mritunjay Kumar',
        jobTitle: 'Full Stack Developer',
      },
    },
  } satisfies SEOConfig,

  experience: {
    title: 'Work Experience | Mritunjay Kumar — Full Stack Developer at Epigroww Global',
    description:
      'Professional work experience of Mritunjay Kumar as a Full Stack Developer at Epigroww Global. Building enterprise-grade applications with React, Node.js, and AI technologies.',
    keywords:
      'Mritunjay Kumar Experience, Full Stack Developer Experience, Epigroww Global, Work History, Developer Resume, React Developer Experience, Professional Developer India',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Work Experience - Mritunjay Kumar',
      url: `${BASE_URL}/experience`,
    },
  } satisfies SEOConfig,

  projects: {
    title: 'Projects by Mritunjay Kumar | React, Node.js, AI & Shopify Portfolio',
    description:
      'Explore projects by Mritunjay Kumar — AI chatbots, Shopify apps, SaaS platforms, and more. Full stack development portfolio showcasing production-grade applications.',
    keywords:
      'Mritunjay Kumar Projects, React Projects, Node.js Projects, AI Projects, Shopify Projects, Full Stack Portfolio, Web App Projects, SaaS Development',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Projects by Mritunjay Kumar',
      description: 'Portfolio of production-grade web applications and AI projects.',
      url: `${BASE_URL}/projects`,
    },
  } satisfies SEOConfig,

  skills: {
    title: 'Technical Skills | Mritunjay Kumar — React, Node.js, TypeScript, AI',
    description:
      'Comprehensive technical skills of Mritunjay Kumar including React 19, TypeScript, Node.js, Express, MongoDB, Supabase, Shopify, AI/ML, and modern web technologies.',
    keywords:
      'Mritunjay Kumar Skills, React Skills, TypeScript Developer, Node.js Skills, Full Stack Skills, AI Skills, Technical Expertise, Web Technologies, MERN Stack',
  } satisfies SEOConfig,

  certifications: {
    title: 'Certifications & Achievements | Mritunjay Kumar — Verified Developer Credentials',
    description:
      'Professional certifications and achievements of Mritunjay Kumar including deep learning, machine learning, full stack development, and internship certificates.',
    keywords:
      'Mritunjay Kumar Certifications, Developer Certifications, Deep Learning Certificate, Machine Learning Certificate, Full Stack Certificate, Professional Achievements',
  } satisfies SEOConfig,

  blog: {
    title: 'Blog & Insights | Mritunjay Kumar — Web Development, AI & Tech Articles',
    description:
      'Read technical blog posts and insights by Mritunjay Kumar covering React, Node.js, AI development, full stack architecture, and modern web engineering.',
    keywords:
      'Mritunjay Kumar Blog, Web Development Blog, React Blog, AI Articles, Full Stack Insights, Tech Blog India, Developer Blog, Programming Articles',
  } satisfies SEOConfig,

  pricing: {
    title: 'Services & Pricing | Hire Mritunjay Kumar — Full Stack Developer for Hire',
    description:
      'Hire Mritunjay Kumar for your next project. Services include full stack development, Shopify development, AI integration, SaaS development, and consulting. Competitive pricing.',
    keywords:
      'Hire Mritunjay Kumar, Full Stack Developer for Hire, React Developer for Hire, Web Development Services, Shopify Developer, Freelance Developer India, Development Pricing, AI Developer',
  } satisfies SEOConfig,

  contact: {
    title: 'Contact Mritunjay Kumar | Hire Full Stack Developer — Get in Touch',
    description:
      'Get in touch with Mritunjay Kumar for full stack development projects, AI consulting, Shopify development, or collaboration. Based in Bihar / New Delhi, India.',
    keywords:
      'Contact Mritunjay Kumar, Hire Developer, Get in Touch, Full Stack Developer Contact, Developer India Contact, Web Development Inquiry',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Mritunjay Kumar',
      url: `${BASE_URL}/contact`,
    },
  } satisfies SEOConfig,

  princeAI: {
    title: 'Prince AI Assistant | Mritunjay Kumar — Ask About Projects, Skills & More',
    description:
      'Chat with Prince AI — an intelligent assistant trained on Mritunjay Kumar\'s portfolio. Ask about projects, tech stack, hiring, experience, and more.',
    keywords:
      'Prince AI, AI Assistant, Portfolio Chat, Mritunjay Kumar AI, Ask Developer, AI Portfolio Assistant',
  } satisfies SEOConfig,

  playground: {
    title: 'AI Playground | Mritunjay Kumar — Interactive AI Demo',
    description:
      'Try the interactive AI playground by Mritunjay Kumar. Experiment with AI-powered tools and demos showcasing modern web engineering capabilities.',
    keywords:
      'AI Playground, Interactive Demo, AI Tools, Mritunjay Kumar Demo, Web AI, Developer Playground',
  } satisfies SEOConfig,
} as const;
