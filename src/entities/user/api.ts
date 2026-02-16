import { apiFetch } from '@/shared/api/base';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: { lat: number; lng: number };
  country: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender: string;
  email: string;
  phone?: string;
  username: string;
  password?: string;
  birthDate?: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: { color: string; type: string };
  ip?: string;
  address?: UserAddress;
  macAddress?: string;
  university?: string;
  bank?: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company?: {
    department: string;
    name: string;
    title: string;
    address: UserAddress;
  };
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: {
    coin: string;
    wallet: string;
    network: string;
  };
  role?: string;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (signal?: AbortSignal) =>
    apiFetch<User>('/auth/me', { signal }),
};
