import { BarChart3, Users, Clock, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface AdminDashboardProps {
  complaints: any[];
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ complaints, onNavigate }: AdminDashboardProps) {
  const totalComplaints = complaints.length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;
  const pending = complaints.filter(c => c.status === "pending").length;

  const categoryData = [
    { name: "Infrastructure", value: complaints.filter(c => c.category === "Infrastructure").length },
    { name: "Academics", value: complaints.filter(c => c.category === "Academics").length },
    { name: "Facilities", value: complaints.filter(c => c.category === "Facilities").length },
    { name: "Other", value: complaints.filter(c => c.category === "Other").length },
  ];

  const statusData = [
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#06b6d4" },
    { name: "Resolved", value: resolved, color: "#10b981" },
  ];

  const trendData = [
    { month: "Jan", complaints: 45 },
    { month: "Feb", complaints: 52 },
    { month: "Mar", complaints: 48 },
    { month: "Apr", complaints: 61 },
    { month: "May", complaints: totalComplaints },
  ];

  const stats = [
    {
      title: "Total Complaints",
      value: totalComplaints.toString(),
      change: "+12%",
      icon: AlertCircle,
      gradient: "from-[#1e3a8a] to-[#3b82f6]",
    },
    {
      title: "Resolved",
      value: resolved.toString(),
      change: `${totalComplaints ? Math.round((resolved/totalComplaints)*100) : 0}%`,
      icon: CheckCircle,
      gradient: "from-[#10b981] to-[#06b6d4]",
    },
    {
      title: "In Progress",
      value: inProgress.toString(),
      change: "Active",
      icon: Clock,
      gradient: "from-[#f59e0b] to-[#f97316]",
    },
    {
      title: "Pending",
      value: pending.toString(),
      change: "Awaiting",
      icon: TrendingUp,
      gradient: "from-[#ec4899] to-[#f472b6]",
    },
  ];

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Complete overview and management of all complaints
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => onNavigate('manage-complaints')}
            >
              <div className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg w-fit`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground mb-1">{stat.title}</p>
              <p className="font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <h3 className="mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1e3a8a]" />
            Complaints by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <h3 className="mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ec4899]" />
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={(entry) => entry.name}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
        <h3 className="mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#06b6d4]" />
          Complaint Trends (Last 5 Months)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
              }}
            />
            <Line type="monotone" dataKey="complaints" stroke="#ec4899" strokeWidth={3} dot={{ fill: "#ec4899", r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('manage-complaints')}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Manage Complaints
        </button>
        <button
          onClick={() => onNavigate('user-management')}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          User Management
        </button>
        <button
          onClick={() => onNavigate('category-management')}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Category Management
        </button>
      </div>
    </div>
  );
}
