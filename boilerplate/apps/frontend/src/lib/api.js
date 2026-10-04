const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const SERVER_URL = API_URL.replace(/\/api\/?$/, '');

export class ApiError extends Error {


  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}, token= null) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? response.statusText);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}



export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  getUsers: (token) => request('/users', {}, token),

  getUser: (id, token) => request(`/users/${id}`, {}, token),

  createUser: (payload, token) => request('/users', { method: 'POST', body: JSON.stringify(payload) }, token),

  updateUser: (
    id,
    payload,
    token,
  ) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),

  deleteUser: (id, token) => request(`/users/${id}`, { method: 'DELETE' }, token),

  changePassword: (currentPassword, newPassword, token) =>
    request(
      '/auth/change-password',
      { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
      token,
    ),
    getDistricts: (token) => request('/districts', {}, token),
 
    getDistrict: (id, token) => request(`/districts/${id}`, {}, token),
    
    createDistrict: (payload, token) =>
        request('/districts', { method: 'POST', body: JSON.stringify(payload) }, token),
    
    updateDistrict: (id, payload, token) =>
    request(`/districts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),
    
    deleteDistrict: (id, token) => request(`/districts/${id}`, { method: 'DELETE' }, token),

    getProvinces: (token) => request('/provinces', {}, token),
  
    getProvince: (id, token) => request(`/provinces/${id}`, {}, token),
  
    createProvince: (payload, token) =>
      request('/provinces', { method: 'POST', body: JSON.stringify(payload) }, token),
  
    updateProvince: (id, payload, token) =>
      request(`/provinces/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),
  
    deleteProvince: (id, token) => request(`/provinces/${id}`, { method: 'DELETE' }, token),
      getMunicipalities: (token) => request('/municipalities', {}, token),
 
    getMunicipality: (id, token) => request(`/municipalities/${id}`, {}, token),
  
    createMunicipality: (payload, token) =>
      request('/municipalities', { method: 'POST', body: JSON.stringify(payload) }, token),
  
    updateMunicipality: (id, payload, token) =>
      request(`/municipalities/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),
  
    deleteMunicipality: (id, token) => request(`/municipalities/${id}`, { method: 'DELETE' }, token),

    getKycs: (token) =>
    request('/kyc', {}, token),

    getKyc: (id, token) =>
      request(`/kyc/${id}`, {}, token),

    createKyc: (payload, token) =>
      request(
        '/kyc',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        token
      ),

    updateKyc: (id, payload, token) =>
      request(
        `/kyc/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        },
        token
      ),

    deleteKyc: (id, token) =>
      request(
        `/kyc/${id}`,
        {
          method: 'DELETE',
        },
        token
      ),

    uploadKycImage: async (id, image, token) => {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch(`${API_URL}/kyc/${id}/image`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? response.statusText);
        throw new ApiError(message, response.status);
      }

      return response.json();
    },

    importKycCsv: async (file, token) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/kyc/import`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? response.statusText);
        throw new ApiError(message, response.status);
      }

      return response.json();
    },

    // =========================
    // IMAGE URL
    // =========================

    getKycImageUrl: (imageUrl) => {
      if (!imageUrl) {
        return null;
      }

      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      return `${SERVER_URL}${imageUrl}`;
  }
};





