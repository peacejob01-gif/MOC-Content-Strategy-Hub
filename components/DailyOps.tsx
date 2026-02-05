import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { NewsItem } from '../types';

interface DailyOpsProps {
  newsItems: NewsItem[];
  onAddNews: (newItem: Omit<NewsItem, 'id'>) => Promise<void>;
  onUpdateNews: (updatedItem: NewsItem) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  currentMonthTheme: string;
}

export const DailyOps: React.FC<DailyOpsProps> = ({ 
  newsItems, 
  onAddNews, 
  onUpdateNews, 
  onDeleteNews,
  currentMonthTheme 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  
  // State สำหรับ Form
  const [formData, setFormData] = useState({
    summary: '',
    category: 'Economic',
    contentType: 'Video',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0]
  });

  // เปิด Modal เพื่อเพิ่มใหม่
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      summary: '',
      category: 'Economic',
      contentType: 'Video',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  // เปิด Modal เพื่อแก้ไข
  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      summary: item.summary,
      category: item.category,
      contentType: item.contentType,
      status: item.status,
      date: item.date
    });
    setIsModalOpen(true);
  };

  // ฟังก์ชันบันทึก (ทั้งเพิ่มและแก้ไข)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // กรณีแก้ไข
      await onUpdateNews({
        ...editingItem,
        ...formData,
      });
    } else {
      // กรณีเพิ่มใหม่
      await onAddNews({
        ...formData,
        originalText: formData.summary,
        isHighlight: false,
        timestamp: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  // ฟังก์ชันลบ
  const handleDelete = async (id: string) => {
    if (window.confirm('คุณมั่นใจใช่ไหมที่จะลบข้อมูลนี้?')) {
      await onDeleteNews(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Daily Operations</h2>
          <p className="text-slate-500">Theme: {currentMonthTheme}</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add News</span>
        </button>
      </div>

      {/* ตารางแสดงผล */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Summary</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {newsItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.summary}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Modal สำหรับ Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-blue-900">
                  {editingItem ? 'Edit News' : 'Add New Content'}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea 
                  className="w-full border rounded-lg p-2 h-24"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Economic">Economic</option>
                    <option value="Policy">Policy</option>
                    <option value="Consumer">Consumer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition mt-4"
              >
                {editingItem ? 'Update Content' : 'Save Content'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
