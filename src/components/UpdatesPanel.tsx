import React from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface UpdatesPanelProps {
  updates: any[];
  onClose: () => void;
}

export function UpdatesPanel({ updates, onClose }: UpdatesPanelProps) {
  const markAsRead = useMutation(api.updates.markUpdateAsRead);

  const handleMarkAsRead = async (updateId: any) => {
    try {
      await markAsRead({ updateId });
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">التحديثات</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Updates List */}
        <div className="flex-1 overflow-y-auto p-6">
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h8V9H4v2zM4 7h8V5H4v2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد تحديثات</h3>
              <p className="text-gray-400">لم يتم العثور على أي تحديثات</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update._id}
                  className={`p-4 rounded-lg border transition-all ${
                    update.isRead
                      ? 'bg-gray-900/50 border-gray-700'
                      : 'bg-gray-900 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {getTypeIcon(update.type)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{update.title}</h4>
                        {!update.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(update._id)}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            تم القراءة
                          </button>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                        {update.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(update._creationTime).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {!update.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
