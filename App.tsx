import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon, Database, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ ใส่ URL Sheety ของคุณตรงนี้
  const SHEETY_API_URL = 'https://api.sheety.co/6890f5c97042898939c323f49f57936a/mocMediaFlowData/newsItems';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHEETY_API_URL);
      const data = await response.json();
      if (data.newsItems) {
        setNewsItems(data.newsItems);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // คำนวณตัวเลขสถิติ (สำหรับโชว์ใน Dashboard)
  const stats = {
    total: newsItems.length,
    published: newsItems.filter(item => item.status === 'Published').length,
    pending: newsItems.filter(item => item.status !== 'Published').length,
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading MOC Hub Data...</p>
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header Stats ตามรูปตัวอย่าง */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><TrendingUp /></div>
                <div>
                  <p className="text-sm text-slate-500">Total Content</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total} Pieces</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle /></div>
                <div>
                  <p className="text-sm text-slate-500">Published</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.published}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Clock /></div>
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <Dashboard 
              milestones={[]} // คุณสามารถเพิ่มข้อมูล Milestone ใน Sheets และดึงมาใส่ตรงนี้ได้
              roadmap={[]} 
              completedCount={stats.published} 
            />
          </div>
        );
      case 'daily':
        return <DailyOps newsItems={newsItems} onAddNews={async()=>{}} onUpdateNews={async()=>{}} onDeleteNews={async()=>{}} currentMonthTheme="MOC Digital" />;
      case 'archive':
        return <Archive newsItems={newsItems} setNewsItems={setNewsItems} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar - ปรับสีตามรูปตัวอย่าง */}
      <aside className="w-72 bg-[#0F172A] text-white fixed h-full flex flex-col shadow-2xl">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
            <h1 className="text-xl font-bold tracking-tight">MOC HUB</h1>
          </div>
          
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800'}`}>
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('daily')} className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'daily' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800'}`}>
              <CalendarIcon size={20} />
              <span className="font-medium">Daily Operations</span>
            </button>
            <button onClick={() => setActiveTab('archive')} className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'archive' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800'}`}>
              <ArchiveIcon size={20} />
              <span className="font-medium">Content Archive</span>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Data Source</p>
            <p className="text-sm font-medium text-blue-400 flex items-center">
              <Database size={14} className="mr-2" /> Google Sheets
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">{activeTab}</h2>
            <p className="text-slate-500">Ministry of Commerce Strategy Monitor</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Refresh Data
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
