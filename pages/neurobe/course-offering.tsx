import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BookOpen, Info, UserCheck } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import AcademicTable from "@/components/academic-setup/AcademicTable";
import {
  MOCK_OFFERINGS,
  COURSE_OFFERING_COLUMNS,
} from "@/components/course-offering/courseOfferingColumns";
import PrivateRouter from "@/hook/privateRouter";

const PROGRAMME_OPTIONS = ["All Programmes", "B.Tech CSE", "B.Tech ECE", "M.Tech AI"];
const BATCH_OPTIONS     = ["All Batches", "2025-29", "2024-28", "2023-27"];
const STATUS_OPTIONS    = ["All Statuses", "Active", "Inactive"];

const CourseOffering = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search:          "",
    programmeFilter: "All Programmes",
    batchFilter:     "All Batches",
    statusFilter:    "All Statuses",
    loading:         false,
  });

  useEffect(() => { dispatch(setPageTitle("Course Offerings")); }, []);

  // ── filtered records ───────────────────────────────────────────────────────
  const records = MOCK_OFFERINGS.filter((r) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      r.course.toLowerCase().includes(s) ||
      r.code.toLowerCase().includes(s) ||
      r.coordinator.toLowerCase().includes(s) ||
      r.instructors.some((i) => i.toLowerCase().includes(s));
    const matchProg   = state.programmeFilter === "All Programmes" || r.programme === state.programmeFilter;
    const matchBatch  = state.batchFilter     === "All Batches"    || r.batch     === state.batchFilter;
    const matchStatus = state.statusFilter    === "All Statuses"   || r.status    === state.statusFilter;
    return matchSearch && matchProg && matchBatch && matchStatus;
  });

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      <p className="mb-2 text-xs text-gray-400">
        ADMIN INSTITUTION &nbsp;›&nbsp; COURSE OFFERINGS
      </p>

      <h1 className="mb-5 text-xl font-bold text-gray-800 dark:text-white">
        Course Offerings
      </h1>

      {/* Info banner */}
      <div className="panel mb-4 flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe]">
            <BookOpen className="h-5 w-5 text-[#7c3aed]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Course Offerings &amp; Faculty Assignment
            </p>
            <p className="mt-0.5 text-xs text-[#000]">
              Manage course offerings across programmes, batches, and terms with automated Coordinator-to-Instructor access maintenance.
            </p>
          </div>
        </div>
        <button className="bg-color2 flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
          <IconPlus className="h-4 w-4" />
          Create Course Offering
        </button>
      </div>

      {/* Auto-instructor notice */}
      <div className="panel mb-5 flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 px-5 py-3 dark:border-yellow-800 dark:bg-yellow-900/20">
        <Info className="h-4 w-4 shrink-0 text-yellow-600" />
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          Course Coordinators automatically have Instructor access for the same course.{" "}
          <span className="font-semibold text-green-600">Now Active</span>
          {" — "}When a faculty member e.g.{" "}
          <span className="font-semibold">Arjun Kumar</span> is assigned as Course Coordinator, they automatically possess full Course Instructor access for the same course delivery.
        </p>
        <button className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <UserCheck className="h-3 w-3" />
          Coordinator = Auto-Instructor
        </button>
      </div>

      {/* Filters */}
      <div className="panel mb-4 flex flex-wrap items-center gap-3 px-5 py-4">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by code, title, faculty..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <select
          value={state.programmeFilter}
          onChange={(e) => setState({ programmeFilter: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-[#000] outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {PROGRAMME_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>

        <select
          value={state.batchFilter}
          onChange={(e) => setState({ batchFilter: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-[#000] outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {BATCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>

        <select
          value={state.statusFilter}
          onChange={(e) => setState({ statusFilter: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-[#000] outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Table — columns passed as prop, defined in courseOfferingColumns.tsx */}
      <div className="panel">
        <AcademicTable
          records={records}
          columns={COURSE_OFFERING_COLUMNS}
          loading={state.loading}
          noRecordsText="No course offerings found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(CourseOffering);
