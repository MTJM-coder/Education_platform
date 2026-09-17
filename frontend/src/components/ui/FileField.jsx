export default function FileField({ label, hint, file, onChange, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <label className="flex cursor-pointer items-center justify-between rounded-md border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500">
        <span className="truncate">
          {file ? file.name : "Choisir un fichier…"}
        </span>
        <span className="ml-3 shrink-0 text-xs text-pf-purple">Parcourir</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          required={required}
        />
      </label>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}