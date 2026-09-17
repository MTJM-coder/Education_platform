export default function FormField({ label, ...inputProps }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">{label}</label>
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        {...inputProps}
      />
    </div>
  );
}