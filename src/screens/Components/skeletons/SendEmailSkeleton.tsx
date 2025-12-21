// src/components/skeletons/member/SendEmailSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SendEmailSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-9 w-48" />
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </Card>
    </div>
  );
}