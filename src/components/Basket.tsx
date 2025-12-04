import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectTotals,
  increment,
  decrement,
  clearCart,
  setCoupon,
  selectCouponCode,
} from '../features/cart/cartSlice';
import { formatMoney } from '../utils';

const Basket: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, subTotal, savingsFromOffers, totalAfterOffers, couponDiscount, grandTotal, appliedCoupon } =
    useAppSelector(selectTotals);
  const couponCode = useAppSelector(selectCouponCode);
  const [input, setInput] = useState<string>(couponCode ?? '');

  const handleApplyCoupon = () => {
    dispatch(setCoupon(input));
  };

  const handleClearCoupon = () => {
    setInput('');
    dispatch(setCoupon(null));
  };

  const handlePrint = () => {
    window.print();
  };

  const couponMessage =
    couponCode && !appliedCoupon
      ? 'Coupon is invalid or minimum amount not reached.'
      : appliedCoupon
      ? appliedCoupon.description
      : '';

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Basket</h2>
        <div className="flex gap-2">
          <button
            className="hidden md:inline-flex text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
            onClick={handlePrint}
          >
            Print bill
          </button>
          <button
            className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
            onClick={() => dispatch(clearCart())}
          >
            Clear
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">No items in the basket.</p>
      ) : (
        <div id="bill-section" className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="border-b pb-2 last:border-none"
            >
              <div className="flex justify-between items-center mb-1">
                <div>
                  <div className="font-medium text-sm">{item.product.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {formatMoney(item.product.price)} × {item.quantity} ={' '}
                    {formatMoney(item.itemPriceWithoutOffers)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="w-7 h-7 rounded-full border text-sm flex items-center justify-center"
                    onClick={() => dispatch(decrement(item.product.id))}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full border text-sm flex items-center justify-center"
                    onClick={() => dispatch(increment(item.product.id))}
                  >
                    +
                  </button>
                </div>
              </div>

              {item.itemSavings > 0 && (
                <div className="text-[11px] text-emerald-600">
                  Offer savings: {formatMoney(item.itemSavings)}
                </div>
              )}

              <div className="text-xs">
                Item total: {formatMoney(item.itemFinalCost)}
              </div>
            </div>
          ))}

          <div className="mt-2 border-t pt-2 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Sub total (before offers)</span>
              <span>{formatMoney(subTotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Savings from offers</span>
              <span>- {formatMoney(savingsFromOffers)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total after offers</span>
              <span>{formatMoney(totalAfterOffers)}</span>
            </div>
          </div>

          <div className="mt-3 border-t pt-3 text-sm space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Coupon code (SAVE10, WELCOME50)"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="flex-1 border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
              {couponCode && (
                <button
                  className="px-2 py-1 text-[11px] rounded border border-slate-300"
                  onClick={handleClearCoupon}
                >
                  Remove
                </button>
              )}
            </div>
            {couponMessage && (
              <p className="text-[11px] text-slate-600">{couponMessage}</p>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon discount</span>
                <span>- {formatMoney(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-semibold border-t pt-2">
              <span>Grand total</span>
              <span>{formatMoney(grandTotal)}</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p>Thank you for shopping with us.</p>
            <p>For demo only – prices are sample values in INR.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;
