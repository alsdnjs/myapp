'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  imageUrl: string;
}

export default function ImageGallery({ imageUrl }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 쉼표로 구분된 이미지 URL을 배열로 변환
  const imageUrls = imageUrl.split(',');
  
  // 디버깅을 위한 로그
  console.log('ImageGallery - imageUrl:', imageUrl);
  console.log('ImageGallery - imageUrl 길이:', imageUrl.length);
  console.log('ImageGallery - imageUrl 타입:', typeof imageUrl);
  console.log('ImageGallery - 쉼표 포함 여부:', imageUrl.includes(','));
  console.log('ImageGallery - imageUrls:', imageUrls);
  console.log('ImageGallery - imageUrls 길이:', imageUrls.length);
  console.log('ImageGallery - hasMultipleImages:', imageUrls.length > 1);
  console.log('ImageGallery - currentImageIndex:', currentImageIndex);
  
  // 이미지가 여러 개일 때만 네비게이션 표시
  const hasMultipleImages = imageUrls.length > 1;

  return (
    <div className="relative">
      {/* 현재 이미지 */}
      <div className="w-64 h-40 overflow-hidden rounded-lg">
        <img 
          src={imageUrls[currentImageIndex].trim()} 
          alt={`칼럼 이미지 ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('이미지 로드 실패:', imageUrls[currentImageIndex]);
            const imgElement = e.currentTarget;
            imgElement.style.display = 'none';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-gray-500';
            errorDiv.innerHTML = `
              <div class="text-center">
                <div class="text-sm font-medium mb-2">이미지를 불러올 수 없습니다</div>
                <div class="text-xs text-gray-400">API 경로: ${imageUrls[currentImageIndex]}</div>
                <div class="text-xs text-gray-400">상태: 404 Not Found</div>
              </div>
            `;
            imgElement.parentNode?.appendChild(errorDiv);
          }}
        />
      </div>
      
      {/* 네비게이션 버튼들 (여러 이미지일 때만) */}
      {hasMultipleImages && (
        <>
          {/* 이전 버튼 */}
          {currentImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => prev - 1);
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* 다음 버튼 */}
          {currentImageIndex < imageUrls.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => prev + 1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* 이미지 인디케이터 */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
          
          {/* 이미지 카운터 */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
        </>
      )}
    </div>
  );
}
