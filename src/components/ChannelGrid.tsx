import React from 'react';
import { Id } from '../../convex/_generated/dataModel';

interface ChannelGridProps {
  channels: any[];
  selectedCategory: Id<"categories"> | null;
  categories: any[];
  onChannelSelect: (channel: any) => void;
}

export function ChannelGrid({ 
  channels, 
  selectedCategory, 
  categories, 
  onChannelSelect 
}: ChannelGridProps) {
  const getCategoryName = (categoryId: Id<"categories">) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'غير محدد';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedCategory 
            ? getCategoryName(selectedCategory)
            : 'جميع القنوات'
          }
        </h2>
        <div className="text-sm text-gray-400">
          {channels.length} قناة
        </div>
      </div>

      {/* Channels Grid */}
      {channels.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد قنوات</h3>
          <p className="text-gray-400">لم يتم العثور على قنوات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              onClick={() => onChannelSelect(channel)}
              className="group bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
            >
              {/* Channel Logo/Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                {channel.logo ? (
                  <img 
                    src={channel.logo} 
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z" />
                    </svg>
                  </div>
                </div>

                {/* Quality Badges */}
                {channel.qualities && channel.qualities.length > 0 && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {channel.qualities.slice(0, 2).map((quality: any, index: number) => (
                      <span 
                        key={index}
                        className={`text-white text-xs px-2 py-1 rounded-full font-medium ${
                          quality.resolution.includes('480') || quality.resolution.includes('SD') 
                            ? 'bg-green-500' 
                            : quality.resolution.includes('720') || quality.resolution.includes('HD')
                            ? 'bg-yellow-500'
                            : quality.resolution.includes('1080') || quality.resolution.includes('FHD')
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                        title={`${quality.label} - ${quality.resolution}`}
                      >
                        {quality.resolution}
                      </span>
                    ))}
                    {channel.qualities.length > 2 && (
                      <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        +{channel.qualities.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Channel Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">
                  {channel.name}
                </h3>
                
                {channel.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {channel.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getCategoryName(channel.categoryId)}</span>
                  {channel.language && (
                    <span className="bg-gray-700 px-2 py-1 rounded">
                      {channel.language}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
