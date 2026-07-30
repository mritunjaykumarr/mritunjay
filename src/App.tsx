import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import CertificationsPage from './pages/CertificationsPage';
import BlogPage from './pages/BlogPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import PrinceAIPage from './pages/PrinceAIPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import FloatingPrinceAI from './components/FloatingPrinceAI';

import PlaygroundPage from './pages/PlaygroundPage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdFree = lazy(() => import('./pages/AdFree'));

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsContactOpen(true);
    window.addEventListener('open-contact', handleOpen);
    return () => window.removeEventListener('open-contact', handleOpen);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <Loader />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/prince-ai" element={<PrinceAIPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adfree" element={<AdFree />} />
        </Routes>
      </Suspense>
      <Contact 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        onOpen={() => setIsContactOpen(true)} 
      />
      <FloatingPrinceAI />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
