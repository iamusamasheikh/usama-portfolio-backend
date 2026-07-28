import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, HeartPulse, Award, Layers, Gauge, Globe2 } from 'lucide-react';

export default function WhyUsama() {
  const { data, sectionStyles } = usePortfolio();
  const { whyUsama } = data;
  const whyStyle = sectionStyles?.whyUsama || {};

  const getIcon = (id) => {
    switch (id) {
      case '01': return <ShieldCheck size={26} color="var(--accent-emerald)" />;
      case '02': return <HeartPulse size={26} color="var(--accent-cyan)" />;
      case '03': return <Award size={26} color="var(--accent-gold)" />;
      case '04': return <Layers size={26} color="var(--accent-blue)" />;
      case '05': return <Gauge size={26} color="var(--accent-purple)" />;
      case '06': return <Globe2 size={26} color="var(--accent-emerald)" />;
      default: return <ShieldCheck size={26} />;
    }
  };

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            {whyStyle.badgeText || "WHY CHOOSE US"}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            {whyStyle.headingText || "Why Work With"} <span className="gradient-text">{whyStyle.gradientText || "Usama Sheikh?"}</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {whyStyle.subheadingText || "Direct communication, top-rated expertise, and guaranteed results."}
          </p>
        </div>

        {/* 6 Value Props Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {whyUsama.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {getIcon(item.id)}
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--border-highlight)', fontFamily: 'var(--font-code)' }}>
                  {item.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
