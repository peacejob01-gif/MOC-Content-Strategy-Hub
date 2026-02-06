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

  const handleDelete = async (id: string) => {
    if (window.confirm('ยืนยันการลบข้อมูลนี้ออกจากระบบ?')) {
      await onDeleteNews(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Daily Operations</h2>
          <p className="text-sm text-slate-500 mt-1">Theme: <span className="font-semibold">{currentMonthTheme}</span></p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg"
        >
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
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{item.summary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4
