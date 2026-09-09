import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X, Clock, Sparkles } from 'lucide-react';

export default function LiveStatusBeacon() {
  const [time, setTime] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 998,
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'var(--surface-2, rgba(14, 14, 14, 0.94))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-strong, rgba(255, 255, 255, 0.2))',
              borderRadius: '14px',
              padding: '10px 14px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '380px',
            }}
          >
            {/* Pulsing indicator */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.4)',
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                }}
              />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
                  Available for Hire
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    fontWeight: 600,
                  }}
                >
                  Q2 2026
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted, #888)',
                  marginTop: '1px',
                }}
              >
                <Clock size={11} style={{ opacity: 0.7 }} />
                <span>IST: {time || 'Loading...'}</span>
                <span>•</span>
                <span>India</span>
              </div>
            </div>

            {/* Book slot button */}
            <button
              onClick={() => navigate('/book-call')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 9px',
                borderRadius: '8px',
                background: 'var(--accent, #fff)',
                color: 'var(--accent-foreground, #000)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Calendar size={12} />
              <span>Book Call</span>
              <ChevronRight size={12} />
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: 'var(--text-subtle, #666)',
                padding: '3px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label="Minimize availability badge"
              title="Minimize"
            >
              <X size={13} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'var(--surface-2, rgba(14, 14, 14, 0.9))',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-strong, rgba(255, 255, 255, 0.2))',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              color: 'var(--text, #fff)',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
              }}
            />
            <span>Available for Work</span>
            <Sparkles size={12} style={{ color: 'var(--accent, #fff)' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
