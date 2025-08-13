import React, { useState, useEffect, useRef } from "react";
import { getToken } from '@/utils/token';

interface ColumnWriteModalProps {
  onClose: () => void;
  onSubmit: (newColumn: {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
    comments: number;
    likes: number;
    content: string;
    imageUrl?: string;
  }) => void;
}

export default function ColumnWriteModal({ onClose, onSubmit }: ColumnWriteModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // 사용자 ID 추가
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getToken();
        if (!token) {
          onClose();
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${apiUrl}/api/user`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.username) {
            setAuthor(data.username);
            // user_id 또는 id 필드 확인
            if (data.user_id) {
              setUserId(data.user_id);
            } else if (data.id) {
              setUserId(data.id);
            } else {
              console.error('사용자 ID를 찾을 수 없습니다:', data);
            }
          }
        } else {
          console.error('사용자 정보 가져오기 실패:', response.status);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [onClose]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 토큰 확인
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }
    
    console.log('토큰 확인됨:', token.substring(0, 20) + '...');
    
    // 임시로 사용자 ID 설정 (실제로는 백엔드에서 가져와야 함)
    const currentUserId = userId || 1; // 임시로 1로 설정
    
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      let imageId = undefined; // null 대신 undefined 사용
      
      // 이미지가 있으면 먼저 이미지 저장
      if (selectedImage) {
        console.log('이미지 업로드 시작...');
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            image_url: selectedImage
          })
        });
        
        if (imageResponse.ok) {
          const data = await imageResponse.json();
          if (data.image_id) {
            imageId = data.image_id;
            console.log('이미지 업로드 성공, image_id:', imageId);
          } else {
            console.error('이미지 저장 실패 - image_id 없음');
          }
        } else {
          console.error('이미지 저장 실패:', imageResponse.status);
        }
      } else {
        console.log('이미지 없음, 글작성만 진행');
      }
      
      // 글작성 API 호출
      console.log('글작성 API 호출 시작...');
      const requestBody: {
        board_content: string;
        user_id: number;
        image_id?: number;
      } = {
        board_content: content,
        user_id: currentUserId
      };
      
      // imageId가 있을 때만 추가 (undefined나 null이 아닐 때만)
      if (imageId !== undefined && imageId !== null) {
        requestBody.image_id = imageId;
        console.log('이미지 ID 포함:', imageId);
      } else {
        console.log('이미지 ID 없음');
      }
      
      console.log('요청 데이터:', requestBody);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/board/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        credentials: 'include', // CORS를 위한 설정 추가
        body: JSON.stringify(requestBody)
      });
      
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      
      if (response.ok) {
        console.log('글작성 성공!');
        // 부모 목록 즉시 갱신 트리거
        onSubmit({
          id: Date.now(),
          title: title || content.substring(0, 50) + '...',
          author: author || '작성자',
          date: new Date().toISOString().slice(0, 10),
          views: 0,
          comments: 0,
          likes: 0,
          content,
        });
        onClose();
        alert('글이 성공적으로 작성되었습니다!');
      } else {
        const errorData = await response.text();
        console.error('글작성 실패:', response.status, errorData);
        
        if (response.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
        } else if (response.status === 403) {
          alert('접근 권한이 없습니다.');
        } else if (response.status === 500) {
          console.error('서버 내부 오류:', errorData);
          alert('서버 오류가 발생했습니다. 백엔드 개발자에게 문의해주세요.');
        } else {
          alert('글작성에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } catch (error) {
      console.error('글작성 오류:', error);
      alert('글작성 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div className="bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden">
          <div className="w-1/2 bg-black"></div>
          <div className="w-1/2 flex items-center justify-center">
            <div className="text-lg">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden transform transition-all duration-500 ease-in-out">
        {/* 왼쪽: 이미지 업로드 영역 */}
        <div className="w-1/2 bg-black relative">
          {selectedImage ? (
            <div className="w-full h-full relative">
              <img 
                src={selectedImage} 
                alt="칼럼 이미지" 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg mb-4">이미지를 추가해주세요</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                이미지 선택
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* 오른쪽: 글쓰기 폼 */}
        <div className="w-1/2 flex flex-col h-full">
          {/* 헤더 */}
          <div className="border-b border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">칼럼 글쓰기</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 transform transition-transform duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 글쓰기 폼 */}
          <div className="flex-1 p-6 flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600"
                    value={author}
                    readOnly
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ height: 'calc(100vh - 500px)' }}
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 flex-shrink-0">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 