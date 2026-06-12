import React from 'react';

const EmptyProjectCard = () => {
  return (
    <div className="card project-card skeleton-card">
      <div className="project-main-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-date"></div>
        <div className="skeleton skeleton-desc"></div>
        <div className="skeleton skeleton-desc short"></div>
        <div className="tags">  
          <div className="skeleton skeleton-tag"></div>
          <div className="skeleton skeleton-tag"></div>
          <div className="skeleton skeleton-tag"></div>
        </div>
      </div>
      <div className="skeleton skeleton-btn"></div>
    </div>
  );
};

export default EmptyProjectCard;
