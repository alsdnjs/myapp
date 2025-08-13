'use client';

import React, { useEffect, useState } from 'react';
import { getToken } from '@/utils/token';

interface ColumnDetail {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  content: string;
}

interface ColumnDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: number | null;
}

export default function ColumnDetailModal({ isOpen, onClose, columnId }: ColumnDetailModalProps) {
  const [column, setColumn] = useState<ColumnDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && columnId) {
      loadColumnDetail();
    }
  }, [isOpen, columnId]);

  const loadColumnDetail = async () => {
    if (!columnId) return;
    
    setLoading(true);
    try {
      const token = getToken();
      const baseUrl = 'http://localhost:8080';
      
      console.log('상세 정보 로드 시작 - columnId:', columnId);
      
      // 글 상세 정보 가져오기
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 실제 백엔드 API 호출
      console.log('백엔드 API 호출 시도 - columnId:', columnId);
      
      // 다른 가능한 경로들을 시도
      const detailResponse = await fetch(`${baseUrl}/api/board/board/detail/${columnId}`, {
        method: 'GET',
        headers
      });

      console.log('API 응답 상태:', detailResponse.status);

      if (detailResponse.ok) {
        const data = await detailResponse.json();
        console.log('글 상세 정보:', data);
        
        const columnDetail: ColumnDetail = {
          id: data.board_id || data.id,
          title: data.board_content?.substring(0, 100) + '...' || '제목 없음',
          author: data.username || data.author || '작성자',
          date: data.uploaded_at || data.date || '2024.03.21',
          views: data.view || data.views || 0,
          comments: data.comment_count || data.comments || 0,
          likes: data.like_count || data.likes || 0,
          content: data.board_content || data.content || '내용 없음'
        };
        
        setColumn(columnDetail);
      } else {
        console.error('글 상세 정보 가져오기 실패:', detailResponse.status);
        // 실패 시 임시 데이터로 설정
        const columnDetail: ColumnDetail = {
          id: columnId,
          title: `칼럼 제목 ${columnId} (API 실패)`,
          author: '작성자',
          date: '2024.03.21',
          views: 100 + (columnId * 10),
          comments: 5 + columnId,
          likes: 20 + (columnId * 5),
          content: `API 호출 실패 (${detailResponse.status}). 이것은 ${columnId}번째 칼럼의 임시 내용입니다.`
        };
        
        setColumn(columnDetail);
      }
    } catch (error) {
      console.error('글 상세 정보 로드 오류:', error);
      // 오류 시 기본 데이터로 설정
      setColumn({
        id: columnId!,
        title: '오류가 발생했습니다',
        author: '작성자',
        date: '2024.03.21',
        views: 0,
        comments: 0,
        likes: 0,
        content: '내용을 불러올 수 없습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className={`bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {/* 왼쪽: 검정 배경 (댓글 모달과 동일 구조) */}
        <div className="w-1/2 bg-black" />

        {/* 오른쪽: 상세 섹션 */}
        <div className="w-1/2 flex flex-col">
          {/* 작성자/닫기/제목/통계 - 댓글 모달 상단과 유사 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    {column?.author ? column.author[0] : '?'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{column?.author ?? '작성자'}</div>
                  <div className="text-sm text-gray-500">{column?.date ?? '날짜'}</div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 transform transition-transform duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h1 className="text-xl font-semibold mt-4 mb-2">{loading ? '불러오는 중...' : (column?.title ?? '제목')}</h1>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#e53e3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">{column?.likes ?? 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">{column?.comments ?? 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">{column?.views?.toLocaleString?.() ?? 0}</span>
              </div>
            </div>
          </div>

          {/* 본문 (스크롤) */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {column?.content ?? ''}
              </div>
            )}
          </div>

          {/* 하단 액션 (선택) */}
          <div className="border-t border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-[#e53e3e] transition-colors">좋아요</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">공유</button>
            </div>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">북마크</button>
          </div>
        </div>
      </div>
    </div>
  );
}



