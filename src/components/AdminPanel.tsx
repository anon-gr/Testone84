import React, { useState } from 'react';
import { ChannelManager } from './admin/ChannelManager';
import { CategoryManager } from './admin/CategoryManager';
import { GeneralSettings } from './admin/GeneralSettings';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('channels');

  const tabs = [
    { id: 'channels', name: 'إدارة القنوات', icon: '📺' },
    { id: 'categories', name: 'إدارة الفئات', icon: '📁' },
    { id: 'settings', name: 'الإعدادات العامة', icon: '⚙️' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">لوحة التحكم</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 border-r border-gray-700">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'channels' && <ChannelManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'settings' && <GeneralSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
