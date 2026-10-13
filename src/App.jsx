import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

import SpotlightCard from './SpotlightCard';
import ProfileCard from './components/ProfileCard';
import GithubCard from './components/GithubCard';
import SocialsCard from './components/SocialsCard';
import MusicCard from './components/MusicCard';
import MiniPlayer from './components/MiniPlayer';
import ProjectCard from './components/ProjectCard';
import ProjectPreviewModal from './components/ProjectPreviewModal';
import EmptyProjectCard from './components/EmptyProjectCard';
import Preloader from './components/Preloader';

import { Globe, X } from 'lucide-react';

import { backgrounds, playlist, projectsList } from './data/constants';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useGithubReleases } from './hooks/useGithubReleases';

// --- LANGUAGE SWITCHER COMPONENT ---
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher-container" ref={dropdownRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lang-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={`lang-option ${language === 'ru' ? 'active' : ''}`}
              onClick={() => { setLanguage('ru'); setIsOpen(false); }}
            >
              RU
            </div>
            <div 
              className={`lang-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => { setLanguage('en'); setIsOpen(false); }}
            >
              EN
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="lang-globe-btn" onClick={() => setIsOpen(!isOpen)}>
        <Globe size={20} />
      </button>
    </div>
  );
};

// =========================================
// MAIN APP CONTENT
// =========================================
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mainVideoRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isBgBlur, setIsBgBlur] = useState(false);
  const [isMaxOpen, setIsMaxOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // States Аудио
  const [currentTrack, setCurrentTrack] = useState(() => {
    const saved = localStorage.getItem('currentTrack');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('volume');
    return saved !== null ? parseFloat(saved) : 0.5;
  });
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  
  const audioRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(playlist[currentTrack].src);
    audioRef.current.volume = volume;
  }

  useEffect(() => {
    const video = mainVideoRef.current;
    if (video && video.readyState >= 2) {
      setTimeout(() => setIsVideoReady(true), 0);
    }
  }, []);

  // Обновление прогресса
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    localStorage.setItem('volume', volume);

    const updateProgress = () => {
      if (!isUserSeeking) setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleNextTrack = () => {
      setCurrentTrack((p) => (p + 1) % playlist.length);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleNextTrack);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [isUserSeeking, volume]);

  // Смена трека и Play/Pause
  const isFirstRender = useRef(true);
  useEffect(() => {
    localStorage.setItem('currentTrack', currentTrack);
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    audioRef.current.src = playlist[currentTrack].src;
    setProgress(0);
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    else audioRef.current.pause();
  }, [isPlaying]);

  const profileItem = { 
    id: 'profile', 
    spotlightColor: "rgba(255, 255, 255, 0.15)", 
    c: <ProfileCard /> 
  };

  const musicItem = { 
    id: 'music', 
    spotlightColor: "rgba(255, 255, 255, 0.15)", 
    c: <MusicCard 
          track={playlist[currentTrack]} isPlaying={isPlaying} progress={progress} duration={duration} volume={volume}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNext={() => { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }}
          onPrev={() => { setCurrentTrack(p => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); }}
          onSeekStart={() => setIsUserSeeking(true)} onSeek={(t) => setProgress(t)}
          onSeekEnd={(t) => { audioRef.current.currentTime = t; setIsUserSeeking(false); }}
          onVolumeChange={setVolume}
       /> 
  };

  const githubItem = { 
    id: 'github', 
    spotlightColor: "rgba(255, 255, 255, 0.15)", 
    c: <GithubCard /> 
  };

  const socialsItem = { 
    id: 'socials', 
    spotlightColor: "rgba(255, 255, 255, 0.15)", 
    c: <SocialsCard onOpen={() => setIsMaxOpen(true)} /> 
  };

  const slidesData = [];

  const releasesMap = useGithubReleases(projectsList);

  const getProjectRelease = (proj) => {
    const key = proj.github || proj.link;
    if (key && releasesMap[key] !== undefined) {
      return releasesMap[key];
    }
    return proj.latestRelease;
  };

  if (isMobile) {
    // Мобильная версия: по 2 карточки на слайд
    slidesData.push([profileItem, musicItem]);
    slidesData.push([githubItem, socialsItem]);

    for (let i = 0; i < projectsList.length; i += 2) {
      const pageProjects = projectsList.slice(i, i + 2);
      const slideItems = pageProjects.map((proj, idx) => ({
        id: `project-${i + idx}`,
        spotlightColor: `${proj.color}40`,
        c: <ProjectCard 
              color={proj.color} 
              title={proj.title} 
              descKey={proj.descKey} 
              date={proj.date} 
              tags={proj.tags} 
              website={proj.website}
              github={proj.github}
              link={proj.link} 
              icon={proj.icon}
              latestRelease={getProjectRelease(proj)}
              screenshots={proj.screenshots}
              onOpenPreview={setPreviewProject}
           />
      }));

      while (slideItems.length < 2) {
        const emptyIdx = slideItems.length;
        slideItems.push({
          id: `empty-project-${i + emptyIdx}`,
          spotlightColor: "rgba(255, 255, 255, 0.05)",
          c: <EmptyProjectCard />
        });
      }

      slidesData.push(slideItems);
    }
  } else {
    // Десктоп: по 4 карточки на слайд
    slidesData.push([profileItem, githubItem, socialsItem, musicItem]);

    for (let i = 0; i < projectsList.length; i += 4) {
      const pageProjects = projectsList.slice(i, i + 4);
      const slideItems = pageProjects.map((proj, idx) => ({
        id: `project-${i + idx}`,
        spotlightColor: `${proj.color}40`,
        c: <ProjectCard 
              color={proj.color} 
              title={proj.title} 
              descKey={proj.descKey} 
              date={proj.date} 
              tags={proj.tags} 
              website={proj.website}
              github={proj.github}
              link={proj.link} 
              icon={proj.icon}
              latestRelease={getProjectRelease(proj)}
              screenshots={proj.screenshots}
              onOpenPreview={setPreviewProject}
           />
      }));

      while (slideItems.length < 4) {
        const emptyIdx = slideItems.length;
        slideItems.push({
          id: `empty-project-${i + emptyIdx}`,
          spotlightColor: "rgba(255, 255, 255, 0.05)",
          c: <EmptyProjectCard />
        });
      }

      slidesData.push(slideItems);
    }
  }

  const changeSlide = (direction) => {
    if (isAnimating || isMaxOpen || previewProject) return;
    const totalSlides = slidesData.length;
    if (direction === 'down' && currentSlide < totalSlides - 1) { setCurrentSlide(p => p + 1); setIsAnimating(true); }
    else if (direction === 'up' && currentSlide > 0) { setCurrentSlide(p => p - 1); setIsAnimating(true); }
  };

  useEffect(() => {
    if (currentSlide >= slidesData.length) {
      setCurrentSlide(Math.max(0, slidesData.length - 1));
    }
  }, [slidesData.length, currentSlide]);

  // Управление клавиатурой (Глобальное)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (isMaxOpen) {
        if (e.code === 'Escape') setIsMaxOpen(false);
        return;
      }
      if (previewProject) {
        return;
      }
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.code === 'ArrowRight') { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }
      if (e.code === 'ArrowLeft') { setCurrentTrack(p => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); }
      if (e.code === 'ArrowDown') changeSlide('down');
      if (e.code === 'ArrowUp') changeSlide('up');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide, isAnimating, isMaxOpen, previewProject, isMobile, slidesData.length]);

  // Управление скроллом и свайпами для смены слайдов
  useEffect(() => {
    const handleWheel = (e) => {
      if (isMaxOpen || previewProject) return;
      if (e.target.closest('.music-card-new') || e.target.closest('.mini-player')) return;
      if (e.deltaY > 50) changeSlide('down');
      else if (e.deltaY < -50) changeSlide('up');
    };

    const handleTouchStart = (e) => { 
      if (isMaxOpen || previewProject) return;
      if (e.target.closest('.seek-track-root')) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY; 
    };
    const handleTouchEnd = (e) => {
      if (isMaxOpen || previewProject || touchStartX.current === null || touchStartY.current === null) return;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX > 40) {
        if (deltaX > 0) changeSlide('down');
        else changeSlide('up');
      } else if (absY > absX && absY > 40) {
        if (deltaY > 0) changeSlide('down');
        else changeSlide('up');
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSlide, isAnimating, isMaxOpen, previewProject, isMobile, slidesData.length]);

  useEffect(() => { if (isAnimating) setTimeout(() => setIsAnimating(false), 500); }, [isAnimating]);

  // Смена фонов
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBgBlur(true);
      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length);
        setTimeout(() => setIsBgBlur(false), 500);
      }, 1000); 
    }, 60000); // 1 минута (60 секунд)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <AnimatePresence>
        {isLoading && (
          <Preloader
            key="preloader"
            isVideoReady={isVideoReady}
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      <video
        key={bgIndex}
        ref={mainVideoRef}
        className={`bg-video ${isBgBlur ? 'blur-active' : ''}`}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setIsVideoReady(true)}
        onCanPlayThrough={() => setIsVideoReady(true)}
        onPlaying={() => setIsVideoReady(true)}
        onLoadedData={() => setIsVideoReady(true)}
      >
        <source src={backgrounds[bgIndex]} type="video/webm" />
      </video>
      
      <LanguageSwitcher />

      <AnimatePresence>
        {currentSlide !== 0 && (
           <MiniPlayer track={playlist[currentTrack]} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onNext={() => { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }} />
        )}
      </AnimatePresence>

      <div className={`slider-container ${previewProject ? 'has-preview-open' : ''} ${isMaxOpen ? 'has-max-open' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide} 
            initial={{ y: 35 }} 
            animate={{ y: 0 }} 
            exit={{ y: -35 }} 
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }} 
            className="grid-wrapper"
          >
            {slidesData[currentSlide]?.map((item) => (
              <div key={item.id} className="grid-item-animated">
                <SpotlightCard spotlightColor={item.spotlightColor || "rgba(255, 255, 255, 0.15)"}>
                  {item.c}
                </SpotlightCard>
              </div>
            ))}

            <AnimatePresence>
              {isMaxOpen && (
                <motion.div 
                  key="max-card-expanded"
                  initial={{ 
                    opacity: 0, 
                    scale: 0.48, 
                    originX: isMobile ? 0.5 : 0, 
                    originY: 1 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    originX: isMobile ? 0.5 : 0, 
                    originY: 1,
                    transition: { 
                      duration: 0.35, 
                      ease: [0.16, 1, 0.3, 1] 
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.48, 
                    originX: isMobile ? 0.5 : 0, 
                    originY: 1,
                    transition: {
                      scale: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                      opacity: { duration: 0.22, delay: 0.1, ease: "easeOut" }
                    }
                  }}
                  className="max-card-full"
                >
                  <div className="max-card-inner">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMaxOpen(false);
                      }}
                      className="max-close-btn"
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                    <img 
                      src="https://r2.diverlin.ru/Assets/max_final.webp" 
                      alt="Max" 
                      className="max-expanded-img"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {previewProject && (
                <ProjectPreviewModal
                  project={previewProject}
                  onClose={() => setPreviewProject(null)}
                  isMobile={isMobile}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {!isMaxOpen && !previewProject && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pagination-dots"
          >
            {slidesData.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${currentSlide === index ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(index)} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}