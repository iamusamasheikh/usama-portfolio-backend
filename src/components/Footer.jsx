import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Lock, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { data, setIsAdminOpen } = usePortfolio();
  const { contact } = data.identity;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      padding: '3.5rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {/* Left Brand info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src="./favicon.png" alt="Usama Sheikh Favicon" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>USAMA SHEIKH</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Digital Marketing Strategist & Web Developer
              </div>
            </div>
          </div>

          {/* Center Social Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <a href={contact.upwork} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
              Upwork Profile
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
              LinkedIn
            </a>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
              WhatsApp
            </a>
            <a href={`mailto:${contact.notificationEmail}`} style={{ color: 'var(--text-secondary)' }}>
              Email Usama
            </a>
          </div>

          {/* Right Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.82rem' }}
          >
            Back to Top <ArrowUp size={14} />
          </button>
        </div>

        {/* Bottom Minimal Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <p>
            © {new Date().getFullYear()} USAMA SHEIKH. ALL RIGHTS RESERVED. BUILT WITH PRECISION & CODE.
          </p>

          <button
            onClick={() => setIsAdminOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem'
            }}
          >
            <Lock size={12} /> Admin Dashboard Access
          </button>
        </div>
      </div>
    </footer>
  );
}
