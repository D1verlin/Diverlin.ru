import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

import wsaIcon from '../assets/WSA.svg';
import bookmarksHubIcon from '../assets/Bookmarks Hub.svg';
import crtOverlayIcon from '../assets/CRT Overlay.svg';
import sdfIcon from '../assets/SDF.svg';
import dnsManagerIcon from '../assets/DNS Manager.svg';
import fileConverterShellIcon from '../assets/FileConverterShell.svg';
import divLauncherIcon from '../assets/DivLauncher.svg';
import vortexIcon from '../assets/Vortex-K06-Configurator.svg';
import maxLogoIcon from '../assets/Max_(app)_logo 1.svg';
import siteLogo from '../assets/logo.svg';

const Preloader = ({ isVideoReady, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [imagesDone, setImagesDone] = useState(false);
  const [apiDone, setApiDone] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const imagesToPreload = [
      'https://r2.diverlin.ru/Assets/Mashiro_Shino.jpg',
      'https://r2.diverlin.ru/Assets/max_final.webp',
      wsaIcon,
      bookmarksHubIcon,
      crtOverlayIcon,
      sdfIcon,
      dnsManagerIcon,
      fileConverterShellIcon,
      divLauncherIcon,
      vortexIcon,
      maxLogoIcon,
      siteLogo,
    ];

    let loadedImages = 0;
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      const onImgDone = () => {
        if (!isMounted) return;
        loadedImages++;
        if (loadedImages === imagesToPreload.length) {
          setImagesDone(true);
        }
      };
      img.onload = onImgDone;
      img.onerror = onImgDone;
    });

    // GitHub API Preload
    const preloadGithubApi = async () => {
      try {
        if (!sessionStorage.getItem('github_data_v4')) {
          const [userRes, reposRes] = await Promise.all([
            fetch('https://api.github.com/users/D1verlin'),
            fetch('https://api.github.com/users/D1verlin/repos?sort=updated&per_page=3')
          ]);
          if (userRes.ok && reposRes.ok) {
            const userJson = await userRes.json();
            let reposJson = await reposRes.json();

            reposJson = await Promise.all(
              reposJson.map(async (repo) => {
                try {
                  const commitsRes = await fetch(
                    `https://api.github.com/repos/D1verlin/${repo.name}/commits?per_page=1`
                  );
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
                } catch {
                  return repo;
                }
              })
            );

            sessionStorage.setItem(
              'github_data_v4',
              JSON.stringify({ user: userJson, repos: reposJson })
            );
          }
        }
      } catch (e) {
        console.warn('GitHub API prefetch warning:', e);
      } finally {
        if (isMounted) setApiDone(true);
      }
    };

    preloadGithubApi();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate percentage dynamically based on actual readiness
  useEffect(() => {
    let completedCount = 0;

    if (imagesDone) completedCount++;
    if (apiDone) {
      completedCount++;
    }
    if (isVideoReady) {
      completedCount++;
    }

    const calcPercent = Math.round((completedCount / 3) * 100);
    setProgress((prev) => Math.max(prev, calcPercent));
  }, [imagesDone, apiDone, isVideoReady]);

  // Safety fallback timer (max 3 seconds)
  useEffect(() => {
    const maxTimer = setTimeout(() => {
      setProgress(100);
    }, 3000);
    return () => clearTimeout(maxTimer);
  }, []);

  // Completion trigger
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="preloader-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="preloader-content">
        <div className="preloader-progress-box">
          <div className="preloader-bar-bg">
            <div
              className="preloader-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="preloader-percentage">{progress}%</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
