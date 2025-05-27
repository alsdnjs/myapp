"use client";

import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import Link from 'next/link';
import SignupModal from './SignupModal';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header className="bg-white text-gray-900 relative z-10">
        {/* 상단 유틸 메뉴 */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-2 flex justify-end items-center">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm text-gray-700 hover:text-[#e53e3e] flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                로그인
              </button>
              <button 
                onClick={() => setIsSignupModalOpen(true)}
                className="text-sm text-gray-700 hover:text-[#e53e3e] flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                회원가입
              </button>
              <Link href="/mypage" className="text-sm text-gray-700 hover:text-[#e53e3e] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                MY 뉴스
              </Link>
              <Link href="/customer" className="text-sm text-gray-700 hover:text-[#e53e3e] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                고객센터
              </Link>
            </div>
          </div>
        </div>
        
        {/* 메인 네비게이션 */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-[#e53e3e] font-bold text-3xl mr-10">뉴스포털</Link>
            <ul className="flex space-x-8">
              <li><Link href="/economy" className="text-gray-800 hover:text-[#e53e3e] font-medium">경제</Link></li>
              <li><Link href="/sports" className="text-gray-800 hover:text-[#e53e3e] font-medium">스포츠</Link></li>
              <li><Link href="/it" className="text-gray-800 hover:text-[#e53e3e] font-medium">IT</Link></li>
              <li><Link href="/column" className="text-gray-800 hover:text-[#e53e3e] font-medium">칼럼</Link></li>
            </ul>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="뉴스검색" 
              className="py-2 px-4 pl-10 rounded-full bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e53e3e] w-60" 
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[0px]"></div> {/* 헤더 높이 보정용 빈 공간 */}
      {isMounted && (
        <>
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)}
            onSignupClick={() => {
              setIsLoginModalOpen(false);
              setIsSignupModalOpen(true);
            }}
          />
          <SignupModal 
            isOpen={isSignupModalOpen} 
            onClose={() => setIsSignupModalOpen(false)}
            onSwitchToLogin={() => {
              setIsSignupModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />
        </>
      )}
    </>
  );
} 