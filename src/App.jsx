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
import EmptyProjectCard from './components/EmptyProjectCard';
import MaxPopup from './components/MaxPopup';

import { Globe } from 'lucide-react';

import { backgrounds, playlist, projectsList } from './data/constants';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isBgBlur, setIsBgBlur] = useState(false);
  const [isMaxPopupOpen, setIsMaxPopupOpen] = useState(false);

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
  const touchStartY = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(playlist[currentTrack].src);
    audioRef.current.volume = volume;
  }

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

  // Управление клавиатурой (Глобальное)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.code === 'ArrowRight') { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }
      if (e.code === 'ArrowLeft') { setCurrentTrack(p => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); }
      if (e.code === 'ArrowDown') changeSlide('down');
      if (e.code === 'ArrowUp') changeSlide('up');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide, isAnimating]);

  const changeSlide = (direction) => {
    if (isAnimating) return;
    if (direction === 'down' && currentSlide < slidesData.length - 1) { setCurrentSlide(p => p + 1); setIsAnimating(true); }
    else if (direction === 'up' && currentSlide > 0) { setCurrentSlide(p => p - 1); setIsAnimating(true); }
  };

  // Управление скроллом и свайпами для смены слайдов
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.closest('.music-card-new') || e.target.closest('.mini-player')) return;
      if (e.deltaY > 50) changeSlide('down');
      else if (e.deltaY < -50) changeSlide('up');
    };

    const handleTouchStart = (e) => { 
      if (e.target.closest('.terminal-body') || e.target.closest('.music-card-new') || e.target.closest('.github-repos')) return;
      touchStartY.current = e.touches[0].clientY; 
    };
    const handleTouchEnd = (e) => {
      if (!touchStartY.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 50) changeSlide('down');
      else if (delta < -50) changeSlide('up');
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
  }, [currentSlide, isAnimating]);

  useEffect(() => { if (isAnimating) setTimeout(() => setIsAnimating(false), 500); }, [isAnimating]);

  // Смена фонов
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBgBlur(true);
      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length);
        setTimeout(() => setIsBgBlur(false), 500);
      }, 1000); 
    }, 30000); 
    return () => clearInterval(interval);
  }, []);

  // Динамически формируем данные слайдов
  const slidesData = [
    // Слайд 1 (Главный экран)
    [ 
      { id: 'profile', spotlightColor: "rgba(255, 255, 255, 0.15)", c: <ProfileCard /> }, 
      { id: 'github', spotlightColor: "rgba(255, 255, 255, 0.15)", c: <GithubCard /> }, 
      { id: 'socials', spotlightColor: "rgba(255, 255, 255, 0.15)", c: <SocialsCard onMaxPopup={() => setIsMaxPopupOpen(true)} /> }, 
      { id: 'music', spotlightColor: "rgba(255, 255, 255, 0.15)", c: <MusicCard 
                      track={playlist[currentTrack]} isPlaying={isPlaying} progress={progress} duration={duration} volume={volume}
                      onTogglePlay={() => setIsPlaying(!isPlaying)}
                      onNext={() => { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }}
                      onPrev={() => { setCurrentTrack(p => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); }}
                      onSeekStart={() => setIsUserSeeking(true)} onSeek={(t) => setProgress(t)}
                      onSeekEnd={(t) => { audioRef.current.currentTime = t; setIsUserSeeking(false); }}
                      onVolumeChange={setVolume}
                   /> 
      } 
    ]
  ];

  // Слайды с проектами (по 4 на страницу)
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
            link={proj.link} 
            icon={proj.icon}
         />
    }));

    // Дополняем пустыми карточками, если проектов меньше 4 на слайде
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

  return (
    <div className="app-container">
      <video key={bgIndex} className={`bg-video ${isBgBlur ? 'blur-active' : ''}`} autoPlay loop muted playsInline>
        <source src={backgrounds[bgIndex]} type="video/webm" />
      </video>
      
      <LanguageSwitcher />

      <AnimatePresence>
        {currentSlide !== 0 && (
           <MiniPlayer track={playlist[currentTrack]} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onNext={() => { setCurrentTrack(p => (p + 1) % playlist.length); setIsPlaying(true); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMaxPopupOpen && <MaxPopup onClose={() => setIsMaxPopupOpen(false)} />}
      </AnimatePresence>

      <div className="slider-container">
        <AnimatePresence mode='wait'>
          <motion.div key={currentSlide} initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="grid-wrapper">
            {slidesData[currentSlide].map((item, index) => (
               <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }} className="grid-item-animated">
                 <SpotlightCard spotlightColor={item.spotlightColor || "rgba(255, 255, 255, 0.15)"}>
                    {item.c}
                 </SpotlightCard>
               </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="pagination-dots">
        {slidesData.map((_, index) => (
          <div 
            key={index} 
            className={`dot ${currentSlide === index ? 'active' : ''}`} 
            onClick={() => setCurrentSlide(index)} 
          />
        ))}
      </div>
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