import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import BlogFeed from '../components/BlogFeed';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((el) => {
        if (el.isIntersecting) {
          setTimeout(() => {
            el.target.classList.add('visible');
          }, Number((el.target as HTMLElement).dataset.delay) || 0);
          revealObserver.unobserve(el.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => {
      revealObserver.observe(el);
    });
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="home" style={{ overflowX: 'hidden' }}>
      <Header />
      <main>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Certifications />
        <Skills />
        <BlogFeed />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
