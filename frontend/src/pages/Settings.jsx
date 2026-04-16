import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AppIcon from '../components/AppIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkTheme: false,
    autoRefresh: true,
    primaryMetric: localStorage.getItem('edu_setu_primary_metric') || 'percentage',
    lowAttendance: true,
    performanceReports: true,
    aiAlerts: false,
    format: 'PDF (Legacy)'
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    // Persist to local storage
    localStorage.setItem('edu_setu_primary_metric', settings.primaryMetric);
    
    setTimeout(() => {
      setSaving(false);
      setMessage("Settings updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default?")) {
      const defaults = {
        darkTheme: false,
        autoRefresh: true,
        primaryMetric: 'percentage',
        lowAttendance: true,
        performanceReports: true,
        aiAlerts: false,
        format: 'PDF (Legacy)'
      };
      setSettings(defaults);
      localStorage.setItem('edu_setu_primary_metric', 'percentage');
    }
  };

  const groups = [
    {
      title: 'Platform Preferences',
      items: [
        { id: 'darkTheme', name: 'Dark Theme', description: 'Enable dark mode for the entire interface', type: 'toggle', value: settings.darkTheme },
        { id: 'autoRefresh', name: 'Auto-Refresh', description: 'Refresh dashboard analytics every 5 minutes', type: 'toggle', value: settings.autoRefresh },
        { 
          id: 'primaryMetric', 
          name: 'Primary Metric', 
          description: 'Choose which unit is displayed as the primary performance indicator', 
          type: 'select', 
          value: settings.primaryMetric === 'percentage' ? 'Percentage (%)' : 'CGPA (10.0)',
          options: ['percentage', 'cgpa']
        }
      ]
    },
    {
      title: 'Academic Notifications',
      items: [
        { id: 'lowAttendance', name: 'Low Attendance Alerts', description: 'Notify when student attendance drops below 75%', type: 'toggle', value: settings.lowAttendance },
        { id: 'performanceReports', name: 'Performance Reports', description: 'Weekly summary of institutional efficiency', type: 'toggle', value: settings.performanceReports },
        { id: 'aiAlerts', name: 'AI Insight Alerts', description: 'Notify when significant trends are detected', type: 'toggle', value: settings.aiAlerts }
      ]
    },
    {
      title: 'Data & Security',
      items: [
        { id: 'format', name: 'Data Export Format', description: 'Default format for report downloads', type: 'select', value: settings.format }
      ]
    }
  ];

  return (
    <Layout title="Settings">
      <div className="max-w-4xl space-y-6 lg:space-y-10">
        {message && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg border border-emerald-100 font-bold text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            {message}
          </div>
        )}

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 px-1">{group.title}</h3>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
              {group.items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 ${idx !== group.items.length - 1 ? 'border-b border-outline-variant/5' : ''} hover:bg-surface-container-low/30 transition-colors gap-4`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-on-surface text-sm sm:text-base">{item.name}</p>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-md">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center sm:justify-end">
                    {item.type === 'toggle' && (
                      <button 
                        onClick={() => handleToggle(item.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${item.value ? 'bg-primary shadow-[0_0_15px_-5px_var(--primary)]' : 'bg-neutral-200'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${item.value ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    )}
                    {item.type === 'select' && item.id === 'primaryMetric' ? (
                      <div className="flex items-center gap-2">
                        {item.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleSelect(item.id, opt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${settings.primaryMetric === opt ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 uppercase'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      item.type === 'select' && (
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
                          {item.value}
                          <AppIcon icon="expand_more" className="h-4 w-4" />
                        </div>
                      )
                    )}
                    {item.type === 'button' && (
                      <button className="w-full sm:w-auto text-[10px] sm:text-xs font-bold text-white bg-black px-6 py-2 rounded-lg hover:opacity-80 transition-opacity">
                        {item.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6 lg:pt-10 flex flex-col sm:flex-row gap-4 border-t border-outline-variant/5">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto bg-primary text-on-primary px-10 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          <button 
            onClick={handleReset}
            className="w-full sm:w-auto text-neutral-500 px-10 py-3 rounded-xl font-bold hover:bg-neutral-100 transition-all text-sm"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
