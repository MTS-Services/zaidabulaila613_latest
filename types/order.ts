export type OrderItem = {
    id:string;
  product: {
    id:string;
    name:string;
    pictures:{
        path:[]
    };
  };
  qty: number;
  size: string;
  color: string;
  total:number;
};

export type PaymentType = 'Cash' | 'Online';

export type Order = {
  id: string;
  total: number;
  ref: string;
  status: string;
  notes?: string;
  items: OrderItem[];
  paymentType: PaymentType;
  isPaid: boolean;
  city: string;
  apartment: string;
  createdAt: string;
};