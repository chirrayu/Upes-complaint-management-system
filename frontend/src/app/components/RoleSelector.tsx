import { GraduationCap, Shield, Users } from "lucide-react";
import upesLogo from "../../imports/image.png";

interface RoleSelectorProps {
  onSelectRole: (role: "student" | "admin" | "staff") => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      id: "student" as const,
      title: "Student",
      description: "Submit and track your complaints",
      icon: GraduationCap,
      gradient: "from-[#1e3a8a] to-[#3b82f6]",
      shadow: "shadow-[#1e3a8a]/30",
    },
    {
      id: "admin" as const,
      title: "Admin",
      description: "Manage all complaints and users",
      icon: Shield,
      gradient: "from-[#ec4899] to-[#f97316]",
      shadow: "shadow-[#ec4899]/30",
    },
    {
      id: "staff" as const,
      title: "Staff",
      description: "Resolve assigned complaints",
      icon: Users,
      gradient: "from-[#06b6d4] to-[#10b981]",
      shadow: "shadow-[#06b6d4]/30",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 via-[#06b6d4]/10 to-[#ec4899]/10 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.15),transparent_50%)]"></div>

      <div className="relative max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={upesLogo} alt="UPES Logo" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
            UPES Complaint Portal
          </h1>
          <p className="text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-md border border-border p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className={`mb-6 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} ${role.shadow} shadow-lg flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h2 className="mb-2 text-foreground">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.description}</p>

                <div className={`mt-6 w-full h-1 rounded-full bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
