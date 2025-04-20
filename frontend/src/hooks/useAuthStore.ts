import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  createdAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      token: null,
      
      fetchUserProfile: async () => {
        try {
          const userData = await authAPI.getProfile();
          console.log('Fetched user profile:', userData);
          set({ user: userData });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If profile fetch fails, clear auth state
          set({ isAuthenticated: false, token: null, user: null });
          localStorage.removeItem('token');
          throw error; // Re-throw to handle in calling function
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.login(email, password);
          console.log('Login response:', response);
          
          // Set token and auth state immediately
          const token = response.token;
          if (!token) {
            throw new Error('No token received from server');
          }
          
          set({ 
            isAuthenticated: true, 
            token,
            isLoading: true 
          });

          // Now fetch user profile
          try {
            await get().fetchUserProfile();
          } catch (error) {
            console.error('Profile fetch failed after login:', error);
            throw error;
          }
          
          set({ isLoading: false });
          console.log('Auth store after login:', get());
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false, isAuthenticated: false, token: null });
          localStorage.removeItem('token');
          throw new Error(errorMessage);
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.signup(name, email, password);
          console.log('Signup response:', response);
          
          // Set token and auth state immediately
          const token = response.token;
          if (!token) {
            throw new Error('No token received from server');
          }
          
          set({ 
            isAuthenticated: true, 
            token,
            isLoading: true 
          });

          // Now fetch user profile
          try {
            await get().fetchUserProfile();
          } catch (error) {
            console.error('Profile fetch failed after signup:', error);
            throw error;
          }
          
          set({ isLoading: false });
          console.log('Auth store after signup:', get());
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({ error: errorMessage, isLoading: false, isAuthenticated: false, token: null });
          localStorage.removeItem('token');
          throw new Error(errorMessage);
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('resume-storage');
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null,
          error: null
        });
      },
      
      updateProfile: async (data: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await authAPI.updateProfile(data);
          set({ 
            user: updatedUser,
            isLoading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      verifyEmail: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
          const email = get().user?.email;
          if (!email) {
            throw new Error('No email found for verification');
          }
          const response = await authAPI.verifyEmail(email, code);
          if (response.token) {
            set({ 
              isAuthenticated: true, 
              token: response.token,
              isLoading: false 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      resendVerificationCode: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.resendVerification(email);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token 
      })
    }
  )
);

export default useAuthStore;
