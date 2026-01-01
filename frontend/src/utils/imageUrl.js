export const getImageUrl = (url) => {
  if (!url) return null;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  
  if (base && base.startsWith('http')) {
    // If base URL is provided (production), construct full URL
    const backendUrl = base.replace(/\/api$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${backendUrl}${path}`;
  }
  
  // For relative URLs (local development or when base is not set)
  const path = url.startsWith('/') ? url : `/${url}`;
  return path;
};

