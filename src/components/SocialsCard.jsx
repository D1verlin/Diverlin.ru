import React from 'react';
import { FaDiscord, FaTelegramPlane, FaSteam, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import MaxLogo from '../assets/Max_(app)_logo 1.svg';

const SocialsCard = ({ isMaxActive, isSocialsExpanded, onOpen, onClose }) => {
  const socials = [
    { Icon: FaDiscord, name: "discord", link: "https://discord.com/users/294066838579707904", color: "#5865f23a", isLink: true },
    { Icon: FaTelegramPlane, name: "telegram", link: "https://t.me/diverlin", color: "#229fd933", isLink: true },
    { Icon: ({size}) => <img src={MaxLogo} width={size} height={size} alt="Max" className="social-img-icon" />, name: "max", action: onOpen, color: "#ffffff2f", isLink: false },
    { Icon: FaSteam, name: "steam", link: "https://steamcommunity.com/id/D1verlin/", color: "#1b28382f", isLink: true },
  ];

  return (
    <div className={`card socials-card ${isSocialsExpanded ? 'expanded' : ''}`} style={{ width: '100%', height: '100%', padding: isSocialsExpanded ? '0' : '' }}>
      <AnimatePresence mode="wait">
        {isSocialsExpanded ? (
          <motion.div 
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-expanded-view"
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="max-close-btn"
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
            >
              <FaTimes size={16} />
            </button>
            <img 
              src="https://r2.diverlin.ru/Assets/max_final.webp" 
              alt="Max" 
              className="max-expanded-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px',
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="grid-content"
            initial={{ opacity: 1 }}
            animate={{ opacity: isMaxActive ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="socials-grid"
            style={{ width: '100%', height: '100%', pointerEvents: isMaxActive ? 'none' : 'auto' }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialsCard;
