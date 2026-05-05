import { Search, Filter, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";

interface ComplaintsListProps {
  complaints: any[];
  onNavigate: (view: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function ComplaintsList({ complaints, onNavigate, onUpdateStatus }: ComplaintsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
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

      <h1 className="mb-8 bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent">
        All Complaints
      </h1>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Academics">Academics</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No complaints found. {searchTerm || filterStatus !== "all" || filterCategory !== "all" ? "Try adjusting your filters." : "Submit your first complaint to get started."}
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">{complaint.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-muted text-foreground">{complaint.category}</span>
                    <span className="text-muted-foreground">
                      {new Date(complaint.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <StatusBadge status={complaint.status} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
