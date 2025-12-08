// src/components/skeletons/member/KYCSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function KYCSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  );
}