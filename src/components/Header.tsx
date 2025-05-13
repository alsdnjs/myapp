"use client";

import React, { useState } from 'react';
import LoginModal from './LoginModal';
import Link from 'next/link';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">경빈이네</h1>
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">홈</Link>
                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900">IT</Link>
                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900">스포츠</Link>
                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900">경제</Link>
                <Link href="/column" className="text-sm text-gray-700 hover:text-gray-900">칼럼</Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-full pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  🔍
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                로그인
              </button>
              <button className="text-sm text-gray-700 hover:text-gray-900">
                회원가입
              </button>
            </div>
          </nav>
        </div>
      </header>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header; 