import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = params;
  
  // 임시 뉴스 데이터 (실제로는 API나 데이터베이스에서 가져올 것입니다)
  const news = {
    id: id,
    title: "디지털 위기에 처한 세계, IT 초강대국들의 대응",
    subtitle: "기술 강국들의 협력과 경쟁, 글로벌 사이버 안보의 미래는?",
    category: "기술",
    author: "김기자",
    publishDate: "2024.05.20",
    readTime: "5분",
    viewCount: 1024,
    likeCount: 97,
    shareCount: 55.2,
    content: `디지털상의 모든 정보를 통제할 수 있는 시장 조우의 무기로 인해 전 세계 국가와 조직의 기능이 마비되고, 인류 전체가 위협받는 걸 체감 명의 위기가 찾아온다. 이를 막을 수 있는 건 오직 존재 자체가 기밀인 '에단 헌트'와 그의 IMF 팀뿐이다.

    모든 위협에 맞서온 최강의 스파이 시스템 IMF는 인공지능과 결합한 새로운 무기의 등장으로 인류 전체가 위험에 처하자 다시 한번 세상을 구하기 위해 뭉친다. 전 세계 곳곳에서 벌어지는 액션 끝판왕 미션이 시작된다.
    
    글로벌 IT 기업들은 이러한 사이버 위협에 대응하기 위해 국가 간 협력을 강화하고 있다. 특히 미국, 한국, 일본 등 IT 강국들은 공동 대응책 마련에 나섰으며, 인공지능 기술의 안전한 발전과 활용을 위한 국제 규범 수립에도 적극적으로 나서고 있다.
    
    전문가들은 앞으로 디지털 안보가 국가 안보의 핵심 요소로 자리 잡을 것이며, 이에 따라 IT 기술력이 국가 경쟁력을 좌우하는 중요한 요소가 될 것으로 전망하고 있다.`,
    tags: ["IT", "사이버보안", "인공지능", "디지털위협", "국제협력"],
    relatedNews: [
      { id: "2", title: "삼성, 폴더블폰 신제품 공개", category: "IT" },
      { id: "3", title: "애플, iOS 18 베타 배포 시작", category: "IT" },
      { id: "4", title: "네이버, AI 번역 서비스 업그레이드", category: "기술" }
    ],
    // 임시 댓글 데이터
    comments: [
      {
        id: 1,
        username: "tech_lover",
        profileImage: "/image/profile1.jpg",
        date: "2024.05.20",
        content: "정말 심각한 문제네요. 국가 간 협력이 필요한 시점입니다. IT 기술이 발전할수록 보안 위협도 함께 증가하는 것 같아요.",
        likes: 15,
        replies: [
          {
            id: 101,
            username: "security_expert",
            profileImage: "/image/profile2.jpg",
            date: "2024.05.20",
            content: "맞습니다. 특히 인공지능 기술이 발전하면서 사이버 공격 방식도 더욱 고도화되고 있어 우려됩니다.",
            likes: 7
          }
        ]
      },
      {
        id: 2,
        username: "digital_citizen",
        profileImage: "/image/profile3.jpg",
        date: "2024.05.20",
        content: "좋은 기사 감사합니다. 디지털 안보가 국가 안보의 핵심으로 자리잡게 될 것이라는 전망에 전적으로 동의합니다.",
        likes: 8,
        replies: []
      },
      {
        id: 3,
        username: "ai_researcher",
        profileImage: "/image/profile4.jpg",
        date: "2024.05.21",
        content: "인공지능 기술의 안전한 발전을 위한 국제 규범 수립은 매우 중요합니다. 기술 발전과 안전 사이의 균형이 필요하죠.",
        likes: 12,
        replies: []
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* 상단 뉴스 카테고리 네비게이션 */}
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-[#e53e3e]">홈</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/${news.category.toLowerCase()}`} className="hover:text-[#e53e3e]">{news.category}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">뉴스 상세</span>
        </div>

        <div className="flex gap-8">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 뉴스 헤더 정보 - CGV 스타일 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="flex p-6 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-[#e53e3e] text-white text-xs rounded mr-2">최신</span>
                    <span className="text-gray-500 text-sm">{news.category}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{news.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{news.subtitle}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">기자: {news.author}</span>
                    <span className="mr-4">발행일: {news.publishDate}</span>
                    <span>읽는 시간: {news.readTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-1">👁️</span>
                      <span className="text-sm text-gray-700">조회 {news.viewCount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg mr-1">👍</span>
                      <span className="text-sm text-gray-700">{news.likeCount}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg mr-1">🔄</span>
                      <span className="text-sm text-gray-700">공유 {news.shareCount}k</span>
                    </div>
                  </div>
                </div>
                
                {/* 대표 이미지 */}
                <div className="ml-6 w-56 h-56 bg-[#e3e6f3] flex items-center justify-center rounded">
                  <div className="text-2xl font-bold text-[#e53e3e]">Tech News</div>
                </div>
              </div>
              
              {/* 뉴스 액션 버튼 */}
              <div className="flex p-3 bg-gray-50">
                <button className="flex items-center justify-center bg-[#e53e3e] text-white py-2 px-4 rounded mr-2 hover:bg-[#c53030]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  북마크
                </button>
                <button className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  공유하기
                </button>
                <a href="#comments" className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  댓글 {news.comments.length}
                </a>
              </div>
            </div>
            
            {/* 뉴스 본문 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <div className="prose max-w-none">
                  {news.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* 태그 */}
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className="flex items-center flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <Link href={`/tag/${tag.toLowerCase()}`} key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 댓글 섹션 */}
            <div id="comments" className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">댓글 {news.comments.length}개</h3>
                
                {/* 댓글 작성 폼 */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-500">나</span>
                    </div>
                    <div className="flex-grow">
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e53e3e] focus:border-transparent resize-none" 
                        rows={3} 
                        placeholder="의견을 남겨주세요..."
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button className="bg-[#e53e3e] text-white px-4 py-2 rounded hover:bg-[#c53030] transition">
                          댓글 작성
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 댓글 정렬 옵션 */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">총 {news.comments.length}개의 댓글이 있습니다</span>
                  <div className="flex text-sm">
                    <button className="text-[#e53e3e] font-medium mr-3">최신순</button>
                    <button className="text-gray-500">추천순</button>
                  </div>
                </div>
                
                {/* 댓글 목록 */}
                <div className="space-y-6">
                  {news.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      {/* 댓글 */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <span className="text-gray-500">{comment.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{comment.username}</h4>
                              <p className="text-xs text-gray-500">{comment.date}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-1 text-gray-700">{comment.content}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <button className="text-gray-500 hover:text-[#e53e3e] flex items-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              좋아요 {comment.likes}
                            </button>
                            <button className="text-gray-500 hover:text-[#e53e3e] flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              답글
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 답글이 있는 경우 */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-13 mt-4 space-y-4 pl-13">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 ml-13 pl-13 border-l-2 border-gray-100">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center ml-2">
                                <span className="text-gray-500 text-xs">{reply.username.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-sm">{reply.username}</h4>
                                    <p className="text-xs text-gray-500">{reply.date}</p>
                                  </div>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="mt-1 text-gray-700 text-sm">{reply.content}</p>
                                <div className="flex items-center mt-2 text-xs">
                                  <button className="text-gray-500 hover:text-[#e53e3e] flex items-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    좋아요 {reply.likes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 더보기 버튼 */}
                <div className="mt-6 flex justify-center">
                  <button className="px-4 py-2 border border-gray-200 rounded text-sm text-gray-900 hover:bg-gray-100">
                    댓글 더보기
                  </button>
                </div>
              </div>
            </div>
            
            {/* 기자 정보 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">기자 정보</h3>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                    <span className="text-gray-500">기자</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{news.author}</h4>
                    <p className="text-sm text-gray-500 mt-1">IT/기술 전문기자</p>
                    <p className="text-sm text-gray-700 mt-2">IT와 기술 분야를 전문적으로 취재하는 기자입니다. 최신 IT 트렌드와 기술 발전에 관한 심층 분석 기사를 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 관련 뉴스 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">관련 뉴스</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {news.relatedNews.map((related, index) => (
                    <Link href={`/news/${related.id}`} key={index} className="block">
                      <div className="bg-gray-50 rounded overflow-hidden">
                        <div className="h-32 bg-gray-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-[#e53e3e] bg-[#e3e6f3]">
                            {related.category}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 hover:text-[#e53e3e] text-sm">
                            {related.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 우측 사이드바 */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
} 