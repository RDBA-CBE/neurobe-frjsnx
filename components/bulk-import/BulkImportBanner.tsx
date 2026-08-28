import IconUser from "@/components/Icon/IconUser";

type ImportType = "user" | "course";

interface BulkImportBannerProps {
  importType: ImportType;
  onTypeChange: (type: ImportType) => void;
}

const BulkImportBanner = ({ importType, onTypeChange }: BulkImportBannerProps) => {
  return (
    <div className="panel mb-5 flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: icon + text */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-color2-l">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-color2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800 dark:text-white">
            Bulk Import
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Import users and courses from Excel or CSV files with validation before final import.
          </p>
        </div>
      </div>

      {/* Right: type toggle buttons */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onTypeChange("user")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            importType === "user"
              ? "bg-color2-l text-color2 shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-color2 hover:text-color2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          User Import
        </button>

        <button
          onClick={() => onTypeChange("course")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            importType === "course"
              ? "bg-color2-l text-color2 shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-color2 hover:text-color2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          Course Import
        </button>
      </div>
    </div>
  );
};

export default BulkImportBanner;
