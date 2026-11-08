import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2 border-b border-line pb-4">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-t-sm" />

            <div className="space-y-2 rounded-b-sm border border-line border-t-0 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
