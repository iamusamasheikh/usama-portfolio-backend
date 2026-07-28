import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, CheckCircle2, Award, Globe, BarChart2, ShieldCheck } from 'lucide-react';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function ProjectModal() {
  const { activeProjectModal, setActiveProjectModal } = usePortfolio();

  if (!activeProjectModal) return null;

  const project = activeProjectModal;
  const isCampaignAd = project.image && (project.image.includes('./google ads') || project.image.includes('./Meta Ads') || project.image.includes('./seo') || project.image.includes('./tiktok ads'));
  const slug = slugify(project.title);
  const screenshotSrc = isCampaignAd ? project.image : `./screenshots/${slug}.jpg`;

  return (
    <div className="modal-overlay" onClick={() => setActiveProjectModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={() => setActiveProjectModal(null)} title="Close Modal">
          <X size={20} />
        </button>

        {/* Hero Browser Mockup Header */}
        <div className="browser-mockup" style={{ marginBottom: '1.75rem' }}>
          <div className="browser-header">
            <div className="browser-dots">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="browser-address">
              {project.url || `https://usamasheikh.com/case-study/${project.id}`}
            </div>
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
              >
                Visit Site <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div style={{ maxHeight: '350px', overflow: 'hidden', position: 'relative', background: '#090d16' }}>
            <img 
              src={screenshotSrc} 
              alt={project.title}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = './laptop_desk_mockup.png';
              }}
            />
          </div>
        </div>

        {/* Project Header & Badges */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge">{project.category}</span>
            <span className="badge badge-blue">{project.industry}</span>
            {project.tags && project.tags.map((tag, idx) => (
              <span key={idx} className="badge badge-gold">#{tag}</span>
            ))}
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {project.description}
          </p>
        </div>

        {/* Measurable Results Box */}
        {project.results && project.results.length > 0 && (
          <div style={{
            background: 'var(--glow-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
              <BarChart2 size={20} />
              <span>MEASURABLE RESULTS & IMPACT ACHIEVED:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
              {project.results.map((res, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy & Work Executed */}
        {project.workDone && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              Scope of Work & Strategy Executed:
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {project.workDone}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          {project.url && (
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Visit Live Website <ExternalLink size={16} />
            </a>
          )}
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveProjectModal(null)}
            style={{ padding: '0.85rem 1.5rem' }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
