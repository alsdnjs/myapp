'use client';

import React, { useEffect, useState } from 'react';
import { NaverNewsArticle, fetchNaverNews } from '@/utils/naverApi';
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function SportsPage() {
  const [news, setNews] = useState<NaverNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadNews = async () => {
      console.log('Starting to load news...');
      setLoading(true);
      try {
        console.log('Calling fetchNaverNews...');
        const newsData = await fetchNaverNews('sports');
        console.log('Received news data:', newsData);
        setNews(newsData);
      } catch (error) {
        console.error('Error in loadNews:', error);
      }
      setLoading(false);
    };

    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 주요 뉴스 배너 영역 - CGV 스타일 */}
      <div className="w-full bg-[#00334e] py-0">
        <div className="relative">
          {/* 큰 배너 이미지 영역 */}
          <div className="w-full h-[600px] relative overflow-hidden">
            {/* 배경 이미지 */}
            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center overflow-hidden">
              <div className="text-8xl font-bold text-white opacity-20">Sports News</div>
              {/* 어두운 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            </div>
            
            {/* 콘텐츠 영역 */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10">
              <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold mb-6">월드컵 예선, 한국 축구의 새로운 도전</h1>
                <p className="text-xl max-w-4xl mx-auto mb-8 leading-relaxed">
                  한국 축구 대표팀이 월드컵 예선을 앞두고 새로운 도전을 시작합니다. 손흥민 주장을 중심으로 한 새로운 세대의 선수들이 모여 더 강력한 팀워크를 보여줄 것으로 기대됩니다...
                </p>
                <div className="flex justify-center gap-4">
                  <button className="px-8 py-3 bg-[#e53e3e] text-white font-medium rounded-md hover:bg-[#c53030] transition">
                    기사 보기
                  </button>
                  <button className="px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition">
                    공유하기
                  </button>
                </div>
                <div className="mt-6 text-gray-300">스포츠 · 2시간 전 · 조회수 1k</div>
              </div>
            </div>
          </div>

          {/* 하단 인디케이터/컨트롤 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#e53e3e] rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              <input 
                type="text" 
                placeholder="뉴스검색" 
                className="w-full py-3 px-4 pl-12 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a3ec8] shadow" 
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-6">
        {/* 카테고리 네비게이션 */}
        <div className="mb-6 border-b border-gray-200 pb-2">
          <div className="flex space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]"
            >
              IT
            </Link>
            <Link 
              href="/sports" 
              className="px-3 py-2 text-[#5a3ec8]"
            >
              스포츠
            </Link>
            <Link 
              href="/economy" 
              className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]"
            >
              경제
            </Link>
          </div>
        </div>

        <div className="flex gap-8">
          {/* 메인 뉴스 영역 */}
          <div className="flex-1">
            {/* 뉴스 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // 로딩 상태 표시
                [...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Loading...</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                      <p className="text-gray-600 mb-4">Loading...</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Loading...</span>
                        <span>Loading...</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // 네이버 뉴스 데이터 표시
                news.map((article, index) => (
                  <Link 
                    key={index} 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{article.source}</span>
                          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* 더보기 버튼 */}
            <div className="flex justify-center mb-10">
              <button className="px-4 py-2 border border-gray-200 rounded text-sm text-gray-900 hover:bg-gray-100">더보기</button>
            </div>
          </div>

          {/* 우측 사이드바 */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
} 