

export function getBaseUrl() {
  // 1. Try to get the API URL from .env variables first
  const fromEnv =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL
      : undefined;

  if (fromEnv) {
    const raw = fromEnv.replace(/\/$/, "");
    return raw.endsWith("/api") ? raw.slice(0, -4) : raw;
  }

  // 2. If no .env is found, fallback to hardcoded production URL
  if (import.meta.env?.PROD) {
    return "https://api.indiabrandicon.in";
  }

  // 3. Fallback to local origin for development
  const rawDefault = DEFAULT_BASE_URL.replace(/\/$/, "");
  return rawDefault.endsWith("/api") ? rawDefault.slice(0, -4) : rawDefault;
}

async function request(path, { method = "GET", token, body } = {}) {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const isFormData = body instanceof FormData;
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

const DEFAULT_BASE_URL = window.location.origin;

/* ---------------- Auth ---------------- */
export function registerUser(payload) {
  return request("/api/auth/register", { method: "POST", body: payload });
}

export function loginUser(payload) {
  return request("/api/auth/login", { method: "POST", body: payload });
}

export function verifyOTP(payload) {
  return request("/api/auth/verify-otp", { method: "POST", body: payload });
}

export function resendOTP(payload) {
  return request("/api/auth/resend-otp", { method: "POST", body: payload });
}

export function adminLogin(payload) {
  return request("/api/admin/login", { method: "POST", body: payload });
}

export function forgotPassword(payload) {
  return request("/api/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload) {
  return request("/api/auth/reset-password", { method: "POST", body: payload });
}

/* ---------------- Nominations (user) ---------------- */
export function createNomination(payload, token) {
  return request("/api/nominations", { method: "POST", body: payload, token });
}

export function fetchMyNominations(token) {
  return request("/api/nominations/my", { method: "GET", token });
}

export function fetchNominationById(id, token) {
  return request(`/api/nominations/${id}`, { method: "GET", token });
}

export function updateUserNomination(id, payload, token) {
  return request(`/api/nominations/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

/* ---------------- Nominations (admin) ---------------- */
export function fetchAdminNominations(token) {
  return request("/api/admin/nominations", { method: "GET", token });
}

export function updateNominationStatus(id, status, token) {
  return request(`/api/admin/nominations/${id}/status`, {
    method: "PATCH",
    body: { status },
    token,
  });
}

export function updateNomination(id, payload, token) {
  return request(`/api/admin/nominations/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deleteNomination(id, token) {
  return request(`/api/admin/nominations/${id}`, { method: "DELETE", token });
}

/* ---------------- Previous Editions ---------------- */
export function fetchPreviousEditions() {
  return request("/api/previous-editions", { method: "GET" });
}

export function fetchPreviousEditionByYear(year, slug) {
  const url = slug
    ? `/api/previous-editions/${year}?slug=${slug}`
    : `/api/previous-editions/${year}`;
  return request(url, { method: "GET" });
}

export function createPreviousEdition(payload, token) {
  return request("/api/previous-editions", {
    method: "POST",
    body: payload,
    token,
  });
}

export function updatePreviousEdition(id, payload, token) {
  return request(`/api/previous-editions/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deletePreviousEdition(id, token) {
  return request(`/api/previous-editions/${id}`, { method: "DELETE", token });
}


/* ---------------- Upcoming Editions ---------------- */
export function fetchUpcomingEditions() {
  return request("/api/upcoming-editions", { method: "GET" });
}

export function fetchUpcomingEditionByYear(year, title) {
  const url = title
    ? `/api/upcoming-editions/${year}?title=${title}`
    : `/api/upcoming-editions/${year}`;
  return request(url, { method: "GET" });
}

export function createUpcomingEdition(payload, token) {
  return request("/api/upcoming-editions", {
    method: "POST",
    body: payload,
    token,
  });
}

export function updateUpcomingEdition(id, payload, token) {
  return request(`/api/upcoming-editions/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deleteUpcomingEdition(id, token) {
  return request(`/api/upcoming-editions/${id}`, { method: "DELETE", token });
}

/* ---------------- Inquiries / (Quick Access) ---------------- */

/**
 * Triggers backend WhatsApp/SMS OTP code generation for a phone number
 * @param {object} payload - { phone, name }
 */
export function sendInquiryOTP(payload) {
  return request("/api/inquiries/send-otp", { method: "POST", body: payload });
}

/**
 * Submits the OTP code and details of the lead to finalize verification
 * @param {object} payload - { name, phone, inquiryType, purpose, otp }
 */
export function verifyInquiryOTP(payload) {
  return request("/api/inquiries/verify-otp", { method: "POST", body: payload });
}

/**
 * Fetches all verified inquiries for the Admin Dashboard
 * @param {string} token - Admin authorization JWT token
 */
export function fetchAdminInquiries(token) {
  return request("/api/admin/inquiries", { method: "GET", token });
}

/**
 * Deletes a specific verified inquiry lead from the dashboard
 * @param {string} id - Inquiry database document ID
 * @param {string} token - Admin JWT token
 */
export function deleteAdminInquiry(id, token) {
  return request(`/api/admin/inquiries/${id}`, { method: "DELETE", token });
}

/* ---------------- Blogs ---------------- */

export function fetchPublishedBlogs() {
  return request("/api/blogs", { method: "GET" });
}

export function fetchBlogBySlug(slug) {
  return request(`/api/blogs/${slug}`, { method: "GET" });
}

export function fetchAdminBlogs(token) {
  return request("/api/blogs/admin/all", { method: "GET", token });
}

export function createBlog(payload, token) {
  return request("/api/blogs", {
    method: "POST",
    body: payload,
    token,
  });
}

export function updateBlog(id, payload, token) {
  return request(`/api/blogs/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deleteBlog(id, token) {
  return request(`/api/blogs/${id}`, { method: "DELETE", token });
}

// --- Gallery Media ---

export const fetchGalleryMedia = async () => {
  return request("/api/gallery");
};

export const updateGalleryUrls = async (token, data) => {
  return request("/api/gallery/urls", {
    method: "PUT",
    token,
    body: data,
  });
};

export const uploadGalleryPhotos = async (token, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }
  
  const headers = { Authorization: `Bearer ${token}` };
  
  const response = await fetch(`${getBaseUrl()}/api/gallery/photos`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload photos");
  }
  return response.json();
};

export const deleteGalleryPhoto = async (token, url) => {
  return request("/api/gallery/photos", {
    method: "DELETE",
    token,
    body: { url },
  });
};
