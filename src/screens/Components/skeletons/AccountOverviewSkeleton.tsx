// src/components/skeletons/member/AccountOverviewSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AccountOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="w-16 h-16 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-40 mx-auto" />
          </Card>
        ))}
      </div>
    </div>
  );
}