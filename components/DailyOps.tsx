import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, LayoutList } from 'lucide-react';
import { NewsItem } from '../types';

interface DailyOpsProps {
  newsItems: NewsItem[];
  onAddNews: (newItem: Omit<NewsItem, 'id'>) => Promise<void>;
  onUpdateNews: (updatedItem: NewsItem) => Promise<void>;
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
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    summary: '',
    category: 'Economic',
    contentType: 'Video',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0]
  });

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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Daily Operations</h2>
          <p className="text-sm text-slate-500 mt-1">Theme: {currentMonthTheme}</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all">
          <Plus className="w-5 h-5" />
          <span className="font-bold">Add News</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {newsItems.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Summary</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{item.summary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteNews(item.id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <LayoutList className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-slate-400">No Content Found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
               <h3 className="text-xl font-bold">{editingItem ? 'Edit' : 'New'}</h3>
               <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Summary</label>
                <textarea className="w-full border-2 border-slate-100 rounded-xl p-4 h-32" value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
