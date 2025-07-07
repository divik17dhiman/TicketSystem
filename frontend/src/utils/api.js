// API Configuration utilities
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${imagePath}`;
}; 