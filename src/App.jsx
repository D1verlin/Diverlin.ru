import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaDiscord, FaTelegramPlane, FaGithub, FaSteam, 
  FaPlay, FaPause, FaStepBackward, FaStepForward, FaExternalLinkAlt, FaCodeBranch
} from 'react-icons/fa';
import './App.css';

import ElasticSeekSlider from './ElasticSlider';
import SpotlightCard from './SpotlightCard';

const backgrounds = [
  "https://r2.diverlin.ru/Assets/Wallpaper/sakura-forest-minecraft.1920x1080_web.webm",
  "https://r2.diverlin.ru/Assets/Wallpaper/raindrops-minecraft.1920x1080_web.webm",
  "https://r2.diverlin.ru/Assets/Wallpaper/Loop%20Background%20%EF%BD%9C%20Live%20Wallpaper%20%EF%BD%9C%20Chilling%20Cat%20%EF%BD%9C%20No%20Sound_web.webm",
  "https://r2.diverlin.ru/Assets/Wallpaper/Cherry%20Blossom%20House%20%EF%BD%9C%20Minecraft%20%EF%BD%9C%20Wallpaper%20In%204K%20%EF%BD%9C%20Live%20Wallpaper_web.webm"
];

const playlist = [
  { title: "Boa", author: "Duvet", src: "https://r2.diverlin.ru/Music/Music/boa%20-%20Duvet.mp3", cover: "https://r2.diverlin.ru/Music/Cover/Duvet-%20BOA.jpg" },
  { title: "Show Me How", author: "Men I Trust", src: "https://r2.diverlin.ru/Music/Music/Men%20I%20Trust%20-%20Show%20Me%20How.mp3", cover: "https://r2.diverlin.ru/Music/Cover/Men%20I%20Trust%20-%20Show%20Me%20How.jpg" },
  { title: "Never", author: "Mag.Lo", src: "https://r2.diverlin.ru/Music/Music/NEVER%20feat.%20O_Super.mp3", cover: "https://r2.diverlin.ru/Music/Cover/NEVER.jpg" },
  { title: "Rolling Stoner", author: "Thomas Mraz", src: "https://r2.diverlin.ru/Music/Music/Rolling%20Stoner.mp3", cover: "https://r2.diverlin.ru/Music/Cover/Rolling%20Stoner.png" }   
];

// =========================================
// БАЗА ДАННЫХ ПРОЕКТОВ
// =========================================
const projectsList = [
  { cmd: "wsa", color: "#86edff", title: "WSA", desc: "windows system assistant", date: "12.06.2023", tags: ["HTML", "CSS", "JS"], link: "https://wsa.diverlin.ru" },
  { cmd: "bh", color: "#d06bff", title: "Bookmarks Hub", desc: "Bookmarks makers with out in JSON", date: "17.06.2025", tags: ["React", "JSON"], link: "https://bh.diverlin.ru" },
  { cmd: "crt", color: "#54e460", title: "CRT Overlay", desc: "Оверлей-эффект старого ЭЛТ/CRT монитора на весь экран", date: "06.10.2025", tags: ["Python", "PyQt6", "PySide6"], link: "https://github.com/D1verlin/desktop-crt-overlay" },
  { cmd: "sdf", color: "#ff7070", title: "SDF", desc: "My pastebin clone", date: "17.02.2026", tags: ["Node.js", "Express", "Sqlite"], link: "https://sdf.diverlin.ru" },
  { cmd: "dns", color: "#85ffae", title: "DNS Manager", desc: "Утилита настройки DNS", date: "31.05.2026", tags: ["PowerShell", ".NET"], link: "https://github.com/D1verlin/DNS-Manager" }
];


// --- 1. PROFILE ---
const ProfileCard = () => (
  <div className="card profile-card-v2">
    <div className="avatar-stack">
      <div className="avatar-shadow shadow-1"></div>
      <div className="avatar-shadow shadow-2"></div>
      <div className="avatar-main">
        <img src="https://r2.diverlin.ru/Assets/Mashiro_Shino.jpg" alt="Avatar" />
      </div>
    </div>
    <div className="profile-info-v2">
      <h2 className="profile-name-v2">DIVERLIN</h2>
      <p className="profile-role-v2">Frontend-Developer</p>
    </div>
  </div>
);

