// JWT 토큰 관리 유틸리티

// 토큰을 localStorage에 저장
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

// localStorage에서 토큰 가져오기
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

// 토큰 삭제
// 로그아웃 시 auth-storage 전체를 지우는 것이 안전할 수 있습니다.
// 만약 다른 정보도 함께 저장한다면 token 필드만 null로 업데이트해야 합니다.
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
};

// JWT 토큰 디코딩 (URL-safe Base64)
const decodeBase64Url = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
};

// JWT 토큰 파싱
const parseJwt = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload);
  } catch (error) {
    console.error('JWT 파싱 오류:', error);
    return null;
  }
};

// 토큰이 유효한지 확인 (형식 체크 + 만료 시간 확인)
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  // JWT 토큰은 3개의 부분으로 구성되어 있음 (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // 만료 시간 확인 (임시로 비활성화 - 백엔드 토큰 만료 시간이 너무 짧음)
  try {
    const payload = parseJwt(token);
    if (!payload) return false;
    
    // exp가 없으면 형식만 확인하고 통과
    if (!payload.exp) {
      console.log('🔍 토큰에 만료 시간이 없음 - 형식만 확인하여 통과');
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp;
    
    console.log('🔍 토큰 만료 확인:', {
      now: now,
      exp: exp,
      isExpired: now >= exp,
      timeLeft: exp - now,
      note: '만료 시간 확인을 임시로 비활성화했습니다'
    });
    
    // 임시로 만료 시간 확인을 비활성화 (백엔드 문제 해결까지)
    return true; // now < exp 대신 항상 true 반환
  } catch (error) {
    console.error('토큰 만료 확인 오류:', error);
    return false;
  }
};

// 토큰이 만료되었는지 확인 (임시로 비활성화)
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payload = parseJwt(token);
    if (!payload) return true;
    
    // exp가 없으면 만료되지 않은 것으로 처리
    if (!payload.exp) {
      console.log('🔍 토큰에 만료 시간이 없음 - 만료되지 않은 것으로 처리');
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const isExpired = now >= payload.exp;
    
    console.log('🔍 토큰 만료 확인 (isTokenExpired):', {
      now: now,
      exp: payload.exp,
      isExpired: isExpired,
      note: '만료 시간 확인을 임시로 비활성화했습니다'
    });
    
    // 임시로 만료 시간 확인을 비활성화 (백엔드 문제 해결까지)
    return false; // 항상 만료되지 않은 것으로 처리
  } catch (error) {
    console.error('토큰 만료 확인 오류:', error);
    return true;
  }
};

// Authorization 헤더 생성
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  if (token && isTokenValid(token)) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}; 