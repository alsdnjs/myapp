export default function Sidebar() {
  return (
    <div className="w-80 flex-shrink-0">
      {/* 인기뉴스 */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">인기뉴스</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">1</span>
              <p className="text-sm">주요 뉴스 제목이 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">2</span>
              <p className="text-sm">주요 뉴스 제목이 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">3</span>
              <p className="text-sm">주요 뉴스 제목이 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">4</span>
              <p className="text-sm">주요 뉴스 제목이 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">5</span>
              <p className="text-sm">주요 뉴스 제목이 여기에 들어갑니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 검색어 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">실시간 검색어</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">1</span>
              <p className="text-sm">실시간 검색어가 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">2</span>
              <p className="text-sm">실시간 검색어가 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">3</span>
              <p className="text-sm">실시간 검색어가 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">4</span>
              <p className="text-sm">실시간 검색어가 여기에 들어갑니다.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">5</span>
              <p className="text-sm">실시간 검색어가 여기에 들어갑니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 