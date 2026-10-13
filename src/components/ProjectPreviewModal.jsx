import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectPreviewModal = ({ project, onClose, isMobile }) => {
  const screenshots = project?.screenshots || [];
  const hasMultiple = screenshots.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSrc, setActiveSrc] = useState(screenshots[0] || null);
  const [isBuffering, setIsBuffering] = useState(true);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Preload all screenshots on mount to ensure instant switching
  useEffect(() => {
    screenshots.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [screenshots]);

  // Smoothly load target screenshot without layout shifts
  useEffect(() => {
    const targetSrc = screenshots[currentIndex];
    if (!targetSrc) return;

    let isMounted = true;
    const img = new Image();
    img.src = targetSrc;

    if (img.complete && img.naturalWidth > 0) {
      setActiveSrc(targetSrc);
      setIsBuffering(false);
    } else {
      setIsBuffering(true);
      img.onload = () => {
        if (isMounted) {
          setActiveSrc(targetSrc);
          setIsBuffering(false);
        }
      };
      img.onerror = () => {
        if (isMounted) {
          setActiveSrc(targetSrc);
          setIsBuffering(false);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [currentIndex, screenshots]);

  const handleNext = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  // Keyboard navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        if (hasMultiple) {
          e.preventDefault();
          e.stopPropagation();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        if (hasMultiple) {
          e.preventDefault();
          e.stopPropagation();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isFullscreen, hasMultiple, screenshots.length]);

  // Touch swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!project || screenshots.length === 0) return null;

  const modalContent = (
    <motion.div
      key="project-preview-modal"
      className={`project-preview-modal ${isFullscreen ? 'preview-fullscreen' : ''}`}
      initial={{ 
        opacity: 0, 
        scale: isFullscreen ? 0.95 : 0.6,
        originX: 0.5,
        originY: 0.5
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.6,
        transition: {
          scale: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
          opacity: { duration: 0.2, ease: 'easeOut' }
        }
      }}
      style={{ "--project-color": project.color }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="preview-inner">
        {/* Header bar */}
        <div className="preview-header">
          <div className="preview-title-wrap">
            <h3 style={{ color: project.color }}>{project.title}</h3>
            {hasMultiple && (
              <span className="preview-counter">
                {currentIndex + 1} / {screenshots.length}
              </span>
            )}
          </div>

          <div className="preview-actions-bar">
            <button
              type="button"
              className="preview-control-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Свернуть" : "На весь экран"}
              aria-label={isFullscreen ? "Свернуть" : "На весь экран"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              className="preview-control-btn"
              onClick={onClose}
              title="Закрыть"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media / Image stage */}
        <div 
          className="preview-stage"
          onClick={(e) => {
            if (e.target.classList.contains('preview-stage')) {
              onClose();
            }
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {isBuffering && (
            <div className="preview-loading-indicator">
              <div className="preview-spinner" />
            </div>
          )}

          {activeSrc && (
            <img
              key={activeSrc}
              src={activeSrc}
              alt={`${project.title} Screenshot ${currentIndex + 1}`}
              className="preview-screenshot-img"
              style={{
                opacity: isBuffering && !activeSrc ? 0 : 1,
                transition: 'opacity 0.28s ease'
              }}
            />
          )}
        </div>

        {/* Bottom controls bar for multiple screenshots */}
        {hasMultiple && (
          <div className="preview-bottom-bar">
            <button
              type="button"
              className="preview-bottom-btn"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              title="Предыдущий (←)"
              aria-label="Предыдущий скриншот"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="preview-dots-row">
              {screenshots.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`preview-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  aria-label={`Скриншот ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="preview-bottom-btn"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              title="Следующий (→)"
              aria-label="Следующий скриншот"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default ProjectPreviewModal;
