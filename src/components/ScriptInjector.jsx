import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function ScriptInjector() {
  const { scriptsConfig } = usePortfolio();

  useEffect(() => {
    if (!scriptsConfig) return;

    // Inject Head Scripts
    if (scriptsConfig.headerScripts) {
      const existingHeadScript = document.getElementById('custom-user-head-scripts');
      if (existingHeadScript) existingHeadScript.remove();

      const headContainer = document.createElement('div');
      headContainer.id = 'custom-user-head-scripts';
      headContainer.innerHTML = scriptsConfig.headerScripts;
      
      // Execute any script elements inside headContainer
      Array.from(headContainer.children).forEach(child => {
        if (child.tagName === 'SCRIPT') {
          const s = document.createElement('script');
          if (child.src) s.src = child.src;
          s.innerHTML = child.innerHTML;
          Array.from(child.attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
          document.head.appendChild(s);
        } else {
          document.head.appendChild(child.cloneNode(true));
        }
      });
    }

    // Inject Body / Footer Scripts
    if (scriptsConfig.bodyScripts || scriptsConfig.footerScripts) {
      const existingBodyScript = document.getElementById('custom-user-body-scripts');
      if (existingBodyScript) existingBodyScript.remove();

      const bodyContainer = document.createElement('div');
      bodyContainer.id = 'custom-user-body-scripts';
      bodyContainer.innerHTML = (scriptsConfig.bodyScripts || '') + (scriptsConfig.footerScripts || '');
      
      Array.from(bodyContainer.children).forEach(child => {
        if (child.tagName === 'SCRIPT') {
          const s = document.createElement('script');
          if (child.src) s.src = child.src;
          s.innerHTML = child.innerHTML;
          Array.from(child.attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
          document.body.appendChild(s);
        } else {
          document.body.appendChild(child.cloneNode(true));
        }
      });
    }
  }, [scriptsConfig]);

  return null;
}
