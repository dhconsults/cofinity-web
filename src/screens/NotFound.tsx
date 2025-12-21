// src/screens/NotFound.tsx
import { Building2, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="bg-gray-900 rounded-full p-6">
            <Building2 className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a to="/dashboard">
              <Home className="mr-2 h-5 w-5" />
              Go to Dashboard
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a to="/cooperative-selection">Select Cooperative</a>
          </Button>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Need help?{" "}
          <a
            href="mailto:support@cooperative.com"
            className="font-medium text-gray-900 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}