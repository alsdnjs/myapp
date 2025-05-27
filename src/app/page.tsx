import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
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
          
          {/* 하단 인디케이터/컨트롤 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#e53e3e] rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
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
              </div>

              {/* 뉴스 카드 2 */}
              <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
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
              </div>

              {/* 뉴스 카드 3 */}
              <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
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
              </div>

              {/* 뉴스 카드 4 */}
              <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
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
              </div>

              {/* 뉴스 카드 5 */}
              <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
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
              </div>

              {/* 뉴스 카드 6 */}
              <div className="bg-white rounded shadow overflow-hidden border border-gray-100">
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
              </div>
            </div>

            {/* 더보기 버튼 */}
            <div className="flex justify-center mb-10">
              <button className="px-4 py-2 border border-gray-200 rounded text-sm text-gray-900 hover:bg-gray-100">더보기</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 shrink-0">
            <div className="sticky top-4">
              {/* 인기뉴스 섹션 */}
              <div className="bg-white rounded shadow mb-6 border border-gray-100">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h3 className="text-lg font-bold text-[#e53e3e]">인기뉴스</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg font-bold text-gray-400 mt-1">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">손흥민 헤트트릭 폭발... 토트넘 6연승</h4>
                        <p className="text-xs text-gray-500 mt-1">조회수 12,345 · 14시간 전</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg font-bold text-gray-400 mt-1">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">원/달러 환율, 1개월 만에 최저치</h4>
                        <p className="text-xs text-gray-500 mt-1">조회수 8,721 · 24시간 전</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg font-bold text-gray-400 mt-1">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">코스피, 외국인 매수세에 상승 마감</h4>
                        <p className="text-xs text-gray-500 mt-1">조회수 7,890 · 3시간 전</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg font-bold text-gray-400 mt-1">4</div>
                      <div>
                        <h4 className="font-medium text-gray-900">류현진, 두 번째 재계약..."1년 더"</h4>
                        <p className="text-xs text-gray-500 mt-1">조회수 6,543 · 4시간 전</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg font-bold text-gray-400 mt-1">5</div>
                      <div>
                        <h4 className="font-medium text-gray-900">한화하락</h4>
                        <p className="text-xs text-gray-500 mt-1">조회수 5,432 · 5시간 전</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실시간 검색어 */}
              <div className="bg-white rounded shadow border border-gray-100">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h3 className="text-lg font-bold text-[#e53e3e]">실시간 검색어</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#e53e3e]">1</span>
                      <span className="text-gray-900">손흥민</span>
                    </div>
                    <span className="text-xs bg-red-900 text-red-300 px-1 rounded">NEW</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-lg font-bold text-[#e53e3e] mr-3">2</span>
                    <span className="text-gray-900">환율하락</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-lg font-bold text-[#e53e3e] mr-3">3</span>
                    <span className="text-gray-900">코스피 상승</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-lg font-bold text-[#e53e3e] mr-3">4</span>
                    <span className="text-gray-900">수출 실적</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-lg font-bold text-[#e53e3e] mr-3">5</span>
                    <span className="text-gray-900">류현진</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 