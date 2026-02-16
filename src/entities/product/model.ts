import { makeAutoObservable, runInAction } from 'mobx';
import {
  productsApi,
  type Product,
  type ProductFilters,
  type ProductsResponse,
} from './api';

const DEFAULT_LIMIT = 10;

export class ProductsStore {
  products: Product[] = [];
  total = 0;
  isLoading = false;
  error: string | null = null;
  categories: string[] = [];
  brands: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async loadCategories() {
    try {
      const categories = await productsApi.getCategories();
      runInAction(() => {
        this.categories = categories;
      });
    } catch {
      runInAction(() => {
        this.categories = [];
      });
    }
  }

  async loadBrands() {
    try {
      const brands = await productsApi.getBrands();
      runInAction(() => {
        this.brands = brands;
      });
    } catch {
      runInAction(() => {
        this.brands = [];
      });
    }
  }

  async fetchProducts(filters: ProductFilters) {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });
    try {
      const hasClientFilter = filters.brand;
      const apiFilters = { ...filters };
      if (hasClientFilter) delete apiFilters.brand;

      let response: ProductsResponse;
      if (hasClientFilter) {
        response = await productsApi.getList({
          ...apiFilters,
          limit: 0,
          skip: 0,
        });
      } else {
        response = await productsApi.getList({
          ...apiFilters,
          limit: filters.limit ?? DEFAULT_LIMIT,
          skip: filters.skip ?? 0,
        });
      }

      let products = response.products;
      let total = response.total;

      if (hasClientFilter && filters.brand) {
        products = products.filter((p) => p.brand === filters.brand);
        total = products.length;
        const limit = filters.limit ?? DEFAULT_LIMIT;
        const skip = filters.skip ?? 0;
        products = products.slice(skip, skip + limit);
      }

      runInAction(() => {
        this.products = products;
        this.total = total;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Failed to load products';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadMore(filters: ProductFilters, currentSkip: number) {
    const hasClientFilter = filters.brand;
    const apiFilters = { ...filters };
    if (hasClientFilter) delete apiFilters.brand;

    if (hasClientFilter) {
      const response = await productsApi.getList({
        ...apiFilters,
        limit: 0,
        skip: 0,
      });
      let products = response.products.filter((p) => p.brand === filters.brand);
      const limit = filters.limit ?? DEFAULT_LIMIT;
      const newProducts = products.slice(currentSkip, currentSkip + limit);
      runInAction(() => {
        this.products = [...this.products, ...newProducts];
        this.total = products.length;
      });
    } else {
      const response = await productsApi.getList({
        ...apiFilters,
        limit: filters.limit ?? DEFAULT_LIMIT,
        skip: currentSkip,
      });
      runInAction(() => {
        this.products = [...this.products, ...response.products];
        this.total = response.total;
      });
    }
  }

  async createProduct(data: Omit<Product, 'id'>) {
    const product = await productsApi.create(data);
    runInAction(() => {
      this.products = [product, ...this.products];
      this.total += 1;
    });
  }

  async updateProduct(id: number, data: Partial<Product>) {
    const product = await productsApi.update(id, data);
    runInAction(() => {
      const index = this.products.findIndex((p) => p.id === id);
      if (index >= 0) {
        this.products[index] = product;
      }
    });
  }

  async deleteProduct(id: number) {
    await productsApi.delete(id);
    runInAction(() => {
      this.products = this.products.filter((p) => p.id !== id);
      this.total = Math.max(0, this.total - 1);
    });
  }
}

export const productsStore = new ProductsStore();
