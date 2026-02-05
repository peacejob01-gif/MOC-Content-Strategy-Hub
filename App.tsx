import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem, Milestone, MonthPlan } from './types';
import { supabase } from './src/lib/supabase'; // ตรวจสอบ path ให้ถูกต้อง (ปกติเป็น ./src/...)

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [roadmap, setRoadmap] = useState<MonthPlan[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. ดึงข้อมูลจาก Supabase เมื่อเปิดแอป ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลพร้อมกันจาก 3 ตารางเพื่อความรวดเร็ว
      const [newsRes, roadmapRes, milestoneRes] = await Promise.all([
        supabase.from('news_items').select('*').order('date', { ascending: false }),
        supabase.from('roadmaps').select('*').order('id', { ascending: true }),
        supabase.from('milestones').select('*').order('date', { ascending: true })
      ]);

      if (newsRes.error) throw newsRes.error;
      
      setNewsItems(newsRes.data || []);
      setRoadmap(roadmapRes.data || []);
      setMilestones(milestoneRes.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ฟังก์ชันจัดการข้อมูล (CRUD) ---
  const handleAddNews = async (newItem: Omit<NewsItem, 'id'>) => {
    const id = crypto.randomUUID();
    const { data, error } = await supabase
      .from('news_items')
      .insert([{ ...newItem, id }])
      .select();

    if (!error && data) {
      setNewsItems(prev => [data[0], ...prev]);
    } else {
      alert('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  const handleUpdateNews = async (updatedItem: NewsItem) => {
    const { error } = await supabase
      .from('news_items')
      .update({
        summary: updatedItem.summary,
        category: updatedItem.category,
        contentType: updatedItem.contentType,
        status: updatedItem.status,
        date: updatedItem.date,
        originalText: updatedItem.originalText
      })
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating:', error);
      alert('แก้ไขข้อมูลไม่สำเร็จ');
    } else {
      setNewsItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
      alert('ลบข้อมูลไม่สำเร็จ');
    } else {
      setNewsItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- 3. ส่วนการแสดงผลเนื้อหา ---
  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-full">
        <div className="text-blue-900 animate-pulse font-medium">กำลังโหลดข้อมูลจากระบบออนไลน์...</div>
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            milestones={milestones} 
            roadmap={roadmap} 
            completedCount={newsItems.filter(i => i.status === 'Published').length} 
          />
        );
      case 'daily':
        return (
          <DailyOps 
            newsItems={newsItems} 
            onAddNews={handleAddNews} 
            onUpdateNews={handleUpdateNews} 
            onDeleteNews={handleDeleteNews} 
            currentMonthTheme={roadmap.find(r => r.month === 'May')?.theme || "Strategic Plan"} // เปลี่ยนตามเดือนปัจจุบันได้
          />
        );
      case 'archive':
        return <Archive newsItems={newsItems} />;
      default:
        return <Dashboard milestones={milestones} roadmap={roadmap} completedCount={0} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold leading-tight">MOC<br/>
            <span className="text-blue-300 font-light text-base">Content Hub (Live)</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-700 shadow-inner' : 'hover:bg-blue-800/50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Strategic Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('daily')} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'daily' ? 'bg-blue-700 shadow-inner' : 'hover:bg-blue-800/50'}`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Add Daily News</span>
          </button>
          <button 
            onClick={() => setActiveTab('archive')} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'archive' ? 'bg-blue-700 shadow-inner' : 'hover:bg-blue-800/50'}`}
          >
            <ArchiveIcon className="w-5 h-5" />
            <span>Content Library</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
