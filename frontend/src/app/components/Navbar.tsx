import { Menu, Moon, Sun, GraduationCap, Shield, Users, ChevronDown, LogOut, Settings as SettingsIcon, User } from "lucide-react";
import { useState } from "react";
import upesLogo from "../../imports/image.png";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  role?: "student" | "admin" | "staff";
  userName?: string;
  onLogout?: () => void;
}

export function Navbar({ darkMode, toggleDarkMode, toggleSidebar, role = "student", userName = "User", onLogout }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return Shield;
      case "staff":
        return Users;
      default:
        return GraduationCap;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "from-[#ec4899] to-[#f97316]";
      case "staff":
        return "from-[#06b6d4] to-[#10b981]";
      default:
        return "from-[#1e3a8a] to-[#3b82f6]";
    }
  };

  const RoleIcon = getRoleIcon();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={upesLogo}
                alt="UPES Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
                UPES Portal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getRoleColor()} bg-opacity-10`}>
              <RoleIcon className="w-4 h-4" />
              <span className={`bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent font-medium capitalize`}>
                {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-all hover:scale-105"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-medium text-sm`}>
                  {userName.split(' ').map(n => n[0]).join('')}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-xl z-20 overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <p className="font-medium text-foreground">{userName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{role}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left">
                        <SettingsIcon className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-border">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Switch Role</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
