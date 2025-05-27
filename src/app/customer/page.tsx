"use client";

import React, { useState, useEffect } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface Inquiry {
  id: number;
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'completed';
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "회원가입은 어떻게 하나요?",
    answer: "홈페이지 우측 상단의 '회원가입' 버튼을 클릭하시면 회원가입 페이지로 이동합니다. 이메일 인증 후 가입이 완료됩니다."
  },
  {
    id: 2,
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 페이지의 '비밀번호 찾기' 링크를 클릭하시면 이메일로 비밀번호 재설정 링크를 보내드립니다."
  },
  {
    id: 3,
    question: "칼럼 작성은 어떻게 하나요?",
    answer: "로그인 후 상단 메뉴의 '칼럼 작성' 버튼을 클릭하시면 칼럼 작성 페이지로 이동합니다. 제목과 내용을 입력하시면 됩니다."
  },
  {
    id: 4,
    question: "댓글 작성이 안돼요.",
    answer: "로그인이 필요한 서비스입니다. 로그인 후 다시 시도해주세요."
  },
  {
    id: 5,
    question: "계정을 삭제하고 싶어요.",
    answer: "마이페이지의 '계정 설정'에서 계정 삭제가 가능합니다. 삭제된 계정은 복구가 불가능하니 신중하게 결정해주세요."
  }
];

const notices: Notice[] = [
  {
    id: 1,
    title: "서비스 이용약관 개정 안내",
    date: "2024.03.21",
    content: "더 나은 서비스 제공을 위해 이용약관이 개정되었습니다. 자세한 내용은 공지사항을 확인해주세요."
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    date: "2024.03.20",
    content: "3월 22일 02:00 ~ 04:00 동안 시스템 점검이 진행됩니다. 해당 시간 동안 서비스 이용이 제한될 수 있습니다."
  },
  {
    id: 3,
    title: "신규 기능 업데이트 안내",
    date: "2024.03.19",
    content: "칼럼 작성 시 이미지 첨부 기능이 추가되었습니다. 더 풍부한 콘텐츠를 작성해보세요."
  }
];

const inquiries: Inquiry[] = [
  {
    id: 1,
    title: "칼럼 작성 관련 문의",
    content: "칼럼 작성 시 이미지 업로드가 되지 않습니다.",
    date: "2024.03.21",
    status: 'completed'
  },
  {
    id: 2,
    title: "회원정보 수정 문의",
    content: "프로필 이미지 변경이 안됩니다.",
    date: "2024.03.20",
    status: 'pending'
  }
];

export default function CustomerService() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);
  const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const toggleNotice = (id: number) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  const toggleInquiry = (id: number) => {
    setExpandedInquiry(expandedInquiry === id ? null : id);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 문의사항 제출 로직 구현
    alert('문의사항이 접수되었습니다.');
    setInquiryTitle('');
    setInquiryContent('');
    setIsInquiryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">고객센터</h1>

        {/* 자주 묻는 질문 섹션 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-[#e53e3e]">자주 묻는 질문</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="px-6 py-4">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === faq.id && (
                  <div className="mt-4 text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 공지사항 섹션 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-[#e53e3e]">공지사항</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <div key={notice.id} className="px-6 py-4">
                <button
                  onClick={() => toggleNotice(notice.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{notice.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        expandedNotice === notice.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expandedNotice === notice.id && (
                  <div className="mt-4 text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {notice.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 문의사항 섹션 */}
        <div className="bg-white rounded-lg shadow-sm mb-8 mt-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-[#e53e3e]">문의사항</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="px-6 py-4">
                <button
                  onClick={() => toggleInquiry(inquiry.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{inquiry.title}</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500 mr-4">{inquiry.date}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          inquiry.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inquiry.status === 'completed' ? '답변완료' : '답변대기'}
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        expandedInquiry === inquiry.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expandedInquiry === inquiry.id && (
                  <div className="mt-4 text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {inquiry.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="bg-[#e53e3e] text-white py-1.5 px-4 rounded-lg hover:bg-[#c53030] transition-colors text-sm"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>

      {/* 문의사항 작성 모달 */}
      {isMounted && isInquiryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#e53e3e]">문의사항 작성</h2>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleInquirySubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  id="title"
                  value={inquiryTitle}
                  onChange={(e) => setInquiryTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e53e3e] focus:border-transparent"
                  placeholder="문의사항 제목을 입력해주세요"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <textarea
                  id="content"
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e53e3e] focus:border-transparent h-32"
                  placeholder="문의사항 내용을 입력해주세요"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-[#e53e3e] text-white py-2 px-4 rounded-lg hover:bg-[#c53030] transition-colors"
                >
                  문의하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 