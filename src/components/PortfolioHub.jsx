import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Search, ExternalLink, Eye, CheckCircle2, Lock } from 'lucide-react';
import DynamicDeviceMockup from './DynamicDeviceMockup';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function ProjectCardHeader({ project, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isCampaignAd = project.image && (project.image.includes('./google ads') || project.image.includes('./Meta Ads') || project.image.includes('./seo') || project.image.includes('./tiktok ads'));
  const slug = slugify(project.title);
  const screenshotSrc = isCampaignAd ? project.image : `./screenshots/${slug}.jpg`;
  const domain = project.url ? project.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'live-website.com';

  if (imgFailed) {
    return <DynamicDeviceMockup project={project} onClick={onClick} />;
  }

  return (
    <div 
      style={{
        height: '240px',
        overflow: 'hidden',
        position: 'relative',
        background: '#090d16',
        cursor: 'pointer',
        borderRadius: '24px 24px 0 0'
      }}
      onClick={onClick}
    >
      {/* Browser Top Address Bar */}
      {project.url && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          height: '32px',
          background: 'rgba(9, 13, 22, 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{
            flex: 1,
            margin: '0 0.25rem',
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 600,
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <Lock size={10} color="#10b981" />
            <span>{domain}</span>
          </div>
          <ExternalLink size={12} color="rgba(255, 255, 255, 0.5)" />
        </div>
      )}

      {/* REAL Live Website Screenshot Image */}
      <img
        src={screenshotSrc}
        alt={project.title}
        style={{
          width: '100%',
          height: '100%',
          paddingTop: project.url ? '32px' : '0',
          objectFit: 'cover',
          objectPosition: 'top center',
          transition: 'transform 0.5s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        onError={() => setImgFailed(true)}
      />

      {/* Hover Action Blur Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.25s ease'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0'}
      >
        <span className="btn btn-primary" style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}>
          <Eye size={16} /> View Case Study & Live URL
        </span>
      </div>
    </div>
  );
}

export default function PortfolioHub() {
  const { data, setActiveProjectModal } = usePortfolio();
  const { projects } = data;

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = [
    'All',
    'Web Development',
    'Shopify eCommerce',
    'Google Ads',
    'Meta & TikTok Ads',
    'SEO Case Studies',
    'Healthcare'
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Category Filter
      let matchesCat = true;
      if (activeCategory === 'Web Development') {
        matchesCat = p.category.includes('Web Development') || p.category.includes('WORDPRESS') || p.category.includes('CUSTOM WEB APP') || p.category.includes('CORPORATE') || p.category.includes('SERVICES PORTAL') || p.category.includes('LANDING PAGE');
      } else if (activeCategory === 'Shopify eCommerce') {
        matchesCat = p.category.includes('SHOPIFY') || p.category.includes('WOOCOMMERCE') || p.category.includes('eCommerce');
      } else if (activeCategory === 'Google Ads') {
        matchesCat = p.category.includes('GOOGLE ADS');
      } else if (activeCategory === 'Meta & TikTok Ads') {
        matchesCat = p.category.includes('META') || p.category.includes('TikTok') || p.category.includes('Social');
      } else if (activeCategory === 'SEO Case Studies') {
        matchesCat = p.category.includes('SEO');
      } else if (activeCategory === 'Healthcare') {
        matchesCat = p.category.includes('HEALTHCARE') || p.category.includes('MEDSPA') || (p.tags && p.tags.includes('HIPAA Healthcare'));
      }

      // Search Filter
      const q = searchQuery.toLowerCase().trim();
      let matchesQuery = true;
      if (q) {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        const indMatch = p.industry && p.industry.toLowerCase().includes(q);
        const urlMatch = p.url && p.url.toLowerCase().includes(q);
        matchesQuery = titleMatch || descMatch || tagMatch || indMatch || urlMatch;
      }

      return matchesCat && matchesQuery;
    });
  }, [projects, activeCategory, searchQuery]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(9);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(9);
  };

  return (
    <section id="portfolio" className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            PROVEN TRACK RECORD ({projects.length}+ DELIVERED)
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
            Featured Live Work & <span className="gradient-text">High-ROI Campaigns</span>
          </h2>
          <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)' }}>
            Click on any project to inspect full case study details, strategy executed, and verified live performance metrics (ROAS, Google Rankings & PageSpeed).
          </p>
        </div>

        {/* Filter Bar & Live Search */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            justifyContent: 'center'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  padding: '0.7rem 1.35rem',
                  borderRadius: '50px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--accent-emerald)' : 'var(--border-color)',
                  background: activeCategory === cat ? 'var(--glow-emerald)' : 'var(--bg-card)',
                  color: activeCategory === cat ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                  boxShadow: activeCategory === cat ? '0 0 15px var(--glow-emerald)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat} {cat === 'All' ? `(${projects.length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{
            maxWidth: '550px',
            margin: '0 auto',
            width: '100%',
            position: 'relative'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by site name, link, or tag (e.g., sufyanafzaal, NYC, Shopify, Google Ads)..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 3rem',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>

        {/* Portfolio Cards Grid (REAL Live Website Screenshots in Browser Window Frame) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '2.25rem'
        }}>
          {displayedProjects.map((project) => {
            return (
              <div key={project.id} className="glass-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                padding: '0',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                
                {/* Browser Frame Header with Real Live Website Screenshot / Dynamic Fallback */}
                <ProjectCardHeader project={project} onClick={() => setActiveProjectModal(project)} />

                {/* Card Content Body */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Category Badge in Uppercase Accent */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-cyan)',
                      marginBottom: '0.6rem'
                    }}>
                      {project.category}
                    </div>

                    {/* Bold Card Title */}
                    <h3 
                      style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.6rem', cursor: 'pointer', lineHeight: 1.25 }}
                      onClick={() => setActiveProjectModal(project)}
                    >
                      {project.title}
                    </h3>

                    {/* Description Copy */}
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                      {project.description.length > 115 ? project.description.substring(0, 115) + '...' : project.description}
                    </p>

                    {/* Measurable Results Badge */}
                    {project.results && project.results.length > 0 && (
                      <div style={{
                        background: 'var(--glow-emerald)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--accent-emerald)'
                      }}>
                        <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                        <span>{project.results[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Tags Pills & CTAs */}
                  <div>
                    {/* Subtle Light Tags Pills */}
                    {project.tags && project.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {project.tags.map((tag, tIdx) => (
                          <span key={tIdx} style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            padding: '0.3rem 0.8rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50px',
                            color: 'var(--text-secondary)'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Action CTAs */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setActiveProjectModal(project)}
                        style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem', justifyContent: 'center' }}
                      >
                        <Eye size={15} /> Case Study
                      </button>

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem' }}
                          title="Open Live Website in New Tab"
                        >
                          Live Site <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Load More Projects Button */}
        {visibleCount < filteredProjects.length && (
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '1rem',
                borderRadius: '50px',
                boxShadow: '0 0 25px var(--glow-emerald)',
                cursor: 'pointer'
              }}
            >
              Load More Projects (+9) — Showing {displayedProjects.length} of {filteredProjects.length}
            </button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No projects match your current search.</p>
            <button className="btn btn-secondary" onClick={() => { handleCategorySelect('All'); setSearchQuery(''); }}>
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
