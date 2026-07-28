import React, { useState, useEffect } from 'react';
import { usePortfolio, DEFAULT_SECTION_STYLES } from '../context/PortfolioContext';
import { X, Lock, Save, Plus, Trash2, Edit3, Download, RefreshCw, CheckCircle2, ShieldAlert, Inbox, Mail, Phone, Calendar, DollarSign, Code, Layout, Sparkles, User, Image, FileText, Settings, Layers, Star, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    data, 
    sectionStyles, 
    updateSectionStyles, 
    scriptsConfig, 
    updateScriptsConfig, 
    updateIdentity, 
    addProject, 
    deleteProject, 
    resetToDefault, 
    isAdminOpen, 
    setIsAdminOpen 
  } = usePortfolio();

  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('leads');
  const [activeElementorSection, setActiveElementorSection] = useState('hero');

  // Local Form States
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Helper to deep merge default values so no input is ever empty
  const getMergedStyles = (custom) => ({
    hero: { ...DEFAULT_SECTION_STYLES.hero, ...(custom?.hero || {}) },
    stats: { ...DEFAULT_SECTION_STYLES.stats, ...(custom?.stats || {}) },
    services: { ...DEFAULT_SECTION_STYLES.services, ...(custom?.services || {}) },
    whyUsama: { ...DEFAULT_SECTION_STYLES.whyUsama, ...(custom?.whyUsama || {}) },
    timeline: { ...DEFAULT_SECTION_STYLES.timeline, ...(custom?.timeline || {}) },
    testimonials: { ...DEFAULT_SECTION_STYLES.testimonials, ...(custom?.testimonials || {}) },
    contact: { ...DEFAULT_SECTION_STYLES.contact, ...(custom?.contact || {}) }
  });

  const [stylesForm, setStylesForm] = useState(() => getMergedStyles(sectionStyles));
  const [scriptsForm, setScriptsForm] = useState(scriptsConfig || {});
  const [identityForm, setIdentityForm] = useState(data.identity);

  const [newProj, setNewProj] = useState({
    title: '',
    category: 'WordPress & Shopify',
    industry: 'Healthcare / E-Commerce',
    url: '',
    description: '',
    image: '',
    results: ''
  });

  // Sync state when context settings load
  useEffect(() => {
    if (sectionStyles) {
      setStylesForm(getMergedStyles(sectionStyles));
    }
  }, [sectionStyles]);

  useEffect(() => {
    if (scriptsConfig) setScriptsForm(scriptsConfig);
  }, [scriptsConfig]);

  // Fetch leads from backend API
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('http://localhost:5000/api/leads');
      const json = await res.json();
      if (json.success) {
        setLeads(json.leads || []);
      }
    } catch (e) {
      console.warn('Leads fetch warning:', e.message);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchLeads();
    }
  }, [authenticated]);

  const deleteLead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (e) {
      console.warn('Error deleting lead:', e);
    }
  };

  if (!isAdminOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '@U7856880300a') {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveStyles = (e) => {
    e.preventDefault();
    updateSectionStyles(stylesForm);
    alert('🎨 Full Page Elementor Styles & Content updated successfully across portfolio!');
  };

  const handleSaveScripts = (e) => {
    e.preventDefault();
    updateScriptsConfig(scriptsForm);
    alert('📊 Tracking Scripts & Meta Tags saved! Active across live website.');
  };

  const handleSaveIdentity = (e) => {
    e.preventDefault();
    updateIdentity(identityForm);
    alert('Branding & Contact info updated successfully!');
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProj.title) return;
    addProject({
      ...newProj,
      results: newProj.results ? newProj.results.split(',').map(r => r.trim()) : ['High performance build']
    });
    setNewProj({
      title: '',
      category: 'WordPress & Shopify',
      industry: 'Healthcare / E-Commerce',
      url: '',
      description: '',
      image: '',
      results: ''
    });
    alert('New project added to live portfolio!');
  };

  const exportJSON = () => {
    const backupObj = {
      identity: data.identity,
      projects: data.projects,
      sectionStyles: stylesForm,
      scriptsConfig: scriptsForm
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "usama_portfolio_full_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const updateSectionField = (section, field, value) => {
    setStylesForm(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '1100px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'var(--glow-emerald)', color: 'var(--accent-emerald)', padding: '0.5rem', borderRadius: '10px' }}>
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Usama Sheikh Control Center</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Page Elementor Editor, Image Manager, Leads & Tracking Codes</p>
            </div>
          </div>

          <button className="modal-close" onClick={() => setIsAdminOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {!authenticated ? (
          /* PIN Security Screen */
          <div style={{ maxWidth: '400px', margin: '3rem auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Enter Admin PIN</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Enter secret security passcode to access Control Center
            </p>

            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                placeholder="Enter PIN..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
              />

              {pinError && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Incorrect PIN passcode. Access denied.
                </p>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div>
            {/* Main Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setActiveTab('leads'); fetchLeads(); }}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Inbox size={15} /> Leads Inbox ({leads.length})
              </button>
              
              <button
                className={`btn ${activeTab === 'style-customizer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('style-customizer')}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Layout size={15} /> Full Page Elementor Editor
              </button>

              <button
                className={`btn ${activeTab === 'scripts' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('scripts')}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Code size={15} /> Tracking Codes & Scripts
              </button>

              <button
                className={`btn ${activeTab === 'identity' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('identity')}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                Branding Info
              </button>

              <button
                className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('projects')}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                Manage Portfolio ({data.projects.length})
              </button>

              <button
                className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('export')}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
              >
                Backup
              </button>
            </div>

            {/* TAB 0: Client Leads Inbox */}
            {activeTab === 'leads' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Incoming Leads & Inquiries ({leads.length})</h3>
                  <button className="btn btn-secondary" onClick={fetchLeads} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <RefreshCw size={14} /> Refresh Leads
                  </button>
                </div>

                {loadingLeads ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading client inquiries...</p>
                ) : leads.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <Inbox size={40} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No client inquiries submitted yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '450px', overflowY: 'auto' }}>
                    {leads.map((lead) => (
                      <div key={lead.id} style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{lead.name}</span>
                            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{lead.service}</span>
                          </div>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div><Mail size={13} color="var(--accent-emerald)" /> <strong>Email:</strong> <a href={`mailto:${lead.email}`} style={{ color: 'var(--accent-emerald)' }}>{lead.email}</a></div>
                          <div><Phone size={13} color="var(--accent-cyan)" /> <strong>Phone:</strong> {lead.phone}</div>
                          <div><DollarSign size={13} color="var(--accent-gold)" /> <strong>Budget:</strong> {lead.budget}</div>
                        </div>

                        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)', whiteSpace: 'pre-wrap', margin: 0 }}>
                          {lead.message}
                        </p>

                        {lead.attachedEstimate && (
                          <div style={{ marginTop: '0.65rem', padding: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.8rem' }}>
                            <strong style={{ color: 'var(--accent-gold)' }}>Attached Budget Estimate:</strong> {lead.attachedEstimate.calculatedCost} ({lead.attachedEstimate.calculatedTimeline})
                          </div>
                        )}

                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={12} /> Received: {new Date(lead.date).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: Full Page Elementor Section & Image Customizer */}
            {activeTab === 'style-customizer' && (
              <form onSubmit={handleSaveStyles} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Elementor Sub-Sections Selector */}
                <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'hero', label: '👤 Hero & Image' },
                    { id: 'stats', label: '📊 Telemetry Stats' },
                    { id: 'services', label: '⚡ Services' },
                    { id: 'whyUsama', label: '⭐ Why Us' },
                    { id: 'timeline', label: '📖 Bio & Journey' },
                    { id: 'testimonials', label: '💬 Reviews' },
                    { id: 'contact', label: '📞 Contact & Footer' }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveElementorSection(sec.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: activeElementorSection === sec.id ? 'var(--accent-emerald)' : 'var(--bg-primary)',
                        color: activeElementorSection === sec.id ? '#ffffff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {/* 1. HERO & IMAGE EDITING */}
                  {activeElementorSection === 'hero' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Image size={16} /> Hero Section & Profile Image
                      </h4>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Hero Profile Image URL / File Path</label>
                        <input
                          type="text"
                          placeholder="./usama-real.png or https://example.com/photo.jpg"
                          value={stylesForm.hero?.profileImage ?? DEFAULT_SECTION_STYLES.hero.profileImage}
                          onChange={(e) => updateSectionField('hero', 'profileImage', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Enter custom image URL or relative path (e.g. <code>./usama-real.png</code>).</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Top Badge Text</label>
                          <input
                            type="text"
                            value={stylesForm.hero?.badgeText ?? DEFAULT_SECTION_STYLES.hero.badgeText}
                            onChange={(e) => updateSectionField('hero', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Headline Part 1</label>
                          <input
                            type="text"
                            value={stylesForm.hero?.titleLine1 ?? DEFAULT_SECTION_STYLES.hero.titleLine1}
                            onChange={(e) => updateSectionField('hero', 'titleLine1', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Headline Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.hero?.titleGradient ?? DEFAULT_SECTION_STYLES.hero.titleGradient}
                          onChange={(e) => updateSectionField('hero', 'titleGradient', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subheading Paragraph</label>
                        <textarea
                          rows={3}
                          value={stylesForm.hero?.subheading ?? DEFAULT_SECTION_STYLES.hero.subheading}
                          onChange={(e) => updateSectionField('hero', 'subheading', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Primary Button Label</label>
                          <input
                            type="text"
                            value={stylesForm.hero?.primaryCtaText ?? DEFAULT_SECTION_STYLES.hero.primaryCtaText}
                            onChange={(e) => updateSectionField('hero', 'primaryCtaText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Secondary Button Label</label>
                          <input
                            type="text"
                            value={stylesForm.hero?.secondaryCtaText ?? DEFAULT_SECTION_STYLES.hero.secondaryCtaText}
                            onChange={(e) => updateSectionField('hero', 'secondaryCtaText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. STATS & TELEMETRY */}
                  {activeElementorSection === 'stats' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Completed Projects Stat</label>
                        <input
                          type="text"
                          value={stylesForm.stats?.projectsCompleted ?? DEFAULT_SECTION_STYLES.stats.projectsCompleted}
                          onChange={(e) => updateSectionField('stats', 'projectsCompleted', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Satisfaction Rate Stat</label>
                        <input
                          type="text"
                          value={stylesForm.stats?.successRate ?? DEFAULT_SECTION_STYLES.stats.successRate}
                          onChange={(e) => updateSectionField('stats', 'successRate', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Years Experience Stat</label>
                        <input
                          type="text"
                          value={stylesForm.stats?.yearsExperience ?? DEFAULT_SECTION_STYLES.stats.yearsExperience}
                          onChange={(e) => updateSectionField('stats', 'yearsExperience', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Average Client ROAS Stat</label>
                        <input
                          type="text"
                          value={stylesForm.stats?.clientRoas ?? DEFAULT_SECTION_STYLES.stats.clientRoas}
                          onChange={(e) => updateSectionField('stats', 'clientRoas', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. SERVICES SECTION */}
                  {activeElementorSection === 'services' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Badge Tag Text</label>
                          <input
                            type="text"
                            value={stylesForm.services?.badgeText ?? DEFAULT_SECTION_STYLES.services.badgeText}
                            onChange={(e) => updateSectionField('services', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heading Text</label>
                          <input
                            type="text"
                            value={stylesForm.services?.headingText ?? DEFAULT_SECTION_STYLES.services.headingText}
                            onChange={(e) => updateSectionField('services', 'headingText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.services?.gradientText ?? DEFAULT_SECTION_STYLES.services.gradientText}
                          onChange={(e) => updateSectionField('services', 'gradientText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subheading Paragraph</label>
                        <textarea
                          rows={2}
                          value={stylesForm.services?.subheadingText ?? DEFAULT_SECTION_STYLES.services.subheadingText}
                          onChange={(e) => updateSectionField('services', 'subheadingText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. WHY US SECTION */}
                  {activeElementorSection === 'whyUsama' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Badge Tag Text</label>
                          <input
                            type="text"
                            value={stylesForm.whyUsama?.badgeText ?? DEFAULT_SECTION_STYLES.whyUsama.badgeText}
                            onChange={(e) => updateSectionField('whyUsama', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heading Text</label>
                          <input
                            type="text"
                            value={stylesForm.whyUsama?.headingText ?? DEFAULT_SECTION_STYLES.whyUsama.headingText}
                            onChange={(e) => updateSectionField('whyUsama', 'headingText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.whyUsama?.gradientText ?? DEFAULT_SECTION_STYLES.whyUsama.gradientText}
                          onChange={(e) => updateSectionField('whyUsama', 'gradientText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subheading Paragraph</label>
                        <textarea
                          rows={2}
                          value={stylesForm.whyUsama?.subheadingText ?? DEFAULT_SECTION_STYLES.whyUsama.subheadingText}
                          onChange={(e) => updateSectionField('whyUsama', 'subheadingText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. BIO & TIMELINE */}
                  {activeElementorSection === 'timeline' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Badge Tag Text</label>
                          <input
                            type="text"
                            value={stylesForm.timeline?.badgeText ?? DEFAULT_SECTION_STYLES.timeline.badgeText}
                            onChange={(e) => updateSectionField('timeline', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heading Text</label>
                          <input
                            type="text"
                            value={stylesForm.timeline?.headingText ?? DEFAULT_SECTION_STYLES.timeline.headingText}
                            onChange={(e) => updateSectionField('timeline', 'headingText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.timeline?.gradientText ?? DEFAULT_SECTION_STYLES.timeline.gradientText}
                          onChange={(e) => updateSectionField('timeline', 'gradientText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Bio Paragraph Text</label>
                        <textarea
                          rows={3}
                          value={stylesForm.timeline?.bioText ?? DEFAULT_SECTION_STYLES.timeline.bioText}
                          onChange={(e) => updateSectionField('timeline', 'bioText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. REVIEWS & TESTIMONIALS */}
                  {activeElementorSection === 'testimonials' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Badge Tag Text</label>
                          <input
                            type="text"
                            value={stylesForm.testimonials?.badgeText ?? DEFAULT_SECTION_STYLES.testimonials.badgeText}
                            onChange={(e) => updateSectionField('testimonials', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heading Text</label>
                          <input
                            type="text"
                            value={stylesForm.testimonials?.headingText ?? DEFAULT_SECTION_STYLES.testimonials.headingText}
                            onChange={(e) => updateSectionField('testimonials', 'headingText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.testimonials?.gradientText ?? DEFAULT_SECTION_STYLES.testimonials.gradientText}
                          onChange={(e) => updateSectionField('testimonials', 'gradientText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subheading Paragraph</label>
                        <textarea
                          rows={2}
                          value={stylesForm.testimonials?.subheadingText ?? DEFAULT_SECTION_STYLES.testimonials.subheadingText}
                          onChange={(e) => updateSectionField('testimonials', 'subheadingText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 7. CONTACT & FOOTER */}
                  {activeElementorSection === 'contact' && (
                    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Badge Tag Text</label>
                          <input
                            type="text"
                            value={stylesForm.contact?.badgeText ?? DEFAULT_SECTION_STYLES.contact.badgeText}
                            onChange={(e) => updateSectionField('contact', 'badgeText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heading Text</label>
                          <input
                            type="text"
                            value={stylesForm.contact?.headingText ?? DEFAULT_SECTION_STYLES.contact.headingText}
                            onChange={(e) => updateSectionField('contact', 'headingText', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gradient Word(s)</label>
                        <input
                          type="text"
                          value={stylesForm.contact?.gradientText ?? DEFAULT_SECTION_STYLES.contact.gradientText}
                          onChange={(e) => updateSectionField('contact', 'gradientText', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Notification Email</label>
                          <input
                            type="email"
                            value={stylesForm.contact?.email ?? DEFAULT_SECTION_STYLES.contact.email}
                            onChange={(e) => updateSectionField('contact', 'email', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>WhatsApp Number</label>
                          <input
                            type="text"
                            value={stylesForm.contact?.whatsapp ?? DEFAULT_SECTION_STYLES.contact.whatsapp}
                            onChange={(e) => updateSectionField('contact', 'whatsapp', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                  <Save size={16} /> Save Full Page Customizations
                </button>
              </form>
            )}

            {/* TAB 2: Tracking Codes & Analytics Scripts */}
            {activeTab === 'scripts' && (
              <form onSubmit={handleSaveScripts} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={16} /> Header Tracking Codes (&lt;head&gt; Tag)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Paste your <strong>Google Tag Manager (GTM)</strong>, <strong>Google Analytics (gtag.js)</strong>, <strong>Google Search Console Meta Verification Tag</strong>, or <strong>Meta (Facebook) Pixel</strong> script here.
                  </p>
                  <textarea
                    rows={5}
                    placeholder="<script async src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX'></script>..."
                    value={scriptsForm.headerScripts || ''}
                    onChange={(e) => setScriptsForm({ ...scriptsForm, headerScripts: e.target.value })}
                    style={{ width: '100%', fontFamily: 'var(--font-code)', fontSize: '0.82rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#090d16', color: '#38bdf8', resize: 'vertical' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={16} /> Body Scripts (&lt;body&gt; Tag / GTM Noscript)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Paste GTM <code>&lt;noscript&gt;</code> fallback tags or live chat widget scripts (Tawk.to, WhatsApp floating widget).
                  </p>
                  <textarea
                    rows={4}
                    placeholder="<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX'...</noscript>"
                    value={scriptsForm.bodyScripts || ''}
                    onChange={(e) => setScriptsForm({ ...scriptsForm, bodyScripts: e.target.value })}
                    style={{ width: '100%', fontFamily: 'var(--font-code)', fontSize: '0.82rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#090d16', color: '#fbbf24', resize: 'vertical' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent-purple)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={16} /> Footer Scripts (&lt;footer&gt; Tag)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Paste Google Ads remarketing pixels or custom conversion scripts here.
                  </p>
                  <textarea
                    rows={3}
                    placeholder="<!-- Custom Footer Scripts -->"
                    value={scriptsForm.footerScripts || ''}
                    onChange={(e) => setScriptsForm({ ...scriptsForm, footerScripts: e.target.value })}
                    style={{ width: '100%', fontFamily: 'var(--font-code)', fontSize: '0.82rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#090d16', color: '#a78bfa', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  <Save size={16} /> Save & Activate Tracking Codes
                </button>
              </form>
            )}

            {/* TAB 3: Identity & Contact */}
            {activeTab === 'identity' && (
              <form onSubmit={handleSaveIdentity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name</label>
                    <input
                      type="text"
                      value={identityForm.fullName}
                      onChange={(e) => setIdentityForm({ ...identityForm, fullName: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Primary Title</label>
                    <input
                      type="text"
                      value={identityForm.primaryTitle}
                      onChange={(e) => setIdentityForm({ ...identityForm, primaryTitle: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>WhatsApp Number</label>
                    <input
                      type="text"
                      value={identityForm.contact.whatsapp}
                      onChange={(e) => setIdentityForm({
                        ...identityForm,
                        contact: { ...identityForm.contact, whatsapp: e.target.value }
                      })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Notification Email</label>
                    <input
                      type="email"
                      value={identityForm.contact.notificationEmail}
                      onChange={(e) => setIdentityForm({
                        ...identityForm,
                        contact: { ...identityForm.contact, notificationEmail: e.target.value }
                      })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                  <Save size={16} /> Save Branding & Contact
                </button>
              </form>
            )}

            {/* TAB 4: Manage Projects */}
            {activeTab === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} color="var(--accent-emerald)" /> Add New Project to Portfolio
                  </h4>

                  <form onSubmit={handleAddProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        placeholder="Project Title (e.g. Alphalete)"
                        value={newProj.title}
                        onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                        style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category (e.g. SHOPIFY ECOMMERCE)"
                        value={newProj.category}
                        onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                        style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                      <input
                        type="text"
                        placeholder="Website URL"
                        value={newProj.url}
                        onChange={(e) => setNewProj({ ...newProj, url: e.target.value })}
                        style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        placeholder="Industry (e.g. Fitness Apparel)"
                        value={newProj.industry}
                        onChange={(e) => setNewProj({ ...newProj, industry: e.target.value })}
                        style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newProj.description}
                        onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                        style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Results achieved (comma separated, e.g. +200% Bookings, #1 Rank)"
                      value={newProj.results}
                      onChange={(e) => setNewProj({ ...newProj, results: e.target.value })}
                      style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />

                    <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                      Add to Live Portfolio
                    </button>
                  </form>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Current Live Projects ({data.projects.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '350px', overflowY: 'auto' }}>
                  {data.projects.map((p) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category} · {p.url || 'No URL'}</div>
                      </div>

                      <button
                        onClick={() => deleteProject(p.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Backup & Reset */}
            {activeTab === 'export' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Export Portfolio Dataset & Settings</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Download a full JSON backup of all your identity info, projects, section styles, and scripts.
                  </p>
                  <button className="btn btn-primary" onClick={exportJSON}>
                    <Download size={16} /> Download full_backup.json
                  </button>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={18} /> Reset All Content & Styles to Default
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Resets all custom edits back to default.
                  </p>
                  <button className="btn" style={{ background: '#ef4444', color: '#ffffff' }} onClick={resetToDefault}>
                    <RefreshCw size={16} /> Reset Content to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
