"use client";

import React from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose(); // Close signup modal
    onSwitchToLogin(); // Open login modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">회원가입</h2>
          <p className="text-gray-600 text-sm">소셜 계정으로 간편하게 가입하세요.</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="w-full bg-[#03C75A] text-white py-3 rounded-lg hover:bg-[#02b351] transition-colors flex items-center justify-center"
          >
            <span className="mr-2">N</span>
            네이버로 회원가입
          </button>

          <button
            type="button"
            className="w-full bg-[#FEE500] text-[#000000] py-3 rounded-lg hover:bg-[#F4DC00] transition-colors flex items-center justify-center"
          >
            <span className="mr-2">K</span>
            카카오로 회원가입
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button 
              type="button" 
              className="text-blue-600 hover:text-blue-700"
              onClick={handleLoginClick}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal; 