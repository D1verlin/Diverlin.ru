import React, { useRef, useLayoutEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

const ProjectCard = ({ color, title, descKey, date, tags = [], link }) => {
  const { t } = useLanguage();
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const checkSize = () => {
      // Clear style override to let it calculate naturally first
      el.style.fontSize = '';

      // Get the default font size from computed styles (respecting viewport queries)
      const computedStyle = window.getComputedStyle(el);
      let size = parseFloat(computedStyle.fontSize);

      let attempts = 0;
      // Shrink size by 0.5px steps if it overflows (scrollWidth > clientWidth)
      while (el.scrollWidth > el.clientWidth && size > 8 && attempts < 30) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
        attempts++;
      }
    };

    // Run initially
    checkSize();

    // Listen for window resizes
    window.addEventListener('resize', checkSize);
    
    // Listen for document fonts loaded, to avoid issues when custom font replaces fallback
    if (document.fonts) {
      document.fonts.ready.then(checkSize);
    }

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [title]);

  return (
    <div className="card project-card">
      <div className="project-main-content">
        <h2 ref={titleRef} style={{ color: color }}>{title}</h2>
        <h3>{date}</h3>
        <p>{t(descKey)}</p>
        <div className="tags">  
          {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      </div>
      <a 
        className="project-btn" 
        href={link} 
        target="_blank" 
        rel="noreferrer" 
        style={{ 
          "--project-color": color,
          "--project-bg-hover": color + "22"
        }}
      >
        {t('openProject')} <FaExternalLinkAlt size={14} />
      </a>
    </div>
  );
};

export default ProjectCard;
