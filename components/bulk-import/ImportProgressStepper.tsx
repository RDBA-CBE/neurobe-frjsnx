import { ArrowRightIcon } from "lucide-react";

export type StepStatus = "active" | "completed" | "pending";

export interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Upload File" },
  { number: 2, label: "Validate File" },
  { number: 3, label: "Review Results" },
  { number: 4, label: "Import Complete" },
];

interface ImportProgressStepperProps {
  currentStep: number; // 1-4
  statusLabel?: string; // e.g. "Awaiting Upload"
}

const getStepStatus = (stepNumber: number, currentStep: number): StepStatus => {
  if (stepNumber < currentStep) return "completed";
  if (stepNumber === currentStep) return "active";
  return "pending";
};

const StepCircle = ({ step, status }: { step: Step; status: StepStatus }) => {
  if (status === "completed") {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-color2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-color2 text-sm font-bold text-white">
        {step.number}
      </div>
    );
  }

  // pending
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-400 dark:border-gray-600 dark:text-[#000]">
      {step.number}
    </div>
  );
};

const ImportProgressStepper = ({
  currentStep = 1,
  statusLabel = "Awaiting Upload",
}: ImportProgressStepperProps) => {
  return (
    <div className="panel mb-5 px-6 py-4">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* trend icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-color2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#000] dark:text-gray-400">
            Import Progress
          </span>
        </div>
        <span className="rounded-lg bg-sec px-3 py-1 text-xs font-medium text-pri ">
          {statusLabel}
        </span>
      </div>

      {/* Steps row */}
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.number, currentStep);
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              {/* Step item */}
              <div className="flex flex-1 items-center gap-2.5 border border-gray-100 rounded-lg p-2 bg-sec">
                <StepCircle step={step} status={status} />
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    status === "pending"
                      ? "text-gray-400 dark:text-[#000]"
                      : "text-[#000] dark:text-white"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector arrow — not after last step */}
              {!isLast && (
                <div className="mx-3 flex items-center">
                  {/* <div className="h-px flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" /> */}
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg> */}
                  <ArrowRightIcon className="w-4 h-4"/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImportProgressStepper;
