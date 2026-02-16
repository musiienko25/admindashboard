import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface TableQueryParams {
  q: string;
  category: string;
  brand: string;
  sortBy: string;
  order: 'asc' | 'desc';
  limit: number;
  skip: number;
}

const DEFAULT_PARAMS: TableQueryParams = {
  q: '',
  category: '',
  brand: '',
  sortBy: 'id',
  order: 'asc',
  limit: 10,
  skip: 0,
};

export function useTableQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo((): TableQueryParams => {
    const q = searchParams.get('q') ?? DEFAULT_PARAMS.q;
    const category = searchParams.get('category') ?? DEFAULT_PARAMS.category;
    const brand = searchParams.get('brand') ?? DEFAULT_PARAMS.brand;
    const sortBy = searchParams.get('sortBy') ?? DEFAULT_PARAMS.sortBy;
    const order = (searchParams.get('order') as 'asc' | 'desc') ?? DEFAULT_PARAMS.order;
    const limit = Number(searchParams.get('limit')) || DEFAULT_PARAMS.limit;
    const skip = Number(searchParams.get('skip')) || DEFAULT_PARAMS.skip;

    return { q, category, brand, sortBy, order, limit, skip };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Partial<TableQueryParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === '' || value === DEFAULT_PARAMS[key as keyof TableQueryParams]) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }
        if (updates.skip !== undefined && updates.skip === 0) {
          next.delete('skip');
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const apiFilters = useMemo(
    () => ({
      q: params.q || undefined,
      category: params.category || undefined,
      sortBy: params.sortBy,
      order: params.order,
      limit: params.limit,
      skip: params.skip,
    }),
    [params]
  );

  return { params, updateParams, apiFilters };
}
