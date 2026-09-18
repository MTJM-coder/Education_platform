const STEPS = ["Demande", "Sélection", "Validation", "Cours"];

export default function RequestProgress({ currentStep }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const isDone = i <= currentStep;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full ${
                  isDone ? "bg-pf-purple" : "border-2 border-gray-300 bg-gray-100"
                }`}
              />
              <p
                className={`mt-1 text-[10px] ${
                  isDone ? "text-pf-purple-dark" : "text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${i < currentStep ? "bg-pf-purple" : "bg-gray-300"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}