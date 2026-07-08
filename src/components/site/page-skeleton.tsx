"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative min-h-[100svh] bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-16 sm:h-24 lg:h-32 w-full max-w-2xl mb-6" />
          <Skeleton className="h-16 sm:h-24 lg:h-32 w-full max-w-xl mb-8" />
          <Skeleton className="h-6 w-full max-w-xl mb-10" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </div>

      {/* Brand strip skeleton */}
      <div className="bg-foreground py-4">
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Brand showcase skeleton */}
      <div className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-12 sm:h-16 w-72 mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-background p-10 min-h-[200px]">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-3 w-20 mb-6" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 sm:h-12 w-64 mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full mb-3" />
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
