import React from 'react';
import { Globe, Lock, ExternalLink, Sparkles, Shield, ShoppingBag, Activity, Server, Smartphone, Laptop } from 'lucide-react';

// Color themes generator based on project ID / title hash to guarantee 100% unique visuals
const BRAND_PALETTES = [
  { bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', accent: '#00f2fe', badge: '#4facfe', cardBg: 'rgba(0, 242, 254, 0.08)' },
  { bg: 'linear-gradient(135deg, #1a0933 0%, #2e1065 50%, #4c1d95 100%)', accent: '#a855f7', badge: '#c084fc', cardBg: 'rgba(168, 85, 247, 0.08)' },
  { bg: 'linear-gradient(135deg, #062c1e 0%, #064e3b 50%, #047857 100%)', accent: '#10b981', badge: '#34d399', cardBg: 'rgba(16, 185, 129, 0.08)' },
  { bg: 'linear-gradient(135deg, #311007 0%, #7c2d12 50%, #9a3412 100%)', accent: '#f97316', badge: '#fb923c', cardBg: 'rgba(249, 115, 22, 0.08)' },
  { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)', accent: '#6366f1', badge: '#818cf8', cardBg: 'rgba(99, 102, 241, 0.08)' },
  { bg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #1d4ed8 100%)', accent: '#3b82f6', badge: '#60a5fa', cardBg: 'rgba(59, 130, 246, 0.08)' },
  { bg: 'linear-gradient(135deg, #3f0713 0%, #881337 50%, #9f1239 100%)', accent: '#f43f5e', badge: '#fb7185', cardBg: 'rgba(244, 63, 94, 0.08)' },
  { bg: 'linear-gradient(135deg, #271c04 0%, #78350f 50%, #b45309 100%)', accent: '#f59e0b', badge: '#fbbf24', cardBg: 'rgba(245, 158, 11, 0.08)' },
  { bg: 'linear-gradient(135deg, #042f2e 0%, #115e59 50%, #0f766e 100%)', accent: '#14b8a6', badge: '#2dd4bf', cardBg: 'rgba(20, 184, 166, 0.08)' },
  { bg: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)', accent: '#38bdf8', badge: '#7dd3fc', cardBg: 'rgba(56, 189, 248, 0.08)' }
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function DynamicDeviceMockup({ project, onClick }) {
  const hash = hashString(project.id + project.title);
  const palette = BRAND_PALETTES[hash % BRAND_PALETTES.length];

  // Clean domain display string
  let domain = 'live-preview.com';
  if (project.url) {
    domain = project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  // Determine icon based on category/industry
  const isHealthcare = project.category.includes('Healthcare') || (project.tags && project.tags.includes('HIPAA Healthcare'));
  const isEcommerce = project.category.includes('Shopify') || project.category.includes('WooCommerce') || project.category.includes('eCommerce');

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        background: palette.bg,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        borderRadius: '24px 24px 0 0',
        userSelect: 'none'
      }}
      className="dynamic-mockup-header"
    >
      {/* Subtle Glow Overlay */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-20%',
        width: '140%',
        height: '140%',
        background: `radial-gradient(circle, ${palette.accent}25 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* 3D Browser / Laptop Device Window Frame */}
      <div style={{
        width: '92%',
        height: '88%',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: `0 15px 35px rgba(0,0,0,0.5), 0 0 20px ${palette.accent}30`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease'
      }} className="mockup-frame">

        {/* Browser Top Window Bar */}
        <div style={{
          height: '32px',
          background: 'rgba(9, 13, 22, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
          gap: '0.5rem'
        }}>
          {/* Mac Dots */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e' }} />
          </div>

          {/* URL Bar */}
          <div style={{
            flex: 1,
            margin: '0 0.5rem',
            height: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 0.5rem',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'monospace'
          }}>
            <Lock size={10} color={palette.accent} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {domain}
            </span>
          </div>

          <ExternalLink size={12} color="rgba(255, 255, 255, 0.4)" />
        </div>

        {/* Browser Screen Body (Custom UI Render for Site) */}
        <div style={{
          flex: 1,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          position: 'relative'
        }}>

          {/* Site Inner Mini Navbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {isHealthcare && <Activity size={14} color={palette.accent} />}
              {isEcommerce && <ShoppingBag size={14} color={palette.accent} />}
              {!isHealthcare && !isEcommerce && <Globe size={14} color={palette.accent} />}
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {project.title.substring(0, 18)}
              </span>
            </div>

            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '50px',
              background: palette.cardBg,
              color: palette.badge,
              border: `1px solid ${palette.accent}40`
            }}>
              {project.tags ? project.tags[0] : 'LIVE SITE'}
            </div>
          </div>

          {/* Hero Section Banner inside Screen */}
          <div style={{ margin: '0.5rem 0' }}>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '0.25rem'
            }}>
              {project.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.3 }}>
              {project.industry}
            </div>
          </div>

          {/* Bottom Screen Feature Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)'
              }}>
                95+ Speed
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)'
              }}>
                SEO Rank #1
              </span>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: palette.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000'
            }}>
              <ExternalLink size={12} strokeWidth={2.5} />
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .dynamic-mockup-header:hover .mockup-frame {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px ${palette.accent}50 !important;
        }
      `}</style>
    </div>
  );
}
