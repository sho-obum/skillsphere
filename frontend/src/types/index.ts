export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
}

export interface Skill {
  id: number;
  title: string;
  description: string;
  price: number;
  user_id: number;
  owner_name: string;
  created_at: string;
}

export interface Booking {
  id: number;
  skill_id: number;
  customer_id: number;
  provider_id: number;
  start_time: string;
  duration_mins: number;
  price_snapshot: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  offset: number;
  has_more: boolean;
}
