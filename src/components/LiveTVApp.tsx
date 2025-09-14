import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChannelGrid } from './ChannelGrid';
import { VideoPlayer } from './VideoPlayer';
import { AdminPanel } from './AdminPanel';
import { SettingsModal } from './SettingsModal';
import { UpdatesPanel } from './UpdatesPanel';
import { Id } from '../../convex/_generated/dataModel';

export function LiveTVApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  const categories = useQuery(api.categories.listCategories) || [];
  const channels = useQuery(api.channels.listChannels, 
    selectedCategory ? { categoryId: selectedCategory } : {}
  ) || [];
  const updates = useQuery(api.updates.listUpdates) || [];

  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
  };

  const handleCategorySelect = (categoryId: Id<"categories"> | null) => {
    setSelectedCategory(categoryId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onAdminClick={() => setShowAdmin(true)}
        onSettingsClick={() => setShowSettings(true)}
        onUpdatesClick={() => setShowUpdates(true)}
        unreadUpdates={updates.filter(u => !u.isRead).length}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : ''}`}>
          <div className="p-4 lg:p-6">
            <ChannelGrid 
              channels={channels}
              selectedCategory={selectedCategory}
              categories={categories}
              onChannelSelect={handleChannelSelect}
            />
          </div>
        </main>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedChannel && (
        <VideoPlayer 
          channel={selectedChannel}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Updates Panel */}
      {showUpdates && (
        <UpdatesPanel 
          updates={updates}
          onClose={() => setShowUpdates(false)}
        />
      )}
    </div>
  );
}
