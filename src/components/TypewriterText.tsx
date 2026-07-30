import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetween?: number;
  className?: string;
}

const DEFAULT_PHRASES = [
  "Hello, I'm Mritunjay Kumar",
  "Full Stack & AI Application Developer",
  "Building enterprise-grade AI products & SaaS platforms",
];

export default function TypewriterText({
  phrases = DEFAULT_PHRASES,
  typingSpeed = 80,
  deletingSpeed = 40,
  delayBetween = 2000,
  className = '',
}: TypewriterTextProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const targetPhrase = phrases[phraseIndex % phrases.length];

    if (!isDeleting) {
      if (currentText.length < targetPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetween);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex(prev => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, delayBetween]);

  return (
    <span className={`typewriter-container ${className}`}>
      <span className="typewriter-text">{currentText}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
