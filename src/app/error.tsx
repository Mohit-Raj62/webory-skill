'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    console.error('App Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Oops! Something went wrong</h2>
          <p className="text-zinc-400 text-sm">
            We encountered an unexpected error while trying to load this page. Our team has been notified.
          </p>
        </div>

        {/* Displaying a sanitized version of the error or digest if in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-black/50 p-4 rounded-lg text-left overflow-auto text-xs font-mono text-red-400 border border-red-500/20">
             {error.message || 'Unknown error occurred'}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-800 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
