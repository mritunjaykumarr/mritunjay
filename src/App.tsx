import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Home from './pages/Home';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdFree = lazy(() => import('./pages/AdFree'));

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

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
      <CustomCursor />
      <Loader />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adfree" element={<AdFree />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
