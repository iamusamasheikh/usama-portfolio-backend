import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sliders, ShieldCheck, Clock, Headphones, Check, Send, Sparkles } from 'lucide-react';

export default function BudgetEstimator() {
  const { applyEstimateToForm } = usePortfolio();

  // 1. Usama Sheikh's Actual Service Project Types
  const projectTypes = [
    { id: 'wordpress', label: 'WordPress Website', basePrice: 450, baseDays: 7, icon: '🌐' },
    { id: 'shopify', label: 'Shopify eCommerce Store', basePrice: 650, baseDays: 10, icon: '🛒' },
    { id: 'marketing', label: 'Google & Social Media Ads', basePrice: 500, baseDays: 5, icon: '🎯' },
    { id: 'healthcare', label: 'Healthcare & Medical Site', basePrice: 800, baseDays: 12, icon: '🏥' }
  ];

  // 2. Usama Sheikh's Actual Service Add-ons
  const availableFeatures = [
    { id: 'seo', label: 'Advanced Technical SEO & Topical Mapping', price: 200, days: 3, icon: '🔍' },
    { id: 'ads_setup', label: 'Google Ads & Meta Ads Campaign Setup', price: 250, days: 3, icon: '📈' },
    { id: 'speed', label: '95+ Speed & Core Web Vitals Optimization', price: 150, days: 1, icon: '⚡' },
    { id: 'content', label: 'Topical Content Clusters & Copywriting', price: 180, days: 2, icon: '✒️' },
    { id: 'multivendor', label: 'Multi-Vendor Marketplace (Dokan/WCFM)', price: 350, days: 5, icon: '🏬' }
  ];

  const [selectedType, setSelectedType] = useState('wordpress');
  const [selectedFeatures, setSelectedFeatures] = useState(['seo', 'speed']);

  // Calculate totals
  const currentType = projectTypes.find(t => t.id === selectedType) || projectTypes[0];
  const selectedFeatureObjects = selectedFeatures.map(id => availableFeatures.find(f => f.id === id)).filter(Boolean);

  const featuresTotal = selectedFeatureObjects.reduce((acc, feat) => acc + feat.price, 0);
  const daysTotal = selectedFeatureObjects.reduce((acc, feat) => acc + feat.days, currentType.baseDays);
  const totalPrice = currentType.basePrice + featuresTotal;

  const toggleFeature = (featId) => {
    if (selectedFeatures.includes(featId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featId));
    } else {
      setSelectedFeatures([...selectedFeatures, featId]);
    }
  };

  const handleBookEstimate = () => {
    applyEstimateToForm({
      typeId: currentType.id,
      typeLabel: currentType.label,
      basePrice: currentType.basePrice,
      baseDays: currentType.baseDays,
      features: selectedFeatureObjects.map(f => ({ label: f.label, price: f.price, days: f.days })),
      totalPrice,
      totalDays: daysTotal
    });
  };

  return (
    <section id="estimator" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Main Glass Card (Customized to Usama Sheikh's 6 Core Services) */}
        <div className="glass-panel" style={{
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          borderRadius: '24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '0.95fr 1.05fr',
            gap: '3rem',
            alignItems: 'center'
          }} className="estimator-grid">
            
            {/* Left Side: Guarantees & Title */}
            <div>
              <div className="badge badge-purple" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1rem',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--accent-purple)',
                padding: '0.35rem 0.85rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                <Sliders size={14} /> INTERACTIVE TOOL
              </div>

              <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
                Instant Service Budget <span className="gradient-text">Estimator</span>
              </h2>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Select your required development & digital marketing specifications to calculate an instant cost and time estimate.
              </p>

              {/* Guarantees List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--glow-emerald)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                  <span>100% Satisfaction Guarantee (Demo First, Pay Later)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--glow-blue)',
                    color: 'var(--accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Clock size={18} />
                  </div>
                  <span>On-Time Milestone Delivery</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Headphones size={18} />
                  </div>
                  <span>Free 30-Day Post-Launch Support</span>
                </div>
              </div>
            </div>

            {/* Right Side: Usama Sheikh Services & Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* 1. Choose Core Service */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                  1. Choose Core Service:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem'
                }} className="type-buttons-grid">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '2px solid',
                        borderColor: selectedType === type.id ? 'var(--accent-purple)' : 'var(--border-color)',
                        background: selectedType === type.id ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-secondary)',
                        color: selectedType === type.id ? 'var(--accent-purple)' : 'var(--text-primary)'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Add Extra Features & Growth Add-ons */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                  2. Add Growth Add-ons:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem'
                }} className="feature-buttons-grid">
                  {availableFeatures.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          border: '2px solid',
                          borderColor: isChecked ? 'var(--accent-emerald)' : 'var(--border-color)',
                          background: isChecked ? 'var(--glow-emerald)' : 'var(--bg-secondary)',
                          color: isChecked ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: isChecked ? 'var(--accent-emerald)' : 'transparent',
                          border: `1.5px solid ${isChecked ? 'var(--accent-emerald)' : 'var(--text-muted)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>{feat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output Display Box: Cost & Days */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Estimated Investment:
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1.1 }}>
                    ${totalPrice}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Estimated Delivery:
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {daysTotal} Days
                  </div>
                </div>
              </div>

              {/* Gradient CTA Button */}
              <button
                onClick={handleBookEstimate}
                className="btn"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                  justifyContent: 'center'
                }}
              >
                <Send size={18} /> Book Project with This Estimate (${totalPrice})
              </button>

            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .estimator-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .type-buttons-grid, .feature-buttons-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
