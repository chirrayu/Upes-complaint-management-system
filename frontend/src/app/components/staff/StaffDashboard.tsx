import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

interface StaffDashboardProps {
  complaints: any[];
  staffName: string;
  onNavigate: (view: string) => void;
}

export function StaffDashboard({ complaints, staffName, onNavigate }: StaffDashboardProps) {
  const assignedComplaints = complaints.filter(c => c.assignedTo === staffName);
  const myPending = assignedComplaints.filter(c => c.status === "pending").length;
  const myInProgress = assignedComplaints.filter(c => c.status === "in-progress").length;
  const myResolved = assignedComplaints.filter(c => c.status === "resolved").length;

  const stats = [
    {
      title: "Assigned to Me",
      value: assignedComplaints.length.toString(),
      icon: AlertCircle,
      gradient: "from-[#1e3a8a] to-[#3b82f6]",
    },
    {
      title: "In Progress",
      value: myInProgress.toString(),
      icon: Clock,
      gradient: "from-[#f59e0b] to-[#f97316]",
    },
    {
      title: "Resolved by Me",
      value: myResolved.toString(),
      icon: CheckCircle,
      gradient: "from-[#10b981] to-[#06b6d4]",
    },
    {
      title: "Pending",
      value: myPending.toString(),
      icon: Calendar,
      gradient: "from-[#ec4899] to-[#f472b6]",
    },
  ];

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-[#06b6d4] to-[#10b981] bg-clip-text text-transparent">
          Staff Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {staffName}! Manage your assigned complaints
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => onNavigate('my-complaints')}
            >
              <div className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg w-fit`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground mb-1">{stat.title}</p>
              <p className="font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="bg-gradient-to-r from-[#06b6d4] to-[#10b981] bg-clip-text text-transparent">
            Assigned Complaints
          </h2>
          <button
            onClick={() => onNavigate('my-complaints')}
            className="text-[#06b6d4] hover:text-[#10b981] transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {assignedComplaints.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-card border border-border">
              <p className="text-muted-foreground">No complaints assigned yet</p>
            </div>
          ) : (
            assignedComplaints.slice(0, 5).map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => onNavigate('my-complaints')}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">{complaint.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{complaint.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="px-3 py-1 rounded-full bg-muted">{complaint.category}</span>
                      <span className="text-muted-foreground">
                        {new Date(complaint.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => onNavigate('my-complaints')}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        View & Manage My Complaints
      </button>
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${variant.bg} border ${variant.border}`}>
      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${variant.gradient} mr-2`}></span>
      <span className={`bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent font-medium`}>
        {variant.label}
      </span>
    </span>
  );
}
