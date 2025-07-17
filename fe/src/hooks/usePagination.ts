import { useState, useCallback } from 'react';

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  initialTotal?: number;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 12,
  initialTotal = 0
}: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    current: initialPage,
    pageSize: initialPageSize,
    total: initialTotal
  });

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  }, []);

  const updateTotal = useCallback((total: number) => {
    setPagination(prev => ({
      ...prev,
      total
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  }, [pagination.pageSize, pagination.total]);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      current: 1 // Reset to first page when changing page size
    }));
  }, []);

  return {
    pagination,
    handlePageChange,
    updateTotal,
    resetPagination,
    setPageSize
  };
}; 