import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Layout, ShoppingBag, Search, BarChart3, Layers, Edit3, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

export default function Services() {
  const { data, sectionStyles } = usePortfolio();
  const { services } = data;
  const servStyles = sectionStyles?.services || {};
  const [activeTab, setActiveTab] = useState('all');

  const getServiceIcon = (id) => {
    switch (id) {
      case 'wordpress-dev': return <Layout size={24} color="var(--accent-emerald)" />;
      case 'shopify-dev': return <ShoppingBag size={24} color="var(--accent-cyan)" />;
      case 'advanced-seo': return <Search size={24} color="var(--accent-blue)" />;
      case 'digital-marketing': return <BarChart3 size={24} color="var(--accent-purple)" />;
      case 'ecommerce-solutions': return <Layers size={24} color="var(--accent-gold)" />;
      case 'content-strategy': return <Edit3 size={24} color="var(--accent-emerald)" />;
      default: return <Layout size={24} />;
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
            {servStyles.badgeText || "OUR SPECIALIZATIONS"}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            {servStyles.headingText || "Six Core Services That"} <span className="gradient-text">{servStyles.gradientText || "Compound Growth"}</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {servStyles.subheadingText || "Development builds the foundation. Marketing builds the machine. Together they compound with your tech stack to ship organic traffic and sales on autopilot."}
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((service) => (
            <div key={service.id} className="glass-panel" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                {/* Header Icon & Category */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="badge" style={{ fontSize: '0.75rem' }}>
                    {service.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.85rem' }}>
                  "{service.tagline}"
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                {/* Features List */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem', letterSpacing: '0.05em' }}>
                    KEY DELIVERABLES:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {service.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        <CheckCircle2 size={14} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Tech Tags & CTA */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {service.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={{
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.5rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={scrollToContact}
                  style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1.25rem', fontSize: '0.88rem' }}
                >
                  <span>Book This Service</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
