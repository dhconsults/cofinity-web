// app/layout.tsx

import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export const metadata = {
  title: "CoopHub",
  description: "Cooperative Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}