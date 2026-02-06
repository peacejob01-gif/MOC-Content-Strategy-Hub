import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, LayoutList } from 'lucide-react';
import { NewsItem } from '../types';

interface DailyOpsProps {
  newsItems: NewsItem[];
  onAddNews: (newItem: any) => Promise<void>; // เปลี่ยนเป็น any ชั่วคราวเพื่อให้ผ่าน build
  onUpdateNews: (updatedItem: any) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  currentMonthTheme: string;
}

export const DailyOps: React.FC<DailyOpsProps> = ({ 
  newsItems = [], 
  onAddNews, 
  onUpdateNews, 
  onDeleteNews,
  currentMonthTheme 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    summary: '',
    category: 'Economic' as any,
    contentType: 'Video' as any,
    status: 'Draft' as any,
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      summary: '',
      category: 'Economic' as any,
      contentType: 'Video' as any,
      status: 'Draft' as any,
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await onUpdateNews({ ...editingItem, ...formData });
    } else {
      await onAddNews({
        ...formData,
        originalText: formData.summary,
        isHighlight: false,
        timestamp: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Daily Operations</h2>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add News
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-bold text-slate-600">Date</th>
              <th className="p-4 font-bold text-slate-600">Summary</th>
              <th className="p-4 font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {newsItems.map((item) => (
              <tr key={item.id}>
                <td className="p-4 text-sm">{item.date}</td>
                <td className="p-4 font-medium">{item.summary}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteNews(item.id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} News</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea 
                className="w-full border p-2 rounded-lg h-32" 
                value={formData.summary} 
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-500">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
