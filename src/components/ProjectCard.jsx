import React, { useRef, useLayoutEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Globe, Eye, Tag } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ProjectCard = ({ 
  color, 
  title, 
  descKey, 
  date, 
  tags = [], 
  link, 
  github, 
  website, 
  icon,
  latestRelease,
  screenshots = [],
  onOpenPreview
}) => {
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

  const renderIcon = () => {
    if (typeof icon === 'string' && icon.trim() !== '') {
      return <img src={icon} alt={title} className="project-icon" />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (icon) {
      const IconComponent = icon;
      return <IconComponent className="project-icon" style={{ color: color }} size={24} />;
    }
    // Fallback letter-based icon if no icon is specified
    return (
      <span className="project-icon-fallback" style={{ color: color }}>
        {title ? title.charAt(0) : '?'}
      </span>
    );
  };

  const githubLink = github || (link && link.includes('github.com') ? link : null);
  const websiteLink = website || (link && !link.includes('github.com') ? link : null);

  const btnStyle = {
    "--project-color": color,
    "--project-bg-hover": color ? `${color}1a` : 'rgba(255, 255, 255, 0.08)'
  };

  return (
    <div className="card project-card" style={{ "--project-color": color }}>
      <div className="project-main-content">
        <div className="project-header">
          {renderIcon()}
          <div className="project-title-meta">
            <h2 ref={titleRef} style={{ color: color }}>{title}</h2>
            <h3>{date}</h3>
          </div>
        </div>
        <p>{t(descKey)}</p>
        <div className="tags">  
          {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      </div>
      <div className="project-actions">
        {githubLink && (
          <a 
            className="project-action-btn" 
            href={githubLink} 
            target="_blank" 
            rel="noreferrer" 
            title="GitHub" 
            aria-label="GitHub"
            style={btnStyle}
          >
            <FaGithub size={18} />
          </a>
        )}
        {websiteLink && (
          <a 
            className="project-action-btn" 
            href={websiteLink} 
            target="_blank" 
            rel="noreferrer" 
            title={t('visitSite')} 
            aria-label={t('visitSite')}
            style={btnStyle}
          >
            <Globe size={18} />
          </a>
        )}
        {screenshots && screenshots.length > 0 && (
          <button 
            type="button"
            className="project-action-btn" 
            onClick={() => onOpenPreview && onOpenPreview({ title, color, screenshots })}
            title="Быстрый просмотр" 
            aria-label="Быстрый просмотр"
            style={btnStyle}
          >
            <Eye size={18} />
          </button>
        )}
        {latestRelease && (
          <a
            className="project-release-badge"
            href={latestRelease.url}
            target="_blank"
            rel="noreferrer"
            title={`Релиз ${latestRelease.tag}`}
            aria-label={`Релиз ${latestRelease.tag}`}
            style={btnStyle}
          >
            <Tag size={11} className="release-icon" />
            <span className="release-tag-text">{latestRelease.tag}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
