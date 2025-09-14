import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';

export function ChannelManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);

  const channels = useQuery(api.channels.listChannels, {}) || [];
  const categories = useQuery(api.categories.listCategories) || [];
  const createChannel = useMutation(api.channels.createChannel);
  const updateChannel = useMutation(api.channels.updateChannel);
  const deleteChannel = useMutation(api.channels.deleteChannel);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingChannel) {
        await updateChannel({
          channelId: editingChannel._id,
          ...formData,
        });
        toast.success('تم تحديث القناة بنجاح');
      } else {
        await createChannel(formData);
        toast.success('تم إضافة القناة بنجاح');
      }
      setShowAddForm(false);
      setEditingChannel(null);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ القناة');
    }
  };

  const handleDelete = async (channelId: any) => {
    if (confirm('هل أنت متأكد من حذف هذه القناة؟')) {
      try {
        await deleteChannel({ channelId });
        toast.success('تم حذف القناة بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف القناة');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">إدارة القنوات</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          إضافة قناة جديدة
        </button>
      </div>

      {/* Channels List */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-right p-4 text-gray-300">اسم القناة</th>
                <th className="text-right p-4 text-gray-300">الفئة</th>
                <th className="text-right p-4 text-gray-300">اللغة</th>
                <th className="text-right p-4 text-gray-300">الحالة</th>
                <th className="text-right p-4 text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => {
                const category = categories.find(c => c._id === channel.categoryId);
                return (
                  <tr key={channel._id} className="border-t border-gray-700">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {channel.logo && (
                          <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="text-white font-medium">{channel.name}</div>
                          {channel.description && (
                            <div className="text-sm text-gray-400">{channel.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{category?.name || 'غير محدد'}</td>
                    <td className="p-4 text-gray-300">{channel.language || 'غير محدد'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        channel.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {channel.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingChannel(channel);
                            setShowAddForm(true);
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(channel._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <ChannelForm
          channel={editingChannel}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddForm(false);
            setEditingChannel(null);
          }}
        />
      )}
    </div>
  );
}

function ChannelForm({ channel, categories, onSubmit, onClose }: any) {
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    description: channel?.description || '',
    logo: channel?.logo || '',
    categoryId: channel?.categoryId || '',
    streamUrl: channel?.streamUrl || '',
    language: channel?.language || '',
    country: channel?.country || '',
    qualities: channel?.qualities || [{ label: 'HD', url: '', resolution: '720p' }],
  });

  const handleQualityChange = (index: number, field: string, value: string) => {
    const newQualities = [...formData.qualities];
    newQualities[index] = { ...newQualities[index], [field]: value };
    setFormData({ ...formData, qualities: newQualities });
  };

  const addQuality = () => {
    setFormData({
      ...formData,
      qualities: [...formData.qualities, { label: '', url: '', resolution: '' }]
    });
  };

  const removeQuality = (index: number) => {
    const newQualities = formData.qualities.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, qualities: newQualities });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.streamUrl) {
      formData.qualities[0].url = formData.streamUrl;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {channel ? 'تعديل القناة' : 'إضافة قناة جديدة'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اسم القناة *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الفئة *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">اختر الفئة</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رابط البث * (يدعم M3U8, MP4, وروابط البث المباشر)
              </label>
              <input
                type="url"
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://example.com/stream.m3u8"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                مثال: https://example.com/stream.m3u8 أو https://example.com/video.mp4
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اللغة
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  البلد
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رابط الشعار
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {channel ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
