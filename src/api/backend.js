// ชั้นกลางสำหรับคุยกับ Backend ของทีมเรา
const BASE = process.env.REACT_APP_API_URL || '';

export async function apiFetch(
  path,
  { method = 'GET', body, token } = {}
) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`; // แก้ไข: เติม backtick ปิดท้าย
  }

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json()
    .catch(() => ({ error: 'server ไม่ได้ตอบเป็น JSON' }));

  if (!res.ok) {
    const err = new Error(
      data.error || `server ตอบกลับ ${res.status}` // แก้ไข: เติม backtick ครอบ template string
    );

    err.status = res.status;
    throw err;
  }

  return data;
}

// ---------- สมาชิก ----------
export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
  });
}

export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMe(token) {
  return apiFetch('/api/me', { token });
}

// ---------- รีวิว ----------
export function getReviews(movieId) {
  return apiFetch(`/api/movies/${movieId}/reviews`); // แก้ไข: ครอบ backtick
}

export function postReview(movieId, text, token) {
  return apiFetch(`/api/movies/${movieId}/reviews`, { // แก้ไข: ครอบ backtick
    method: 'POST',
    body: { text },
    token,
  });
}

// ---------- คะแนน ----------
export function putVote(movieId, score, token) {
  return apiFetch(`/api/movies/${movieId}/vote`, { // แก้ไข: ครอบ backtick
    method: 'PUT',
    body: { score },
    token,
  });
}

// ---------- Wishlist ----------
export function getWishlist(token) {
  return apiFetch('/api/me/wishlist', { token });
}

export function addToWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, { // แก้ไข: ครอบ backtick
    method: 'PUT',
    token,
  });
}

export function removeFromWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, { // แก้ไข: ครอบ backtick
    method: 'DELETE',
    token,
  });
}

// ---------- หนัง ----------
export async function getMovies() {
  const data = await apiFetch('/api/movies');
  return data?.items ?? []; // แนะนำ: ใส่ optional chaining กันกรณี items เป็น undefined
}

export async function getMovie(movieId) {
  return apiFetch(`/api/movies/${movieId}`);
}