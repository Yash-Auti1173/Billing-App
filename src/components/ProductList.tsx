import React from 'react';
import { useAppDispatch } from '../hooks';
import { addToCart, selectProducts } from '../features/cart/cartSlice';
import { formatMoney } from '../utils';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = selectProducts();

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-3 border-b pb-2">Products</h2>
      <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between border-b pb-2 last:border-none"
          >
            <div>
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-slate-500">
                {formatMoney(p.price)}
              </div>
            </div>
            <button
              className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition"
              onClick={() => dispatch(addToCart(p.id))}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
