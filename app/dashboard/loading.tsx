"use client"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Dashboard</h2>
        <p className="text-slate-600">Preparing your investment data...</p>
      </div>
    </div>
  )
}
