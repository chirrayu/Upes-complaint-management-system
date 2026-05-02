import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ComplaintForm } from "./components/ComplaintForm";
import { ComplaintsList } from "./components/ComplaintsList";
import { Settings } from "./components/Settings";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ManageComplaints } from "./components/admin/ManageComplaints";
import { UserManagement } from "./components/admin/UserManagement";
import { CategoryManagement } from "./components/admin/CategoryManagement";
import { StaffDashboard } from "./components/staff/StaffDashboard";
import { MyComplaints } from "./components/staff/MyComplaints";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
  date: string;
  priority?: "high" | "medium" | "low";
  assignedTo?: string;
  assignedDate?: string;
  remarks?: { text: string; date: string; author: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "staff" | "admin";
  studentId?: string;
  department?: string;
  assignedComplaints?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  complaintCount: number;
}

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<"student" | "admin" | "staff" | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchData = async () => {
    try {
      const [complaintsRes, usersRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/complaints`),
        fetch(`${API_BASE_URL}/users`),
        fetch(`${API_BASE_URL}/categories`)
      ]);
      
      const complaintsData = await complaintsRes.json();
      const usersData = await usersRes.json();
      const categoriesData = await categoriesRes.json();
      
      setComplaints(complaintsData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // Restore session via API instead of localStorage for security
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          setCurrentRole(user.role);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        setCurrentRole(data.user.role);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Re-throw so LoginPage can handle attempts
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json'
    // Authorization header no longer needed as we use HttpOnly cookies
  });

  const handleSubmitComplaint = async (newComplaint: { title: string; description: string; category: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newComplaint,
          name: currentUser?.name || "Student User",
          email: currentUser?.email || "student@upes.ac.in"
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchData(); // Refresh all data including complaint counts
        setCurrentView("complaints");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    // Note: Need to add DELETE route to backend if missing, 
    // for now we'll just mock it or skip
    setComplaints(complaints.filter(c => c.id !== id));
  };

  const handleAssignStaff = async (id: string, staff: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/assign`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ assignedTo: staff }),
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  const handleAddRemark = async (id: string, remark: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}/remarks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          text: remark, 
          author: currentRole === "staff" ? currentUser?.name || "Staff Member" : "Admin" 
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error adding remark:", error);
    }
  };

  const handleAddUser = async (user: Omit<User, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async (id: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddCategory = (category: Omit<Category, "id" | "complaintCount">) => {
    // Mock for now or implement in backend
    const newCategory: Category = {
      id: Date.now().toString(),
      ...category,
      complaintCount: 0,
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setCurrentRole(null);
    setCurrentUser(null);
    setCurrentView("dashboard");
  };

  const getCurrentUserName = () => {
    return currentUser?.name || "User";
  };

  const renderView = () => {
    if (currentRole === "student") {
      switch (currentView) {
        case "dashboard":
          return <Dashboard onNavigate={setCurrentView} complaints={complaints} />;
        case "submit":
          return <ComplaintForm onSubmit={handleSubmitComplaint} onNavigate={setCurrentView} />;
        case "complaints":
          return <ComplaintsList complaints={complaints} onNavigate={setCurrentView} onUpdateStatus={handleUpdateStatus} />;
        case "settings":
          return <Settings onNavigate={setCurrentView} />;
        default:
          return <Dashboard onNavigate={setCurrentView} complaints={complaints} />;
      }
    }

    if (currentRole === "admin") {
      switch (currentView) {
        case "dashboard":
          return <AdminDashboard complaints={complaints} onNavigate={setCurrentView} />;
        case "manage-complaints":
          return (
            <ManageComplaints
              complaints={complaints}
              onNavigate={setCurrentView}
              onUpdateStatus={handleUpdateStatus}
              onDeleteComplaint={handleDeleteComplaint}
              onAssignStaff={handleAssignStaff}
            />
          );
        case "user-management":
          return (
            <UserManagement
              onNavigate={setCurrentView}
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          );
        case "category-management":
          return (
            <CategoryManagement
              onNavigate={setCurrentView}
              categories={categories}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          );
        case "settings":
          return <Settings onNavigate={setCurrentView} />;
        default:
          return <AdminDashboard complaints={complaints} onNavigate={setCurrentView} />;
      }
    }

    if (currentRole === "staff") {
      switch (currentView) {
        case "dashboard":
          return <StaffDashboard complaints={complaints} staffName="John Smith" onNavigate={setCurrentView} />;
        case "my-complaints":
          return (
            <MyComplaints
              complaints={complaints}
              staffName="John Smith"
              onNavigate={setCurrentView}
              onUpdateStatus={handleUpdateStatus}
              onAddRemark={handleAddRemark}
            />
          );
        case "settings":
          return <Settings onNavigate={setCurrentView} />;
        default:
          return <StaffDashboard complaints={complaints} staffName="John Smith" onNavigate={setCurrentView} />;
      }
    }

    return <Dashboard onNavigate={setCurrentView} complaints={complaints} />;
  };

  if (!currentRole) {
    return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          currentView={currentView}
          onNavigate={setCurrentView}
          role={currentRole || "student"}
        />

        <div className="flex-1 min-w-0">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            role={currentRole || "student"}
            userName={getCurrentUserName()}
            onLogout={handleLogout}
          />

          <main className="pb-12">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}