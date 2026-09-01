import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_LESSON_PLANS = [
  {
    id: 1,
    sessionNo: 1,
    unit: "Unit I",
    topic: "Introduction to Stacks & LIFO Principle",
    plannedDate: "2026-08-05",
    actualDate: "2026-08-05",
    pedagogy: "Chalk & Board + Animation",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 2,
    sessionNo: 2,
    unit: "Unit I",
    topic: "Array Implementation of Stacks & Operations",
    plannedDate: "2026-08-07",
    actualDate: "2026-08-07",
    pedagogy: "Live Coding Walkthrough",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 3,
    sessionNo: 3,
    unit: "Unit I",
    topic: "Infix to Postfix Expression Conversion Algorithm",
    plannedDate: "2026-08-10",
    actualDate: "2026-08-12",
    pedagogy: "Problem Solving Workshop",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 4,
    sessionNo: 4,
    unit: "Unit II",
    topic: "Binary Search Trees: Insertion & Search",
    plannedDate: "2026-08-14",
    actualDate: "-",
    pedagogy: "Interactive Visualizer",
    coMapped: "CO2",
    status: "In Progress",
  },
  {
    id: 5,
    sessionNo: 5,
    unit: "Unit II",
    topic: "Tree Deletion & AVL Tree Balancing",
    plannedDate: "2026-08-17",
    actualDate: "-",
    pedagogy: "Flipped Classroom",
    coMapped: "CO2",
    status: "Scheduled",
  },
];

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "Unit I", label: "Unit I - Stacks & Queues" },
  { value: "Unit II", label: "Unit II - Trees" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Scheduled", label: "Scheduled" },
];

const LessonPlan = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    unitFilter: "all",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Lesson Plan"));
  }, [dispatch]);

  const filteredRecords = MOCK_LESSON_PLANS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      String(row.sessionNo).includes(s) ||
      row.topic.toLowerCase().includes(s) ||
      row.pedagogy.toLowerCase().includes(s);
    const matchUnit = state.unitFilter === "all" || row.unit === state.unitFilter;
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchUnit && matchStatus;
  });

  const columns = [
    {
      accessor: "sessionNo",
      title: "SESSION #",
      render: ({ sessionNo }: any) => (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 font-bold text-[#7c3aed]">
          {sessionNo}
        </span>
      ),
    },
    {
      accessor: "topic",
      title: "TOPIC / ACTIVITY",
      render: ({ topic, unit, coMapped }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{topic}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{unit}</span>
            <span className="text-xs font-semibold text-[#7c3aed]">[{coMapped}]</span>
          </div>
        </div>
      ),
    },
    {
      accessor: "plannedDate",
      title: "PLANNED DATE",
      render: ({ plannedDate }: any) => (
        <span className="text-xs text-gray-700 dark:text-gray-300">{plannedDate}</span>
      ),
    },
    {
      accessor: "actualDate",
      title: "ACTUAL DATE",
      render: ({ actualDate }: any) => (
        <span className={`text-xs ${actualDate === "-" ? "text-gray-400" : "font-medium text-gray-800 dark:text-gray-200"}`}>
          {actualDate}
        </span>
      ),
    },
    {
      accessor: "pedagogy",
      title: "PEDAGOGY",
      render: ({ pedagogy }: any) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">{pedagogy}</span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        let badge = "bg-gray-100 text-gray-700";
        if (status === "Completed") badge = "bg-green-50 text-green-700";
        if (status === "In Progress") badge = "bg-blue-50 text-blue-700";
        if (status === "Scheduled") badge = "bg-amber-50 text-amber-700";

        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Session-wise Lesson Plan"
        description="Plan, track, and record session-by-session lesson delivery schedules, actual completion dates, mapped outcomes, and pedagogical methodologies."
        icon={<Calendar className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Add Lesson Session
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Planned</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">45 Sessions</p>
          <span className="text-xs text-gray-400">1 Semester Plan</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Delivered</span>
          <p className="mt-2 text-2xl font-bold text-green-600">3 Sessions</p>
          <span className="text-xs text-green-600">100% on schedule</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Upcoming This Week</span>
          <p className="mt-2 text-2xl font-bold text-purple-600">2 Sessions</p>
          <span className="text-xs text-purple-600">Ready</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Adherence Rate</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">96.5%</p>
          <span className="text-xs text-blue-600">Syllabus Pacing Index</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-[300px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search session or topic..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={UNIT_OPTIONS}
            value={UNIT_OPTIONS.find((o) => o.value === state.unitFilter) ?? null}
            onChange={(e) => setState({ unitFilter: e?.value ?? "all" })}
            placeholder="All Units"
            className="filter-input"
          />
          <CustomSelect
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((o) => o.value === state.statusFilter) ?? null}
            onChange={(e) => setState({ statusFilter: e?.value ?? "all" })}
            placeholder="All Statuses"
            className="filter-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <TableComponent
          records={filteredRecords}
          columns={columns}
          loading={state.loading}
          noRecordsText="No lesson plan sessions found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(LessonPlan);

