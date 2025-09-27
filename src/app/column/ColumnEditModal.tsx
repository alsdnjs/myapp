'use client';

import React, { useEffect, useState } from 'react';
import { getToken } from '@/utils/token';
import ImageGallery from '@/components/ImageGallery';
import { parseTitleAndContent } from '@/utils/articleStorage';

export interface ColumnEditData {
  id: number;
  content: string;
  title?: string; // 제목 필드 추가
  imageUrls?: string; // 기존 이미지 URL들 (쉼표로 구분)
  image_url?: string; // 기존 단일 이미지 URL (fallback)
}

interface ColumnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: ColumnEditData;
  onUpdated: (updated: { id: number; content: string; shouldRefresh?: boolean; newImageUrls?: string }) => void;
}

export default function ColumnEditModal({ isOpen, onClose, column, onUpdated }: ColumnEditModalProps) {
  // 기존 content를 제목과 내용으로 분리
  const { title: initialTitle, content: initialContent } = parseTitleAndContent(column.content);
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  
  // 이미지 업로드 관련 상태
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 이미지 선택 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 handleImageUpload 함수 호출됨');
    
    const files = Array.from(e.target.files || []);
    console.log('   - 선택된 파일 개수:', files.length);
    console.log('   - 선택된 파일들:', files);
    
    if (files.length === 0) {
      console.log('❌ 선택된 파일이 없음');
      return;
    }

    // 새 이미지들을 기존 이미지에 추가
    const newFiles = [...selectedFiles, ...files];
    console.log('   - 기존 파일 개수:', selectedFiles.length);
    console.log('   - 새로운 파일 개수:', files.length);
    console.log('   - 총 파일 개수:', newFiles.length);
    
    setSelectedFiles(newFiles);

    // 미리보기용 Data URL 생성
    const newImages = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...newImages]);
    
    console.log('✅ 이미지 선택 완료');
  };

  // 이미지 제거 핸들러
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  };

  useEffect(() => {
    const { title: newTitle, content: newContent } = parseTitleAndContent(column.content);
    setTitle(newTitle);
    setContent(newContent);
  }, [column]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 handleSubmit 함수 시작');
    console.log('📋 현재 상태:');
    console.log('   - title:', title);
    console.log('   - content:', content);
    console.log('   - selectedFiles:', selectedFiles);
    console.log('   - selectedFiles.length:', selectedFiles.length);
    
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      console.log('❌ 제목 또는 내용이 비어있음');
      console.log('   - title.trim():', title.trim());
      console.log('   - content.trim():', content.trim());
      return;
    }
    
    console.log('✅ 유효성 검사 통과 - 토큰 검증 시작');

    const token = getToken();
    
    // 🔍 JWT 토큰 상세 검증 로그
    console.log('🔍 JWT 토큰 검증 시작');
    console.log('1. 토큰 존재 여부:', !!token);
    console.log('2. 토큰 길이:', token ? token.length : 0);
    console.log('3. 토큰 미리보기:', token ? `${token.substring(0, 30)}...` : '없음');
    
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다');
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    // JWT 토큰 형식 검증 (header.payload.signature)
    const tokenParts = token.split('.');
    console.log('4. JWT 토큰 형식 검증:');
    console.log('   - 토큰 부분 개수:', tokenParts.length);
    console.log('   - 형식 유효성:', tokenParts.length === 3 ? '✅ 유효' : '❌ 무효');
    
    if (tokenParts.length !== 3) {
      console.error('❌ JWT 토큰 형식이 올바르지 않습니다');
      alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      return;
    }

    // JWT 페이로드 디코딩 및 만료 시간 확인
    try {
      // Base64 URL-safe 디코딩
      let payloadBase64 = tokenParts[1];
      payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      while (payloadBase64.length % 4) {
        payloadBase64 += '=';
      }
      
      const payload = JSON.parse(atob(payloadBase64));
      console.log('5. JWT 페이로드 분석:');
      console.log('   - 사용자 ID:', payload.user_id || payload.id || '없음');
      console.log('   - 사용자명:', payload.username || payload.name || '없음');
      console.log('   - 발급 시간(iat):', payload.iat ? new Date(payload.iat * 1000).toISOString() : '없음');
      console.log('   - 만료 시간(exp):', payload.exp ? new Date(payload.exp * 1000).toISOString() : '없음');
      
      // 만료 시간 확인
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? currentTime >= payload.exp : false;
      console.log('6. 토큰 만료 확인:');
      console.log('   - 현재 시간:', currentTime, new Date().toISOString());
      console.log('   - 만료 시간:', payload.exp || '없음');
      console.log('   - 만료 여부:', isExpired ? '❌ 만료됨' : '✅ 유효함');
      
      if (isExpired) {
        console.error('❌ JWT 토큰이 만료되었습니다');
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      
      console.log('✅ JWT 토큰 검증 완료 - API 호출 진행');
    } catch (e) {
      console.error('❌ JWT 토큰 디코딩 실패:', e);
      alert('토큰이 손상되었습니다. 다시 로그인해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

      // 기존 이미지 상태 확인
      const hasExistingImage = !!(column?.imageUrls || column?.image_url);
      const hasNewImage = selectedFiles.length > 0;
      
      console.log('🔍 이미지 상태 분석:');
      console.log('- 기존 이미지 있음:', hasExistingImage);
      console.log('- 새 이미지 추가:', hasNewImage);
      console.log('- 기존 이미지 URL:', column?.imageUrls || column?.image_url);
      
      let resp;
      
      if (hasNewImage) {
        // 새 이미지를 추가하는 경우
        console.log('📸 새 이미지 추가/변경 - FormData 사용');
        
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        
        // 기존 이미지가 있으면 삭제 표시
        if (hasExistingImage) {
          formData.append('replace_existing_images', 'true');
          console.log('🔄 기존 이미지 교체 모드');
        } else {
          console.log('➕ 기존 이미지 없음 - 새로 추가');
        }
        
        // 선택된 이미지 파일들 추가
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });
        
        console.log('이미지 수정 전송 데이터:');
        console.log('- title:', title.trim());
        console.log('- content:', content.trim());
        console.log('- selectedFiles 개수:', selectedFiles.length);
        console.log('- replace_existing_images:', hasExistingImage);
        
        // 요청 헤더 상세 로깅
        const headers = {
          'Authorization': `Bearer ${token}`,
          // Content-Type은 자동으로 설정됨 (multipart/form-data)
        };
        
        console.log('7. API 요청 헤더 확인:');
        console.log('   - Authorization 헤더 존재:', !!headers.Authorization);
        console.log('   - Authorization 값:', headers.Authorization.substring(0, 30) + '...');
        console.log('   - 요청 URL:', `${baseUrl}/api/board/board/${column.id}`);
        console.log('   - 요청 메서드:', 'PUT');
        console.log('   - Content-Type:', 'multipart/form-data (자동 설정)');
        
        // 기존 글 수정 API 사용 (이미지 포함)
        resp = await fetch(`${baseUrl}/api/board/board/${column.id}`, {
          method: 'PUT',
          headers,
          body: formData,
        });
      } else {
        // 이미지가 없는 경우: URLSearchParams 사용
        console.log('📝 텍스트만 수정 - URLSearchParams 사용');
        
        const requestData = new URLSearchParams();
        requestData.append('title', title.trim());
        requestData.append('content', content.trim());
        
        console.log('텍스트 수정 전송 데이터:');
        console.log('- title:', title.trim());
        console.log('- content:', content.trim());
        console.log('- 기존 이미지 유지:', hasExistingImage);
        
        // 요청 헤더 상세 로깅
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        
        console.log('7. API 요청 헤더 확인:');
        console.log('   - Authorization 헤더 존재:', !!headers.Authorization);
        console.log('   - Authorization 값:', headers.Authorization.substring(0, 30) + '...');
        console.log('   - 요청 URL:', `${baseUrl}/api/board/board/${column.id}`);
        console.log('   - 요청 메서드:', 'PUT');
        console.log('   - Content-Type:', headers['Content-Type']);
        
        // 기존 글 수정 API 사용 (텍스트만)
        resp = await fetch(`${baseUrl}/api/board/board/${column.id}`, {
          method: 'PUT',
          headers,
          body: requestData,
        });
      }

      console.log('8. API 응답 분석:');
      console.log('   - 응답 상태 코드:', resp.status);
      console.log('   - 응답 상태 텍스트:', resp.statusText);
      console.log('   - 응답 성공 여부:', resp.ok ? '✅ 성공' : '❌ 실패');
      console.log('   - 응답 헤더:', Object.fromEntries(resp.headers.entries()));

      if (!resp.ok) {
        console.error('❌ API 요청 실패');
        
        // 응답 본문 확인
        try {
          const errorText = await resp.text();
          console.error('   - 오류 응답 본문:', errorText);
        } catch (e) {
          console.error('   - 응답 본문 읽기 실패:', e);
        }
        
        if (resp.status === 401) {
          console.error('🔒 401 Unauthorized - 인증 실패');
          console.error('   - JWT 토큰이 유효하지 않거나 만료됨');
          console.error('   - Authorization 헤더 문제 가능성');
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
        } else if (resp.status === 403) {
          console.error('🚫 403 Forbidden - 권한 없음');
          alert('작성자만 수정할 수 있습니다.');
        } else if (resp.status === 404) {
          console.error('🔍 404 Not Found - 게시글 없음');
          alert('게시글을 찾을 수 없습니다.');
        } else {
          console.error('💥 기타 오류:', resp.status);
          alert(`수정 실패했습니다. (상태: ${resp.status})`);
        }
        return;
      }
      
      console.log('✅ API 요청 성공');

      // 성공 응답 내용 확인
      const responseText = await resp.text();
      console.log('백엔드 응답 내용:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('백엔드 응답 데이터:', responseData);
        
        // 이미지 수정 성공 확인
        if (responseData.success && responseData.data) {
          console.log('이미지 수정 성공!');
          if (responseData.data.imageUrls || responseData.data.image_url) {
            console.log('새로운 이미지 정보:', {
              imageUrls: responseData.data.imageUrls,
              image_url: responseData.data.image_url
            });
            
            // 새로운 이미지 URL을 즉시 사용하여 상태 업데이트
            const newImageUrls = responseData.data.imageUrls || responseData.data.image_url;
            console.log('즉시 사용할 새로운 이미지 URL:', newImageUrls);
          }
        }
      } catch (e) {
        console.log('응답이 JSON 형식이 아님:', responseText);
        // JSON 파싱 실패 시에도 계속 진행
      }

      // 수정 성공 시 콜백 호출 (서버에서 최신 데이터를 가져와서 업데이트)
      const combinedContent = `[${title.trim()}] ${content.trim()}`;
      onUpdated({ 
        id: column.id, 
        content: combinedContent,
        shouldRefresh: true, // 서버 데이터 재조회 필요 표시
        newImageUrls: responseData?.data?.imageUrls || responseData?.data?.image_url // 새로운 이미지 URL 전달
      });
      
      // 사용자에게 성공 피드백 제공
      if (selectedFiles.length > 0) {
        alert(`✅ 수정 완료!\n\n제목: ${title.trim()}\n내용: ${content.trim()}\n이미지: ${selectedFiles.length}개`);
      } else {
        alert(`✅ 수정 완료!\n\n제목: ${title.trim()}\n내용: ${content.trim()}`);
      }
      
      // alert 확인 후 자동 새로고침
      setTimeout(() => {
        console.log('사용자가 alert 확인 - 페이지 새로고침 실행');
        window.location.reload();
      }, 100);
      
      onClose();
    } catch (error) {
      console.error('오류:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden">
        {/* 왼쪽: 이미지 표시 영역 */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          {(column?.imageUrls || column?.image_url) ? (
            <ImageGallery 
              imageUrl={column.imageUrls || column.image_url || ''} 
              size="large" 
            />
          ) : (
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">이미지 없음</p>
              <p className="text-sm">이미지를 추가해보세요</p>
            </div>
          )}
        </div>

        {/* 오른쪽: 수정 폼 */}
        <div className="w-1/2 flex flex-col">
          {/* 헤더 */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">칼럼 수정</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-4 flex flex-col gap-4">
            {/* 제목 입력 필드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>

            {/* 내용 입력 필드 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                className="w-full h-[calc(100%-12rem)] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
            </div>

            {/* 이미지 수정 섹션 */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지 수정</label>
              
              {/* 파일 입력 (숨김) */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* 이미지 업로드 버튼 */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  이미지 추가
                </button>
                <span className="text-sm text-gray-500">
                  총 이미지: {
                    (column?.imageUrls 
                      ? column.imageUrls.split(',').length 
                      : column?.image_url 
                        ? 1 
                        : 0) + selectedFiles.length
                  }개
                </span>
              </div>

              {/* 선택된 이미지 미리보기 */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {selectedFiles.map((_, index) => (
                    <div key={index} className="relative">
                      <img
                        src={selectedImages[index]}
                        alt={`새 이미지 ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400">
                기존 이미지는 새 이미지로 교체됩니다.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim()}
                onClick={() => {
                  console.log('🔘 저장 버튼 클릭됨');
                  console.log('   - submitting:', submitting);
                  console.log('   - title.trim():', title.trim());
                  console.log('   - content.trim():', content.trim());
                  console.log('   - 버튼 비활성화 여부:', submitting || !title.trim() || !content.trim());
                }}
                className={`px-6 py-2 rounded-lg text-white ${
                  submitting || !title.trim() || !content.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}