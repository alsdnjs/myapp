'use client';

import React, { useEffect, useState } from 'react';
import { getToken } from '@/utils/token';

export interface ColumnEditData {
  id: number;
  content: string;
}

interface ColumnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: ColumnEditData;
  onUpdated: (updated: { id: number; content: string }) => void;
}

export default function ColumnEditModal({ isOpen, onClose, column, onUpdated }: ColumnEditModalProps) {
  const [content, setContent] = useState(column.content);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setContent(column.content);
  }, [column]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const token = getToken();
    console.log('보내는 토큰:', token);

    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

      const resp = await fetch(`${baseUrl}/api/board/update/${column.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ board_content: content }),
      });
      

      console.log('응답 상태:', resp.status);

      if (!resp.ok) {
        if (resp.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
        } else if (resp.status === 403) {
          alert('작성자만 수정할 수 있습니다.');
        } else if (resp.status === 404) {
          alert('게시글을 찾을 수 없습니다.');
        } else {
          alert('수정 실패했습니다.');
        }
        return;
      }

      onUpdated({ id: column.id, content });
      onClose();
    } catch (error) {
      console.error('오류:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white/95 rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden">
        {/* 왼쪽: 비주얼 영역(플레이스홀더) */}
        <div className="w-1/2 bg-black" />

        {/* 오른쪽: 수정 폼 */}
        <div className="w-1/2 flex flex-col">
          {/* 헤더 */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">칼럼 수정</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                className="w-full h-[calc(100%-2rem)] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className={`px-6 py-2 rounded-lg text-white ${
                  submitting || !content.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

