import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon, Monitor, Award, Lock, Menu, X, PhoneCall, MessageSquare, Briefcase, UserCheck, Star, Layers, Home } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme, autoSystem, setSystemTheme } = useTheme();
  const { data, setIsAdminOpen } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo & Name */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} 
          onClick={() => scrollToSection('hero')}
        >
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid var(--accent-emerald)',
            boxShadow: '0 0 15px var(--glow-emerald)',
            flexShrink: 0
          }}>
            <img 
              src="./favicon.png" 
              alt="Usama Sheikh Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                USAMA SHEIKH
              </span>
              <span className="badge badge-gold header-badge" style={{ fontSize: '0.68rem', padding: '0.12rem 0.45rem' }}>
                <Award size={11} /> Top Rated
              </span>
            </div>
            <p className="header-subtitle" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
              Digital Marketing & Web Developer
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <a onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Home
          </a>
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Services
          </a>
          <a onClick={() => scrollToSection('portfolio')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Portfolio (80+)
          </a>
          <a onClick={() => scrollToSection('timeline')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            About
          </a>
          <a onClick={() => scrollToSection('testimonials')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Reviews
          </a>
          <a onClick={() => scrollToSection('contact')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Contact
          </a>
        </nav>

        {/* Right Actions: Theme Toggle, Consultation & Admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Switcher Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '50px',
            padding: '3px'
          }}>
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px 9px',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              {theme === 'dark' ? <Moon size={15} color="var(--accent-gold)" /> : <Sun size={15} color="var(--accent-gold)" />}
              <span className="theme-toggle-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              onClick={setSystemTheme}
              title="Sync with Device / OS Theme"
              className="theme-toggle-text"
              style={{
                background: autoSystem ? 'var(--glow-emerald)' : 'transparent',
                border: 'none',
                color: autoSystem ? 'var(--accent-emerald)' : 'var(--text-muted)',
                padding: '6px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Monitor size={14} />
            </button>
          </div>

          {/* Desktop Consultation CTA */}
          <button 
            className="btn btn-primary desktop-cta"
            onClick={() => scrollToSection('contact')}
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
          >
            <PhoneCall size={14} /> Consultation
          </button>

          {/* Admin Dashboard Quick Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            title="Open Content Admin Panel"
            className="desktop-admin-btn"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.55rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock size={15} />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'none',
              padding: '0.5rem',
              borderRadius: '10px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={20} color="var(--accent-emerald)" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.25rem 1.5rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 20px 30px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.25s ease-out'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <a onClick={() => scrollToSection('hero')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Home size={16} color="var(--accent-emerald)" /> Home
            </a>
            <a onClick={() => scrollToSection('services')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Layers size={16} color="var(--accent-cyan)" /> Services
            </a>
            <a onClick={() => scrollToSection('portfolio')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Briefcase size={16} color="var(--accent-blue)" /> Portfolio (80+)
            </a>
            <a onClick={() => scrollToSection('timeline')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <UserCheck size={16} color="var(--accent-purple)" /> About
            </a>
            <a onClick={() => scrollToSection('testimonials')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Star size={16} color="var(--accent-gold)" /> Reviews
            </a>
            <a onClick={() => scrollToSection('contact')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <MessageSquare size={16} color="var(--accent-emerald)" /> Contact
            </a>
          </div>

          {/* Mobile Action CTAs inside menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('contact')}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', justifyContent: 'center' }}
            >
              <PhoneCall size={16} /> Book Free Consultation
            </button>
            <a 
              href="https://wa.me/923007856880"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.88rem', justifyContent: 'center', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
            >
              💬 WhatsApp Chat (+92 300 7856880)
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .desktop-nav, .desktop-cta, .desktop-admin-btn { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        @media (max-width: 600px) {
          .header-subtitle { display: none !important; }
          .theme-toggle-text { display: none !important; }
        }

        @media (max-width: 420px) {
          .header-badge { display: none !important; }
        }
      `}</style>
    </header>
  );
}
