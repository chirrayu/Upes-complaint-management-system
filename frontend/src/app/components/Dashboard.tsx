import { AlertCircle, CheckCircle, Clock, TrendingUp, ArrowRight } from "lucide-react";

interface DashboardProps {
  onNavigate: (view: string) => void;
  complaints: any[];
}

export function Dashboard({ onNavigate, complaints }: DashboardProps) {
  const totalComplaints = complaints.length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;
  const pending = complaints.filter(c => c.status === "pending").length;

  const stats = [
    {
      title: "Total Complaints",
      value: totalComplaints.toString(),
      change: "+12% from last month",
      icon: AlertCircle,
      gradient: "from-[#1e3a8a] to-[#3b82f6]",
      glowColor: "shadow-[#1e3a8a]/20",
    },
    {
      title: "Resolved",
      value: resolved.toString(),
      change: `${totalComplaints ? Math.round((resolved/totalComplaints)*100) : 0}% completion rate`,
      icon: CheckCircle,
      gradient: "from-[#10b981] to-[#06b6d4]",
      glowColor: "shadow-[#10b981]/20",
    },
    {
      title: "In Progress",
      value: inProgress.toString(),
      change: "Active resolution",
      icon: Clock,
      gradient: "from-[#f59e0b] to-[#f97316]",
      glowColor: "shadow-[#f59e0b]/20",
    },
    {
      title: "Pending",
      value: pending.toString(),
      change: "Awaiting review",
      icon: TrendingUp,
      gradient: "from-[#ec4899] to-[#f472b6]",
      glowColor: "shadow-[#ec4899]/20",
    },
  ];

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 via-[#06b6d4]/10 to-[#ec4899]/10 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="mb-4 bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
            Welcome to UPES Portal
          </h1>
          <p className="text-muted-foreground mb-6">
            Manage and track your campus complaints efficiently
          </p>
          <button
            onClick={() => onNavigate('submit')}
            className="group px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30 hover:shadow-xl hover:shadow-[#1e3a8a]/40 transition-all hover:scale-105"
          >
            Submit New Complaint
            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 backdrop-blur-sm cursor-pointer"
              onClick={() => onNavigate('complaints')}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
                   style={{ backgroundImage: `linear-gradient(to bottom right, var(--blue), var(--cyan))` }}></div>

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.glowColor} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {stat.title}
                </p>
                <p className="font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <button
            onClick={() => onNavigate('complaints')}
            className="text-[#1e3a8a] hover:text-[#06b6d4] transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentComplaints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No complaints yet. Submit your first complaint to get started.
            </div>
          ) : (
            recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="group rounded-2xl bg-card/50 backdrop-blur-md border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => onNavigate('complaints')}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">{complaint.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="px-3 py-1 rounded-full bg-muted">{complaint.category}</span>
                      <span>{new Date(complaint.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, any> = {
    pending: {
      label: "Pending",
      gradient: "from-[#f59e0b] to-[#f97316]",
      bg: "bg-[#f59e0b]/10",
      border: "border-[#f59e0b]/30",
    },
    "in-progress": {
      label: "In Progress",
      gradient: "from-[#06b6d4] to-[#3b82f6]",
      bg: "bg-[#06b6d4]/10",
      border: "border-[#06b6d4]/30",
    },
    resolved: {
      label: "Resolved",
      gradient: "from-[#10b981] to-[#06b6d4]",
      bg: "bg-[#10b981]/10",
      border: "border-[#10b981]/30",
    },
  };

  const variant = variants[status] || variants.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${variant.bg} border ${variant.border}`}
    >
      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${variant.gradient} mr-2`}></span>
      <span className={`bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent font-medium`}>
        {variant.label}
      </span>
    </span>
  );
}
