export interface ProductPicture {
  id: string;
  path: string;
  fileType: string;
}

export interface ProductSize {
  value: string;
  label: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductUserAccount {
  mobile: string;
}

export interface ProductUser {
  id: string;
  account: ProductUserAccount | null;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  selectedColor: string;
  origin: string;
  qty: number;
  approve: boolean;
  price?: number;
  oldPrice?: number;
  size: ProductSize[];
  color: string[];
  category: ProductCategory | null;
  pictures: ProductPicture[];
  user: ProductUser | null;
}

export interface UserProductsResponse {
  userProducts: {
    total: number;
    data: Product[];
  };
}
export interface ProductsResponse {
  products: {
    total: number;
    data: Product[];
  };
}