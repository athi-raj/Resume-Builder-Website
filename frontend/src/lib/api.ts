import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/hooks/useAuthStore';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request logging
api.interceptors.request.use((config) => {
  // Log the request details
  console.log('🚀 Making request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  // Remove CORS headers - these should only be set on the server
  // config.headers['Access-Control-Allow-Origin'] = '*';
  // config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  // config.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  
  return config;
}, (error) => {
  console.error('❌ Request error:', error);
  return Promise.reject(error);
});

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add token management utilities
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found in localStorage');
    throw new Error('No authentication token found');
  }
  
  // Validate token format
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format:', token);
      throw new Error('Invalid token format');
    }
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() >= expirationTime) {
      console.error('❌ Token expired:', new Date(expirationTime));
      localStorage.removeItem('token');
      throw new Error('Token expired');
    }
    
    console.log('✅ Token validated successfully');
    return token;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    localStorage.removeItem('token');
    throw new Error('Invalid token');
  }
};

const setAuthHeader = (config: any) => {
  try {
    const token = getToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Auth header set successfully:', config.headers.Authorization.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Failed to set auth header:', error);
  }
  return config;
};

// Add request interceptor for auth header
api.interceptors.request.use(setAuthHeader);

// Add response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error('❌ 401 Unauthorized response:', error.response.data);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Signup request data:', { name, email });
      
      const response = await api.post('/auth/signup', 
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log('📦 Raw signup response:', {
        status: response.status,
        data: response.data
      });

      const { token, user } = response.data;
      
      if (!token) {
        console.error('❌ No token in response:', response.data);
        throw new Error('No token received from server');
      }

      // Store token immediately after receiving it
      localStorage.setItem('token', token);
      
      // Update Authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ Token stored and headers updated');
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Signup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { 
      email: email.trim().toLowerCase(), 
      password 
    });
    if (response.data.token) {
      // Store token immediately after receiving it
      localStorage.setItem('token', response.data.token);
      // Update Authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      console.log('📝 Sending profile update request');
      
      // Check if profile image is too large
      if (data.profileImage && data.profileImage.length > 5000000) { // 5MB limit
        throw new Error('Profile image is too large. Please use a smaller image.');
      }
      
      const response = await api.put('/auth/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Profile update successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.error || 'Failed to update profile');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Error updating profile');
      }
    }
  },

  verifyEmail: async (email: string, code: string) => {
    const response = await api.post('/auth/verify-email', { email, code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }
};

export const resumeAPI = {
  saveResume: async (resumeData: any) => {
    try {
      console.log('📝 Saving resume data:', resumeData);
      
      const token = getToken();
      console.log('✅ Token retrieved for save request');
      
      const response = await api.post('/resumes/save', resumeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Resume saved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save resume error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      } else if (error.response) {
        throw new Error(error.response.data.error || 'Failed to save resume');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('Error setting up the request');
      }
    }
  },

  getUserResumes: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/resumes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  deleteResume: async (resumeId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.delete(`/resumes/${resumeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default api; 