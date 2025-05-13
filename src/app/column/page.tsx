import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Column() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* 칼럼 섹션 */}
              <div className="max-w-4xl">
                {/* 칼럼 카드 */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
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

                {/* 추가 칼럼 카드들 */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
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

                <div className="bg-white rounded-lg shadow-sm mb-6">
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