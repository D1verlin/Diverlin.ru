import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import ElasticSeekSlider from '../ElasticSlider';

const MusicCard = ({ track, isPlaying, progress, duration, volume, onTogglePlay, onNext, onPrev, onSeekStart, onSeek, onSeekEnd, onVolumeChange }) => {
  const [showVolume, setShowVolume] = useState(false);
  const hideVolTimeout = useRef(null);

  const handleWheel = (e) => {
    // Only intercept small wheel events, let large ones pass if you want standard scrolling
    // or we just preventDefault here to not trigger app level wheel
    e.stopPropagation();
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

export default MusicCard;
