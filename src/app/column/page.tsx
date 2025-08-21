"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CommentModal from "@/components/CommentModal";
import ColumnDetailModal from "./ColumnDetailModal";
import ColumnWriteModal from "./ColumnWriteModal";
import { getToken } from '@/utils/token';
import ColumnEditModal, { ColumnEditData } from './ColumnEditModal';
import { parseTitleAndContent } from '@/utils/articleStorage';
import ImageGallery from '@/components/ImageGallery'; // 이미지 갤러리 컴포넌트 추가

interface Column {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  content: string;
  image_url?: string;
  imageUrls?: string; // 여러 이미지를 위한 필드 추가
  imageIds?: string; // 이미지 ID들을 위한 필드 추가
  user_id?: number; // 사용자 ID 필드 추가
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

  // 전체 칼럼 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 더보기 상태 관리
  const [expandedColumns, setExpandedColumns] = useState<number[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<ColumnEditData | null>(null);
  
  // 글쓰기 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [columns, setColumns] = useState(mockColumns);
  
  // columns 상태가 선언된 후에 totalPages 계산
  const totalPages = Math.ceil(columns.length / itemsPerPage);

  // 서버 아이템을 화면 모델로 변환
  const mapServerItemToColumn = (item: any): Column => {
    const { title, content } = parseTitleAndContent(item.board_content || item.content);
    
    // 디버깅: 백엔드 응답 구조 확인
    console.log('백엔드 응답 데이터:', item);
    console.log('이미지 URL (image_url):', item.image_url);
    console.log('이미지 URL (imageUrl):', item.imageUrl);
    console.log('이미지 URL (image_path):', item.image_path);
    console.log('이미지 URL (attachment_url):', item.attachment_url);
    
    // 가능한 모든 이미지 필드명 시도
    const imageUrl = item.image_url || item.imageUrl || item.image_path || item.attachment_url || item.file_url;
    
    // 백엔드 이미지 API 엔드포인트로 URL 변환
    let fullImageUrl = null;
    let multipleImageUrls = null;
    
    if (imageUrl) {
      if (imageUrl.startsWith('/upload/')) {
        // /upload/파일명.png → /api/board/image/파일명.png
        const filename = imageUrl.replace('/upload/', '');
        fullImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}/api/board/image/${filename}`;
      } else if (!imageUrl.startsWith('http')) {
        // 상대 경로인 경우
        fullImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}${imageUrl}`;
      } else {
        // 이미 전체 URL인 경우
        fullImageUrl = imageUrl;
      }
    }
    
    // imageUrls 필드 처리 (여러 이미지) - 백엔드 요청에 따라 우선 사용
    if (item.imageUrls) {
      console.log('백엔드에서 imageUrls 필드 발견:', item.imageUrls);
      console.log('imageUrls 타입:', typeof item.imageUrls);
      
      // imageUrls 배열을 우선 사용하되, URL 변환 필요
      if (typeof item.imageUrls === 'string') {
        // 쉼표로 구분된 문자열인 경우
        const urls = item.imageUrls.split(',').map((url: string) => {
          const trimmedUrl = url.trim();
          console.log('처리 중인 URL:', trimmedUrl);
          
          if (trimmedUrl.startsWith('/upload/')) {
            // /upload/파일명.png → /api/board/image/파일명.png
            const filename = trimmedUrl.replace('/upload/', '');
            const transformedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}/api/board/image/${filename}`;
            console.log('URL 변환:', trimmedUrl, '→', transformedUrl);
            return transformedUrl;
          } else if (!trimmedUrl.startsWith('http')) {
            // 상대 경로인 경우
            const transformedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}${trimmedUrl}`;
            console.log('상대 경로 변환:', trimmedUrl, '→', transformedUrl);
            return transformedUrl;
          } else {
            // 이미 전체 URL인 경우
            console.log('전체 URL 유지:', trimmedUrl);
            return trimmedUrl;
          }
        });
        multipleImageUrls = urls.join(',');
        console.log('최종 변환된 multipleImageUrls:', multipleImageUrls);
      } else if (Array.isArray(item.imageUrls)) {
        // 이미 배열인 경우
        console.log('imageUrls가 이미 배열입니다:', item.imageUrls);
        multipleImageUrls = item.imageUrls.map((url: string) => {
          if (url.startsWith('/upload/')) {
            const filename = url.replace('/upload/', '');
            return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}/api/board/image/${filename}`;
          }
          return url;
        }).join(',');
      }
    } else {
      console.log('백엔드에 imageUrls 필드가 없음');
    }
    
    // imageUrls가 없으면 image_url을 fallback으로 사용
    if (!multipleImageUrls && imageUrl) {
      console.log('image_url을 fallback으로 사용:', imageUrl);
      multipleImageUrls = imageUrl;
    }
    
    // 디버깅: URL 변환 과정 확인
    console.log('원본 imageUrl:', imageUrl);
    console.log('원본 imageUrls:', item.imageUrls);
    console.log('최종 multipleImageUrls:', multipleImageUrls);
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    
    return {
      id: item.board_id || item.id,
      title: title || '제목 없음',
      author: item.username || item.author || '작성자',
      date: item.uploaded_at || item.date || '2024.03.21',
      views: item.view || item.views || item.view_count || 0,
      comments: item.comment_count || item.comments || 0,
      likes: item.like_count || item.likes || 0,
      content: content || '내용 없음',
      image_url: fullImageUrl || undefined,
      imageUrls: multipleImageUrls || undefined, // 여러 이미지를 위한 필드
      imageIds: item.imageIds || item.image_ids || undefined, // 이미지 ID들을 위한 필드
      user_id: item.user_id || item.userId // 사용자 ID 필드
    };
  };

  const toggleExpand = (columnId: number) => {
    setExpandedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  // 외부 클릭 시 액션 메뉴 닫기 (메뉴/버튼 내부 클릭은 유지)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (openActionMenuId == null) return;
      const root = document.querySelector(`[data-action-root="${openActionMenuId}"]`) as HTMLElement | null;
      if (root && e.target instanceof Node && root.contains(e.target)) return;
      setOpenActionMenuId(null);
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenActionMenuId(null); };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [openActionMenuId]);

  const toggleActionMenu = (e: React.MouseEvent, columnId: number) => {
    e.stopPropagation();
    setOpenActionMenuId(prev => (prev === columnId ? null : columnId));
  };

  const handleEditColumn = (e: React.MouseEvent, column: Column) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    setEditTarget({ id: column.id, content: column.content });
  };

  const handleDeleteColumn = async (e: React.MouseEvent, columnId: number) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const resp = await fetch(`${baseUrl}/api/board/board/delete/${columnId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status === 204 || resp.status === 200) {
        setColumns(prev => prev.filter(c => c.id !== columnId));
      } else if (resp.status === 403) {
        alert('작성자만 삭제할 수 있습니다.');
      } else if (resp.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (resp.status === 404) {
        alert('게시글을 찾을 수 없습니다.');
      } else {
        const text = await resp.text().catch(() => '');
        console.error('삭제 실패:', resp.status, text);
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 인기 칼럼 슬라이더 함수
  const getTotalSliderPages = () => {
    const sortedByViewsDesc = [...columns].sort((a, b) => (b.views || 0) - (a.views || 0));
    const topTen = sortedByViewsDesc.slice(0, 10);
    return Math.ceil(topTen.length / sliderItemsPerPage) || 1;
  };

  const nextSliderPage = () => {
    const pages = getTotalSliderPages();
    setCurrentSliderPage((prev) => (prev + 1) % pages);
  };

  const prevSliderPage = () => {
    const pages = getTotalSliderPages();
    setCurrentSliderPage((prev) => (prev - 1 + pages) % pages);
  };

  const getVisibleTopColumns = () => {
    const sortedByViewsDesc = [...columns].sort((a, b) => (b.views || 0) - (a.views || 0));
    const topTen = sortedByViewsDesc.slice(0, 10);
    const startIndex = currentSliderPage * sliderItemsPerPage;
    const endIndex = startIndex + sliderItemsPerPage;
    return topTen.slice(startIndex, endIndex);
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

  const handleColumnClick = (columnId: number) => {
    console.log('글 클릭됨 - columnId:', columnId);
    setSelectedColumnId(columnId);
    setIsDetailModalOpen(true);
    // 상세에서 조회수가 증가하므로 UX를 위해 낙관적 증가
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, views: (c.views || 0) + 1 } : c));
  };

  const handleAddColumn = async (newColumn: Column) => {
    // 글 작성 후 서버에서 최신 목록을 다시 가져오기
    try {
      const token = getToken();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/board/board`, {
        method: 'GET',
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('글 작성 후 최신 목록:', data);
        const serverColumns: Column[] = data.map(mapServerItemToColumn);
        setColumns(serverColumns);
      } else {
        console.error('글 작성 후 목록 새로고침 실패:', response.status);
        // 실패 시 기존 방식으로 추가
        setColumns(prev => [newColumn, ...prev]);
      }
    } catch (error) {
      console.error('글 작성 후 목록 새로고침 오류:', error);
      // 오류 시 기존 방식으로 추가
      setColumns(prev => [newColumn, ...prev]);
    }
  };

  // 클라이언트 사이드에서만 실행되도록 useEffect 사용
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    
    // 로그인 상태 확인
    const token = getToken();
    setIsLoggedIn(!!token);
    // 현재 사용자 정보 로드 (user_id 확인)
    const loadMe = async () => {
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/user`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user_id) setCurrentUserId(data.user_id);
          else if (data.id) setCurrentUserId(data.id);
        }
      } catch (e) {
        console.error('내 정보 로드 실패', e);
      }
    };
    loadMe();
    
    // 백엔드에서 글 목록 가져오기
    const fetchColumns = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${baseUrl}/api/board/board`, {
          method: 'GET',
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('서버에서 받은 글 목록:', data);
          const serverColumns: Column[] = data.map(mapServerItemToColumn);
          setColumns(serverColumns);
        } else {
          console.error('글 목록 가져오기 실패:', response.status);
          // 실패 시 기존 mock 데이터 사용
          setColumns(mockColumns);
        }
      } catch (error) {
        console.error('글 목록 가져오기 오류:', error);
        // 오류 시 기존 mock 데이터 사용
        setColumns(mockColumns);
      }
    };
    
    fetchColumns();
  }, []);

  if (!mounted) {
    return null; // 서버 사이드 렌더링 시에는 아무것도 렌더링하지 않음
  }

  const selectedColumn = columns.find(c => c.id === selectedColumnId);

  return (
    <div className="min-h-screen pt-4 bg-gray-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* 인기 칼럼 슬라이더 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">인기 칼럼</h2>
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
                {getVisibleTopColumns().map((column, index) => (
                  <div 
                    key={column.id} 
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleColumnClick(column.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 font-bold">#{currentSliderPage * sliderItemsPerPage + index + 1}</span>
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
                  {Array.from({ length: getTotalSliderPages() }, (_, i) => (
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
                  <div 
                    key={column.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleColumnClick(column.id)}
                  >
                    {/* 헤더 */}
                    <div className="p-4 flex items-center justify-between relative" data-action-root={column.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/150?img=${column.id}`} 
                            alt={column.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{column.author}</div>
                          <div className="text-sm text-gray-500">{column.date}</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleActionMenu(e, column.id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-haspopup="menu"
                        aria-expanded={openActionMenuId === column.id}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {openActionMenuId === column.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          role="menu"
                          className="absolute right-4 top-12 z-20 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1"
                        >
                          <button
                            role="menuitem"
                            onClick={(e) => handleEditColumn(e, column)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            수정
                          </button>
                          {currentUserId && column.user_id === currentUserId && (
                            <button
                              role="menuitem"
                              onClick={(e) => handleDeleteColumn(e, column.id)}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 제목, 내용, 이미지를 가로로 배치 */}
                    <div className="px-4">
                      <div className="flex gap-4">
                        {/* 이미지 영역 - 왼쪽으로 이동 */}
                        {(column.imageUrls || column.image_url) && (
                          <div className="flex-shrink-0">
                            <ImageGallery imageUrl={column.imageUrls || column.image_url || ''} size="small" />
                          </div>
                        )}

                        {/* 텍스트 영역 - 오른쪽으로 이동 */}
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-3">{column.title}</h2>
                          
                          {/* 내용 (더보기 버튼으로 표시/숨김) */}
                          {expandedColumns.includes(column.id) && (
                            <div className="mb-4">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {column.content}
                              </p>
                            </div>
                          )}
                          
                          {/* 더보기/접기 버튼 - 항상 표시 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(column.id);
                            }}
                            className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center mb-4"
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
                        </div>
                      </div>
                    </div>

                    {/* 상호작용 버튼 */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColumnClick(column.id); // 상세페이지로 이동
                            }}
                            className="text-gray-600 hover:text-blue-500 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>

                      {/* 통계 */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span 
                          className="font-semibold cursor-pointer hover:text-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColumnClick(column.id);
                          }}
                        >
                          {column.likes.toLocaleString()} 좋아요
                        </span>
                        <span 
                          className="cursor-pointer hover:text-blue-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColumnClick(column.id);
                          }}
                        >
                          {column.comments} 댓글
                        </span>
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

            {/* 수정 모달 */}
            {editTarget && (
              <ColumnEditModal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                column={editTarget}
                onUpdated={(updated) => {
                  setColumns(prev => prev.map(c => c.id === updated.id ? { ...c, content: updated.content } : c));
                }}
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

            {/* 상세 페이지 모달 */}
            <ColumnDetailModal
              isOpen={isDetailModalOpen}
              onClose={() => {
                setIsDetailModalOpen(false);
                setSelectedColumnId(null);
              }}
              columnId={selectedColumnId}
            />

          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
} 