// --- 2. GITHUB WIDGET ---
const GithubCard = () => {
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = sessionStorage.getItem('github_data_v4');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.user);
          setRepos(parsed.repos);
          setLoading(false);
          return;
        }
        
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/D1verlin"),
          fetch("https://api.github.com/users/D1verlin/repos?sort=updated&per_page=3")
        ]);

        const userJson = await userRes.json();
        let reposJson = await reposRes.json();

        if (userRes.ok && reposRes.ok) {
          reposJson = await Promise.all(reposJson.map(async (repo) => {
            try {
              const commitsRes = await fetch(`https://api.github.com/repos/D1verlin/${repo.name}/commits?per_page=1`);
              let commitsCount = 0;
              if (commitsRes.ok) {
                const linkHeader = commitsRes.headers.get('link');
                if (linkHeader) {
                  const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                  if (match) commitsCount = parseInt(match[1]);
                } else {
                  const commits = await commitsRes.clone().json();
                  commitsCount = commits.length;
                }
              }
              return { ...repo, commitsCount };
            } catch (e) {
              return repo;
            }
          }));

          sessionStorage.setItem('github_data_v4', JSON.stringify({ user: userJson, repos: reposJson }));
          setData(userJson);
          setRepos(reposJson);
        }
      } catch (e) {
        console.error("Error fetching GitHub API.", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="card github-card">
      <div className="github-header">
        <div className="github-header-left">
          <FaGithub size={20} className="github-icon-top" />
          <span className="github-title">GitHub</span>
        </div>
        {data && (
          <a href={data.html_url} target="_blank" rel="noreferrer" className="github-header-link">
            <FaExternalLinkAlt size={14} />
          </a>
        )}
      </div>
      {loading ? (
        <div className="github-loading">Loading...</div>
      ) : data ? (
        <div className="github-content">
          <div className="github-profile-row">
            <div className="github-stats">
              <div className="github-stat">
                <span className="stat-val">{data.public_repos}</span>
                <span className="stat-lbl">Repos</span>
              </div>
              <div className="github-stat">
                <span className="stat-val">{data.followers}</span>
                <span className="stat-lbl">Followers</span>
              </div>
            </div>
          </div>
          {data.bio && <p className="github-bio">{data.bio}</p>}
          
          <div className="github-repos">
            {repos.map((repo, index) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="github-repo-card" style={{ "--depth-index": index }}>
                <span className="repo-name">{repo.name}</span>
                {repo.commitsCount !== undefined && (
                  <span className="repo-commits">
                    <FaCodeBranch size={10} /> {repo.commitsCount}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="github-error">Error loading data</div>
      )}
    </div>
  );
};

// --- 3. SOCIALS ---
import MaxLogo from './assets/Max_(app)_logo 1.svg';

const SocialsCard = ({ onMaxPopup }) => {
  const socials = [
    { Icon: FaDiscord, name: "discord", link: "https://discord.com/users/294066838579707904", color: "#5865f23a", isLink: true },
    { Icon: FaTelegramPlane, name: "telegram", link: "https://t.me/diverlin", color: "#229fd933", isLink: true },
    { Icon: ({size}) => <img src={MaxLogo} width={size} height={size} alt="Max" className="social-img-icon" />, name: "max", action: onMaxPopup, color: "#ffffff2f", isLink: false },
    { Icon: FaSteam, name: "steam", link: "https://steamcommunity.com/id/D1verlin/", color: "#1b28382f", isLink: true },
  ];
  return (
    <div className="card socials-card">
      <div className="socials-grid">
        {socials.map(({ Icon, name, link, action, color, isLink }, i) => (
          isLink ? (
            <a key={i} href={link} target="_blank" rel="noreferrer" className={`social-btn ${name}`} style={{ "--hover-color": color }}>
              <Icon size={48} />
            </a>
          ) : (
            <div key={i} onClick={action} className={`social-btn ${name}`} style={{ "--hover-color": color, cursor: 'pointer' }}>
              <Icon size={48} />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

// --- 4. MAIN MUSIC CARD ---
const MusicCard = ({ track, isPlaying, progress, duration, volume, onTogglePlay, onNext, onPrev, onSeekStart, onSeek, onSeekEnd, onVolumeChange }) => {
  const [showVolume, setShowVolume] = useState(false);
  const hideVolTimeout = useRef(null);

  const handleWheel = (e) => {
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    let newVol = Math.max(0, Math.min(1, volume + delta));
    onVolumeChange(newVol);
    setShowVolume(true);
    if (hideVolTimeout.current) clearTimeout(hideVolTimeout.current);
    hideVolTimeout.current = setTimeout(() => setShowVolume(false), 1500);
  };

  return (
    <div className="card music-card-new" onWheel={handleWheel}>
      <motion.div layoutId="music-cover-wrapper" className="music-bg-cover" style={{ backgroundImage: `url(${track.cover})` }} />

      <div className="music-details" style={{ marginTop: 'auto' }}>
        <motion.h3 layoutId="music-title">{track.title}</motion.h3>
        <p>{track.author}</p>
      </div>

      <div className="music-controls-new">
         <button onClick={onPrev} className="control-btn"><FaStepBackward size={28} /></button>
         <button onClick={onTogglePlay} className="control-btn">
            {isPlaying ? <FaPause size={36} /> : <FaPlay size={36} style={{marginLeft: '4px'}} />}
         </button>
         <button onClick={onNext} className="control-btn"><FaStepForward size={28} /></button>
      </div>

      <ElasticSeekSlider currentTime={progress} duration={duration} onSeekStart={onSeekStart} onSeek={onSeek} onSeekEnd={onSeekEnd} />

      <AnimatePresence>
        {showVolume && (
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0 }} transition={{ duration: 0.2 }} className="volume-indicator-aw" style={{ originX: 1 }}>
            <div className="volume-fill-aw" style={{ height: `${volume * 100}%` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 5. MINI PLAYER ---
const MiniPlayer = ({ track, isPlaying, onTogglePlay, onNext }) => (
  <motion.div initial={{ y: -100, opacity: 0, x: '-50%' }} animate={{ y: 0, opacity: 1, x: '-50%' }} exit={{ y: -100, opacity: 0, x: '-50%' }} transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} className="mini-player">
    <motion.div layoutId="music-cover-wrapper" className={`mini-cover-wrapper ${isPlaying ? 'playing' : ''}`}>
       <img src={track.cover} className="mini-cover-img" alt="Cover" />
    </motion.div>
    <div className="mini-info">
      <motion.h4 layoutId="music-title">{track.title}</motion.h4>
      <p>{track.author}</p>
    </div>
    <div className="mini-controls">
      <button onClick={onTogglePlay}>{isPlaying ? <FaPause size={14}/> : <FaPlay size={14}/>}</button>
      <button onClick={onNext}><FaStepForward size={14}/></button>
    </div>
  </motion.div>
);

// --- 6. PROJECTS ---
const ProjectCard = ({ color, title, desc, date, tags = [], link }) => (
  <div className="card project-card">
    <div className="project-main-content">
      <h2 style={{ color: color }}>{title}</h2>
      <h3>{date}</h3>
      <p>{desc}</p>
      <div className="tags">  
        {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
      </div>
    </div>
    <a className="project-btn" href={link} target="_blank" rel="noreferrer" style={{ color: color, borderColor: color }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color + "22")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
      Open Project <FaExternalLinkAlt size={14} />
    </a>
  </div>
);


// =========================================
// MAX POPUP
// =========================================
const MaxPopup = ({ onClose }) => (
  <div className="max-popup-overlay" onClick={onClose}>
    <motion.div 
      className="max-popup-content" 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0.8, opacity: 0 }} 
      transition={{ type: "spring", bounce: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <img src="https://r2.diverlin.ru/Assets/max_final.webp" alt="Max" className="max-popup-img" />
    </motion.div>
  </div>
);

// =========================================
// MAIN APP COMPONENT
// =========================================
export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isBgBlur, setIsBgBlur] = useState(false);
  const [isMaxPopupOpen, setIsMaxPopupOpen] = useState(false);

  // States Аудио
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  
  const audioRef = useRef(null);
  const touchStartY = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(playlist[0].src);
  }

  // Обновление прогресса
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

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
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Управление скроллом и свайпами для смены слайдов
  useEffect(() => {
    const changeSlide = (direction) => {
      if (isAnimating) return;
      if (direction === 'down' && currentSlide < slidesData.length - 1) { setCurrentSlide(p => p + 1); setIsAnimating(true); }
      else if (direction === 'up' && currentSlide > 0) { setCurrentSlide(p => p - 1); setIsAnimating(true); }
    };

    const handleWheel = (e) => {
      if (e.target.closest('.music-card-new') || e.target.closest('.mini-player')) return;
      if (e.deltaY > 50) changeSlide('down');
      else if (e.deltaY < -50) changeSlide('up');
    };

    const handleTouchStart = (e) => { 
      if (e.target.closest('.terminal-body')) return;
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
    }, 15000); 
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
    slidesData.push(
      projectsList.slice(i, i + 4).map((proj, idx) => ({
        id: `project-${i + idx}`,
        spotlightColor: `${proj.color}40`, // Добавляем прозрачность к цвету проекта для Spotlight
        c: <ProjectCard 
              color={proj.color} 
              title={proj.title} 
              desc={proj.desc} 
              date={proj.date} 
              tags={proj.tags} 
              link={proj.link} 
           />
      }))
    );
  }

  return (
    <div className="app-container">
      <video key={bgIndex} className={`bg-video ${isBgBlur ? 'blur-active' : ''}`} autoPlay loop muted playsInline>
        <source src={backgrounds[bgIndex]} type="video/webm" />
      </video>

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
}