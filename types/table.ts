export interface ColumnDef<T> {
  header: string;
  accessor: string;
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