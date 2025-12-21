// src/components/skeletons/member/LoansSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoansSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="p-6 space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="text-center space-y-2">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-9 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}