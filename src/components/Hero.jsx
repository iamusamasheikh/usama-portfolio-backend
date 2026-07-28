import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, CheckCircle, ArrowUpRight, Globe, ShieldCheck, Sparkles, Zap, Star } from 'lucide-react';

export default function Hero() {
  const { data, sectionStyles } = usePortfolio();
  const { identity } = data;
  const heroStyle = sectionStyles?.hero || {};

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      padding: '5rem 0 3.5rem 0',
      overflow: 'hidden'
    }}>
      {/* Ambient background glow shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--glow-emerald) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, var(--glow-blue) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '3.5rem',
          alignItems: 'center'
        }} className="hero-grid">
          
          {/* Left Column: Text & CTAs */}
          <div>
            {/* Top Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-gold">
                <Award size={14} /> {heroStyle.badgeText || "Upwork Top Rated Freelancer"}
              </span>
              <span className="badge">
                <Sparkles size={14} /> 7+ Years Experience
              </span>
              <span className="badge badge-blue">
                <CheckCircle size={14} /> 100% Client Satisfaction
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}>
              {heroStyle.titleLine1 || "Digital Marketing Strategist &"} <span className="gradient-text">{heroStyle.titleGradient || "Web Developer"}</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.75rem',
              maxWidth: '650px'
            }}>
              {heroStyle.subheading || identity.tagline}
            </p>

            {/* Core Strengths Checklist */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.6rem 1.25rem',
              marginBottom: '2.25rem'
            }}>
              {identity.strengths.slice(0, 4).map((strength, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  <ShieldCheck size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <span>{strength}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => scrollToSection('contact')}
                style={{ padding: '0.95rem 2.2rem', fontSize: '1rem' }}
              >
                {heroStyle.primaryCtaText || "Get Free Consultation"} <ArrowUpRight size={18} />
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('portfolio')}
                style={{ padding: '0.95rem 1.8rem', fontSize: '1rem' }}
              >
                {heroStyle.secondaryCtaText || "Explore 80+ Live Projects"}
              </button>
            </div>

            {/* Global Reach Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <Globe size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                GLOBAL CLIENTELE:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {identity.globalReach.map((country, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.8rem',
                    padding: '0.15rem 0.6rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)'
                  }}>
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Usama Sheikh Photo & Floating Badges */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              borderRadius: '24px',
              padding: '8px',
              background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-cyan) 50%, var(--accent-blue) 100%)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}>
                <img 
                  src={heroStyle.profileImage || "./usama-real.png"} 
                  alt="Usama Sheikh"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'; }}
                />
              </div>

              {/* Floating Badge: Live Status */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                zIndex: 2
              }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981'
                }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Available for Projects
                </span>
              </div>

              {/* Floating Stat Card: 80+ Projects */}
              <div className="glass-panel" style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                zIndex: 2
              }}>
                <div style={{
                  background: 'var(--glow-emerald)',
                  color: 'var(--accent-emerald)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>80+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivered Work</div>
                </div>
              </div>

              {/* Floating Stat Card: 5-Star Reviews */}
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '40%',
                right: '-30px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                zIndex: 2
              }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  <Star size={14} fill="#f59e0b" />
                  <Star size={14} fill="#f59e0b" />
                  <Star size={14} fill="#f59e0b" />
                  <Star size={14} fill="#f59e0b" />
                  <Star size={14} fill="#f59e0b" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>5.0 Upwork Rating</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
