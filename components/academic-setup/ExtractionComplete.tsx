import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const EXTRACTION_TASKS = [
  "Read syllabus document and extract structure",
  "Extract course code, title, L/T/P/S/C, theory hours and lab hours",
  "Extract course outcomes and knowledge levels",
  "Extract units, topics and unit hours",
  "Extract lab experiments",
  "Extract textbooks and reference books",
];

interface ExtractionCompleteProps {
  fileName?: string;
  progress?: number;
  onReview?: () => void;
}

const ExtractionComplete = ({
  fileName = "CS309_Computer_Networks_Syllabus.pdf",
  progress: progressProp = 100,
  onReview,
}: ExtractionCompleteProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressProp), 100);
    return () => clearTimeout(timer);
  }, [progressProp]);
  return (
    <div className="panel mt-2 mb-5 px-6 py-6 dark:border-gray-700 ">
      {/* Top badge row */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Extraction Complete
        </span>
        <span className="text-sm text-gray-500">{fileName}</span>
      </div>

      {/* Title */}
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Extraction Complete</h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-sm font-semibold text-gray-800 dark:text-gray-200">
          <span>Extraction Complete</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-primary-custom transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="mb-6 divide-y divide-gray-100 dark:divide-gray-700">
        {EXTRACTION_TASKS.map((task) => (
          <div key={task} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-custom">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{task}</span>
            </div>
            <span className="text-sm font-medium text-primary">Completed</span>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between rounded-xl bg-purple-50 px-5 py-4 dark:bg-purple-900/20">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Extraction Complete</p>
          <p className="mt-0.5 text-sm text-primary">
            AI extraction completed. Faculty review and ratification is required before final approval.
          </p>
        </div>
        <button
          onClick={onReview}
          className="flex items-center gap-2 rounded-lg bg-primary-custom px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Review Extracted Data →
        </button>
      </div>
    </div>
  );
};

export default ExtractionComplete;
