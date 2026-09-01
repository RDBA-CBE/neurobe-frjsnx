import { ChevronLeft, Users } from "lucide-react";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

type CourseBannerProps = {
  courseCode: string;
  courseTitle: string;
  description?: string;
  programme: string;
  batch: string;
  academicYear: string;
  students: string;
  selectedCourse?: string;
  courseOptions?: { value: string; label: string }[];
  onCourseChange?: (val: any) => void;
  activeView?: "coordinator" | "instructor";
  onBack?: () => void;
  onViewChange?: (view: "coordinator" | "instructor") => void;
};

export default function CourseBanner({
  courseCode,
  courseTitle,
  description,
  programme,
  batch,
  academicYear,
  students,
  selectedCourse,
  courseOptions = [],
  onCourseChange,
  activeView = "coordinator",
  onBack,
  onViewChange,
}: CourseBannerProps) {
  return (
    <div className="mb-6 mt-2 rounded-2xl bg-color1 px-8 py-5">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-sm text-white/80 hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to My Courses
        </button>

        <CustomSelect
          options={courseOptions}
          value={courseOptions.find((o) => o.value === selectedCourse) || null}
          onChange={onCourseChange}
          placeholder={`Course: ${selectedCourse || courseCode}`}
          isSearchable={false}
          isClearable={false}
          className="course-banner-select w-48"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        />
      </div>

      {/* Title Row */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {courseCode} — {courseTitle}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-white/60">{description}</p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex shrink-0 items-center border-[0.5px] border-white rounded-md  p-1">
          <button
            onClick={() => onViewChange?.("coordinator")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeView === "coordinator"
                ? "bg-primary-custom text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Coordinator View
          </button>
          <button
            onClick={() => onViewChange?.("instructor")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeView === "instructor"
                ? "bg-primary-custom text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Instructor View
          </button>
        </div>
      </div>

      {/* Meta Row */}
      <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-white/70">
        <span>Programme:</span>
        <span className="font-semibold text-white">{programme}</span>
        <span className="mx-2 text-white/30">•</span>
        <span>Batch:</span>
        <span className="font-semibold text-white">{batch}</span>
        <span className="mx-2 text-white/30">•</span>
        <span>Academic Year / Term:</span>
        <span className="font-semibold text-white">{academicYear}</span>
        <span className="mx-2 text-white/30">•</span>
        <Users className="h-4 w-4" />
        <span className="font-semibold text-white">{students}</span>
      </div>
    </div>
  );
}
