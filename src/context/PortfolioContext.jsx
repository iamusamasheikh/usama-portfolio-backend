import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/portfolioData';

const PortfolioContext = createContext();

export const DEFAULT_SECTION_STYLES = {
  hero: {
    badgeText: "UPWORK TOP RATED FREELANCER",
    titleLine1: "Digital Marketing Strategist &",
    titleGradient: "Web Developer",
    subheading: "Full-Stack Web Developer & SEO Specialist with 7+ years of experience launching high-ROI Shopify stores, custom WordPress portals, and PPC ad campaigns.",
    profileImage: "./usama-real.png",
    primaryCtaText: "Get Free Consultation",
    secondaryCtaText: "Explore 80+ Live Projects"
  },
  stats: {
    projectsCompleted: "80+",
    successRate: "99.4%",
    yearsExperience: "7+ Years",
    clientRoas: "4.8x Average"
  },
  services: {
    badgeText: "OUR SPECIALIZATIONS",
    headingText: "Services Designed to Drive",
    gradientText: "Measurable ROI",
    subheadingText: "End-to-end web engineering, speed optimization, and ad scaling."
  },
  whyUsama: {
    badgeText: "WHY CHOOSE US",
    headingText: "Why Work With",
    gradientText: "Usama Sheikh?",
    subheadingText: "Direct communication, top-rated expertise, and guaranteed results."
  },
  timeline: {
    badgeText: "ABOUT & JOURNEY",
    headingText: "7+ Years of",
    gradientText: "Proven Industry Impact",
    bioText: "Over the past 7 years, I've engineered high-performance Shopify stores, custom WordPress platforms, and targeted digital marketing campaigns for 80+ clients globally."
  },
  testimonials: {
    badgeText: "CLIENT TESTIMONIALS",
    headingText: "Trusted by Founders &",
    gradientText: "Business Leaders Globally",
    subheadingText: "Real feedback from clients across USA, Canada, UK, Germany, and UAE."
  },
  contact: {
    badgeText: "GET IN TOUCH",
    headingText: "Let's Build Something",
    gradientText: "Amazing Together",
    subheadingText: "Have a project in mind or need a full SEO/Website audit? Fill out the form or reach out directly for a 30-minute free discovery call.",
    email: "officialusamano1@gmail.com",
    whatsapp: "+92 300 7856880",
    location: "Global / Remote (USA, UK, UAE, Canada, EU)"
  }
};

const DEFAULT_SCRIPTS_CONFIG = {
  headerScripts: "",
  bodyScripts: "",
  footerScripts: ""
};

const API_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://usama-portfolio-backend-16jd.onrender.com';

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(INITIAL_DATA);
  const [sectionStyles, setSectionStyles] = useState(DEFAULT_SECTION_STYLES);
  const [scriptsConfig, setScriptsConfig] = useState(DEFAULT_SCRIPTS_CONFIG);

  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState(null);

  // Load section styles & tracking scripts from backend API or localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        const json = await res.json();
        if (json.success && json.settings) {
          if (json.settings.sectionStyles) setSectionStyles(prev => ({ ...prev, ...json.settings.sectionStyles }));
          if (json.settings.scriptsConfig) setScriptsConfig(prev => ({ ...prev, ...json.settings.scriptsConfig }));
          return;
        }
      } catch (e) {
        console.warn('API settings load warning, using local state:', e.message);
      }

      // Local storage fallback
      const savedStyles = localStorage.getItem('usama_section_styles');
      if (savedStyles) {
        try { setSectionStyles(JSON.parse(savedStyles)); } catch(e){}
      }
      const savedScripts = localStorage.getItem('usama_scripts_config');
      if (savedScripts) {
        try { setScriptsConfig(JSON.parse(savedScripts)); } catch(e){}
      }
    }

    loadSettings();
  }, []);

  const updateSectionStyles = async (newStyles) => {
    setSectionStyles(newStyles);
    localStorage.setItem('usama_section_styles', JSON.stringify(newStyles));
    try {
      await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionStyles: newStyles, scriptsConfig })
      });
    } catch(e){}
  };

  const updateScriptsConfig = async (newScripts) => {
    setScriptsConfig(newScripts);
    localStorage.setItem('usama_scripts_config', JSON.stringify(newScripts));
    try {
      await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionStyles, scriptsConfig: newScripts })
      });
    } catch(e){}
  };

  const updateIdentity = (newIdentity) => {
    setData(prev => ({ ...prev, identity: newIdentity }));
  };

  const addProject = (newProj) => {
    setData(prev => ({
      ...prev,
      projects: [ { ...newProj, id: 'p_' + Date.now() }, ...prev.projects ]
    }));
  };

  const updateProject = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    }));
  };

  const deleteProject = (id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const resetToDefault = () => {
    setData(INITIAL_DATA);
    setSectionStyles(DEFAULT_SECTION_STYLES);
    setScriptsConfig(DEFAULT_SCRIPTS_CONFIG);
    localStorage.removeItem('usama_section_styles');
    localStorage.removeItem('usama_scripts_config');
  };

  const applyEstimateToForm = (estimateData) => {
    setActiveEstimate(estimateData);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      sectionStyles,
      updateSectionStyles,
      scriptsConfig,
      updateScriptsConfig,
      updateIdentity,
      addProject,
      updateProject,
      deleteProject,
      resetToDefault,
      activeProjectModal,
      setActiveProjectModal,
      isAdminOpen,
      setIsAdminOpen,
      activeEstimate,
      setActiveEstimate,
      applyEstimateToForm
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
}
