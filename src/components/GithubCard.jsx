import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCodeBranch, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

const GithubCard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (userRes.status === 403 || reposRes.status === 403) {
          setError('apiLimitReached');
          setLoading(false);
          return;
        }

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
        } else {
          setError('errorLoading');
        }
      } catch (e) {
        console.error("Error fetching GitHub API.", e);
        setError('errorLoading');
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
        {data && !error && (
          <a href={data.html_url} target="_blank" rel="noreferrer" className="github-header-link">
            <FaExternalLinkAlt size={14} />
          </a>
        )}
      </div>
      {loading ? (
        <div className="github-loading">{t('loading')}</div>
      ) : error ? (
        <div className="github-error">
          <FaExclamationCircle size={24} style={{ marginBottom: '8px' }} />
          <span>{t(error)}</span>
        </div>
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
        <div className="github-error">{t('errorLoading')}</div>
      )}
    </div>
  );
};

export default GithubCard;
