export default function Sidebar() {
  return (
    <div className="w-80 shrink-0">
      <div className="sticky top-4 transition-transform duration-300 ease-in-out hover:translate-y-2">
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
  );
} 