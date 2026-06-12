import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const ProfileCard = () => {
  const { t } = useLanguage();
  return (
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
        <p className="profile-role-v2">{t('role')}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
