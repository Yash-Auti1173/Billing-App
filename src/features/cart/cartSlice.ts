import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product, ProductId } from '../../types';
import type { RootState } from '../../store';

export const PRODUCTS: Product[] = [
  { id: 'bread', name: 'Bread', price: 40 },
  { id: 'milk', name: 'Milk (1L)', price: 30 },
  { id: 'cheese', name: 'Cheese (200g)', price: 90 },
  { id: 'soup', name: 'Soup Packet', price: 50 },
  { id: 'butter', name: 'Butter (200g)', price: 120 },
  { id: 'rice', name: 'Rice (1kg)', price: 65 },
  { id: 'sugar', name: 'Sugar (1kg)', price: 45 },
  { id: 'tea', name: 'Tea (250g)', price: 160 },
  { id: 'eggs', name: 'Eggs (6 pcs)', price: 50 },
];

export interface Coupon {
  code: string;
  description: string;
  discountPercent: number;
  minAmount: number;
}

export const COUPONS: Coupon[] = [
  {
    code: 'SAVE10',
    description: '10% off on bills above ₹300',
    discountPercent: 10,
    minAmount: 300,
  },
  {
    code: 'WELCOME50',
    description: 'Flat 5% off above ₹200',
    discountPercent: 5,
    minAmount: 200,
  },
];

interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
};

const findItemIndex = (items: CartItem[], id: ProductId) =>
  items.findIndex((i) => i.productId === id);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ProductId>) {
      const idx = findItemIndex(state.items, action.payload);
      if (idx === -1) {
        state.items.push({ productId: action.payload, quantity: 1 });
      } else {
        state.items[idx].quantity += 1;
      }
    },
    increment(state, action: PayloadAction<ProductId>) {
      const idx = findItemIndex(state.items, action.payload);
      if (idx !== -1) {
        state.items[idx].quantity += 1;
      }
    },
    decrement(state, action: PayloadAction<ProductId>) {
      const idx = findItemIndex(state.items, action.payload);
      if (idx !== -1) {
        state.items[idx].quantity -= 1;
        if (state.items[idx].quantity <= 0) {
          state.items.splice(idx, 1);
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
    },
    setCoupon(state, action: PayloadAction<string | null>) {
      const value = action.payload ? action.payload.trim() : '';
      state.couponCode = value.length ? value.toUpperCase() : null;
    },
  },
});

export const { addToCart, increment, decrement, clearCart, setCoupon } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectProducts = () => PRODUCTS;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCouponCode = (state: RootState) => state.cart.couponCode;

export const getProductById = (id: ProductId) =>
  PRODUCTS.find((p) => p.id === id)!;

const cheeseOfferSavings = (qty: number, price: number) => {
  const paid = Math.ceil(qty / 2);
  const normalCost = qty * price;
  const discountedCost = paid * price;
  return normalCost - discountedCost;
};

const soupBreadOfferSavings = (
  soupQty: number,
  breadQty: number,
  breadPrice: number
) => {
  const eligible = Math.min(soupQty, breadQty);
  return eligible * breadPrice * 0.5;
};

const butterOfferSavings = (qty: number, price: number) => {
  return qty * price * (1 / 3);
};

export interface ItemPricing {
  product: Product;
  quantity: number;
  itemPriceWithoutOffers: number;
  itemSavings: number;
  itemFinalCost: number;
}

export interface Totals {
  subTotal: number;
  savingsFromOffers: number;
  totalAfterOffers: number;
  couponDiscount: number;
  grandTotal: number;
  items: ItemPricing[];
  appliedCoupon: Coupon | null;
}

export const selectTotals = (state: RootState): Totals => {
  const items = state.cart.items;
  const quantityById: Record<ProductId, number> = {
    bread: 0,
    milk: 0,
    cheese: 0,
    soup: 0,
    butter: 0,
    rice: 0,
    sugar: 0,
    tea: 0,
    eggs: 0,
  };

  items.forEach((i) => {
    quantityById[i.productId] = i.quantity;
  });

  const bread = getProductById('bread');
  const cheese = getProductById('cheese');
  const soup = getProductById('soup');
  const butter = getProductById('butter');

  const cheeseSaving = cheeseOfferSavings(quantityById.cheese, cheese.price);
  const soupBreadSaving = soupBreadOfferSavings(
    quantityById.soup,
    quantityById.bread,
    bread.price
  );
  const butterSaving = butterOfferSavings(quantityById.butter, butter.price);

  const itemSavingsById: Record<ProductId, number> = {
    bread: soupBreadSaving,
    milk: 0,
    cheese: cheeseSaving,
    soup: 0,
    butter: butterSaving,
    rice: 0,
    sugar: 0,
    tea: 0,
    eggs: 0,
  };

  const detailedItems: ItemPricing[] = items.map((i) => {
    const product = getProductById(i.productId);
    const base = product.price * i.quantity;
    const saving = itemSavingsById[i.productId] || 0;
    const finalCost = base - saving;
    return {
      product,
      quantity: i.quantity,
      itemPriceWithoutOffers: base,
      itemSavings: saving,
      itemFinalCost: finalCost,
    };
  });

  const subTotal = detailedItems.reduce(
    (sum, i) => sum + i.itemPriceWithoutOffers,
    0
  );
  const savingsFromOffers = detailedItems.reduce(
    (sum, i) => sum + i.itemSavings,
    0
  );
  const totalAfterOffers = subTotal - savingsFromOffers;

  let appliedCoupon: Coupon | null = null;
  let couponDiscount = 0;

  if (state.cart.couponCode) {
    const coupon = COUPONS.find(
      (c) => c.code === state.cart.couponCode
    );
    if (coupon && totalAfterOffers >= coupon.minAmount) {
      appliedCoupon = coupon;
      couponDiscount = (totalAfterOffers * coupon.discountPercent) / 100;
    }
  }

  const grandTotal = totalAfterOffers - couponDiscount;

  return {
    subTotal,
    savingsFromOffers,
    totalAfterOffers,
    couponDiscount,
    grandTotal,
    items: detailedItems,
    appliedCoupon,
  };
};
