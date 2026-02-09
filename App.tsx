import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem } from './types';

// ข้อมูลจำลอง (Mockup Data) เพื่อให้เห็นหน้าตาเว็บทันที
const MOCK_DATA: NewsItem[] = [
  {
    id: '1',
    summary: 'พาณิชย์ลดราคา! ช่วยประชาชนรับปี 2026',
    date: '2026-02-09',
    category: 'Policy to People',
    contentType: 'Video',
    status: 'Published',
    isHighlight: true,
    originalText: 'โครงการพาณิชย์ลดราคาช่วยประชาชน...',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    summary: 'สรุปภาวะการส่งออกเดือนมกราคม โตต่อเนื่อง 5%',
    date: '2026-02-08',
    category: 'MOC Update',
    contentType: 'Banner',
    status: 'Draft',
    isHighlight: false,
    originalText: 'ตัวเลขการส่งออกไทยในเดือนมกราคม...',
    timestamp: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  // สถิติสำหรับ Dashboard
  const stats = {
    total: newsItems.length,
    published: newsItems.filter(i => i.status === 'Published').length,
    pending: newsItems.filter(i => i.status !== 'Published').length
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><TrendingUp /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Content</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total} Pieces</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Published</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.published}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Clock /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                </div>
              </div>
            </div>

            <Dashboard 
              milestones={[]} 
              roadmap={[]} 
              completedCount={stats.published} 
            />
          </div>
        );
      case 'daily':
        return (
          <DailyOps 
            newsItems={newsItems} 
            onAddNews={async (item) => setNewsItems([item, ...newsItems])} 
            onUpdateNews={async (id, item) => setNewsItems(newsItems.map(n => n.id === id ? {...n, ...item} : n))} 
            onDeleteNews={async (id) => setNewsItems(newsItems.filter(n => n.id !== id))} 
            currentMonthTheme="MOC Digital Strategy 2026" 
          />
        );
      case 'archive':
        return <Archive newsItems={newsItems} setNewsItems={setNewsItems} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar - Midnight Blue ตามรูปเป้าหมาย */}
      <aside className="w-72 bg-[#0F172A] text-white fixed h-full flex flex-col shadow-2xl z-30">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">M</div>
            <h1 className="text-xl font-bold tracking-tight">MOC HUB</h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'daily', label: 'Daily Operations', icon: CalendarIcon },
              { id: 'archive', label: 'Content Archive', icon: ArchiveIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">System Status</p>
            <p className="text-sm font-medium text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Local Runtime Mode
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 min-h-screen overflow-y-auto">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight capitalize">{activeTab}</h2>
            <p className="text-slate-500 mt-1">MOC Media Strategy Hub & Content Planner</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
              Feb 9, 2026
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
