import React from 'react';
import Layout from '../components/Layout';
import AppIcon from '../components/AppIcon';

const Settings = () => {
  const settingsGroups = [
    {
      title: 'Platform Preferences',
      items: [
        { name: 'Dark Theme', description: 'Enable dark mode for the entire interface', type: 'toggle', value: false },
        { name: 'Auto-Refresh', description: 'Refresh dashboard analytics every 5 minutes', type: 'toggle', value: true },
        { name: 'Measurement Unit', description: 'Change performance scaling metrics', type: 'select', value: 'Percentage (%)' }
      ]
    },
    {
      title: 'Academic Notifications',
      items: [
        { name: 'Low Attendance Alerts', description: 'Notify when student attendance drops below 75%', type: 'toggle', value: true },
        { name: 'Performance Reports', description: 'Weekly summary of institutional efficiency', type: 'toggle', value: true },
        { name: 'AI Insight Alerts', description: 'Notify when significant trends are detected', type: 'toggle', value: false }
      ]
    },
    {
      title: 'Data & Security',
      items: [
        { name: '2FA Authentication', description: 'Add an extra layer of security to your account', type: 'button', label: 'Enable' },
        { name: 'Data Export Format', description: 'Default format for report downloads', type: 'select', value: 'PDF (Legacy)' }
      ]
    }
  ];

  return (
    <Layout title="Settings">
      <div className="max-w-4xl space-y-6 lg:space-y-10">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 px-1">{group.title}</h3>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
              {group.items.map((item, idx) => (
                <div 
                  key={item.name} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 ${idx !== group.items.length - 1 ? 'border-b border-outline-variant/5' : ''} hover:bg-surface-container-low/30 transition-colors gap-4`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-on-surface text-sm sm:text-base">{item.name}</p>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-md">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center sm:justify-end">
                    {item.type === 'toggle' && (
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${item.value ? 'bg-primary' : 'bg-neutral-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    )}
                    {item.type === 'select' && (
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
                        {item.value}
                        <AppIcon icon="expand_more" className="h-4 w-4" />
                      </div>
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

        <div className="pt-6 lg:pt-10 flex flex-col sm:flex-row gap-4">
          <button className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-sm">
            Save Changes
          </button>
          <button className="w-full sm:w-auto text-neutral-500 px-8 py-3 rounded-xl font-bold hover:bg-neutral-100 transition-all text-sm">
            Reset to Default
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
