import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '@/entities/user/model';
import { productsStore } from '@/entities/product/model';
import type { Product } from '@/entities/product/api';
import { useTableQueryParams } from '@/shared/lib/use-query-params';
import { CreateProductModal } from '@/features/product/create-product/ui/create-product-modal';
import { EditProductModal } from '@/features/product/edit-product/ui/edit-product-modal';
import { DeleteProductModal } from '@/features/product/delete-product/ui/delete-product-modal';
import type { ProductFormData } from '@/features/product/create-product/ui/create-product-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ProductsPage = observer(function ProductsPage() {
  const navigate = useNavigate();
  const { params, updateParams, apiFilters } = useTableQueryParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!authStore.isAuthenticated && authStore.isInitialized) {
      navigate('/login', { replace: true });
    }
  }, [authStore.isAuthenticated, authStore.isInitialized, navigate]);

  const prevSkipRef = useRef(0);

  useEffect(() => {
    productsStore.loadCategories();
    productsStore.loadBrands();
  }, []);

  useEffect(() => {
    const filters = { ...apiFilters, brand: params.brand || undefined };
    const isLoadMore =
      params.skip > prevSkipRef.current && params.skip > 0;
    prevSkipRef.current = params.skip;

    if (isLoadMore) {
      productsStore.loadMore(filters, params.skip);
    } else {
      productsStore.fetchProducts(filters);
    }
  }, [
    params.q,
    params.category,
    params.brand,
    params.sortBy,
    params.order,
    params.limit,
    params.skip,
  ]);

  const handleLogout = () => {
    authStore.logout();
    navigate('/login', { replace: true });
  };

  const handleSort = (field: string) => {
    const order = params.sortBy === field && params.order === 'asc' ? 'desc' : 'asc';
    updateParams({ sortBy: field, order, skip: 0 });
  };

  const handleLoadMore = () => {
    updateParams({ skip: params.skip + params.limit });
  };

  const hasMore = params.skip + productsStore.products.length < productsStore.total;

  const handleCreateSubmit = async (data: ProductFormData) => {
    await productsStore.createProduct({
      ...data,
      thumbnail: 'https://via.placeholder.com/150',
    });
  };

  const handleEditSubmit = async (id: number, data: ProductFormData) => {
    await productsStore.updateProduct(id, data);
  };

  const handleDeleteConfirm = async (id: number) => {
    await productsStore.deleteProduct(id);
  };

  if (!authStore.isInitialized || !authStore.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Products</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {authStore.user?.firstName} {authStore.user?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search products..."
                value={params.q}
                onChange={(e) => updateParams({ q: e.target.value, skip: 0 })}
              />
            </div>
            <div className="w-[180px] space-y-2">
              <Label>Category</Label>
              <Select
                value={params.category || '__all__'}
                onValueChange={(v) =>
                  updateParams({ category: v === '__all__' ? '' : v, skip: 0 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All categories</SelectItem>
                  {productsStore.categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px] space-y-2">
              <Label>Brand</Label>
              <Select
                value={params.brand || '__all__'}
                onValueChange={(v) =>
                  updateParams({ brand: v === '__all__' ? '' : v, skip: 0 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All brands</SelectItem>
                  {productsStore.brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setCreateOpen(true)}>Add Product</Button>
          </div>
        </div>

        {productsStore.error && (
          <p className="text-destructive mb-4">{productsStore.error}</p>
        )}

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('id')}
                >
                  ID {params.sortBy === 'id' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('title')}
                >
                  Title {params.sortBy === 'title' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('category')}
                >
                  Category {params.sortBy === 'category' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('brand')}
                >
                  Brand {params.sortBy === 'brand' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('price')}
                >
                  Price {params.sortBy === 'price' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('stock')}
                >
                  Stock {params.sortBy === 'stock' && (params.order === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsStore.isLoading && productsStore.products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                productsStore.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteProduct(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={productsStore.isLoading}
            >
              {productsStore.isLoading ? 'Loading...' : 'Show more'}
            </Button>
          </div>
        )}
      </main>

      <CreateProductModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        categories={productsStore.categories}
        brands={productsStore.brands}
      />
      <EditProductModal
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        product={editProduct}
        onSubmit={handleEditSubmit}
        categories={productsStore.categories}
        brands={productsStore.brands}
      />
      <DeleteProductModal
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        product={deleteProduct}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
});
