import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"
import "./index.css"
import App from "./App"

// Add axios interceptors for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('🚀 AXIOS REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: {
        ...config.headers,
        Authorization: config.headers?.Authorization?.toString().substring(0, 30) + '...' // Mask token for security
      },
      data: config.data,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('❌ AXIOS REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ AXIOS RESPONSE:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ AXIOS RESPONSE ERROR:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)


