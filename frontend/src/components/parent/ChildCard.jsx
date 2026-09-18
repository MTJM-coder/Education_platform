import { Pill } from "../ui/StatusUi";

export default function ChildCard({ child }) {
  const statusConfig = {
    active: { tone: "green", label: "Enseignant actif" },
    searching: { tone: "gold", label: "En recherche" },
  };
  const status = statusConfig[child.status];

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4">
      <div className="h-10 w-10 shrink-0 rounded-full bg-pf-purple-light" />
      <div className="flex-1">
        <p className="text-sm font-medium text-pf-purple-dark">
          {child.name}, {child.age} ans
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{child.details}</p>
      </div>
      <Pill tone={status.tone}>{status.label}</Pill>
    </div>
  );
}