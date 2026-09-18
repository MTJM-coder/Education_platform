export function Pill({ tone = "gold", children, icon: Icon }) {
  const tones = {
    green: "bg-[#EEF6E7] text-pf-green",
    gold: "bg-[#FBF3E1] text-[#8A5A00]",
    red: "bg-red-50 text-red-600",
    purple: "bg-pf-purple-light text-pf-purple-dark",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatCard({ label, value, tone = "light" }) {
  const isDark = tone === "dark";

  return (
    <div
      className={`flex-1 rounded-xl p-4 ${
        isDark ? "bg-pf-purple" : "border border-gray-200 bg-white"
      }`}
    >
      <p className={`mb-1 text-xs ${isDark ? "text-purple-100" : "text-gray-400"}`}>
        {label}
      </p>
      <p
        className={`text-lg font-medium ${
          isDark ? "text-white" : "text-pf-purple-dark"
        }`}
      >
        {value}
      </p>
    </div>
  );
}