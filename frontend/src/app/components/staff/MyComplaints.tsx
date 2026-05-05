import { ArrowLeft, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../StatusBadge";

interface MyComplaintsProps {
  complaints: any[];
  staffName: string;
  onNavigate: (view: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onAddRemark: (id: string, remark: string) => void;
}

export function MyComplaints({ complaints, staffName, onNavigate, onUpdateStatus, onAddRemark }: MyComplaintsProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [newRemark, setNewRemark] = useState("");

  const assignedComplaints = complaints.filter(c => c.assignedTo === staffName);

  const handleAddRemark = () => {
    if (newRemark.trim() && selectedComplaint) {
      onAddRemark(selectedComplaint.id, newRemark);
      setNewRemark("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h1 className="mb-8 bg-gradient-to-r from-[#06b6d4] to-[#10b981] bg-clip-text text-transparent">
        My Assigned Complaints
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {assignedComplaints.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-card border border-border">
              <p className="text-muted-foreground">No complaints assigned to you</p>
            </div>
          ) : (
            assignedComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => setSelectedComplaint(complaint)}
                className={`rounded-2xl bg-card border p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  selectedComplaint?.id === complaint.id
                    ? "border-[#06b6d4] ring-2 ring-[#06b6d4]/20"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">{complaint.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-muted text-sm">{complaint.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(complaint.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <div className="flex gap-2">
                  <select
                    value={complaint.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(complaint.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Mark as Pending</option>
                    <option value="in-progress">Mark as In Progress</option>
                    <option value="resolved">Mark as Resolved</option>
                  </select>
                </div>

              </div>
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          {selectedComplaint ? (
            <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
              <h2 className="mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#06b6d4]" />
                Complaint Timeline
              </h2>

              <div className="space-y-6 mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]"></div>
                    <div className="w-0.5 h-full bg-border"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-foreground mb-1">Complaint Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedComplaint.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedComplaint.assignedDate && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-foreground mb-1">Assigned to {selectedComplaint.assignedTo}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedComplaint.assignedDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedComplaint.remarks && selectedComplaint.remarks.map((remark: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f97316]"></div>
                      {idx < selectedComplaint.remarks.length - 1 && <div className="w-0.5 h-full bg-border"></div>}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-foreground mb-1">Remark Added</p>
                      <p className="text-sm text-muted-foreground mb-2">{remark.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(remark.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
                  Add Remark
                </h3>
                <textarea
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Add progress update or note..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none mb-4"
                ></textarea>
                <button
                  onClick={handleAddRemark}
                  disabled={!newRemark.trim()}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Add Remark
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-card border border-border p-12 text-center">
              <p className="text-muted-foreground">
                Select a complaint to view timeline and add remarks
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
