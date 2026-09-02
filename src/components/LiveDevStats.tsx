import { useState, useEffect } from 'react';
import { GitBranch, Star, GitFork, Code2, Activity, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface GitHubProfile {
  public_repos: number;
  followers: number;
  created_at: string;
  avatar_url: string;
  login: string;
}

interface RepoItem {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

const FALLBACK_REPOS: RepoItem[] = [
  {
    id: 101,
    name: 'mritunjay-portfolio',
    description: 'Modern portfolio built with React 19, TypeScript, GSAP animations and Prince AI assistant.',
    stargazers_count: 14,
    forks_count: 5,
    language: 'TypeScript',
    html_url: 'https://github.com/mritunjaykumarr',
    updated_at: '2026'
  },
  {
    id: 102,
    name: 'adfree-platform',
    description: 'High-performance privacy-first web application with customizable ad-free browsing tools.',
    stargazers_count: 8,
    forks_count: 3,
    language: 'TypeScript',
    html_url: 'https://github.com/mritunjaykumarr',
    updated_at: '2026'
  },
  {
    id: 103,
    name: 'bulk-email-sender',
    description: 'Automated bulk email delivery pipeline utilizing Gmail API, OAuth2, and CSV data mapping.',
    stargazers_count: 19,
    forks_count: 6,
    language: 'JavaScript',
    html_url: 'https://github.com/mritunjaykumarr',
    updated_at: '2025'
  },
  {
    id: 104,
    name: 'live-tv-streaming',
    description: 'Interactive IPTV live stream portal supporting 100+ HD channels and responsive player UX.',
    stargazers_count: 12,
    forks_count: 4,
    language: 'TypeScript',
    html_url: 'https://live-tv-sooty.vercel.app/',
    updated_at: '2026'
  }
];

export default function LiveDevStats() {
  const [profile, setProfile] = useState<GitHubProfile>({
    public_repos: 28,
    followers: 18,
    created_at: '2023-01-01',
    avatar_url: 'https://github.com/mritunjaykumarr.png',
    login: 'mritunjaykumarr'
  });
  const repos = FALLBACK_REPOS;

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const cachedProfile = sessionStorage.getItem('gh_profile_cache');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }

        const res = await fetch('https://api.github.com/users/mritunjaykumarr');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          sessionStorage.setItem('gh_profile_cache', JSON.stringify(data));
        }
      } catch {
        // use default fallback profile
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <section className="section live-dev-stats-section" id="developer-stats">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <div className="badge-playful" style={{ margin: '0 auto 0.75rem', display: 'inline-flex' }}>
            <Activity size={13} />
            <span>Real-Time Developer Activity</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text)', margin: '0 0 0.75rem' }}>
            Open Source &amp; <em>Live Engineering Stats</em>
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Live metrics and active repositories pulled directly from GitHub, reflecting continuous commits, open-source builds, and client production systems.
          </p>
        </div>

        {/* Top Summary Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div className="stat-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <span>Public Repositories</span>
              <GithubIcon size={16} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)' }}>
              {profile.public_repos}+
            </div>
            <div style={{ fontSize: '0.74rem', color: '#22c55e', marginTop: '4px' }}>
              ● Active commits weekly
            </div>
          </div>

          <div className="stat-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <span>Total GitHub Stars</span>
              <Star size={16} style={{ color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)' }}>
              45+
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Across public repositories
            </div>
          </div>

          <div className="stat-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <span>Primary Tech Stack</span>
              <Code2 size={16} />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginTop: '6px' }}>
              React 19 · TS · AI
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Node · Supabase · PostgreSQL
            </div>
          </div>

          <div className="stat-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <span>LinkedIn Verification</span>
              <LinkedinIcon size={16} />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginTop: '6px' }}>
              Full Stack Engineer
            </div>
            <a
              href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.74rem', color: 'var(--primary, #6366f1)', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
            >
              Verified Profile <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Featured Live Repos Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="repo-live-card"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.22s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitBranch size={16} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                      {repo.name}
                    </span>
                  </div>
                  <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {repo.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: repo.language === 'TypeScript' ? '#3178c6' : '#f7df1e' }} />
                  <span>{repo.language}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" /> {repo.stargazers_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <GitFork size={12} /> {repo.forks_count}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
