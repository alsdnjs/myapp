import React from 'react';
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* 주요 뉴스 배너 영역 - CGV 스타일 */}
              <div className="w-full bg-[#00334e] py-0">
                <div className="relative">
                  {/* 큰 배너 이미지 영역 */}
                  <div className="w-full h-[600px] relative overflow-hidden">
                    {/* 배경 이미지 */}
                    <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center overflow-hidden">
                      <div className="text-8xl font-bold text-white opacity-20">Tech News</div>
                      {/* 어두운 그라데이션 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                    </div>
                    
                    {/* 콘텐츠 영역 */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10">
                      <div className="container mx-auto px-4">
                        <h1 className="text-5xl font-bold mb-6">디지털 위기에 처한 세계, IT 초강대국들의 대응</h1>
                        <p className="text-xl max-w-4xl mx-auto mb-8 leading-relaxed">
                          디지털상의 모든 정보를 통제할 수 있는 시장 조우의 무기로 인해 전 세계 국가와 조직의 기능이 마비되고, 인류 전체가 위협받는 걸 체감명의 위기가 찾아온다. 이를 막을 수 있는 건 오직 존재 자체가 기밀인 '에단 헌트'와...
                        </p>
                        <div className="flex justify-center gap-4">
                          <button className="px-8 py-3 bg-[#e53e3e] text-white font-medium rounded-md hover:bg-[#c53030] transition">
                            기사 보기
                          </button>
                          <button className="px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition">
                            공유하기
                          </button>
                        </div>
                        <div className="mt-6 text-gray-300">기술 · 2시간 전 · 조회수 1k</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 검색 섹션 */}
              <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-xl">
                      <input 
                        type="text" 
                        placeholder="뉴스검색" 
                        className="w-full py-3 px-4 pl-12 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a3ec8] shadow" 
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 메인 콘텐츠 */}
              <div className="container mx-auto px-4 py-6">
                {/* 카테고리 네비게이션 */}
                <div className="mb-6 border-b border-gray-200 pb-2">
                  <div className="flex space-x-6 text-sm font-medium">
                    <Link href="/it" className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]">IT</Link>
                    <Link href="/sports" className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]">스포츠</Link>
                    <Link href="/economy" className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]">경제</Link>
                    <Link href="/column" className="px-3 py-2 text-gray-800 hover:text-[#5a3ec8]">칼럼</Link>
                  </div>
                </div>

                <div className="flex gap-8">
                  {/* 메인 뉴스 영역 */}
                  <div className="flex-1">
                    {/* 뉴스 그리드 */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                      {/* 뉴스 카드 1 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/1">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Samsung</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">삼성, 폴더블폰 신제품 공개</h3>
                            <p className="text-sm text-gray-500 mb-2">삼성전자가 새로운 폴더블폰 시리즈를 공개했습니다. 이번 제품은 내구성이 크게 향상되었으며...</p>
                            <div className="text-xs text-gray-400">조회수 123</div>
                          </div>
                        </Link>
                      </div>

                      {/* 뉴스 카드 2 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/2">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Apple</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">애플, iOS 18 베타 배포 시작</h3>
                            <p className="text-sm text-gray-500 mb-2">애플이 개발자들을 대상으로 iOS 18 베타 버전 배포를 시작했습니다. 새로운 AI 기능이...</p>
                            <div className="text-xs text-gray-400">조회수 456</div>
                          </div>
                        </Link>
                      </div>

                      {/* 뉴스 카드 3 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/3">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Naver</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">네이버, AI 번역 서비스 업그레이드</h3>
                            <p className="text-sm text-gray-500 mb-2">네이버가 인공지능 번역 서비스의 정확도를 크게 높인 새 버전을 출시했습니다...</p>
                            <div className="text-xs text-gray-400">조회수 789</div>
                          </div>
                        </Link>
                      </div>

                      {/* 뉴스 카드 4 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/4">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Tesla</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">자율주행 기술의 새 시대, 테슬라 FSD 공개</h3>
                            <p className="text-sm text-gray-500 mb-2">테슬라가 완전 자율주행 기능을 공개하며 자동차 업계에 큰 변화의 바람을 일으키고 있습니다...</p>
                            <div className="text-xs text-gray-400">조회수 321</div>
                          </div>
                        </Link>
                      </div>

                      {/* 뉴스 카드 5 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/5">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Economy</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">2025년 글로벌 경제 전망, 불확실성 증가</h3>
                            <p className="text-sm text-gray-500 mb-2">세계 경제 전문가들은 2025년 세계 경제의 불확실성이 더욱 커질 것으로 전망하며...</p>
                            <div className="text-xs text-gray-400">조회수 654</div>
                          </div>
                        </Link>
                      </div>

                      {/* 뉴스 카드 6 */}
                      <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
                        <Link href="/news/6">
                          <div className="h-48 relative">
                            <div className="absolute inset-0 bg-[#e3e6f3] flex items-center justify-center">
                              <div className="text-2xl font-bold text-[#e53e3e]">Metaverse</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 text-gray-900">메타버스 신기술, 국내 기업 주도권 확보</h3>
                            <p className="text-sm text-gray-500 mb-2">국내 IT 기업들이 메타버스 핵심 기술 개발에 성공하며 글로벌 시장에서 주도권을 확보...</p>
                            <div className="text-xs text-gray-400">조회수 987</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* 더보기 버튼 */}
                    <div className="flex justify-center mb-10">
                      <button className="px-4 py-2 border border-gray-200 rounded text-sm text-gray-900 hover:bg-gray-100">더보기</button>
                    </div>
                  </div>

                  {/* 우측 사이드바 */}
                  <Sidebar />
                </div>
              </div>

              {/* 칼럼 섹션 */}
              <div className="max-w-4xl">
                {/* 칼럼 카드 */}
                <Link href="/column" className="block">
                  <div className="bg-white rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <h3 className="font-medium">작성자명</h3>
                            <p className="text-sm text-gray-500">2024.03.21</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                      <h2 className="text-xl font-bold mb-3">칼럼 제목</h2>
                      <p className="text-gray-600 mb-4">칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다.</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>조회수 123</span>
                        <span>댓글 5</span>
                        <span>좋아요 10</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 추가 칼럼 카드들 */}
                <Link href="/column" className="block">
                  <div className="bg-white rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <h3 className="font-medium">작성자명</h3>
                            <p className="text-sm text-gray-500">2024.03.21</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                      <h2 className="text-xl font-bold mb-3">칼럼 제목 2</h2>
                      <p className="text-gray-600 mb-4">칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다.</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>조회수 123</span>
                        <span>댓글 5</span>
                        <span>좋아요 10</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/column" className="block">
                  <div className="bg-white rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <h3 className="font-medium">작성자명</h3>
                            <p className="text-sm text-gray-500">2024.03.21</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                      <h2 className="text-xl font-bold mb-3">칼럼 제목 3</h2>
                      <p className="text-gray-600 mb-4">칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다. 칼럼 내용이 여기에 들어갑니다.</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>조회수 123</span>
                        <span>댓글 5</span>
                        <span>좋아요 10</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-50">이전</button>
                  <button className="px-4 py-2 border rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-50">3</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-50">다음</button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
} 