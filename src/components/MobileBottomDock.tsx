import { Link, useLocation } from 'react-router-dom';
import { Home, FolderKanban, Wrench, Bot, Mail } from 'lucide-react';

export default function MobileBottomDock() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-contact'));
  };

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation Dock">
      <Link
        to="/"
        className={`mobile-dock-item ${isActive('/') ? 'active' : ''}`}
        aria-label="Home"
      >
        <Home size={18} />
        <span>Home</span>
      </Link>

      <Link
        to="/projects"
        className={`mobile-dock-item ${isActive('/projects') ? 'active' : ''}`}
        aria-label="Projects"
      >
        <FolderKanban size={18} />
        <span>Projects</span>
      </Link>

      {/* Featured AI Highlight Center Action */}
      <Link
        to="/prince-ai"
        className={`mobile-dock-item mobile-dock-item-ai ${isActive('/prince-ai') ? 'active' : ''}`}
        aria-label="Ask Prince AI"
      >
        <Bot size={18} />
        <span style={{ fontWeight: 600 }}>PrinceAI</span>
      </Link>

      <Link
        to="/skills"
        className={`mobile-dock-item ${isActive('/skills') ? 'active' : ''}`}
        aria-label="Skills"
      >
        <Wrench size={18} />
        <span>Skills</span>
      </Link>

      <button
        onClick={openContactModal}
        className={`mobile-dock-item ${isActive('/contact') ? 'active' : ''}`}
        aria-label="Contact"
        type="button"
      >
        <Mail size={18} />
        <span>Contact</span>
      </button>
    </nav>
  );
}
