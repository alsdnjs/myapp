'use client';

import React, { useEffect, useState } from 'react';
import { getToken } from '@/utils/token';
import { parseTitleAndContent } from '@/utils/articleStorage';
import ImageGallery from '@/components/ImageGallery'; // ImageGallery 컴포넌트 추가

interface ColumnDetail {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  content: string;
  image_url?: string;
  imageUrls?: string; // 여러 이미지를 위한 필드 추가
  isLiked?: boolean; // 좋아요 상태 추가
  commentList?: any[]; // 댓글 목록 필드 추가
}

interface ColumnDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: number | null;
  onLikeChange?: (columnId: number, isLiked: boolean, likeCount: number) => void; // 좋아요 상태 변경 콜백 추가
}

export default function ColumnDetailModal({ isOpen, onClose, columnId, onLikeChange }: ColumnDetailModalProps) {
  const [column, setColumn] = useState<ColumnDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentInput, setCommentInput] = useState(''); // 댓글 입력 상태
  
  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');
  
  // 대댓글 관련 상태
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');
  
  // 답글 표시 상태 관리
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  
  // 현재 사용자 정보
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);

  // 좋아요 토글 함수
  const handleLikeToggle = async () => {
    if (!column) return;
    
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/board/${column.id}/like`;
      
      const resp = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        const newIsLiked = data.isLiked;
        const newCount = data.likeCount || data.like_count || data.likes || 0;

        // 컬럼 상태 업데이트
        setColumn(prev => prev ? {
          ...prev,
          isLiked: newIsLiked,
          likes: newCount
        } : null);

        // 부모 컴포넌트에 좋아요 상태 변경 알림
        if (onLikeChange) {
          onLikeChange(column.id, newIsLiked, newCount);
          console.log('📢 부모 컴포넌트에 좋아요 상태 변경 알림:', { columnId: column.id, isLiked: newIsLiked, count: newCount });
        }

        console.log('✅ 좋아요 토글 성공:', { columnId: column.id, isLiked: newIsLiked, count: newCount });
      } else {
        console.error('❌ 좋아요 토글 실패:', resp.status);
        alert('좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('💥 좋아요 토글 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 신고하기 함수
  const handleReportColumn = async () => {
    if (!column) {
      alert('게시글을 찾을 수 없습니다.');
      return;
    }
    
    // 신고 사유 선택
    const reportReasons = [
      '스팸/광고성 게시글',
      '부적절한 내용',
      '저작권 침해',
      '개인정보 노출',
      '기타'
    ];
    
    const selectedReason = prompt(
      `"${column.title}" 게시글을 신고합니다.\n\n신고 사유를 선택해주세요:\n\n${reportReasons.map((reason, index) => `${index + 1}. ${reason}`).join('\n')}\n\n번호를 입력하세요 (1-5):`
    );
    
    if (!selectedReason) return; // 취소
    
    const reasonIndex = parseInt(selectedReason) - 1;
    if (isNaN(reasonIndex) || reasonIndex < 0 || reasonIndex >= reportReasons.length) {
      alert('올바른 신고 사유를 선택해주세요.');
      return;
    }
    
    const reportReason = reportReasons[reasonIndex];
    
    // 추가 설명 입력 (선택사항)
    const additionalComment = prompt('추가 설명이 있다면 입력해주세요 (선택사항):');
    
    if (!confirm(`다음 내용으로 신고하시겠습니까?\n\n게시글: ${column.title}\n신고 사유: ${reportReason}${additionalComment ? `\n추가 설명: ${additionalComment}` : ''}`)) {
      return;
    }
    
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      
      // 백엔드 구현 전이므로 임시로 성공 메시지 표시
      console.log('🚨 상세페이지 신고 정보:', {
        columnId: column.id,
        title: column.title,
        reason: reportReason,
        additionalComment,
        reporterToken: token ? `${token.substring(0, 20)}...` : '없음'
      });
      
      // TODO: 백엔드 API 구현 후 실제 신고 요청
      // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      // const resp = await fetch(`${baseUrl}/api/board/report`, {
      //   method: 'POST',
      //   headers: { 
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     board_id: column.id,
      //     report_reason: reportReason,
      //     additional_comment: additionalComment || ''
      //   })
      // });
      
      alert('신고가 접수되었습니다. 검토 후 처리하겠습니다.');
      
    } catch (err) {
      console.error('신고 오류:', err);
      alert('신고 처리 중 오류가 발생했습니다.');
    }
  };

  // 댓글 수정 함수
  const handleCommentEdit = async (commentId: number) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/comment/${commentId}`;
      
      console.log('✏️ 댓글 수정 API 호출:', requestUrl);
      console.log('📝 수정할 내용:', editCommentContent);

      const resp = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: new URLSearchParams({
          comment_content: editCommentContent
        })
      });

      if (resp.ok) {
        const responseText = await resp.text();
        console.log('✅ 댓글 수정 성공:', responseText);
        
        // 수정 모드 종료
        setEditingCommentId(null);
        setEditCommentContent('');
        
        // 댓글 목록 새로고침
        await loadColumnDetail();
        
        alert('댓글이 수정되었습니다.');
      } else {
        console.error('❌ 댓글 수정 실패:', resp.status);
        if (resp.status === 401) {
          alert('권한이 없습니다.');
        } else if (resp.status === 400) {
          alert('댓글 내용을 입력해주세요.');
        } else {
          alert('댓글 수정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 댓글 수정 오류:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 댓글 수정 취소 함수
  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  // 댓글 수정 모드 시작 함수
  const handleCommentEditStart = (comment: any) => {
    setEditingCommentId(comment.comment_id);
    setEditCommentContent(comment.comment_content);
  };

  // 대댓글 작성 함수
  const handleReplySubmit = async (parentCommentId: number) => {
    if (!replyInput.trim()) {
      alert('대댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/comment/${column?.id}/reply`;
      
      console.log('💬 대댓글 작성 API 호출:', requestUrl);
      console.log('📝 대댓글 내용:', replyInput);
      console.log('👥 부모 댓글 ID:', parentCommentId);

      const resp = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: new URLSearchParams({
          parent_id: parentCommentId.toString(),
          comment_content: replyInput
        })
      });

      if (resp.ok) {
        const responseText = await resp.text();
        console.log('✅ 대댓글 작성 성공:', responseText);
        
        // 입력 필드 초기화 및 대댓글 모드 종료
        setReplyInput('');
        setReplyingToCommentId(null);
        
        // 댓글 목록 새로고침
        await loadColumnDetail();
        
        alert('대댓글이 작성되었습니다.');
      } else {
        console.error('❌ 대댓글 작성 실패:', resp.status);
        if (resp.status === 401) {
          alert('권한이 없습니다.');
        } else if (resp.status === 400) {
          alert('대댓글 내용을 입력해주세요.');
        } else {
          alert('대댓글 작성에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 대댓글 작성 오류:', error);
      alert('대댓글 작성 중 오류가 발생했습니다.');
    }
  };

  // 대댓글 작성 모드 시작
  const handleReplyStart = (commentId: number) => {
    setReplyingToCommentId(commentId);
    setReplyInput('');
  };

  // 대댓글 작성 모드 취소
  const handleReplyCancel = () => {
    setReplyingToCommentId(null);
    setReplyInput('');
  };

  // 답글 표시/숨김 토글
  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // 대댓글 수정 함수
  const handleReplyEdit = async (replyId: number) => {
    if (!editCommentContent.trim()) {
      alert('대댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/comment/reply/${replyId}`;
      
      console.log('✏️ 대댓글 수정 API 호출:', requestUrl);
      console.log('📝 수정할 내용:', editCommentContent);

      const resp = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: new URLSearchParams({
          comment_content: editCommentContent
        })
      });

      if (resp.ok) {
        const responseText = await resp.text();
        console.log('✅ 대댓글 수정 성공:', responseText);
        
        // 수정 모드 종료
        setEditingCommentId(null);
        setEditCommentContent('');
        
        // 댓글 목록 새로고침
        await loadColumnDetail();
        
        alert('대댓글이 수정되었습니다.');
      } else {
        console.error('❌ 대댓글 수정 실패:', resp.status);
        if (resp.status === 401) {
          alert('권한이 없습니다.');
        } else if (resp.status === 400) {
          alert('대댓글 내용을 입력해주세요.');
        } else {
          alert('대댓글 수정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 대댓글 수정 오류:', error);
      alert('대댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 대댓글 삭제 함수
  const handleReplyDelete = async (replyId: number) => {
    // 삭제 확인
    if (!confirm('정말로 이 대댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/comment/reply/${replyId}`;
      
      console.log('🗑️ 대댓글 삭제 API 호출:', requestUrl);

      const resp = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (resp.ok) {
        const responseText = await resp.text();
        console.log('✅ 대댓글 삭제 성공:', responseText);
        
        // 댓글 목록 새로고침
        await loadColumnDetail();
        
        alert('대댓글이 삭제되었습니다.');
      } else {
        console.error('❌ 대댓글 삭제 실패:', resp.status);
        if (resp.status === 401) {
          alert('권한이 없습니다.');
        } else if (resp.status === 404) {
          alert('대댓글을 찾을 수 없습니다.');
        } else {
          alert('대댓글 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 대댓글 삭제 오류:', error);
      alert('대댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제 함수
  const handleCommentDelete = async (commentId: number) => {
    // 삭제 확인
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const requestUrl = `${baseUrl}/api/board/comment/${commentId}`;
      
      console.log('🗑️ 댓글 삭제 API 호출:', requestUrl);

      const resp = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (resp.ok) {
        const responseText = await resp.text();
        console.log('✅ 댓글 삭제 성공:', responseText);
        
        // 댓글 목록 새로고침
        await loadColumnDetail();
        
        alert('댓글이 삭제되었습니다.');
      } else {
        console.error('❌ 댓글 삭제 실패:', resp.status);
        if (resp.status === 401) {
          alert('권한이 없습니다.');
        } else if (resp.status === 404) {
          alert('댓글을 찾을 수 없습니다.');
        } else {
          alert('댓글 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 현재 사용자 정보 가져오기
  const loadCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCurrentUser(null);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('👤 /api/user 응답 데이터:', userData);
        
        if (userData.isAuthenticated) {
          // 여러 가능한 필드에서 사용자 ID 찾기
          const userId = userData.userId || userData.id || userData.user_id || userData.userId;
          const username = userData.username || userData.name;
          
          console.log('👤 추출된 사용자 정보:', { userId, username });
          
          if (userId) {
            setCurrentUser({
              id: userId,
              username: username
            });
            console.log('✅ 현재 사용자 정보 설정 완료:', { id: userId, username });
          } else {
            console.error('❌ 사용자 ID를 찾을 수 없음:', userData);
            setCurrentUser(null);
          }
        }
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setCurrentUser(null);
    }
  };

  // 댓글 작성 함수
  const handleCommentSubmit = async () => {
    if (!column || !commentInput.trim()) return;

    try {
      const token = getToken();
      console.log('🔍 댓글 작성 디버깅:', {
        columnId: column.id,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : '없음'
      });
      
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
      // 올바른 API 엔드포인트로 수정
      const requestUrl = `${baseUrl}/api/board/comment/${column.id}`;
      
      console.log('🌐 댓글 작성 API 호출:', requestUrl);
      console.log('🔑 요청 헤더:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        // 'Content-Type' 헤더 제거됨
      });
      console.log('📝 요청 본문:', { comment_content: commentInput });

      const resp = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type' 헤더 제거 (브라우저가 자동 설정)
        },
        body: new URLSearchParams({
          comment_content: commentInput // 백엔드 필드명에 맞춤
        })
      });

      console.log('📡 응답 상태:', resp.status, resp.statusText);

      if (resp.ok) {
        // 백엔드 응답이 한글 텍스트이므로 text()로 처리
        const responseText = await resp.text();
        setCommentInput(''); // 입력 필드 초기화
        await loadColumnDetail(); // 댓글 목록 다시 로드
        console.log('✅ 댓글 작성 성공:', responseText);
      } else {
        console.error('❌ 댓글 작성 실패:', resp.status);
        
        // 401 오류 상세 정보
        if (resp.status === 401) {
          console.error('🔒 401 오류 상세:', {
            status: resp.status,
            statusText: resp.statusText,
            requestUrl: requestUrl,
            hasToken: !!token
          });
          
          // 응답 본문 확인
          try {
            const errorText = await resp.text();
            console.error('📝 오류 응답 본문:', errorText);
          } catch (e) {
            console.error('📝 응답 본문 읽기 실패:', e);
          }
          
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else {
          alert('댓글 작성에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('💥 댓글 작성 오류:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  // 이미지 URL 변환 함수
  const transformImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('/upload/')) {
      // /upload/파일명.png → /api/board/image/파일명.png
      const filename = imageUrl.replace('/upload/', '');
      return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}/api/board/image/${filename}`;
    } else if (!imageUrl.startsWith('http')) {
      // 상대 경로인 경우
      return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'}${imageUrl}`;
    } else {
      // 이미 전체 URL인 경우
      return imageUrl;
    }
  };

  useEffect(() => {
    if (isOpen && columnId) {
      loadColumnDetail();
      loadCurrentUser();
    }
  }, [isOpen, columnId]);

  const loadColumnDetail = async () => {
    if (!columnId) return;
    
    setLoading(true);
    try {
      const token = getToken();
      const baseUrl = 'http://localhost:8080';
      
      console.log('상세 정보 로드 시작 - columnId:', columnId);
      console.log('토큰 상태:', token ? '있음' : '없음');
      console.log('토큰 값:', token ? token.substring(0, 20) + '...' : '없음');
      
      // 글 상세 정보 가져오기
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization 헤더 추가됨');
      } else {
        console.log('토큰이 없어서 Authorization 헤더를 추가하지 않음');
      }

      // 실제 백엔드 API 호출
      console.log('백엔드 API 호출 시도 - columnId:', columnId);
      console.log('요청 헤더:', headers);
      
      // 다른 가능한 경로들을 시도
      const detailResponse = await fetch(`${baseUrl}/api/board/board/detail/${columnId}`, {
        method: 'GET',
        headers
      });

      console.log('API 응답 상태:', detailResponse.status);

      if (detailResponse.ok) {
        const data = await detailResponse.json();
        console.log('글 상세 정보:', data);
        
        // 제목과 내용을 파싱
        const { title, content } = parseTitleAndContent(data.board_content || data.content || '');
        
        // 임시 해결책: 전체목록에서 좋아요 상태 가져오기
        let isLiked = false;
        if (token) {
          try {
            const listResponse = await fetch(`${baseUrl}/api/board/board/authenticated`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (listResponse.ok) {
              const listData = await listResponse.json();
              const columnFromList = listData.find((item: any) => 
                (item.board_id || item.id) === columnId
              );
              
              if (columnFromList) {
                isLiked = columnFromList.is_liked || columnFromList.isLiked || false;
                console.log('📋 전체목록에서 좋아요 상태 가져옴:', isLiked);
              }
            }
          } catch (error) {
            console.log('전체목록에서 좋아요 상태 가져오기 실패:', error);
          }
        }
        
        // 댓글 목록 가져오기 (기존 API로 복구)
        let commentList = [];
        try {
          console.log('🔍 댓글 목록 로드 시작 - columnId:', columnId);
          
          // 기존 댓글 API 사용 (복구)
          const commentsResponse = await fetch(`${baseUrl}/api/board/comment/${columnId}`, {
            method: 'GET'
            // 인증 헤더 제거 - 모든 사용자가 댓글을 볼 수 있음
          });
          console.log('📡 댓글 API 응답 상태:', commentsResponse.status);
          
          if (commentsResponse.ok) {
            const comments = await commentsResponse.json();
            console.log('📝 댓글 목록 로드 성공:', comments);
            console.log('📝 댓글 개수:', comments.length);
            console.log('📝 댓글 데이터 구조:', comments[0] ? Object.keys(comments[0]) : '댓글 없음');
            console.log('📝 첫 번째 댓글 상세:', comments[0] || '댓글 없음');
            
            // 각 댓글에 대댓글 로드
            const commentsWithReplies = await Promise.all(
              comments.map(async (comment: any) => {
                if (comment.parent_id === null) { // 최상위 댓글만
                  try {
                    const repliesResponse = await fetch(`${baseUrl}/api/board/comment/replies/${comment.comment_id}`, {
                      method: 'GET'
                      // 인증 헤더 제거 - 모든 사용자가 대댓글을 볼 수 있음
                    });
                    if (repliesResponse.ok) {
                      const replies = await repliesResponse.json();
                      return { ...comment, replies };
                    }
                  } catch (error) {
                    console.error('대댓글 로드 실패:', error);
                  }
                }
                return comment;
              })
            );
            
            commentList = commentsWithReplies;
            console.log('🔄 댓글과 대댓글 로드 완료:', commentList);
            console.log('🔄 commentList 길이:', commentList.length);
          }
        } catch (error) {
          console.error('댓글 목록 로드 실패:', error);
        }
        
        const columnDetail: ColumnDetail = {
          id: data.board_id || data.id,
          title: title || '제목 없음',
          author: data.username || data.author || '작성자',
          date: data.uploaded_at || data.date || '2024.03.21',
          views: data.view || data.views || 0,
          comments: data.comment_count || data.comments || 0,
          likes: data.like_count || data.likes || 0,
          content: content || '내용 없음',
          image_url: data.image_url ? transformImageUrl(data.image_url) : undefined,
          imageUrls: data.imageUrls ? (Array.isArray(data.imageUrls) ? data.imageUrls.join(',') : data.imageUrls).split(',').map(transformImageUrl).join(',') : undefined,
          isLiked: isLiked, // 임시 해결책으로 가져온 좋아요 상태 사용
          commentList: commentList // 댓글 목록 추가
        };
        
        console.log('🏗️ columnDetail 객체 생성 완료:', columnDetail);
        console.log('🏗️ commentList 포함 여부:', !!columnDetail.commentList);
        console.log('🏗️ commentList 길이:', columnDetail.commentList?.length || 0);
        
        setColumn(columnDetail);
      } else {
        console.error('글 상세 정보 가져오기 실패:', detailResponse.status);
        // 실패 시 임시 데이터로 설정
        const columnDetail: ColumnDetail = {
          id: columnId,
          title: `칼럼 제목 ${columnId} (API 실패)`,
          author: '작성자',
          date: '2024.03.21',
          views: 100 + (columnId * 10),
          comments: 5 + columnId,
          likes: 20 + (columnId * 5),
          content: `API 호출 실패 (${detailResponse.status}). 이것은 ${columnId}번째 칼럼의 임시 내용입니다.`
        };
        
        setColumn(columnDetail);
      }
    } catch (error) {
      console.error('글 상세 정보 로드 오류:', error);
      // 오류 시 기본 데이터로 설정
      setColumn({
        id: columnId!,
        title: '오류가 발생했습니다',
        author: '작성자',
        date: '2024.03.21',
        views: 0,
        comments: 0,
        likes: 0,
        content: '내용을 불러올 수 없습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className={`bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {/* 왼쪽: 이미지 섹션 */}
        <div className="w-1/2 h-full bg-gray-100 rounded-l-lg overflow-hidden"> {/* w-3/4에서 w-1/2로 변경 */}
          {(column?.imageUrls || column?.image_url) ? (
            <ImageGallery imageUrl={column.imageUrls || column.image_url || ''} size="large" />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <div className="text-white text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">이미지 없음</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 상세 섹션 */}
        <div className="w-1/2 flex flex-col"> {/* w-1/4에서 w-1/2로 변경 */}
          {/* 작성자/닫기/제목/통계 - 댓글 모달 상단과 유사 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    {column?.author ? column.author[0] : '?'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{column?.author ?? '작성자'}</div>
                  <div className="text-sm text-gray-500">{column?.date ?? '날짜'}</div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 transform transition-transform duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h1 className="text-xl font-semibold mt-4 mb-2">{loading ? '불러오는 중...' : (column?.title ?? '제목')}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={handleLikeToggle}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg 
                    className={`w-5 h-5 transition-all duration-200 ${
                      column?.isLiked ? 'fill-current text-red-500' : 'fill-none'
                    }`}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {(() => {
                      const commentListLength = column?.commentList?.length || 0;
                      const backendComments = column?.comments || 0;
                      const finalCount = commentListLength || backendComments || 0;
                      
                      console.log('🔍 댓글 개수 디버깅:', {
                        commentListLength,
                        backendComments,
                        finalCount,
                        hasCommentList: !!column?.commentList,
                        commentListType: typeof column?.commentList
                      });
                      
                      return finalCount;
                    })()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">{column?.views?.toLocaleString?.() ?? 0}</span>
                </div>
              </div>
              
              {/* 신고하기 버튼 */}
              <button 
                onClick={handleReportColumn}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>신고</span>
              </button>
            </div>
          </div>

          {/* 본문 (고정 높이) */}
          <div className="p-4 border-b border-gray-200">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {column?.content ?? ''}
              </div>
            )}
          </div>

          {/* 댓글 섹션 (별도 스크롤) */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200">
            <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">댓글</h3>
            
            {/* 댓글 입력 폼 */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={commentInput || ''}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleCommentSubmit}
                >
                  작성
                </button>
              </div>
            </div>
            
            {/* 댓글 목록 */}
            {column?.commentList && column.commentList.length > 0 ? (
              <div className="space-y-4">
                {column.commentList.map((comment) => (
                  <div key={comment.comment_id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-900">{comment.username}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* 액션 버튼 (작성자에게만 표시) */}
                          {!editingCommentId && currentUser && currentUser.id === comment.user_id && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCommentEditStart(comment)}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleCommentDelete(comment.comment_id)}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded hover:bg-red-50"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        
                                                {/* 댓글 내용 (수정 모드 또는 일반 모드) */}
                        {editingCommentId === comment.comment_id ? (
                          <div className="mb-3">
                            <input
                              type="text"
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="댓글을 입력하세요..."
                            />
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() => handleCommentEdit(comment.comment_id)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                              >
                                저장
                              </button>
                              <button
                                onClick={handleCommentEditCancel}
                                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-3">{comment.comment_content}</p>
                        )}
                        
                        {/* 대댓글 작성 버튼 */}
                        {!editingCommentId && (
                          <div className="mb-3">
                            <button
                              onClick={() => handleReplyStart(comment.comment_id)}
                              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              💬 답글 작성
                            </button>
                          </div>
                        )}
                        
                        {/* 대댓글 작성 입력창 */}
                        {replyingToCommentId === comment.comment_id && (
                          <div className="mb-3 ml-6 border-l-2 border-blue-200 pl-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="대댓글을 입력하세요..."
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleReplySubmit(comment.comment_id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleReplySubmit(comment.comment_id)}
                                className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                              >
                                작성
                              </button>
                              <button
                                onClick={handleReplyCancel}
                                className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* 답글 토글 버튼 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleReplies(comment.comment_id)}
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                            >
                              <span>
                                {expandedReplies.has(comment.comment_id) ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
                              </span>
                              <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  expandedReplies.has(comment.comment_id) ? 'rotate-180' : ''
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* 대댓글 표시 (토글 가능) */}
                        {comment.replies && comment.replies.length > 0 && expandedReplies.has(comment.comment_id) && (
                          <div className="ml-6 space-y-3 border-l-2 border-blue-200 pl-4 mt-3">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.comment_id} className="bg-white rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm font-semibold text-gray-900">{reply.username}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.uploaded_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  
                                  {/* 대댓글 액션 버튼 (작성자에게만 표시) */}
                                  {currentUser && currentUser.id === reply.user_id && (
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleCommentEditStart(reply)}
                                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => handleReplyDelete(reply.comment_id)}
                                        className="text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded hover:bg-red-50"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  )}
                                </div>
                                
                                {/* 대댓글 내용 (수정 모드 또는 일반 모드) */}
                                {editingCommentId === reply.comment_id ? (
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      value={editCommentContent}
                                      onChange={(e) => setEditCommentContent(e.target.value)}
                                      className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="대댓글을 입력하세요..."
                                    />
                                    <div className="flex items-center space-x-2 mt-2">
                                      <button
                                        onClick={() => handleReplyEdit(reply.comment_id)}
                                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                      >
                                        저장
                                      </button>
                                      <button
                                        onClick={handleCommentEditCancel}
                                        className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-700">{reply.comment_content}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
            </div>
          </div>

          {/* 하단 액션 (선택) */}
          <div className="border-t border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">공유</button>
            </div>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">북마크</button>
          </div>
        </div>
      </div>
    </div>
  );
}



