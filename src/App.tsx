import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import AnnouncementBar from './components/AnnouncementBar';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import FloatingPrinceAI from './components/FloatingPrinceAI';
import MobileBottomDock from './components/MobileBottomDock';

import PlaygroundPage from './pages/PlaygroundPage';
import DomainCheckerPage from './pages/DomainCheckerPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdFree = lazy(() => import('./pages/AdFree'));

/* Footer wrapper: shows Footer on all pages EXCEPT "/" (Home has its own) */
function ConditionalFooter() {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return <Footer />;
}

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
    if (theme === 'light') {
      document.documentElement.style.backgroundColor = '#f8f9fa';
      document.body.style.backgroundColor = '#f8f9fa';
    } else {
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Loader />
      <AnnouncementBar />
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
          <Route path="/domain-checker" element={<DomainCheckerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adfree" element={<AdFree />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ConditionalFooter />
      <Contact 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
      <FloatingPrinceAI />
      <MobileBottomDock />
    </BrowserRouter>
  );
}

export default App;
