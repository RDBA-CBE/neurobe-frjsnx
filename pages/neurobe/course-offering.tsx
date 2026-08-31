import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ArrowRight, BookOpen, Info, User, UserCheck } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import AcademicTable from "@/components/academic-setup/TableComponent";
import {
  MOCK_OFFERINGS,
  COURSE_OFFERING_COLUMNS,
} from "@/components/course-offering/courseOfferingColumns";
import PrivateRouter from "@/hook/privateRouter";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const PROGRAMME_OPTIONS = [
  { value: "all", label: "All Programmes" },
  { value: "btech-cse", label: "B.Tech CSE" },
  { value: "btech-ece", label: "B.Tech ECE" },
  { value: "mtech-ai", label: "M.Tech AI" },
];

const BATCH_OPTIONS = [
  { value: "all", label: "All Batches" },
  { value: "2025-29", label: "2025-29" },
  { value: "2024-28", label: "2024-28" },
  { value: "2023-27", label: "2023-27" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CourseOffering = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search:          "",
    programmeFilter: "all",
    batchFilter:     "all",
    statusFilter:    "all",
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
    const matchProg   = !state.programmeFilter || state.programmeFilter === "all" || r.programme === PROGRAMME_OPTIONS.find((o) => o.value === state.programmeFilter)?.label;
    const matchBatch  = !state.batchFilter     || state.batchFilter     === "all" || r.batch     === state.batchFilter;
    const matchStatus = !state.statusFilter    || state.statusFilter    === "all" || r.status    === STATUS_OPTIONS.find((o) => o.value === state.statusFilter)?.label;
    return matchSearch && matchProg && matchBatch && matchStatus;
  });

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      {/* <p className="mb-2 text-xs text-gray-400">
        ADMIN INSTITUTION &nbsp;›&nbsp; COURSE OFFERINGS
      </p> */}

      <h1 className="mb-5 page-ti">
        Course Offerings
      </h1>

      {/* Info banner */}
      <div className="panel mb-4 flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe]">
            <BookOpen className="h-5 w-5 text-[#7c3aed]" />
          </div>
          <div>
            <p className="section-ti">
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
      <div className="panel mb-5 flex items-center gap-3 rounded-xl  bg-[#ede9fe]/60 px-5 py-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-color2-l">
            <UserCheck className="h-5 w-5 text-color2" />
          </div>
        <p className="text-sm text-color2 font-bold dark:text-yellow-300">
          <span className="font-bold">Course Coordinators automatically have Instructor access for the same course.{" "}</span>
          <span className="font-semibold text-green-600">Now Active</span>
          <br />
          <span >When a faculty member e.g.{" "}Arjun Kumar is assigned as Course Coordinator, they automatically possess full Course Instructor access for the same course delivery.</span>
        </p>
        <button className="ml-auto flex shrink-0 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-bold text-color2 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <UserCheck className="h-3 w-3" />
          Coordinator <ArrowRight className="w-3 h-3"/> Auto-Instructor
        </button>
      </div>

      {/* Filters */}
      <div className=" mb-4 flex flex-wrap justify-between items-center gap-3  py-4">
        {/* Search */}
        <div className="relative max-w-[300px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by code, title, faculty..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-[#fff] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <CustomSelect
            options={PROGRAMME_OPTIONS}
            value={PROGRAMME_OPTIONS.find((o) => o.value === state.programmeFilter) ?? null}
            onChange={(e) => setState({ programmeFilter: e?.value ?? "all" })}
            placeholder="All Programmes"
            className="filter-input"
            isClearable
          />

          <CustomSelect
            options={BATCH_OPTIONS}
            value={BATCH_OPTIONS.find((o) => o.value === state.batchFilter) ?? null}
            onChange={(e) => setState({ batchFilter: e?.value ?? "all" })}
            placeholder="All Batches"
            className="filter-input"
            isClearable
          />

          <CustomSelect
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((o) => o.value === state.statusFilter) ?? null}
            onChange={(e) => setState({ statusFilter: e?.value ?? "all" })}
            placeholder="All Statuses"
            className="filter-input"
            isClearable
          />
        </div>
        


        
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
