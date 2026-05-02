import { ArrowLeft, Search, Trash2, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../StatusBadge";

interface ManageComplaintsProps {
  complaints: any[];
  onNavigate: (view: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteComplaint: (id: string) => void;
  onAssignStaff: (id: string, staff: string) => void;
}

export function ManageComplaints({ complaints, onNavigate, onUpdateStatus, onDeleteComplaint, onAssignStaff }: ManageComplaintsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory;
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
          Manage All Complaints
        </h1>
        <p className="text-muted-foreground">
          Full control over complaint lifecycle and assignments
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, description, or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Academics">Academics</option>
            <option value="Facilities">Facilities</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-foreground">ID</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Title</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Category</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Priority</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Status</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Assigned To</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Date</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No complaints found
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{complaint.id}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-foreground truncate">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{complaint.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-muted text-sm">{complaint.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={complaint.priority || "medium"} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {complaint.assignedTo || (
                        <button
                          onClick={() => {
                            const staff = prompt("Enter staff name:");
                            if (staff) onAssignStaff(complaint.id, staff);
                          }}
                          className="flex items-center gap-1 text-[#1e3a8a] hover:text-[#06b6d4] transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(complaint.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={complaint.status}
                          onChange={(e) => onUpdateStatus(complaint.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this complaint?")) {
                              onDeleteComplaint(complaint.id);
                            }
                          }}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, any> = {
    high: {
      label: "High",
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/30",
    },
    medium: {
      label: "Medium",
      bg: "bg-yellow-500/10",
      text: "text-yellow-600",
      border: "border-yellow-500/30",
    },
    low: {
      label: "Low",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/30",
    },
  };

  const variant = variants[priority] || variants.medium;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${variant.bg} ${variant.text} border ${variant.border} text-sm font-medium`}>
      {variant.label}
    </span>
  );
}
