// API Configuration
// Priority: VITE_BACKEND_URL env var -> deployed backend in production -> localhost for dev
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
	|| (import.meta.env.PROD ? 'https://backend-ks43.onrender.com' : 'http://localhost:5000');

export default API_BASE_URL;
