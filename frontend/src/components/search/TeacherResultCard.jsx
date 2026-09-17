import { ShieldCheck } from "lucide-react";

export default function TeacherResultCard({ teacher, isTop = false }) {
  return (
    <div className="flex gap-4">
      <div className="flex w-14 shrink-0 justify-center pt-4.5">
        {isTop ? (
          <div className="h-3.5 w-3.5 rounded-full border-[3px] border-white bg-pf-gold shadow-[0_0_0_1px_theme(colors.pf.gold)]" />
        ) : (
          <div className="h-3 w-3 rounded-full border-2 border-pf-purple bg-pf-purple-light" />
        )}
      </div>

      <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 bg-white p-4.5">
        <div className="h-14 w-14 shrink-0 rounded-full bg-pf-purple-light" />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-serif text-base font-medium text-pf-purple-dark">
              {teacher.name}
            </p>
            {teacher.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF3E1] px-2 py-0.5 text-[11px] text-[#8A5A00]">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Vérifiée
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            {teacher.subjects} · {teacher.location}
          </p>
          <div className="mt-2 flex items-center gap-2.5 text-xs text-pf-purple-dark">
            <span>
              ★ {teacher.rating} <span className="text-gray-400">({teacher.reviews} avis)</span>
            </span>
            <span className="text-gray-400">{teacher.experience}</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-sm font-medium text-pf-purple-dark">
              {teacher.rate} FCFA / heure
            </span>
            <a
              href={`/teachers/${teacher.id}`}
              className={
                isTop
                  ? "rounded-md bg-pf-purple px-4 py-2 text-sm text-white"
                  : "rounded-md border border-pf-purple px-4 py-2 text-sm text-pf-purple"
              }
            >
              Voir le profil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}