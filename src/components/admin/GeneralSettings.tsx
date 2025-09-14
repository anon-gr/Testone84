import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';

export function GeneralSettings() {
  const settings = useQuery(api.settings.getSettings) || {};
  const updateSetting = useMutation(api.settings.updateSetting);
  const createUpdate = useMutation(api.updates.createUpdate);

  const [formData, setFormData] = useState({
    autoSync: settings.autoSync || false,
    syncInterval: settings.syncInterval || 30,
    maxChannels: settings.maxChannels || 1000,
    enableNotifications: settings.enableNotifications || true,
    defaultQuality: settings.defaultQuality || 'HD',
  });

  const [updateForm, setUpdateForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success',
  });

  const handleSettingUpdate = async (key: string, value: any) => {
    try {
      await updateSetting({ key, value });
      toast.success('تم حفظ الإعداد بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الإعداد');
    }
  };

  const handleSyncData = async () => {
    toast.info('جاري مزامنة البيانات...');
    // Simulate sync process
    setTimeout(() => {
      toast.success('تم مزامنة البيانات بنجاح');
    }, 2000);
  };

  const handleBackupData = () => {
    toast.info('جاري إنشاء نسخة احتياطية...');
    // Simulate backup process
    setTimeout(() => {
      toast.success('تم إنشاء النسخة الاحتياطية بنجاح');
    }, 1500);
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUpdate(updateForm);
      toast.success('تم إضافة التحديث بنجاح');
      setUpdateForm({ title: '', content: '', type: 'info' });
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة التحديث');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h3 className="text-xl font-bold text-white">الإعدادات العامة</h3>

      {/* Sync Settings */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">إعدادات المزامنة</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">المزامنة التلقائية</label>
              <p className="text-sm text-gray-400">تفعيل المزامنة التلقائية للبيانات</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoSync}
                onChange={(e) => {
                  const value = e.target.checked;
                  setFormData({ ...formData, autoSync: value });
                  handleSettingUpdate('autoSync', value);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              فترة المزامنة (بالدقائق)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={formData.syncInterval}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFormData({ ...formData, syncInterval: value });
                handleSettingUpdate('syncInterval', value);
              }}
              className="w-32 bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSyncData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              مزامنة الآن
            </button>
            <button
              onClick={handleBackupData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              نسخ احتياطي
            </button>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">إعدادات التطبيق</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              الحد الأقصى للقنوات
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              value={formData.maxChannels}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFormData({ ...formData, maxChannels: value });
                handleSettingUpdate('maxChannels', value);
              }}
              className="w-32 bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              الجودة الافتراضية
            </label>
            <select
              value={formData.defaultQuality}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, defaultQuality: value });
                handleSettingUpdate('defaultQuality', value);
              }}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="SD">SD (480p)</option>
              <option value="HD">HD (720p)</option>
              <option value="FHD">Full HD (1080p)</option>
              <option value="4K">4K (2160p)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">الإشعارات</label>
              <p className="text-sm text-gray-400">تفعيل إشعارات التطبيق</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableNotifications}
                onChange={(e) => {
                  const value = e.target.checked;
                  setFormData({ ...formData, enableNotifications: value });
                  handleSettingUpdate('enableNotifications', value);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Updates Management */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">إدارة التحديثات</h4>
        
        <form onSubmit={handleCreateUpdate} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              عنوان التحديث
            </label>
            <input
              type="text"
              value={updateForm.title}
              onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              محتوى التحديث
            </label>
            <textarea
              value={updateForm.content}
              onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              نوع التحديث
            </label>
            <select
              value={updateForm.type}
              onChange={(e) => setUpdateForm({ ...updateForm, type: e.target.value as any })}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="info">معلومات</option>
              <option value="warning">تحذير</option>
              <option value="success">نجاح</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إضافة التحديث
          </button>
        </form>
      </div>
    </div>
  );
}
