export default function SelectField({ label, children, ...selectProps }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">{label}</label>
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        {...selectProps}
      >
        {children}
      </select>
    </div>
  );
}