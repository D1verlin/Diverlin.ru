import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward } from 'react-icons/fa';

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

export default MiniPlayer;
