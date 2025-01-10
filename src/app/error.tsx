'use client';

import { useEffect } from 'react';

const logError = (error: any, context?: any) => {
  console.error('Application error:', {
    error: {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name,
      digest: error?.digest
    },
    context,
    timestamp: new Date().toISOString()
  });
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, {
      url: typeof window !== 'undefined' ? window.location.href : null,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        We&apos;ve logged the error and we&apos;ll look into it.
      </p>
      <button
        onClick={() => {
          console.info('User initiated page refresh');
          window.location.reload();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}