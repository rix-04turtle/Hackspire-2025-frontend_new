import React from 'react';
import { Newspaper, Calendar, Tag } from 'lucide-react';

const dummyNews = [
  {
    id: 1,
    title: "New Wheat Variety Shows Promise for Drought Resistance",
    source: "AgriNews Today",
    date: "Oct 26, 2023",
    category: "Crops",
    snippet: "Researchers have developed a new wheat strain that requires 30% less water, a breakthrough for arid farming regions.",
  },
  {
    id: 2,
    title: "Global Corn Prices Surge Amidst Supply Chain Issues",
    source: "Market Watch",
    date: "Oct 25, 2023",
    category: "Market",
    snippet: "Unexpected logistical bottlenecks have led to a sharp increase in corn prices worldwide, affecting both farmers and consumers.",
  },
  {
    id: 3,
    title: "Organic Farming Techniques Boost Soil Health and Yields",
    source: "Green Fields Journal",
    date: "Oct 24, 2023",
    category: "Techniques",
    snippet: "A long-term study reveals that organic farming methods can significantly improve soil microbiome and lead to sustainable crop yields.",
  },
];

const NewsSection = ({ className }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Newspaper className="h-7 w-7 text-green-800" />
        <h2 className="text-2xl font-bold text-green-900">Latest Agri News</h2>
      </div>
      <div className="space-y-4">
        {dummyNews.map((item) => (
          <div key={item.id} className="bg-white/70 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-green-200 group">
            <h3 className="font-bold text-lg text-green-900 group-hover:text-green-700 transition-colors">{item.title}</h3>
            <p className="text-gray-700 text-sm mt-1">{item.snippet}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span className="font-medium">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;