import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCodeBranch, FaExclamationCircle, FaSync } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

const GithubCard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const FALLBACK_DATA = {
    user: {
      public_repos: 12,
      followers: 8,
      bio: "",
      html_url: "https://github.com/D1verlin"
    },
    repos: [
      {
        id: "Vortex-K06-Configurator",
        name: "Vortex-K06-Configurator",
        html_url: "https://github.com/D1verlin/Vortex-K06-Configurator",
        commitsCount: 12
      },
      {
        id: "DivLauncher",
        name: "DivLauncher",
        html_url: "https://github.com/D1verlin/DivLauncher",
        commitsCount: 28
      },
      {
        id: "DNS-Manager",
        name: "DNS-Manager",
        html_url: "https://github.com/D1verlin/DNS-Manager",
        commitsCount: 15
      }
    ]
  };

  const fetchData = async (forceRefetch = false) => {
    if (forceRefetch) {
      setRetrying(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (!forceRefetch) {
        const cachedData = sessionStorage.getItem('github_data_v4');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.user);
          setRepos(parsed.repos);
          setIsOffline(false);
          setLoading(false);
          return;
        }
      }

      const [userRes, reposRes] = await Promise.all([
        fetch("https://api.github.com/users/D1verlin"),
        fetch("https://api.github.com/users/D1verlin/repos?sort=updated&per_page=3")
      ]);

      if (userRes.status === 403 || reposRes.status === 403) {
        setError('apiLimitReached');
        setIsOffline(true);
        // Load fallback/cached data if api limit is hit
        const cachedData = sessionStorage.getItem('github_data_v4');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.user);
          setRepos(parsed.repos);
        } else {
          setData(FALLBACK_DATA.user);
          setRepos(FALLBACK_DATA.repos);
        }
        setLoading(false);
        setRetrying(false);
        return;
      }

      if (!userRes.ok || !reposRes.ok) {
        setError('errorLoading');
        setIsOffline(true);
        const cachedData = sessionStorage.getItem('github_data_v4');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.user);
          setRepos(parsed.repos);
        } else {
          setData(FALLBACK_DATA.user);
          setRepos(FALLBACK_DATA.repos);
        }
        setLoading(false);
        setRetrying(false);
        return;
      }

      const userJson = await userRes.json();
      let reposJson = await reposRes.json();

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
      setIsOffline(false);
      setError(null);
    } catch (e) {
      console.error("Error fetching GitHub API.", e);
      setError('errorLoading');
      setIsOffline(true);
      
      const cachedData = sessionStorage.getItem('github_data_v4');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setData(parsed.user);
        setRepos(parsed.repos);
      } else {
        setData(FALLBACK_DATA.user);
        setRepos(FALLBACK_DATA.repos);
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card github-card">
      <div className="github-header">
        <div className="github-header-left">
          <FaGithub size={20} className="github-icon-top" />
          <span className="github-title">GitHub</span>
        </div>
        <div className="github-header-right">
          {isOffline && (
            <button 
              onClick={() => fetchData(true)} 
              disabled={retrying} 
              className={`github-header-retry-btn ${retrying ? 'spinning' : ''}`}
              title={`${t('offlineMode')} (${t(error || 'errorLoading')}). ${t('retry')}`}
            >
              {retrying ? <FaSync size={12} /> : <FaExclamationCircle size={14} />}
            </button>
          )}
          {data && (
            <a href={data.html_url || "https://github.com/D1verlin"} target="_blank" rel="noreferrer" className="github-header-link">
              <FaExternalLinkAlt size={14} />
            </a>
          )}
        </div>
      </div>

      {loading ? (
        <div className="github-loading">{t('loading')}</div>
      ) : data ? (
        <div className="github-content">
          <div className="github-profile-row">
            <div className="github-stats">
              <div className="github-stat">
                <span className="stat-val">{data.public_repos}</span>
                <span className="stat-lbl">{t('repos')}</span>
              </div>
              <div className="github-stat">
                <span className="stat-val">{data.followers}</span>
                <span className="stat-lbl">{t('followers')}</span>
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
        <div className="github-error">
          <FaExclamationCircle size={24} style={{ marginBottom: '8px' }} />
          <span>{t(error || 'errorLoading')}</span>
          <button 
            onClick={() => fetchData(true)} 
            disabled={retrying} 
            className={`github-retry-button ${retrying ? 'spinning' : ''}`}
            style={{ marginTop: '10px' }}
          >
            <FaSync size={12} style={{ marginRight: '6px' }} />
            {t('retry')}
          </button>
        </div>
      )}
    </div>
  );
};

export default GithubCard;
