import { Product } from "./product.model";

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    totalPrice: number;
    status: string;
    createdAt: Date;
  }
  
  export interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
  }