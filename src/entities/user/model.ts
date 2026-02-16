import { makeAutoObservable } from 'mobx';
import { authApi, type User } from './api';

const TOKEN_KEY = 'accessToken';

export class AuthStore {
  user: User | null = null;
  isLoading = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return !!this.user && !!localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  logout() {
    this.user = null;
    this.clearToken();
  }

  async login(username: string, password: string) {
    this.isLoading = true;
    try {
      const response = await authApi.login({ username, password });
      this.setToken(response.accessToken);
      this.user = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      };
      return true;
    } catch {
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      this.isInitialized = true;
      return;
    }
    this.isLoading = true;
    try {
      this.user = await authApi.me();
    } catch {
      this.logout();
    } finally {
      this.isLoading = false;
      this.isInitialized = true;
    }
  }
}

export const authStore = new AuthStore();
