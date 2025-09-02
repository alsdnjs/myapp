'use client';

import React, { useState, useEffect } from 'react';
import ColumnDetailModal from '../column/ColumnDetailModal';
import { getToken } from '@/utils/token';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Headphones, 
  BarChart3, 
  Settings,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  Shield,
  Search,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 관리자 정보 가져오기
  const fetchAdminInfo = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log('토큰이 없습니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('관리자 정보:', data);
        setAdminInfo(data);
      } else {
        console.error('관리자 정보 조회 실패:', response.status);
      }
    } catch (error) {
      console.error('관리자 정보 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 게시물 목록 상태
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  // 게시물 삭제 함수
  const handleDeletePost = async (postId: number) => {
    if (!confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    setDeletingPostId(postId);

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/board/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('게시물이 성공적으로 삭제되었습니다.');
        // 게시물 목록 새로고침
        fetchPosts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`삭제 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
      alert('게시물 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingPostId(null);
    }
  };

  // 댓글 개수를 백엔드에서 가져오는 함수
  const fetchCommentCount = async (boardId: number): Promise<number> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/board/comment/${boardId}`);
      
      if (response.ok) {
        const comments = await response.json();
        
        // 댓글 개수 계산 (대댓글 포함)
        let totalCount = 0;
        if (Array.isArray(comments)) {
          totalCount = comments.length;
          
          // 대댓글 개수도 계산
          for (const comment of comments) {
            if (comment.replies && Array.isArray(comment.replies)) {
              totalCount += comment.replies.length;
            }
          }
        }
        
        return totalCount;
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  };

  // 실제 게시물 목록 가져오기
  const fetchPosts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/board/board`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('게시물 목록:', data);
        
        // 각 게시글의 댓글 개수를 가져와서 업데이트
        const postsWithCommentCounts = await Promise.all(
          data.map(async (post: any) => {
            const commentCount = await fetchCommentCount(post.board_id);
            return {
              ...post,
              comment_count: commentCount
            };
          })
        );
        
        setPosts(postsWithCommentCounts);
      } else {
        console.error('게시물 목록 조회 실패:', response.status);
        // 실패 시 하드코딩 데이터 사용
        setPosts([
          {
            board_id: 1,
            title: "오늘의 맛집 추천 - 강남역 맛집 5곳",
            username: "김철수",
            view: 1247,
            like_count: 89,
            comment_count: 23,
            uploaded_at: "2024-01-15",
            image_url: "/upload/sample1.jpg",
            isReported: false
          },
          {
            board_id: 2,
            title: "운동 루틴 공유 - 홈트레이닝 가이드",
            username: "최지영",
            view: 567,
            like_count: 23,
            comment_count: 8,
            uploaded_at: "2024-01-12",
            image_url: "/upload/sample2.jpg",
            isReported: true
          }
        ]);
      }
    } catch (error) {
      console.error('게시물 목록 조회 오류:', error);
      // 오류 시 하드코딩 데이터 사용
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 관리자 정보와 게시물 목록 가져오기
  useEffect(() => {
    fetchAdminInfo();
    fetchPosts();
  }, []);

  // 임시 데이터 (나중에 실제 데이터로 교체)
  const stats = {
    totalUsers: 1247,
    totalPosts: 89,
    totalComments: 342,
    totalInquiries: 23,
    activeUsers: 156,
    pendingPosts: 5,
    reportedComments: 8,
    newInquiries: 3
  };

  const recentActivities = [
    { id: 1, type: 'post', user: '김철수', action: '새 게시글 작성', time: '5분 전', status: 'pending' },
    { id: 2, type: 'comment', user: '이영희', action: '댓글 신고', time: '12분 전', status: 'reported' },
    { id: 3, type: 'user', user: '박민수', action: '회원가입', time: '1시간 전', status: 'new' },
    { id: 4, type: 'inquiry', user: '최지영', action: '문의사항 등록', time: '2시간 전', status: 'new' }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% 이전 대비
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ activity }: any) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'reported': return 'bg-red-100 text-red-800';
        case 'new': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending': return '대기중';
        case 'reported': return '신고됨';
        case 'new': return '신규';
        default: return '완료';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {activity.type === 'post' && <FileText className="w-5 h-5 text-gray-600" />}
            {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-gray-600" />}
            {activity.type === 'user' && <Users className="w-5 h-5 text-gray-600" />}
            {activity.type === 'inquiry' && <Headphones className="w-5 h-5 text-gray-600" />}
          </div>
          <div>
            <p className="font-medium text-gray-900">{activity.user}</p>
            <p className="text-sm text-gray-600">{activity.action}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
            {getStatusText(activity.status)}
          </span>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
      </div>
    );
  };

  const QuickActionButton = ({ title, icon: Icon, color, onClick }: any) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-${color}-300 hover:bg-${color}-50 transition-all group`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`p-3 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 transition-colors`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {isLoading ? (
                  '로딩 중...'
                ) : adminInfo ? (
                  `${adminInfo.name || adminInfo.username || '관리자'}님, 안녕하세요!`
                ) : (
                  '관리자님, 안녕하세요!'
                )}
              </span>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: '대시보드', icon: BarChart3 },
              { id: 'users', label: '사용자 관리', icon: Users },
              { id: 'posts', label: '게시물 관리', icon: FileText },
              { id: 'comments', label: '댓글 관리', icon: MessageSquare },
              { id: 'support', label: '고객센터', icon: Headphones },
              { id: 'news', label: '뉴스 통계', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  console.log('탭 클릭:', tab.id);
                  setActiveTab(tab.id);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="전체 사용자"
                value={stats.totalUsers.toLocaleString()}
                icon={Users}
                color="bg-blue-500"
                change={12}
              />
              <StatCard
                title="전체 게시글"
                value={stats.totalPosts.toLocaleString()}
                icon={FileText}
                color="bg-green-500"
                change={8}
              />
              <StatCard
                title="전체 댓글"
                value={stats.totalComments.toLocaleString()}
                icon={MessageSquare}
                color="bg-purple-500"
                change={-3}
              />
              <StatCard
                title="문의사항"
                value={stats.totalInquiries.toLocaleString()}
                icon={Headphones}
                color="bg-orange-500"
                change={15}
              />
            </div>

            {/* 상세 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton
                    title="게시글 보기"
                    icon={CheckCircle}
                    color="green"
                    onClick={() => setActiveTab('posts')}
                  />
                  <QuickActionButton
                    title="댓글 검토"
                    icon={MessageSquare}
                    color="blue"
                    onClick={() => setActiveTab('comments')}
                  />
                  <QuickActionButton
                    title="사용자 관리"
                    icon={Users}
                    color="purple"
                    onClick={() => setActiveTab('users')}
                  />
                  <QuickActionButton
                    title="문의 답변"
                    icon={Headphones}
                    color="orange"
                    onClick={() => setActiveTab('support')}
                  />
                </div>
              </div>
            </div>

            {/* 알림 및 경고 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">주의가 필요한 항목</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-yellow-700">• 승인 대기 게시글: {stats.pendingPosts}개</p>
                  <p className="text-yellow-700">• 신고된 댓글: {stats.reportedComments}개</p>
                  <p className="text-yellow-700">• 새로운 문의: {stats.newInquiries}개</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">시스템 상태</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-green-700">• 서버 상태: 정상</p>
                  <p className="text-green-700">• 데이터베이스: 연결됨</p>
                  <p className="text-green-700">• 백업 상태: 최신</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 게시물 관리 탭 */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">게시물 관리</h2>
                <p className="text-gray-600 mt-1">전체 게시물 현황을 모니터링하세요</p>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체 게시물</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {postsLoading ? '...' : posts.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">총 게시물 수</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">신고된 게시물</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {postsLoading ? '...' : posts.filter(post => post.isReported).length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">처리 대기 중</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 간단한 게시물 목록 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">최근 게시물</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {postsLoading ? (
                  <div className="px-6 py-8 text-center">
                    <div className="text-gray-500">게시물을 불러오는 중...</div>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <div className="text-gray-500">게시물이 없습니다.</div>
                  </div>
                ) : (
                  posts.map((post) => (
                  <div key={post.board_id || post.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {post.image_url ? (
                              <ImageIcon className="w-5 h-5 text-gray-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">작성자: {post.username}</p>
                            {post.isReported && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                신고됨
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>조회 {post.view?.toLocaleString() || 0}</span>
                          <span>댓글 {post.comment_count?.toLocaleString() || 0}</span>
                          <span>{post.uploaded_at}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedPost(post);
                              setIsDetailModalOpen(true);
                            }}
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            보기
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.board_id || post.id)}
                            disabled={deletingPostId === (post.board_id || post.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                              deletingPostId === (post.board_id || post.id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                          >
                            {deletingPostId === (post.board_id || post.id) ? '삭제 중...' : '삭제'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 사용자 관리 탭 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
                <p className="text-gray-600 mt-1">전체 사용자 현황을 모니터링하세요</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  사용자 추가
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  엑셀 다운로드
                </button>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600 mt-1">+12% 이번 달</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                    <p className="text-3xl font-bold text-gray-900">896</p>
                    <p className="text-sm text-green-600 mt-1">72% 활성도</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">신규 가입</p>
                    <p className="text-3xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-gray-500 mt-1">오늘</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">정지된 사용자</p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-red-600 mt-1">관리 필요</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">사용자 목록</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="사용자 검색..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>전체 상태</option>
                    <option>활성</option>
                    <option>비활성</option>
                    <option>정지</option>
                  </select>
                </div>
              </div>

              {/* 사용자 목록 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        name: "김철수",
                        email: "kim@example.com",
                        joinDate: "2024-01-15",
                        posts: 23,
                        comments: 45,
                        status: "active",
                        lastLogin: "2시간 전"
                      },
                      {
                        id: 2,
                        name: "이영희",
                        email: "lee@example.com",
                        joinDate: "2024-01-10",
                        posts: 15,
                        comments: 32,
                        status: "active",
                        lastLogin: "1일 전"
                      },
                      {
                        id: 3,
                        name: "박민수",
                        email: "park@example.com",
                        joinDate: "2024-01-08",
                        posts: 8,
                        comments: 12,
                        status: "inactive",
                        lastLogin: "1주일 전"
                      },
                      {
                        id: 4,
                        name: "최지영",
                        email: "choi@example.com",
                        joinDate: "2024-01-05",
                        posts: 5,
                        comments: 8,
                        status: "suspended",
                        lastLogin: "3일 전"
                      },
                      {
                        id: 5,
                        name: "정수현",
                        email: "jung@example.com",
                        joinDate: "2024-01-20",
                        posts: 12,
                        comments: 28,
                        status: "active",
                        lastLogin: "30분 전"
                      }
                    ].map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                                alt={user.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">최근 로그인: {user.lastLogin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">게시물: {user.posts}</div>
                          <div className="text-sm text-gray-500">댓글: {user.comments}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? '활성' : user.status === 'inactive' ? '비활성' : '정지'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">보기</button>
                          <button className="text-green-600 hover:text-green-900">편집</button>
                          {user.status === 'suspended' ? (
                            <button className="text-green-600 hover:text-green-900">해제</button>
                          ) : (
                            <button className="text-red-600 hover:text-red-900">정지</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  총 <span className="font-medium">1,247</span>명 중 <span className="font-medium">1-5</span>명 표시
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                    이전
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                    다음
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 다른 탭들 (나중에 구현) */}
        {activeTab !== 'dashboard' && activeTab !== 'posts' && activeTab !== 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'comments' && '댓글 관리'}
              {activeTab === 'support' && '고객센터 관리'}
              {activeTab === 'news' && '뉴스 통계'}
            </h3>
            <p className="text-gray-600">이 기능은 현재 개발 중입니다.</p>
          </div>
        )}

        {/* 게시물 상세 모달 */}
        {isDetailModalOpen && selectedPost && (
          <ColumnDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedPost(null);
            }}
            columnId={selectedPost.board_id || selectedPost.id}
            onLikeChange={() => {
              // 좋아요 상태 변경 시 게시물 목록 새로고침
              fetchPosts();
            }}
          />
        )}
      </div>
    </div>
  );
}
