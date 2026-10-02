export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-20 rounded-2xl bg-slate-200/70" />

      {/* 4 Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200/70" />
        ))}
      </div>

      {/* Middle Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-200/70" />
        <div className="h-80 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}
