import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Settings, Home } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import {
  MOCK_DEPARTMENTS,
  makeDepartmentColumns,
  MOCK_PROGRAMMES,
  makeProgrammeColumns,
  MOCK_BATCHES,
  makeBatchColumns,
  MOCK_COURSES,
  makeCourseColumns,
  MOCK_PSOS,
  makePSOColumns,
} from "@/components/academic-setup/tableColumns";
import {
  CreateCourseModal,
  CreateDepartmentModal,
  CreateProgrammeModal,
  CreateBatchModal,
  CreatePSOModal,
} from "@/components/academic-setup/AddModals";
import PrivateRouter from "@/hook/privateRouter";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const TABS = [
  {
    key: "departments",
    label: "Departments",
    subLabel: "Academic Divisions",
    count: 5,
  },
  {
    key: "programmes",
    label: "Programmes",
    subLabel: "Degrees & Majors",
    count: 4,
  },
  { key: "batches", label: "Batches", subLabel: "Academic Batches", count: 6 },
  { key: "courses", label: "Courses", subLabel: "Course Catalog", count: 6 },
  {
    key: "psos",
    label: "PSOs",
    subLabel: "Programme Specific Outcomes",
    count: 6,
  },
];

const STATUS_OPTIONS = [
  { value: "all_status", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ADD_LABELS: Record<string, string> = {
  departments: "Add Department",
  programmes: "Add Programme",
  batches: "Add Batch",
  courses: "Add Courses",
  psos: "Add PSO",
};

const AcademicSetup = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    activeTab: "courses",
    search: "",
    statusFilter: "All Statuses",
    deptFilter: "All Departments",
    loading: false,
    showModal: false,
    editRow: null as any,
  });

  useEffect(() => {
    dispatch(setPageTitle("Academic Setup"));
  }, []);

  // ── filter helpers ─────────────────────────────────────────────────────────
  const bySearch = (row: any, keys: string[]) => {
    const s = state.search.toLowerCase();
    return (
      !s ||
      keys.some((k) =>
        String(row[k] ?? "")
          .toLowerCase()
          .includes(s)
      )
    );
  };
  const byStatus = (row: any) =>
    state.statusFilter === "All Statuses" || row.status === state.statusFilter;
  const byDept = (row: any) =>
    state.deptFilter === "All Departments" ||
    row.department === state.deptFilter;

  // ── modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => setState({ showModal: true, editRow: null });
  const openEdit = (row: any) => setState({ showModal: true, editRow: row });
  const closeModal = () => setState({ showModal: false, editRow: null });

  // ── per-tab config ─────────────────────────────────────────────────────────
  const TAB_CONFIG: Record<
    string,
    { records: any[]; columns: any[]; noRecordsText: string }
  > = {
    departments: {
      records: MOCK_DEPARTMENTS.filter(
        (r) => bySearch(r, ["code", "name"]) && byStatus(r)
      ),
      columns: makeDepartmentColumns(openEdit, () => {}),
      noRecordsText: "No departments found",
    },
    programmes: {
      records: MOCK_PROGRAMMES.filter(
        (r) => bySearch(r, ["code", "name"]) && byStatus(r)
      ),
      columns: makeProgrammeColumns(openEdit, () => {}),
      noRecordsText: "No programmes found",
    },
    batches: {
      records: MOCK_BATCHES.filter(
        (r) => bySearch(r, ["code", "name"]) && byStatus(r)
      ),
      columns: makeBatchColumns(openEdit, () => {}),
      noRecordsText: "No batches found",
    },
    courses: {
      records: MOCK_COURSES.filter(
        (r) => bySearch(r, ["code", "title"]) && byStatus(r) && byDept(r)
      ),
      columns: makeCourseColumns(openEdit, () => {}),
      noRecordsText: "No courses found",
    },
    psos: {
      records: MOCK_PSOS.filter(
        (r) => bySearch(r, ["code", "programme", "description"]) && byStatus(r)
      ),
      columns: makePSOColumns(openEdit, () => {}),
      noRecordsText: "No PSOs found",
    },
  };

  const current = TAB_CONFIG[state.activeTab];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Academic Setup"
        description="Manage core academic master data including Departments, Programmes, Batches, Courses, and Programme Specific Outcomes (PSOs)."
        icon={<Settings className="text-color2 h-7 w-7" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Add button */}
      <div className="mb-5 flex justify-end">
        <button
          onClick={openCreate}
          className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-8 py-2 text-sm text-white shadow"
        >
          <IconPlus className="h-4 w-4" />
          {ADD_LABELS[state.activeTab]}
        </button>
      </div>

      {/* Modals — open for create (editRow=null) or edit (editRow=row) */}
      <CreateCourseModal
        open={state.showModal && state.activeTab === "courses"}
        onClose={closeModal}
        initialData={state.editRow}
      />
      <CreateDepartmentModal
        open={state.showModal && state.activeTab === "departments"}
        onClose={closeModal}
        initialData={state.editRow}
      />
      <CreateProgrammeModal
        open={state.showModal && state.activeTab === "programmes"}
        onClose={closeModal}
        initialData={state.editRow}
      />
      <CreateBatchModal
        open={state.showModal && state.activeTab === "batches"}
        onClose={closeModal}
        initialData={state.editRow}
      />
      <CreatePSOModal
        open={state.showModal && state.activeTab === "psos"}
        onClose={closeModal}
        initialData={state.editRow}
      />

      {/* Stat Tab Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {TABS.map((tab) => (
          <StatTabCard
            key={tab.key}
            icon={<Home className="h-5 w-5" />}
            label={tab.label}
            subLabel={tab.subLabel}
            count={tab.count}
            active={state.activeTab === tab.key}
            onClick={() =>
              setState({
                activeTab: tab.key,
                search: "",
                statusFilter: "All Statuses",
                deptFilter: "All Departments",
              })
            }
          />
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700">
        <div className="relative max-w-[300px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            placeholder={`Search ${state.activeTab}...`}
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="border-input w-full rounded-lg border bg-[#fff] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={
              STATUS_OPTIONS.find((o) => o.label === state.statusFilter) ?? null
            }
            onChange={(e) =>
              setState({ statusFilter: e?.label ?? "All Statuses" })
            }
            placeholder="All Status"
            className="filter-input"
          />

          {state.activeTab === "courses" && (
            <CustomSelect
              options={[
                { value: "All Departments", label: "All Departments" },
                { value: "CSE", label: "CSE" },
                { value: "ECE", label: "ECE" },
                { value: "AI", label: "AI" },
              ]}
              value={{ value: state.deptFilter, label: state.deptFilter }}
              onChange={(e) =>
                setState({ deptFilter: e?.value ?? "All Departments" })
              }
              placeholder="All Departments"
              className="filter-input"
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <TableComponent
          records={current.records}
          columns={current.columns}
          loading={state.loading}
          noRecordsText={current.noRecordsText}
        />
      </div>
    </div>
  );
};

export default PrivateRouter(AcademicSetup);
