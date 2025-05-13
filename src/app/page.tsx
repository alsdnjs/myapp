import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* 메인 섹션 */}
              <div className="max-w-4xl">
                {/* 메인 카드 */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">메인 콘텐츠</h2>
                    <p className="text-gray-600 mb-4">
                      메인 페이지의 주요 콘텐츠가 여기에 들어갑니다. 다양한 정보와 업데이트를 확인하실 수 있습니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">최신 소식</h3>
                        <p className="text-sm text-gray-600">최신 소식과 업데이트를 확인하세요.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">주요 기능</h3>
                        <p className="text-sm text-gray-600">서비스의 주요 기능을 살펴보세요.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추가 콘텐츠 카드 */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">추천 콘텐츠</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h3 className="font-medium">추천 콘텐츠 1</h3>
                          <p className="text-sm text-gray-600">추천 콘텐츠에 대한 설명이 들어갑니다.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h3 className="font-medium">추천 콘텐츠 2</h3>
                          <p className="text-sm text-gray-600">추천 콘텐츠에 대한 설명이 들어갑니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 최신 업데이트 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">최신 업데이트</h2>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">업데이트 제목 1</h3>
                        <p className="text-sm text-gray-600">업데이트 내용에 대한 설명이 들어갑니다.</p>
                        <p className="text-xs text-gray-500 mt-2">2024.03.21</p>
                      </div>
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">업데이트 제목 2</h3>
                        <p className="text-sm text-gray-600">업데이트 내용에 대한 설명이 들어갑니다.</p>
                        <p className="text-xs text-gray-500 mt-2">2024.03.20</p>
                      </div>
                    </div>
                  </div>
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
