import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { TrendingUp, Cpu, Activity, ShieldCheck } from 'lucide-react';

export default function TelemetryPanels() {
  const { data, sectionStyles } = usePortfolio();
  const { telemetryPanels } = data;
  const statsStyle = sectionStyles?.stats || {};

  const getMetric = (id, defaultMetric) => {
    switch(id) {
      case 'TRAJ.001': return statsStyle.projectsCompleted || defaultMetric;
      case 'FLOW.002': return statsStyle.successRate || defaultMetric;
      case 'PULSE.003': return statsStyle.yearsExperience || defaultMetric;
      case 'TRUST.004': return statsStyle.clientRoas || defaultMetric;
      default: return defaultMetric;
    }
  };

  const getIcon = (id) => {
    switch (id) {
      case 'TRAJ.001': return <TrendingUp size={20} color="var(--accent-emerald)" />;
      case 'FLOW.002': return <Cpu size={20} color="var(--accent-cyan)" />;
      case 'PULSE.003': return <Activity size={20} color="var(--accent-blue)" />;
      case 'TRUST.004': return <ShieldCheck size={20} color="var(--accent-gold)" />;
      default: return <TrendingUp size={20} />;
    }
  };

  return (
    <section style={{ padding: '2rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {telemetryPanels.map((panel) => (
            <div key={panel.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getIcon(panel.id)}
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-code)', fontWeight: 600, color: 'var(--text-muted)' }}>
                    [{panel.id}]
                  </span>
                </div>
                <span className="badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                  {panel.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>
                  {getMetric(panel.id, panel.metric)}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {panel.label}
                </span>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {panel.title}
              </h4>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {panel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
