import { Home, FileText, PlusCircle, Settings, X, BarChart3, Users, ClipboardList } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  role?: "student" | "admin" | "staff";
}

export function Sidebar({ isOpen, closeSidebar, currentView, onNavigate, role = "student" }: SidebarProps) {
  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { icon: Home, label: "Dashboard", view: "dashboard" },
        { icon: ClipboardList, label: "All Complaints", view: "manage-complaints" },
        { icon: Users, label: "User Management", view: "user-management" },
        { icon: BarChart3, label: "Categories", view: "category-management" },
        { icon: Settings, label: "Settings", view: "settings" },
      ];
    }

    if (role === "staff") {
      return [
        { icon: Home, label: "Dashboard", view: "dashboard" },
        { icon: FileText, label: "My Complaints", view: "my-complaints" },
        { icon: Settings, label: "Settings", view: "settings" },
      ];
    }

    return [
      { icon: Home, label: "Dashboard", view: "dashboard" },
      { icon: FileText, label: "Complaints", view: "complaints" },
      { icon: PlusCircle, label: "Submit", view: "submit" },
      { icon: Settings, label: "Settings", view: "settings" },
    ];
  };

  const menuItems = getMenuItems();

  const handleNavigate = (view: string) => {
    onNavigate(view);
    closeSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border lg:hidden">
          <span className="font-bold">Menu</span>
          <button onClick={closeSidebar} className="p-2 hover:bg-sidebar-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={index}
                onClick={() => handleNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#ec4899]/10 to-[#f97316]/10 border border-[#ec4899]/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ec4899] to-[#f97316] flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Student Name</p>
              <p className="text-sm text-muted-foreground truncate">student@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
