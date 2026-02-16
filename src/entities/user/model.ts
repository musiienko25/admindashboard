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
      this.user = await authApi.me();
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      this.user = await authApi.me(controller.signal);
      clearTimeout(timeoutId);
    } catch {
      this.logout();
    } finally {
      this.isLoading = false;
      this.isInitialized = true;
    }
  }
}

export const authStore = new AuthStore();
