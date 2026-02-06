import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem, Milestone, MonthPlan } from './types';
import { supabase } from './src/lib/supabase';// แก้ไข Path ให้ถูกต้อง

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [roadmap, setRoadmap] = useState<MonthPlan[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. ดึงข้อมูลจากฐานข้อมูลจริง ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, roadmapRes, milestoneRes] = await Promise.all([
        supabase.from('news_items').select('*').order('date', { ascending: false }),
        supabase.from('roadmaps').select('*').order('id', { ascending: true }),
        supabase.from('milestones').select('*').order('id', { ascending: true })
      ]);

      if (newsRes.error) throw newsRes.error;
      if (roadmapRes.error) throw roadmapRes.error;
      if (milestoneRes.error) throw milestoneRes.error;
      
      setNewsItems(newsRes.data || []);
      setRoadmap(roadmapRes.data || []);
      setMilestones(milestoneRes.data || []);
      
    } catch (error) {
      console.error('Fetch System Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ฟังก์ชันจัดการข้อมูล (CRUD) ---
  const handleAddNews = async (newItem: any) => {
    const id = crypto.randomUUID();
    const { data, error } = await supabase
      .from('news_items')
      .insert([{ ...newItem, id }])
      .select();

    if (!error && data) {
      setNewsItems(prev => [data[0], ...prev]);
    } else {
      console.error('Insert Error:', error);
      alert('บันทึกข้อมูลไม่สำเร็จ');
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
      console.error('Update Error:', error);
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
      alert('ลบข้อมูลไม่สำเร็จ');
    } else {
      setNewsItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- 3. ส่วนเรนเดอร์เนื้อหา ---
  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-900 font-medium">Connecting to MOC Cloud Database...</div>
      </div>
    );

    const currentTheme = roadmap.length > 0 ? roadmap[0].theme : "Strategic Planning";

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
            currentMonthTheme={currentTheme} 
          />
        );
      case 'archive':
        // แก้ไข: เพิ่ม setNewsItems ตามที่ Error TS2741 แจ้งเตือน
        return <Archive newsItems={newsItems} setNewsItems={setNewsItems} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold leading-tight">MOC<br/>
            <span className="text-blue-300 font-light text-base">Content Hub (Live)</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800/50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Strategic Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('daily')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'daily' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800/50'}`}>
            <CalendarIcon className="w-5 h-5" />
            <span className="font-medium">Daily Operations</span>
          </button>
          <button onClick={() => setActiveTab('archive')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'archive' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800/50'}`}>
            <ArchiveIcon className="w-5 h-5" />
            <span className="font-medium">Content Library</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
