'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { getToken } from '@/utils/token';

export default function AdminDashboard() {
  // 통계 데이터 상태
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    todayVisitors: 0,
    loading: true
  });

  // 통계 데이터 가져오기
  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log('토큰이 없습니다.');
        return;
      }

      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      };

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

      // 병렬로 API 호출
      const [usersRes, postsRes, reportsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/users`, { headers }),
        fetch(`${baseUrl}/api/board/board`, { headers }),
        fetch(`${baseUrl}/api/report/admin/list`, { headers })
      ]);

      // 사용자 수
      let totalUsers = 0;
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        console.log('사용자 데이터:', usersData);
        totalUsers = usersData.total || usersData.length || 0;
      } else {
        console.log('사용자 API 실패:', usersRes.status);
      }

      // 게시물 수
      let totalPosts = 0;
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        console.log('게시물 데이터:', postsData);
        totalPosts = postsData.total || postsData.length || 0;
      } else {
        console.log('게시물 API 실패:', postsRes.status);
      }

      // 신고 건수
      let totalReports = 0;
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        console.log('신고 데이터 구조:', reportsData);
        totalReports = Array.isArray(reportsData) ? reportsData.length : (reportsData.total || 0);
    } else {
        console.log('신고 API 실패:', reportsRes.status);
      }

      setStats({
        totalUsers,
        totalPosts,
        totalReports,
        todayVisitors: 0, // 임시로 0 (추후 구현)
        loading: false
      });

      console.log('📊 대시보드 통계 로드 완료:', {
        totalUsers,
        totalPosts,
        totalReports
      });

    } catch (error) {
      console.error('통계 로드 실패:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);
    return (
          <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
          <p className="mt-1 text-sm text-gray-500">관리자 대시보드에 오신 것을 환영합니다.</p>
        </div>
    <button
          onClick={fetchDashboardStats}
          disabled={stats.loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {stats.loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              로딩 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새로고침
            </>
          )}
              </button>
      </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
                <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
                  </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">전체 사용자</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    ) : (
                      stats.totalUsers.toLocaleString()
                    )}
                  </dd>
                </dl>
                          </div>
                        </div>
                          </div>
                        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
                <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-green-600" />
                  </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">전체 게시물</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    ) : (
                      stats.totalPosts.toLocaleString()
                    )}
                  </dd>
                </dl>
              </div>
                </div>
                </div>
              </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
                <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">신고 건수</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    ) : (
                      stats.totalReports.toLocaleString()
                    )}
                  </dd>
                </dl>
                              </div>
                </div>
              </div>
            </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
                <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">오늘 방문자</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    ) : (
                      stats.todayVisitors.toLocaleString()
                    )}
                  </dd>
                </dl>
                          </div>
                        </div>
                      </div>
              </div>
              </div>

      {/* 최근 활동 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">최근 활동</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">최근 관리자 활동 내역입니다.</p>
            </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">새로운 신고가 접수되었습니다</p>
                  <p className="text-sm text-gray-500">2분 전</p>
          </div>
                  </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">새로운 게시물이 작성되었습니다</p>
                  <p className="text-sm text-gray-500">5분 전</p>
                </div>
                    </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">사용자가 가입했습니다</p>
                  <p className="text-sm text-gray-500">10분 전</p>
                  </div>
                    </div>
            </li>
          </ul>
                  </div>
      </div>
    </div>
  );
}

