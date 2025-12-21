// app/error.tsx (Next.js 13+ App Router error boundary)
'use client';

import { useEffect } from 'react';
import { Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, etc.) in production
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="bg-red-100 rounded-full p-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          500
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Something Went Wrong
        </p>
        <p className="text-gray-600 mb-8">
          We're experiencing technical difficulties. Please try again in a few moments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>

        {/* Support */}
        <p className="mt-12 text-sm text-gray-500">
          Still having issues?{' '}
          <a
            href="mailto:support@cooperative.com"
            className="font-medium text-gray-900 hover:underline"
          >
            Contact support
          </a>
        </p>

        {/* Optional debug info (remove in production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-gray-100 p-4 rounded-lg text-xs">
            <summary className="cursor-pointer font-medium mb-2">Error details</summary>
            <pre className="whitespace-pre-wrap">{error.message}</pre>
            {error.digest && <p className="mt-2">Digest: {error.digest}</p>}
          </details>
        )} */}
      </div>
    </div>
  );
}