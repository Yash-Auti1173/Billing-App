export type ProductId =
  | 'bread'
  | 'milk'
  | 'cheese'
  | 'soup'
  | 'butter'
  | 'rice'
  | 'sugar'
  | 'tea'
  | 'eggs';

export interface Product {
  id: ProductId;
  name: string;
  price: number; // price in INR
}

export interface CartItem {
  productId: ProductId;
  quantity: number;
}
