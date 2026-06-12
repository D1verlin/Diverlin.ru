import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

const ProjectCard = ({ color, title, descKey, date, tags = [], link }) => {
  const { t } = useLanguage();
  
  return (
    <div className="card project-card">
      <div className="project-main-content">
        <h2 style={{ color: color }}>{title}</h2>
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
