import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BookOpen, Layers, CheckCircle2, Clock } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_SYLLABUS_UNITS = [
  {
    id: 1,
    unitNumber: "Unit I",
    title: "Linear Data Structures - Stacks and Queues",
    courseCode: "CS301",
    courseTitle: "Data Structures & Algorithms",
    hours: 9,
    coTarget: "CO1, CO2",
    status: "Approved",
  },
  {
    id: 2,
    unitNumber: "Unit II",
    title: "Non-Linear Data Structures - Trees & Binary Search Trees",
    courseCode: "CS301",
    courseTitle: "Data Structures & Algorithms",
    hours: 10,
    coTarget: "CO2, CO3",
    status: "Approved",
  },
  {
    id: 3,
    unitNumber: "Unit III",
    title: "Graph Algorithms - Traversal, Shortest Path & Spanning Trees",
    courseCode: "CS301",
    courseTitle: "Data Structures & Algorithms",
    hours: 9,
    coTarget: "CO3, CO4",
    status: "Approved",
  },
  {
    id: 4,
    unitNumber: "Unit IV",
    title: "Sorting, Searching & Hashing Techniques",
    courseCode: "CS301",
    courseTitle: "Data Structures & Algorithms",
    hours: 8,
    coTarget: "CO4, CO5",
    status: "Draft",
  },
  {
    id: 5,
    unitNumber: "Unit V",
    title: "Algorithm Design Paradigms - Greedy & Dynamic Programming",
    courseCode: "CS301",
    courseTitle: "Data Structures & Algorithms",
    hours: 9,
    coTarget: "CO5",
    status: "Draft",
  },
];

const COURSE_OPTIONS = [
  { value: "all", label: "All Courses" },
  { value: "CS301", label: "CS301 - Data Structures & Algorithms" },
  { value: "CS402", label: "CS402 - Database Management Systems" },
  { value: "AI201", label: "AI201 - Intro to Artificial Intelligence" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Approved", label: "Approved" },
  { value: "Draft", label: "Draft" },
];

const Syllabus = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    courseFilter: "all",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Syllabus Management"));
  }, [dispatch]);

  const filteredRecords = MOCK_SYLLABUS_UNITS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.unitNumber.toLowerCase().includes(s) ||
      row.title.toLowerCase().includes(s) ||
      row.courseCode.toLowerCase().includes(s);
    const matchCourse =
      state.courseFilter === "all" || row.courseCode === state.courseFilter;
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  const columns = [
    {
      accessor: "unitNumber",
      title: "UNIT",
      render: ({ unitNumber }: any) => (
        <span className="font-bold text-[#7c3aed]">{unitNumber}</span>
      ),
    },
    {
      accessor: "title",
      title: "UNIT TITLE & DESCRIPTION",
      render: ({ title, courseCode, courseTitle }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500">
            {courseCode} - {courseTitle}
          </p>
        </div>
      ),
    },
    {
      accessor: "hours",
      title: "CONTACT HOURS",
      render: ({ hours }: any) => (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          {hours} Hours
        </span>
      ),
    },
    {
      accessor: "coTarget",
      title: "MAPPED COS",
      render: ({ coTarget }: any) => (
        <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {coTarget}
        </span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            status === "Approved"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "Approved" ? "bg-green-500" : "bg-amber-400"
            }`}
          />
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Syllabus Management"
        description="Structure course syllabus by defining modular units, lecture hours breakdown, intended Course Outcomes (COs), and reference materials."
        icon={<BookOpen className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Header action button */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Add Syllabus Unit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Units</span>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">5 Units</p>
          <span className="text-xs text-gray-400">Standard 45 Hours</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Approved Units</span>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <span className="text-xs text-green-600">60% Complete</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Hours</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">45 Hrs</p>
          <span className="text-xs text-gray-400">Instructional Hours</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">COs Covered</span>
            <BookOpen className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">5 COs</p>
          <span className="text-xs text-amber-600">Full Alignment</span>
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
            placeholder="Search units, topics..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={COURSE_OPTIONS}
            value={
              COURSE_OPTIONS.find((o) => o.value === state.courseFilter) ?? null
            }
            onChange={(e) => setState({ courseFilter: e?.value ?? "all" })}
            placeholder="All Courses"
            className="filter-input"
          />
          <CustomSelect
            options={STATUS_OPTIONS}
            value={
              STATUS_OPTIONS.find((o) => o.value === state.statusFilter) ?? null
            }
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
          noRecordsText="No syllabus units found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(Syllabus);

