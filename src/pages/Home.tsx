import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import BlogFeed from '../components/BlogFeed';
import Pricing from '../components/Pricing';
import PrinceAI from '../components/PrinceAI';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useState, useEffect } from 'react';

interface HomeProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Home({ theme, toggleTheme }: HomeProps) {
  usePortfolioMotion();
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsContactOpen(true);
    window.addEventListener('open-contact', handleOpen);
    return () => window.removeEventListener('open-contact', handleOpen);
  }, []);

  return (
    <div className="home" style={{ overflowX: 'hidden' }}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Certifications />
        <Skills />
        <BlogFeed />
        <Pricing />
        <PrinceAI />
        <Contact 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
          onOpen={() => setIsContactOpen(true)} 
        />
      </main>
      <Footer />
    </div>
  );
}
