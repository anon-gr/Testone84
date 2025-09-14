import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useQuery(api.settings.getSettings) || {};
  const updateSetting = useMutation(api.settings.updateSetting);

  const [formData, setFormData] = useState({
    autoplay: settings.autoplay ?? true,
    defaultVolume: settings.defaultVolume ?? 50,
    showSubtitles: settings.showSubtitles ?? false,
    theme: settings.theme ?? 'dark',
    language: settings.language ?? 'ar',
    notifications: settings.notifications ?? true,
  });

  const handleSettingUpdate = async (key: string, value: any) => {
    try {
      await updateSetting({ key, value });
      toast.success('تم حفظ الإعداد بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الإعداد');
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    setFormData({ ...formData, [key]: value });
    handleSettingUpdate(key, value);
  };

  const handleSliderChange = (key: string, value: number) => {
    setFormData({ ...formData, [key]: value });
    handleSettingUpdate(key, value);
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    handleSettingUpdate(key, value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">الإعدادات</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Playback Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">إعدادات التشغيل</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">التشغيل التلقائي</label>
                  <p className="text-sm text-gray-400">تشغيل القنوات تلقائياً عند الاختيار</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoplay}
                    onChange={(e) => handleToggle('autoplay', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  مستوى الصوت الافتراضي: {formData.defaultVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.defaultVolume}
                  onChange={(e) => handleSliderChange('defaultVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">عرض الترجمة</label>
                  <p className="text-sm text-gray-400">إظهار الترجمة عند توفرها</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSubtitles}
                    onChange={(e) => handleToggle('showSubtitles', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">إعدادات المظهر</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">المظهر</label>
                <select
                  value={formData.theme}
                  onChange={(e) => handleSelectChange('theme', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="dark">داكن</option>
                  <option value="light">فاتح</option>
                  <option value="auto">تلقائي</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">اللغة</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">إعدادات الإشعارات</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">الإشعارات</label>
                <p className="text-sm text-gray-400">تلقي إشعارات التحديثات والأخبار</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => handleToggle('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات التطبيق</h3>
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>الإصدار:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>آخر تحديث:</span>
                <span>{new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
