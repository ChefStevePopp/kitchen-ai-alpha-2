import React, { useState } from 'react';
import { Settings, Activity, Database, Brain, Palette, FileCode } from 'lucide-react';
import { useDevAccess } from '@/hooks/useDevAccess';
import { DiagnosticsPanel } from './DiagnosticsPanel';
import { DatabasePanel } from './DatabasePanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { ThemeExport } from './ThemeExport';
import { DevelopmentConsciousness } from './DevelopmentConsciousness';

export const DevManagement: React.FC = () => {
  const { isDev } = useDevAccess();
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'system' | 'database' | 'brain' | 'theme'>('diagnostics');

  if (!isDev) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Settings className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-center max-w-md">
          This section is only accessible to users with dev privileges.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'diagnostics' as const, label: 'Diagnostics', icon: FileCode, color: 'primary' },
    { id: 'system' as const, label: 'System Info', icon: Activity, color: 'green' },
    { id: 'database' as const, label: 'Database', icon: Database, color: 'amber' },
    { id: 'brain' as const, label: 'Brain Health', icon: Brain, color: 'rose' },
    { id: 'theme' as const, label: 'Theme', icon: Palette, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dev Management</h1>
          <p className="text-gray-400">Development tools and system configuration</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${tab.color} ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className={`w-5 h-5 ${
              activeTab === tab.id ? `text-${tab.color}-400` : 'text-current'
            }`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === 'diagnostics' && <DiagnosticsPanel />}
        {activeTab === 'system' && <SystemInfoPanel />}
        {activeTab === 'database' && <DatabasePanel />}
        {activeTab === 'brain' && <DevelopmentConsciousness />}
        {activeTab === 'theme' && <ThemeExport />}
      </div>
    </div>
  );
};