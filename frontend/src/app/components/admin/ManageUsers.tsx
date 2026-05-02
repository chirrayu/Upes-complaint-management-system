import { ArrowLeft, UserPlus, Shield, Users as UsersIcon } from "lucide-react";

interface ManageUsersProps {
  onNavigate: (view: string) => void;
}

export function ManageUsers({ onNavigate }: ManageUsersProps) {
  const users = [
    { id: 1, name: "John Smith", role: "staff", email: "john.smith@upes.ac.in", complaints: 8 },
    { id: 2, name: "Sarah Johnson", role: "staff", email: "sarah.j@upes.ac.in", complaints: 12 },
    { id: 3, name: "Mike Davis", role: "staff", email: "mike.d@upes.ac.in", complaints: 5 },
    { id: 4, name: "Emma Wilson", role: "admin", email: "emma.w@upes.ac.in", complaints: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
            Manage Users & Staff
          </h1>
          <p className="text-muted-foreground">
            Manage staff members and their assignments
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <UserPlus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Staff</p>
              <p className="font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f97316]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">Admins</p>
              <p className="font-bold">1</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#10b981]">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">Active Staff</p>
              <p className="font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-foreground">Name</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Role</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Email</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Assigned Complaints</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Status</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.role === "admin"
                        ? "bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/30"
                        : "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-muted">
                      {user.complaints}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm text-muted-foreground">Active</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
