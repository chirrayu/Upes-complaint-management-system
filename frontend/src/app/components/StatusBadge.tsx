interface StatusBadgeProps {
  status: "pending" | "in-progress" | "resolved";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: {
      label: "Pending",
      gradient: "from-[#f59e0b] to-[#f97316]",
      bg: "bg-[#f59e0b]/10",
      border: "border-[#f59e0b]/30",
    },
    "in-progress": {
      label: "In Progress",
      gradient: "from-[#06b6d4] to-[#3b82f6]",
      bg: "bg-[#06b6d4]/10",
      border: "border-[#06b6d4]/30",
    },
    resolved: {
      label: "Resolved",
      gradient: "from-[#10b981] to-[#06b6d4]",
      bg: "bg-[#10b981]/10",
      border: "border-[#10b981]/30",
    },
  };

  const variant = variants[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${variant.bg} border ${variant.border}`}
    >
      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${variant.gradient} mr-2`}></span>
      <span className={`bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent font-medium`}>
        {variant.label}
      </span>
    </span>
  );
}
