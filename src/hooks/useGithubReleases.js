import { useState, useEffect } from 'react';

const CACHE_KEY = 'diverlin_github_releases_v1';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// Extract "owner/repo" from github URL
export const getRepoFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/github\.com\/([^/]+\/[^/#?]+)/i);
  return match ? match[1].replace(/\.git$/, '') : null;
};

// Safe localStorage reader
const getStorageCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

// Safe localStorage writer
const setStorageCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota or private mode errors
  }
};

// Default seed to eliminate layout shifts on fresh sessions before first fetch
const DEFAULT_SEEDS = {
  'D1verlin/desktop-crt-overlay': { tag: 'v1.0', url: 'https://github.com/D1verlin/desktop-crt-overlay/releases/tag/v1.0', hasRelease: true },
  'D1verlin/DNS-Manager': { tag: '1.1', url: 'https://github.com/D1verlin/DNS-Manager/releases/tag/1.1', hasRelease: true },
  'D1verlin/Vortex-K06-Configurator': { tag: 'v1.0.5', url: 'https://github.com/D1verlin/Vortex-K06-Configurator/releases/tag/v1.0.5', hasRelease: true },
  'D1verlin/YT-DLP-Client': { tag: 'v1.0.4', url: 'https://github.com/D1verlin/YT-DLP-Client/releases/tag/v1.0.4', hasRelease: true },
  'D1verlin/Checklister': { tag: 'v1.0.4', url: 'https://github.com/D1verlin/Checklister/releases/tag/v1.0.4', hasRelease: true },
  'D1verlin/ProxyRouterDesktop': { tag: 'v1.0.11', url: 'https://github.com/D1verlin/ProxyRouterDesktop/releases/tag/v1.0.11', hasRelease: true }
};

/**
 * Hook to automatically fetch and cache latest releases for GitHub repositories.
 * Stale-while-revalidate pattern with localStorage caching and 2h TTL.
 * 
 * @param {Array} projects - Projects list containing github/link URLs
 * @returns {Object} Map of {[repoUrl]: { tag: string, url: string } | null}
 */
export const useGithubReleases = (projects = []) => {
  const [releases, setReleases] = useState(() => {
    const cache = getStorageCache();
    const map = {};

    projects.forEach((proj) => {
      const url = proj.github || proj.link;
      const repo = getRepoFromUrl(url);
      if (!repo) return;

      if (cache[repo]) {
        const item = cache[repo];
        if (item.hasRelease && item.tag && item.url) {
          map[url] = { tag: item.tag, url: item.url };
        } else if (item.hasRelease === false) {
          map[url] = null;
        }
      } else if (DEFAULT_SEEDS[repo]) {
        map[url] = { tag: DEFAULT_SEEDS[repo].tag, url: DEFAULT_SEEDS[repo].url };
      } else if (proj.latestRelease) {
        map[url] = proj.latestRelease;
      }
    });

    return map;
  });

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    let isMounted = true;
    const cache = getStorageCache();
    const now = Date.now();

    const targets = [];
    projects.forEach((proj) => {
      const url = proj.github || proj.link;
      const repo = getRepoFromUrl(url);
      if (!repo) return;

      const cached = cache[repo];
      const isExpired = !cached || !cached.timestamp || (now - cached.timestamp > CACHE_TTL_MS);

      if (isExpired) {
        targets.push({ repo, url });
      }
    });

    if (targets.length === 0) return;

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        targets.map(async ({ repo, url }) => {
          try {
            const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
              headers: { Accept: 'application/vnd.github.v3+json' }
            });

            if (res.status === 200) {
              const data = await res.json();
              return {
                repo,
                url,
                hasRelease: true,
                tag: data.tag_name,
                releaseUrl: data.html_url
              };
            }

            if (res.status === 404) {
              return {
                repo,
                url,
                hasRelease: false,
                tag: null,
                releaseUrl: null
              };
            }

            // 403 or other: skip without breaking existing cache
            return null;
          } catch {
            return null;
          }
        })
      );

      if (!isMounted) return;

      let changed = false;
      const updates = {};

      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value) {
          const { repo, url, hasRelease, tag, releaseUrl } = r.value;
          cache[repo] = {
            hasRelease,
            tag,
            url: releaseUrl,
            timestamp: Date.now()
          };
          changed = true;

          if (hasRelease && tag && releaseUrl) {
            updates[url] = { tag, url: releaseUrl };
          } else if (!hasRelease) {
            updates[url] = null;
          }
        }
      });

      if (changed) {
        setStorageCache(cache);
        setReleases((prev) => ({
          ...prev,
          ...updates
        }));
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, [projects]);

  return releases;
};
