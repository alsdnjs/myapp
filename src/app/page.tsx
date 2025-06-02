'use client';

import React, { useEffect, useState } from 'react';
import { RssArticle } from '@/utils/rssApi';

type Category = 'IT' | 'sports' | 'economy';

const categoryBanners = {
  IT: {
    title: 'IT 뉴스',
    description: '최신 IT 트렌드와 기술 소식을 확인하세요',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
  },
  sports: {
    title: '스포츠 뉴스',
    description: '국내외 스포츠 소식과 경기 결과를 확인하세요',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop'
  },
  economy: {
    title: '경제 뉴스',
    description: '주요 경제 동향과 금융 시장 소식을 확인하세요',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
  }
};

export default function Home() {
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<Category>('IT');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news for category:', currentCategory);
        const response = await fetch(`/api/news?category=${currentCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        console.log('Received news data:', data);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentCategory]);

  const handleCategoryChange = (category: Category) => {
    setCurrentCategory(category);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 메인 배너 섹션 */}
      <section className="relative h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryBanners[currentCategory].image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{categoryBanners[currentCategory].title}</h1>
            <p className="text-xl">{categoryBanners[currentCategory].description}</p>
          </div>
        </div>
      </section>

      {/* 카테고리 네비게이션 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => handleCategoryChange('IT')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentCategory === 'IT'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => handleCategoryChange('sports')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentCategory === 'sports'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                스포츠
              </button>
              <button
                onClick={() => handleCategoryChange('economy')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentCategory === 'economy'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                경제
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 뉴스 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {article.imageUrl && (
                  <div className="relative h-48">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{article.source}</span>
                    <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 