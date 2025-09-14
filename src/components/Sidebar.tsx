import React from 'react';
import { Id } from '../../convex/_generated/dataModel';

interface SidebarProps {
  isOpen: boolean;
  categories: any[];
  selectedCategory: Id<"categories"> | null;
  onCategorySelect: (categoryId: Id<"categories"> | null) => void;
  onClose: () => void;
}

export function Sidebar({ 
  isOpen, 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onClose 
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-gray-800 border-r border-gray-700 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">الفئات</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {/* All Channels */}
              <button
                onClick={() => onCategorySelect(null)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors
                  ${selectedCategory === null 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                  }
                `}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <span className="font-medium">جميع القنوات</span>
              </button>

              {/* Category List */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => onCategorySelect(category._id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors mt-1
                    ${selectedCategory === category._id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700 text-gray-300'
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {category.icon ? (
                      <span className="text-sm">{category.icon}</span>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
