import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, User, Skill, Booking, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      
      // Debug logging
      console.log('API Service initialized with token:', this.accessToken ? 'YES' : 'NO');
    }

    // Request interceptor to add auth header
    this.api.interceptors.request.use((config: any) => {
      if (this.accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshAccessToken();
            return this.api(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', {
      email,
      password,
    });

    const { access_token, refresh_token, user } = response.data;
    this.setTokens(access_token, refresh_token);
    return response.data;
  }

  async signup(name: string, email: string, password: string, role: string = 'customer'): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/auth/signup', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response: AxiosResponse<{ access_token: string }> = await this.api.post('/auth/refresh', {
      refresh_token: this.refreshToken,
    });

    this.accessToken = response.data.access_token;
    localStorage.setItem('access_token', this.accessToken!);
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.api.post('/auth/logout', {
          refresh_token: this.refreshToken,
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    console.log('Tokens set successfully');
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Add this method to manually refresh tokens from localStorage
  refreshTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      console.log('Tokens refreshed from storage:', this.accessToken ? 'YES' : 'NO');
    }
  }

  // Skills methods
  async getSkills(limit: number = 10, offset: number = 0): Promise<PaginatedResponse<Skill>> {
    const response: AxiosResponse<PaginatedResponse<Skill>> = await this.api.get('/skills', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getSkillById(id: number): Promise<Skill> {
    const response: AxiosResponse<Skill> = await this.api.get(`/skills/${id}`);
    return response.data;
  }

  async createSkill(skill: { title: string; description: string; price: number }): Promise<Skill> {
    const response: AxiosResponse<Skill> = await this.api.post('/skills', skill);
    return response.data;
  }

  async updateSkill(id: number, skill: Partial<{ title: string; description: string; price: number }>): Promise<Skill> {
    const response: AxiosResponse<Skill> = await this.api.put(`/skills/${id}`, skill);
    return response.data;
  }

  async deleteSkill(id: number): Promise<void> {
    await this.api.delete(`/skills/${id}`);
  }

  // Booking methods
  async createBooking(booking: {
    skill_id: number;
    start_time: string;
    duration_mins: number;
    notes?: string;
  }): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.post('/bookings', booking);
    return response.data;
  }

  async getMyBookings(role?: 'customer' | 'provider'): Promise<Booking[]> {
    const params = role ? { role } : {};
    const response: AxiosResponse<Booking[]> = await this.api.get('/bookings/me', { params });
    return response.data;
  }

  async getBookingById(id: number): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async confirmBooking(id: number): Promise<void> {
    await this.api.post(`/bookings/${id}/confirm`);
  }

  async cancelBooking(id: number): Promise<void> {
    await this.api.post(`/bookings/${id}/cancel`);
  }

  async completeBooking(id: number): Promise<void> {
    await this.api.post(`/bookings/${id}/complete`);
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const apiService = new ApiService();

// Make it globally accessible for debugging
if (typeof window !== 'undefined') {
  (window as any).apiService = apiService;
}

export default apiService;
