import React from 'react';
import { FaDiscord, FaTelegramPlane, FaSteam } from 'react-icons/fa';
import MaxLogo from '../assets/Max_(app)_logo 1.svg';

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

export default SocialsCard;
