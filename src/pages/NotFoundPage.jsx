import React from 'react';
import { Wrench, Home } from 'lucide-react';

export function NotFoundPage({ setActivePage }) {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto text-xs">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
        <Wrench className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">404 - Page Not Found</h1>
      <p className="text-slate-500 leading-relaxed">
        The campus page or maintenance resource you requested does not exist or has been relocated.
      </p>
      <button
        onClick={() => setActivePage('landing')}
        className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
    </div>
  );
}
