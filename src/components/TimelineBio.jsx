import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, CheckCircle2, User, Award } from 'lucide-react';

export default function TimelineBio() {
  const { data, sectionStyles } = usePortfolio();
  const { identity, timeline } = data;
  const timeStyle = sectionStyles?.timeline || {};

  const skills = [
    { name: "WordPress & Elementor Pro", level: 95 },
    { name: "Technical SEO & Topical Authority", level: 95 },
    { name: "Google Ads & PPC Strategy", level: 90 },
    { name: "Meta (Facebook/IG) & TikTok Ads", level: 88 },
    { name: "Shopify Store & Liquid Development", level: 90 },
    { name: "GA4, GSC & Data Analytics", level: 92 },
    { name: "Page Speed & Core Web Vitals (Green)", level: 95 }
  ];

  return (
    <section id="timeline" className="section-padding">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem'
        }} className="timeline-grid">
          
          {/* Left Column: Bio & Skills */}
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              {timeStyle.badgeText || "ABOUT & JOURNEY"}
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1.25rem' }}>
              {timeStyle.headingText || "7+ Years of"} <span className="gradient-text">{timeStyle.gradientText || "Proven Industry Impact"}</span>
            </h2>
            
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {timeStyle.bioText || identity.longBio}
            </p>

            {/* Skill Bars */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
              Technical & Strategy Proficiency
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{skill.name}</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>{skill.level}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    borderRadius: '50px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${skill.level}%`,
                      background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)',
                      borderRadius: '50px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Career Timeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <Briefcase size={22} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.6rem' }}>
                7+ Years Career Journey (2018 - 2025)
              </h3>
            </div>

            <div style={{
              position: 'relative',
              paddingLeft: '1.75rem',
              borderLeft: '2px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              {timeline.map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-2.35rem',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    border: '3px solid var(--accent-emerald)',
                    boxShadow: '0 0 10px var(--glow-emerald)'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="badge" style={{ fontSize: '0.75rem', padding: '0.15rem 0.6rem' }}>
                      <Calendar size={12} /> {item.year}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      {item.milestone}
                    </h4>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
