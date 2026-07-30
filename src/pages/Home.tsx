import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import AIPlayground from '../components/AIPlayground';
import BlogFeed from '../components/BlogFeed';
import Pricing from '../components/Pricing';
import PrinceAI from '../components/PrinceAI';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export default function Home() {
  usePortfolioMotion();

  return (
    <div className="home" style={{ overflowX: 'hidden' }}>
      <main>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Certifications />
        <Skills />
        <AIPlayground />
        <BlogFeed />
        <Pricing />
        <PrinceAI />
      </main>
    </div>
  );
}
