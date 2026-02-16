import { makeAutoObservable, runInAction } from 'mobx';
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
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await authApi.login({ username, password });
      this.setToken(response.accessToken);
      const user = await authApi.me();
      runInAction(() => {
        this.user = user;
      });
      return true;
    } catch {
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      runInAction(() => {
        this.isInitialized = true;
      });
      return;
    }
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const user = await authApi.me(controller.signal);
      clearTimeout(timeoutId);
      runInAction(() => {
        this.user = user;
      });
    } catch {
      runInAction(() => {
        this.logout();
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.isInitialized = true;
      });
    }
  }
}

export const authStore = new AuthStore();
