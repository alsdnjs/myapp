"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CommentModal from "@/components/CommentModal";
import ColumnWriteModal from "./ColumnWriteModal";
import { getToken } from '@/utils/token';

interface Column {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  content: string;
}

// Mock data for columns with fixed values
const mockColumns: Column[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `칼럼 제목 ${i + 1}`,
  author: `작성자 ${i + 1}`,
  date: '2024.03.21',
  views: 100 + (i * 50),
  comments: 10 + (i * 2),
  likes: 20 + (i * 5),
  content: '칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다.'
}));

export default function Column() {
  // 인기 칼럼 슬라이더 상태
  const [currentSliderPage, setCurrentSliderPage] = useState(0);
  const sliderItemsPerPage = 3;
  const totalSliderPages = Math.ceil(10 / sliderItemsPerPage); // 상위 10개 칼럼

  // 전체 칼럼 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 더보기 상태 관리
  const [expandedColumns, setExpandedColumns] = useState<number[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 글쓰기 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [columns, setColumns] = useState(mockColumns);
  
  // columns 상태가 선언된 후에 totalPages 계산
  const totalPages = Math.ceil(columns.length / itemsPerPage);

  const toggleExpand = (columnId: number) => {
    setExpandedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  // 인기 칼럼 슬라이더 함수
  const nextSliderPage = () => {
    setCurrentSliderPage((prev) => (prev + 1) % totalSliderPages);
  };

  const prevSliderPage = () => {
    setCurrentSliderPage((prev) => (prev - 1 + totalSliderPages) % totalSliderPages);
  };

  const getVisibleTopColumns = () => {
    const startIndex = currentSliderPage * sliderItemsPerPage;
    const endIndex = startIndex + sliderItemsPerPage;
    return columns.slice(0, 10).slice(startIndex, endIndex);
  };

  // 전체 칼럼 페이지네이션 함수
  const getVisibleColumns = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return columns.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCommentClick = (columnId: number) => {
    setSelectedColumnId(columnId);
    setIsCommentModalOpen(true);
  };

  const handleAddColumn = (newColumn: Column) => {
    setColumns(prev => [newColumn, ...prev]);
  };

  // 클라이언트 사이드에서만 실행되도록 useEffect 사용
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // 컴포넌트 마운트 시 토큰을 확인하여 로그인 상태 설정
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  if (!mounted) {
    return null; // 서버 사이드 렌더링 시에는 아무것도 렌더링하지 않음
  }

  const selectedColumn = mockColumns.find(c => c.id === selectedColumnId);

  return (
    <div className="min-h-screen pt-4 bg-gray-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* 인기 칼럼 슬라이더 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">많이 본 칼럼</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevSliderPage}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSliderPage}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getVisibleTopColumns().map((column) => (
                  <div key={column.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 font-bold">#{column.id}</span>
                        <span className="text-sm text-gray-500">{column.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <h3 className="font-bold mb-2 line-clamp-2">{column.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{column.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{column.author}</span>
                      <div className="flex items-center space-x-3">
                        <span>{column.comments} 댓글</span>
                        <span>{column.likes} 좋아요</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {Array.from({ length: totalSliderPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSliderPage(i)}
                      className={`w-2 h-2 rounded-full ${
                        currentSliderPage === i ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 전체 칼럼 목록 */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">전체 칼럼</h2>
                {isLoggedIn && (
                  <button 
                    onClick={() => setIsWriteModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    글쓰기
                  </button>
                )}
              </div>
              <div className="space-y-8">
                {getVisibleColumns().map((column) => (
                  <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* 헤더 */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/150?img=${column.id}`} 
                            alt={column.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{column.author}</h3>
                          <p className="text-sm text-gray-500">{column.date}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* 내용 */}
                    <div className="px-4">
                      <h2 className="text-xl font-bold mb-3">{column.title}</h2>
                      <div className="relative">
                        <p className={`text-gray-600 mb-4 ${!expandedColumns.includes(column.id) ? 'line-clamp-2' : ''}`}>
                          {column.content}
                        </p>
                        {column.content.length > 100 && (
                          <button
                            onClick={() => toggleExpand(column.id)}
                            className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center"
                          >
                            {expandedColumns.includes(column.id) ? (
                              <>
                                접기
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                </svg>
                              </>
                            ) : (
                              <>
                                더보기
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 상호작용 버튼 */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-600 hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleCommentClick(column.id)}
                            className="text-gray-600 hover:text-blue-500 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                        <button className="text-gray-600 hover:text-blue-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>

                      {/* 통계 */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-semibold">{column.likes.toLocaleString()} 좋아요</span>
                        <span>{column.comments} 댓글</span>
                        <span>{column.views.toLocaleString()} 조회</span>
                      </div>

                      {/* 댓글 섹션 */}
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="댓글을 입력하세요..."
                            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="text-blue-500 font-semibold hover:text-blue-600">
                            작성
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>

            {/* 글쓰기 모달 */}
            {isWriteModalOpen && (
              <ColumnWriteModal
                onClose={() => setIsWriteModalOpen(false)}
                onSubmit={handleAddColumn}
              />
            )}

            {/* 댓글 모달 */}
            {isCommentModalOpen && selectedColumnId && (
              <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => {
                  setIsCommentModalOpen(false);
                  setSelectedColumnId(null);
                }}
                columnInfo={selectedColumn ? {
                  title: selectedColumn.title,
                  author: selectedColumn.author,
                  date: selectedColumn.date,
                  content: selectedColumn.content,
                  likes: selectedColumn.likes,
                  commentsCount: selectedColumn.comments,
                } : undefined}
                comments={[]}
              />
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
} 