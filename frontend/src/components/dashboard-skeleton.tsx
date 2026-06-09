import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton({
  title = "Dashboard",
  subtitle = "High-level view of claim processing and metrics.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-8">
      <div className="animate-pulse space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <div className="h-4 w-96 bg-slate-200 rounded" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card
            key={idx}
            className="border border-slate-200/50 shadow-sm rounded-xl p-6 bg-white flex flex-col justify-between h-28 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-8 w-16 bg-slate-300 rounded-lg" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-200" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <Card
            key={idx}
            className="border border-slate-200/50 shadow-sm rounded-xl h-80 flex flex-col p-5 bg-white animate-pulse"
          >
            <div className="border-b border-slate-100/50 pb-3 mb-4">
              <div className="h-4 w-36 bg-slate-200 rounded" />
            </div>
            <div className="flex-grow flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100/30">
              <div className="w-32 h-32 rounded-full border-8 border-slate-200/50 border-t-transparent animate-spin hidden" />
              <div className="space-y-2 w-full px-6">
                <div className="h-3 w-2/3 bg-slate-200 rounded mx-auto" />
                <div className="h-3 w-1/2 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="border border-slate-200/50 shadow-sm rounded-xl overflow-hidden bg-white animate-pulse">
        <div className="p-5 border-b border-slate-100/50">
          <div className="h-4 w-44 bg-slate-200 rounded" />
        </div>
        <div className="p-5 space-y-4">
          <div className="flex space-x-6 border-b border-slate-100 pb-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-3.5 flex-1 bg-slate-200 rounded" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex space-x-6 py-3 border-b border-slate-50 last:border-none"
            >
              {Array.from({ length: 6 }).map((_, colIdx) => (
                <div key={colIdx} className="h-4 flex-1 bg-slate-100 rounded" />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
