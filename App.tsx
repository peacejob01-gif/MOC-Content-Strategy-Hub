import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Archive as ArchiveIcon, Database } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DailyOps } from './components/DailyOps';
import { Archive } from './components/Archive';
import { NewsItem } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'archive'>('dashboard');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ เปลี่ยน URL ตรงนี้ให้เป็น API Endpoint ที่คุณได้จาก Sheety ครับ
  const SHEETY_API_URL = 'https://api.sheety.co/71008b0fa6a5f4f59dbc7934af0852b9/mocInfo/ชีต1';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHEETY_API_URL);
      const data = await response.json();
      
      // Sheety จะครอบข้อมูลด้วยชื่อ Sheet (newsItems)
      // และแปลงหัวตารางเป็น camelCase (เช่น original_text จะกลายเป็น originalText)
      if (data.newsItems) {
        setNewsItems(data.newsItems);
      }
    } catch (error) {
      console.error('Error fetching data from Sheety:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-900 font-medium">Connecting to Google Sheets via Sheety...</div>
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            milestones={[]} 
            roadmap={[]} 
            completedCount={newsItems.filter(i => i.status === 'Published').length} 
          />
        );
      case 'daily':
        return (
          <DailyOps 
            newsItems={newsItems} 
            onAddNews={async () => alert('ฟังก์ชันเพิ่มข้อมูลกำลังถูกย้ายไปที่ Google Sheets')} 
            onUpdateNews={async () => {}} 
            onDeleteNews={async () => {}} 
            currentMonthTheme="MOC Digital Transformation" 
          />
        );
      case 'archive':
        return <Archive newsItems={newsItems} setNewsItems={setNewsItems} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      <aside className="w-64 bg-[#003366] text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold leading-tight uppercase">MOC Hub<br/>
            <span className="text-blue-300 font-light text-xs italic flex items-center mt-1">
              <Database className="w-3 h-3 mr-1" /> Google Sheets Powered
            </span>
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
