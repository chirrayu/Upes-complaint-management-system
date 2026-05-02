import { ArrowLeft, UserPlus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { Modal } from "../Modal";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "staff" | "admin";
  studentId?: string;
  department?: string;
  assignedComplaints?: number;
}

interface UserManagementProps {
  onNavigate: (view: string) => void;
  users: User[];
  onAddUser: (user: Omit<User, "id">) => void;
  onEditUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export function UserManagement({ onNavigate, users, onAddUser, onEditUser, onDeleteUser }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "staff" | "admin",
    studentId: "",
    department: "",
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }
    onAddUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      studentId: formData.studentId || undefined,
      department: formData.department || undefined,
      assignedComplaints: 0,
    });
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", role: "student", studentId: "", department: "" });
  };

  const handleEdit = () => {
    if (!selectedUser) return;
    onEditUser(selectedUser.id, formData);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "student", studentId: "", department: "" });
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId || "",
      department: user.department || "",
    });
    setIsEditModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      admin: { bg: "bg-[#ec4899]/10", text: "text-[#ec4899]", border: "border-[#ec4899]/30" },
      staff: { bg: "bg-[#06b6d4]/10", text: "text-[#06b6d4]", border: "border-[#06b6d4]/30" },
      student: { bg: "bg-[#1e3a8a]/10", text: "text-[#1e3a8a]", border: "border-[#1e3a8a]/30" },
    };
    const variant = variants[role];
    return (
      <span className={`px-3 py-1 rounded-full text-sm border ${variant.bg} ${variant.text} ${variant.border} font-medium`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
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

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage students, staff, and administrators
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <p className="text-muted-foreground mb-1">Total Users</p>
          <p className="font-bold mb-1">{users.length}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <p className="text-muted-foreground mb-1">Students</p>
          <p className="font-bold mb-1">{users.filter(u => u.role === "student").length}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <p className="text-muted-foreground mb-1">Staff Members</p>
          <p className="font-bold mb-1">{users.filter(u => u.role === "staff").length}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-foreground">Name</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Email</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Role</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">ID/Department</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.studentId || user.department || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete user ${user.name}?`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <UserForm formData={formData} setFormData={setFormData} onSubmit={handleAdd} submitLabel="Add User" />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User">
        <UserForm formData={formData} setFormData={setFormData} onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
    </div>
  );
}

function UserForm({ formData, setFormData, onSubmit, submitLabel }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div>
        <label className="block mb-2 text-foreground">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label className="block mb-2 text-foreground">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label className="block mb-2 text-foreground">Role *</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {formData.role === "student" && (
        <div>
          <label className="block mb-2 text-foreground">Student ID</label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      )}

      {formData.role === "staff" && (
        <div>
          <label className="block mb-2 text-foreground">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        {submitLabel}
      </button>
    </form>
  );
}
