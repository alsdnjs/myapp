"use client";

import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignupClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white/95 rounded-lg p-16 w-[700px] relative transform transition-all duration-500 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">로그인</h2>
          <p className="text-gray-600 text-lg">소셜 계정으로 간편하게 로그인하세요.</p>
        </div>

        <div className="space-y-8">
          <button
            type="button"
            className="w-full bg-[#03C75A] text-white py-5 rounded-lg hover:bg-[#02b351] transition-colors flex items-center justify-center text-xl"
          >
            <span className="mr-4 text-2xl">N</span>
            네이버 로그인
          </button>

          <button
            type="button"
            className="w-full bg-[#FEE500] text-[#000000] py-5 rounded-lg hover:bg-[#F4DC00] transition-colors flex items-center justify-center text-xl"
          >
            <span className="mr-4 text-2xl">K</span>
            카카오 로그인
          </button>

          <button
            type="button"
            className="w-full bg-white border border-gray-300 text-gray-700 py-5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-xl"
          >
            <span className="mr-4 text-2xl font-bold bg-gradient-to-r from-[#EA4335] via-[#34A853] via-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">G</span>
            구글 로그인
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            계정이 없으신가요?{' '}
            <button
              onClick={onSignupClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 