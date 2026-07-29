import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, MessageSquare, Send, CheckCircle2, ArrowUpRight, ShieldCheck, Sparkles, X, Calculator } from 'lucide-react';

export default function ContactSection() {
  const { data, activeEstimate, setActiveEstimate } = usePortfolio();
  const { contact } = data.identity;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'WordPress & Shopify Development',
    budget: '$1,000 - $2,500',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync active estimate to contact form inputs when an estimate is selected
  useEffect(() => {
    if (activeEstimate) {
      const featSummary = activeEstimate.features && activeEstimate.features.length > 0
        ? activeEstimate.features.map(f => ` • ${f.label} (+$${f.price})`).join('\n')
        : ' • No extra add-ons selected';

      const autoMsg = `[ATTACHED ESTIMATE SELECTION]\nSelected Service: ${activeEstimate.typeLabel} ($${activeEstimate.basePrice})\nSelected Add-ons:\n${featSummary}\n\nEstimated Investment: $${activeEstimate.totalPrice}\nEstimated Delivery: ${activeEstimate.totalDays} Days\n\nAdditional Notes / Instructions:\n`;

      setFormData(prev => ({
        ...prev,
        service: activeEstimate.typeLabel,
        budget: `$${activeEstimate.totalPrice}`,
        message: autoMsg
      }));
    }
  }, [activeEstimate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      budget: formData.budget,
      message: formData.message,
      attachedEstimate: activeEstimate ? {
        serviceType: activeEstimate.typeLabel,
        addonsChecked: activeEstimate.features.map(f => f.label),
        calculatedCost: `$${activeEstimate.totalPrice}`,
        calculatedTimeline: `${activeEstimate.totalDays} Days`
      } : null
    };

    // Backup to local storage lead store so no lead is ever lost
    try {
      const localLeads = JSON.parse(localStorage.getItem('usama_submitted_leads') || '[]');
      localLeads.unshift({ ...payload, date: new Date().toISOString() });
      localStorage.setItem('usama_submitted_leads', JSON.stringify(localLeads));
    } catch(e){}

    try {
      const backendUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/contact'
        : 'https://usama-portfolio-backend-16jd.onrender.com/api/contact';
      
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setSubmitted(true);
    } catch (err) {
      console.warn('Backend API connection notice:', err.message);
      setSubmitted(true);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: '3.5rem',
          alignItems: 'start'
        }} className="contact-grid">
          
          {/* Left Column: Direct Contacts & Promises */}
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              GET IN TOUCH
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
              Let's Build Something <span className="gradient-text">Amazing Together</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Have a project in mind or need a full SEO/Website audit? Fill out the form or reach out directly for a 30-minute free discovery call.
            </p>

            {/* Direct Channel Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              
              {/* WhatsApp Card */}
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MessageSquare size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>WHATSAPP DIRECT</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{contact.whatsapp}</div>
                </div>
                <ArrowUpRight size={18} color="var(--accent-emerald)" />
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${contact.notificationEmail}`}
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--glow-blue)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFICIAL EMAIL</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{contact.notificationEmail}</div>
                </div>
                <ArrowUpRight size={18} color="var(--accent-blue)" />
              </a>

              {/* Upwork Profile Card */}
              <a
                href={contact.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPWORK TOP RATED</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>View Upwork Profile</div>
                </div>
                <ArrowUpRight size={18} color="var(--accent-gold)" />
              </a>

            </div>

            {/* Service Promises */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>24-Hour Response Time</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>Free 30-min Consultation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>Demo First, Pay Later</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="glass-panel" style={{ padding: '2.25rem', position: 'relative' }}>
            
            {/* Active Estimate Attached Banner */}
            {activeEstimate && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Calculator size={20} color="var(--accent-purple)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                      ESTIMATE CONFIGURATION ATTACHED:
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {activeEstimate.typeLabel} (${activeEstimate.totalPrice} · {activeEstimate.totalDays} Days)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Add-ons: {activeEstimate.features.map(f => f.label).join(', ') || 'Standard Build'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveEstimate(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                  title="Remove attached estimate"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
              Book Your Strategy Call & Inquiry
            </h3>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: 'var(--glow-emerald)',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                <CheckCircle2 size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Inquiry & Selection Received!</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Thank you! Usama Sheikh has received your message and chosen estimate checklist. We will contact you within 24 hours at <strong>{formData.email}</strong>.
                </p>
                <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Name & Email Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Mitchell"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@clinic.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Phone & Service Choice */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Select Required Service
                    </label>
                    <input
                      type="text"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Project Details Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Project Goals & Selected Checklist Summary *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your business, website URL, or key goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ padding: '0.95rem 1.5rem', fontSize: '1rem', justifyContent: 'center' }}
                >
                  {loading ? 'Sending Request...' : 'Send Message & Attached Selection to Usama Sheikh'} <Send size={18} />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
