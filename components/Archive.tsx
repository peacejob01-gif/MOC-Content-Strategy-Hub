import React from 'react';
import { NewsItem } from '../types';

interface ArchiveProps {
  newsItems: NewsItem[];
  setNewsItems: React.Dispatch<React.SetStateAction<NewsItem[]>>; // เพิ่มบรรทัดนี้
}

export const Archive: React.FC<ArchiveProps> = ({ newsItems, setNewsItems }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Content Library</h2>
      <div className="grid gap-4">
        {newsItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">{item.category}</span>
                <h3 className="font-bold text-slate-800 mt-1">{item.summary}</h3>
                <p className="text-sm text-slate-500 mt-2">{item.date}</p>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">
                {item.contentType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
