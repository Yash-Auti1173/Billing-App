import React from 'react';
import ProductList from './components/ProductList';
import Basket from './components/Basket';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-5xl w-full bg-slate-100 p-4 md:p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">SuperMart Billing</h1>
            <p className="text-xs text-slate-500">
              Simple demo billing screen with offers, coupons and print bill.
            </p>
          </div>
          <span className="hidden md:inline-flex text-xs rounded-full border px-3 py-1 text-slate-600 bg-white">
            Currency: INR (₹)
          </span>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductList />
          <Basket />
        </main>

        <section className="mt-6 text-xs text-slate-600 bg-white rounded-lg p-3 shadow-sm">
          <p className="font-semibold mb-1">Built-in store offers</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Buy 1 Cheese, get the 2nd Cheese free.</li>
            <li>Buy 1 Soup and get 1 Bread at 50% off (auto applied).</li>
            <li>Flat 33% off on Butter.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;
