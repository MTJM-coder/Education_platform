import { Compass } from "lucide-react";

export default function FilterPanel() {
  const days = ["Lun", "Mer", "Ven", "Sam"];
  const activeDays = ["Mer"];

  return (
    <aside className="sticky top-5 h-fit rounded-xl border border-gray-200 bg-white p-4.5">
      <div className="mb-4 flex items-center gap-2">
        <Compass className="h-[18px] w-[18px] text-pf-purple" aria-hidden="true" />
        <p className="font-serif text-sm font-medium text-pf-purple-dark">
          Ajuster le cap
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1.5 text-[11px] text-gray-400">Section</p>
          <div className="flex gap-1.5">
            <span className="rounded-full bg-pf-purple px-2.5 py-1 text-xs text-white">
              Anglais
            </span>
            <span className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-600">
              Français
            </span>
          </div>
        </div>

        <Field label="Niveau">
          <select className="w-full">
            <option>Primaire</option>
            <option>Secondaire</option>
          </select>
        </Field>

        <Field label="Matière">
          <select className="w-full">
            <option>Mathématiques</option>
          </select>
        </Field>

        <div>
          <p className="mb-1.5 text-[11px] text-gray-400">Disponibilité</p>
          <div className="flex flex-wrap gap-1.5">
            {days.map((day) => (
              <span
                key={day}
                className={`rounded px-2 py-1 text-[11px] ${
                  activeDays.includes(day)
                    ? "bg-pf-purple-light text-pf-purple-dark"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] text-gray-400">Tarif horaire</p>
          <input type="range" className="w-full" />
          <p className="mt-1 text-[11px] text-gray-600">Jusqu'à 4 000 FCFA</p>
        </div>

        <button className="h-8.5 border border-gray-300 bg-transparent text-sm text-gray-700">
          Réinitialiser
        </button>
      </div>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] text-gray-400">{label}</p>
      {children}
    </div>
  );
}