import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon } from 'lucide-react';
// ตัด .tsx ออกเพื่อให้ Vite จัดการ Path ได้ยืดหยุ่นขึ้น
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem, Milestone, MonthPlan } from './types';
import { supabase } from '.src/lib/supabase';

// ข้อมูลคงที่สำหรับ Roadmap (คงไว้ได้)
const MOCK_ROADMAP: MonthPlan[] = [
  { month: 'April', theme: 'Songkran & Soft Power', highlights: ['Elephant Pants Viral', 'Water Festival Safety'] },
  { month: 'May', theme: 'Back to School', highlights: ['School Uniform Pricing', 'Stationery Support'] },
  { month: 'June', theme: 'Fruit Season', highlights: ['Durian Export', 'Mangosteen Festival'] },
  { month: 'July', theme: 'King\'s Birthday', highlights: ['Royal Projects', 'Community Service'] },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. ดึงข้อมูลจาก Supabase เมื่อเปิดแอป ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setNewsItems(data || []);
    }
    setLoading(false);
  };

  // --- 2. ฟังก์ชันบันทึกข้อมูลใหม่ (ใช้ใน DailyOps หรือ Archive) ---
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

  // --- 3. ฟังก์ชันแก้ไขข้อมูล (Update) ---
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
    // อัปเดต State ในหน้าจอ
    setNewsItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }
};

// --- 4. ฟังก์ชันลบข้อมูล (Delete) ---
const handleDeleteNews = async (id: string) => {
  const { error } = await supabase
    .from('news_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting:', error);
    alert('ลบข้อมูลไม่สำเร็จ');
  } else {
    // ลบออกจาก State ในหน้าจอ
    setNewsItems(prev => prev.filter(item => item.id !== id));
  }
};

  const renderContent = () => {
    if (loading) return <div className="p-8 text-center text-blue-900">กำลังโหลดข้อมูลออนไลน์...</div>;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
            milestones={[]} 
            roadmap={MOCK_ROADMAP} 
            completedCount={newsItems.filter(i => i.status === 'Published').length} 
        />;

      case 'daily':
        return <DailyOps 
            newsItems={newsItems} 
            onAddNews={handleAddNews} 
            // --- เพิ่ม 2 บรรทัดนี้ลงไปตรงนี้ครับ ---
            onUpdateNews={handleUpdateNews} 
            onDeleteNews={handleDeleteNews} 
            // ----------------------------------
            currentMonthTheme="Back to School"
        />;

      case 'archive':
        return <Archive newsItems={newsItems} />;
      default:
        return <Dashboard milestones={[]} roadmap={MOCK_ROADMAP} completedCount={0} />;
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar (เหมือนเดิมแต่เปลี่ยนเมนูเล็กน้อย) */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold leading-tight">MOC<br/><span className="text-blue-300 font-light text-base">Content Hub (Live)</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Strategic Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('daily')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'daily' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
            <CalendarIcon className="w-5 h-5" />
            <span>Add Daily News</span>
          </button>
          <button onClick={() => setActiveTab('archive')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'archive' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
            <ArchiveIcon className="w-5 h-5" />
            <span>Content Library</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
