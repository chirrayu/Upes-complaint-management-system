import { ArrowLeft, User, Bell, Shield } from "lucide-react";

interface SettingsProps {
  onNavigate: (view: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h1 className="mb-8 bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent">
        Settings
      </h1>

      <div className="space-y-6">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2>Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">Full Name</label>
              <input
                type="text"
                defaultValue="Student Name"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">Email</label>
              <input
                type="email"
                defaultValue="student@example.com"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">Student ID</label>
              <input
                type="text"
                defaultValue="UPES2024001"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2>Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#1e3a8a] peer-checked:to-[#3b82f6]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status Updates</p>
                <p className="text-sm text-muted-foreground">Get notified when complaint status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#1e3a8a] peer-checked:to-[#3b82f6]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#f97316]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2>Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left">
              Change Password
            </button>
            <button className="w-full px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30 hover:shadow-xl hover:shadow-[#1e3a8a]/40 transition-all hover:scale-105">
          Save Changes
        </button>
      </div>
    </div>
  );
}
