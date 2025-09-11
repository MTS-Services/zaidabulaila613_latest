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
  size: ProductSize[];
  color: string[];
  category: ProductCategory | null;
  pictures: ProductPicture[];
  user: ProductUser | null;
  description?: string;
  price?: number;
  oldPrice?: number;
  state?: string;
  material?: string;
  careInstructions?: string;
  sleeve?: boolean;
  underlay?: boolean;
  ref?: string;
  shoulder?: string;
  chest?: string;
  length?: string;
  hip?: string;
  high?: string;
  waist?: string;
}

export interface UserProductsResponse {
  userProducts: {
    total: number;
    data: Product[];
  };
}
export interface UserProductsByIdResponse {
  getProductsByUserId: {
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

export interface ProductByIdResponse {
  productById: Product;
}