export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-2">
          {/* Title line */}
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          {/* Subtitle line */}
          <div className="h-4 w-24 bg-slate-100 rounded-md" />
        </div>
        {/* Days controller segment */}
        <div className="h-10 w-full sm:w-56 bg-slate-100 rounded-xl shrink-0" />
      </div>

      {/*  STAT CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/50 shadow-sm flex items-center gap-4"
          >
            {/* Icon box */}
            <div className="w-11 h-11 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              {/* Category metric title */}
              <div className="h-3 w-2/3 bg-slate-100 rounded" />
              {/* Main value string */}
              <div className="h-5 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHARTS CONTAINER SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE LINE CHART AREA (2 columns wide on desktop) */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/50 shadow-sm space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded-md" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
          {/* Chart canvas simulation */}
          <div className="h-[280px] w-full bg-slate-50 rounded-lg flex items-end justify-between p-4 gap-1.5 sm:gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-slate-200/40 rounded-t-sm sm:rounded-t-md"
                style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
              />
            ))}
          </div>
        </div>

        {/* PIE DISTRIBUTION CHART (1 column wide) */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 rounded-md" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
          {/* Pie Donut simulation */}
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-[18px] border-slate-100 flex items-center justify-center">
              <div className="space-y-1.5 text-center">
                <div className="h-3 w-12 bg-slate-100 rounded mx-auto" />
                <div className="h-4 w-16 bg-slate-200 rounded mx-auto" />
              </div>
            </div>
          </div>
          {/* Legend indicators */}
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="h-3.5 w-16 bg-slate-100 rounded" />
                </div>
                <div className="h-3.5 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SALES FLOW CHART SKELETON */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-72 bg-slate-100 rounded" />
        </div>
        {/* Flow blocks simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full border border-slate-100 p-4 rounded-xl flex items-center sm:flex-col text-left sm:text-center gap-4 bg-slate-50/50"
            >
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
              <div className="space-y-2 flex-1 sm:flex-none w-full">
                <div className="h-3 w-20 bg-slate-100 rounded sm:mx-auto" />
                <div className="h-4 w-28 bg-slate-200 rounded sm:mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECENT ORDERS TABLE SKELETON */}
      <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div className="h-4 w-44 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="overflow-x-auto">
          <div className="w-full min-w-[768px] p-5 space-y-4">
            {/* Table headers */}
            <div className="grid grid-cols-5 gap-4 border-b border-slate-100 pb-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3 bg-slate-100 rounded ${
                    i === 4 ? "ml-auto w-12" : "w-20"
                  }`}
                />
              ))}
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 items-center pt-2">
                <div className="h-4 w-16 bg-slate-200 rounded font-mono" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
                <div className="h-4 w-20 bg-slate-100 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
