export interface ProductPicture {
  id: string;
  path: string;
  fileType: string;
}

export interface ProductSize {
  value: string;
  label: string;
}

export interface LanguageField {
  ar: string;
  en: string;
}

export interface AvailableColorSize {
  size: string;
  sizeSpecific: string;
  quantity: number;
  colorDisction?: LanguageField;
}

export interface AvailableColor {
  color: LanguageField;
  sizes: AvailableColorSize[];
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
  name: string | LanguageField;
  type: string | LanguageField;
  selectedColor: string | LanguageField;
  origin: string | LanguageField;
  qty: number;
  approve: boolean;
  size: ProductSize[];
  color: string[] | LanguageField[];
  availableColors?: AvailableColor[];
  category: ProductCategory | null;
  pictures: ProductPicture[];
  user: ProductUser | null;
  description?: string | LanguageField;
  price?: number;
  oldPrice?: number;
  state?: string | LanguageField;
  material?: string | LanguageField;
  careInstructions?: string | LanguageField;
  sleeve?: boolean;
  underlay?: boolean;
  ref?: string;
  shoulder?: string;
  chest?: string;
  length?: string;
  hip?: string;
  high?: string;
  waist?: string;
  createdAt?: Date;
  updatedAt?: Date;
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