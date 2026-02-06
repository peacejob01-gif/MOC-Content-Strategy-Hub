import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, LayoutList, Search } from 'lucide-react';
import { NewsItem } from '../types';

interface DailyOpsProps {
  newsItems: NewsItem[];
  onAddNews: (newItem: Omit<NewsItem, 'id'>) => Promise<void>;
  onUpdateNews: (updatedItem: NewsItem) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  currentMonthTheme: string;
}

export const DailyOps: React.FC<DailyOpsProps> = ({ 
  newsItems = [], // ป้องกันกรณีส่งค่ามาเป็น null
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
    if (window.confirm('คุณมั่นใจใช่ไหมที่จะลบข้อมูลนี้? ข้อมูลจะถูกลบออกจากฐานข้อมูล Cloud ทันที')) {
      await onDeleteNews(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Daily Operations</h2>
          <div className="flex items-center mt-1 text-slate-500">
            <span className="text-sm font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md mr-2">Live Mode</span>
            <p className="text-sm">Current Theme: <span className="text-slate-700 font-semibold">{currentMonthTheme}</span></p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">Create New Content</span>
        </button>
      </div>

      {/* ตารางแสดงผล */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {newsItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Content Summary</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {newsItems.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{item.summary}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <LayoutList className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Content Found</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">
              ฐานข้อมูลว่างเปล่า กรุณากดปุ่ม Create New Content เพื่อเริ่มเพิ่มข้อมูลลงในระบบ Cloud
            </p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
               <h3 className="text-xl font-bold">
                 {editingItem ? 'Edit Content Details' : 'New Content Entry'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                 <X className="w-6 h-6" />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb
