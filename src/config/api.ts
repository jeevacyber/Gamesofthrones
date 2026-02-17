// API Configuration
// This file manages the API base URL for different environments

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
