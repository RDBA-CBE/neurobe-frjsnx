import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

type PrepItem = {
  label: string;
  status: "not_started" | "approved" | "review" | "draft";
  extra?: string;
};

type CourseCardProps = {
  isNew?: boolean;
  code: string;
  credits: string;
  role: string;
  title: string;
  readiness?: string;
  programme: string;
  batch: string;
  term: string;
  students: string;
  prepItems: PrepItem[];
  nextAction: string;
  instructors: string;
  actionLabel: string;
  onAction?: () => void;
};

const STATUS_CONFIG = {
  not_started: {
    label: "Not started",
    icon: null,
    cell: "border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    cell: "bg-green-50 dark:bg-green-900/20",
  },
  review: {
    label: "Review",
    icon: <TriangleAlert className="h-4 w-4 text-yellow-500" />,
    cell: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  draft: {
    label: "Draft",
    icon: <Clock className="h-4 w-4 text-gray-400" />,
    cell: "bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800",
  },
};

export default function CourseCard({
  isNew,
  code,
  credits,
  role,
  title,
  readiness,
  programme,
  batch,
  term,
  students,
  prepItems,
  nextAction,
  instructors,
  actionLabel,
  onAction,
}: CourseCardProps) {
  const hasProgress = prepItems.some((p) => p.status !== "not_started");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="rounded-md bg-[#F3F4F6] px-2.5 py-0.5 text-md font-bold text-primary">
              NEW
            </span>
          )}
          <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            {code}
          </span>
          <span className="text-xs text-gray-500">{credits}</span>
        </div>
        <span className="rounded-full border border-purple-300 px-3 py-1 text-xs font-medium text-purple-700">
          {role}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {readiness && (
          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" /> {readiness} Ready
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-4 gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
        {[
          { label: "PROGRAMME", value: programme },
          { label: "BATCH", value: batch },
          { label: "TERM", value: term },
          { label: "STUDENTS", value: students },
        ].map((m) => (
          <div key={m.label}>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {m.label}
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Prep Section */}
      <div>
        <div className="mb-2 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {hasProgress
              ? "Academic Preparation Progress"
              : "Academic Preparation"}
          </p>
          {!hasProgress && (
            <span className="text-xs font-medium text-red-400">
              Preparation not started
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {prepItems.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${cfg.cell}`}
              >
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-gray-600">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {cfg.label}
                    {item.extra && (
                      <span className="ml-1 text-xs text-gray-500">
                        {item.extra}
                      </span>
                    )}
                  </p>
                </div>
                {cfg.icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Action */}
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          hasProgress
            ? "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20"
            : "bg-gray-50 text-gray-600 dark:bg-gray-800"
        }`}
      >
        {hasProgress ? (
          <AlertCircle className="h-4 w-4 shrink-0" />
        ) : (
          <Bell className="h-4 w-4 shrink-0 text-purple-600 font-bold" />
        )}
        <span>
          <span className="font-semibold">Next Action:</span> {nextAction}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <p className="text-xs text-gray-500">{instructors}</p>
        <button
          onClick={() => onAction?.()}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            hasProgress
              ? "border border-purple-600 text-purple-600 hover:bg-purple-50"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {actionLabel} →
        </button>
      </div>
    </div>
  );
}
