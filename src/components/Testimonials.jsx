import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Star, Quote, Award } from 'lucide-react';

export default function Testimonials() {
  const { data, sectionStyles } = usePortfolio();
  const { testimonials } = data;
  const testStyle = sectionStyles?.testimonials || {};

  return (
    <section id="testimonials" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            <Award size={14} /> {testStyle.badgeText || "100% VERIFIED REVIEWS"}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            {testStyle.headingText || "Trusted by Founders &"} <span className="gradient-text">{testStyle.gradientText || "Business Leaders Globally"}</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {testStyle.subheadingText || "Real feedback from clients across USA, Canada, UK, Germany, and UAE."}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <Quote size={40} color="var(--border-highlight)" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.3 }} />

              <div>
                {/* 5-Star Rating */}
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1.25rem' }}>
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                </div>

                <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-emerald)'
                  }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'; }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {item.role} · <span style={{ color: 'var(--accent-cyan)' }}>{item.project}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
