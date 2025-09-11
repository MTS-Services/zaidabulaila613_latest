export interface ColumnDef<T> {
  header: string;
  accessor: string; // Changed from keyof T to string
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string;
  onSearch?: (searchTerm: string) => void;
  onSort?: (sortOption: SortOption) => void;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  searchPlaceholder?: string;
}

import { useState, useEffect } from 'react';

const DataTable = <T,>({
  data,
  columns,
  loading,
  error,
  onSearch,
  onSort,
  onPageChange,
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  searchPlaceholder = 'Search...',
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSort = (field: string) => {
    if (loading) return;
    
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    onSort?.({ field, direction });
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search Bar */}
      {onSearch && (
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${loading ? 'opacity-50' : ''}`}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && (
                      <span className="ml-1">
                        {sortField === column.accessor ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 min-h-[300px]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center h-[300px]">
                  <div className="flex items-center justify-center h-full">
                    Loading...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-red-500 h-[300px]">
                  <div className="flex items-center justify-center h-full">
                    {error}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 h-[300px]">
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row: any, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {columns.map((column, columnIndex) => (
                    <td key={`${columnIndex}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.cell ? column.cell(row[column.accessor], row) : String(row[column.accessor] || '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Simplified */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => !loading && onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={loading || currentPage === 1}
              className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mx-4">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <button
              onClick={() => !loading && onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={loading || currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;