export const getImageUrl = (url) => {
  if (!url) return null;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '/api';
  
  if (apiBase.startsWith('http')) {
    const backendUrl = apiBase.replace(/\/api$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${backendUrl}${path}`;
  }
  
  const path = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:5000${path}`;
};

