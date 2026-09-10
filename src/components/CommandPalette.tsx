import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Bot, Briefcase, FolderKanban, Wrench, BookOpen,
  Calendar, FileText, Moon, CornerDownLeft, Sparkles,
  Terminal, Heart, Mail, User
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Contact';
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  action: () => void;
  badge?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Listen for Cmd+K or Ctrl+K & custom trigger event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open & lock body scroll
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (next === 'light') {
      document.documentElement.style.backgroundColor = '#f8f9fa';
      document.body.style.backgroundColor = '#f8f9fa';
    } else {
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
    }
    window.dispatchEvent(new Event('theme-changed'));
    setIsOpen(false);
  };

  const copyCLICommand = () => {
    navigator.clipboard.writeText('npx mritunjay-portfolio');
    alert('Copied "npx mritunjay-portfolio" to clipboard! Run it in your terminal.');
    setIsOpen(false);
  };

  const items: PaletteItem[] = useMemo(() => [
    // Interactive Assistants & Bookings
    {
      id: 'prince-ai',
      title: 'Prince AI Assistant',
      subtitle: 'Ask technical questions, explore work history, and query portfolio knowledge',
      category: 'Navigation',
      icon: Bot,
      badge: 'LLM Agent',
      action: () => { navigate('/prince-ai'); setIsOpen(false); }
    },
    {
      id: 'book-call',
      title: 'Schedule a Call / Consultation',
      subtitle: 'Book a 15-min intro, 30-min technical scope, or 60-min advisory slot',
      category: 'Navigation',
      icon: Calendar,
      badge: 'Interactive',
      action: () => { navigate('/book-call'); setIsOpen(false); }
    },
    {
      id: 'guestbook',
      title: 'Community Guestbook & Endorsements',
      subtitle: 'Leave a verified signature, feedback, or peer review on the live wall',
      category: 'Navigation',
      icon: Heart,
      badge: 'Live',
      action: () => { navigate('/guestbook'); setIsOpen(false); }
    },

    // Navigation
    {
      id: 'nav-projects',
      title: 'Featured Projects & Case Studies',
      subtitle: 'Production web apps, Bulk Mail Sender, and AI integrations',
      category: 'Navigation',
      icon: FolderKanban,
      action: () => { navigate('/projects'); setIsOpen(false); }
    },
    {
      id: 'nav-experience',
      title: 'Work Experience & History',
      subtitle: 'Epigroww Global, role timeline, and full-stack milestones',
      category: 'Navigation',
      icon: Briefcase,
      action: () => { navigate('/experience'); setIsOpen(false); }
    },
    {
      id: 'nav-skills',
      title: 'Technical Skills & Architecture',
      subtitle: 'React 19, TypeScript, Node.js, AI workflows, Supabase',
      category: 'Navigation',
      icon: Wrench,
      action: () => { navigate('/skills'); setIsOpen(false); }
    },
    {
      id: 'nav-blog',
      title: 'Engineering Blog & Insights',
      subtitle: 'Articles on React 19, streaming LLM interfaces, and web performance',
      category: 'Navigation',
      icon: BookOpen,
      action: () => { navigate('/blog'); setIsOpen(false); }
    },
    {
      id: 'nav-pricing',
      title: 'Services & Project Estimates',
      subtitle: 'Tiered development packages, add-ons, and pricing model',
      category: 'Navigation',
      icon: FileText,
      action: () => { navigate('/pricing'); setIsOpen(false); }
    },
    {
      id: 'nav-about',
      title: 'About Mritunjay Kumar',
      subtitle: 'Background, developer journey, and philosophy',
      category: 'Navigation',
      icon: User,
      action: () => { navigate('/about'); setIsOpen(false); }
    },

    // Quick Actions
    {
      id: 'act-resume',
      title: 'View & Download Resume PDF',
      subtitle: 'Open latest updated verified resume',
      category: 'Actions',
      icon: FileText,
      badge: 'PDF',
      action: () => { window.open('/updated_resume.pdf', '_blank'); setIsOpen(false); }
    },
    {
      id: 'act-cli',
      title: 'Copy CLI Command (`npx mritunjay-portfolio`)',
      subtitle: 'Run terminal interactive portfolio right inside your shell',
      category: 'Actions',
      icon: Terminal,
      action: copyCLICommand
    },
    {
      id: 'act-theme',
      title: 'Toggle Dark / Light Theme',
      subtitle: 'Switch between sleek pure black and clean daylight mode',
      category: 'Actions',
      icon: Moon,
      action: toggleTheme
    },

    // Contact
    {
      id: 'contact-email',
      title: 'Send Direct Email',
      subtitle: 'me@mritify.online',
      category: 'Contact',
      icon: Mail,
      action: () => { window.location.href = 'mailto:me@mritify.online'; setIsOpen(false); }
    },
    {
      id: 'contact-form',
      title: 'Open Instant Contact Modal',
      subtitle: 'Send a message or proposal inquiry',
      category: 'Contact',
      icon: CornerDownLeft,
      action: () => {
        window.dispatchEvent(new Event('open-contact'));
        setIsOpen(false);
      }
    }
  ], [navigate]);

  // Filtered items
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Keyboard navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-selected="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="command-palette-backdrop"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              background: 'var(--surface-2, #0d0d0d)',
              border: '1px solid var(--border-strong, rgba(255,255,255,0.2))',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '75vh',
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.875rem 1.25rem',
                borderBottom: '1px solid var(--border, rgba(255,255,255,0.1))',
                gap: '12px',
                background: 'var(--surface, #080808)',
              }}
            >
              <Search size={18} style={{ color: 'var(--text-muted, #888)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command, tool name, or page..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.98rem',
                  color: 'var(--text, #fff)',
                  fontWeight: 500,
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    color: 'var(--text-muted, #888)',
                    padding: '2px',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '4px',
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <kbd
                style={{
                  padding: '2px 7px',
                  borderRadius: '6px',
                  background: 'var(--surface-3, #1c1c1c)',
                  border: '1px solid var(--border, rgba(255,255,255,0.12))',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted, #888)',
                  fontFamily: 'monospace',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              style={{
                overflowY: 'auto',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted, #888)',
                    fontSize: '0.9rem',
                  }}
                >
                  <Sparkles size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  No results found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      data-selected={isSelected}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--surface-3, rgba(255,255,255,0.08))' : 'transparent',
                        border: isSelected ? '1px solid var(--border-soft, rgba(255,255,255,0.1))' : '1px solid transparent',
                        transition: 'background 0.1s ease, border-color 0.1s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: isSelected ? 'var(--accent, #fff)' : 'var(--surface, #141414)',
                            color: isSelected ? 'var(--accent-foreground, #000)' : 'var(--text-muted, #aaa)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            transition: 'all 0.1s ease',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: isSelected ? 'var(--text, #fff)' : 'var(--text-2, #ccc)',
                              }}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(255,255,255,0.08)',
                                  color: 'var(--text-muted, #aaa)',
                                  fontWeight: 500,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted, #777)',
                                margin: 0,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-subtle, #555)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {item.category}
                        </span>
                        {isSelected && (
                          <CornerDownLeft size={13} style={{ color: 'var(--accent, #fff)' }} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Hint Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1.25rem',
                borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
                background: 'var(--surface, #060606)',
                fontSize: '0.74rem',
                color: 'var(--text-subtle, #777)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span><kbd style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>↑↓</kbd> to navigate</span>
                <span><kbd style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>↵</kbd> to select</span>
                <span><kbd style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>ESC</kbd> to close</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                <span>Mritunjay Platform v2.5</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
