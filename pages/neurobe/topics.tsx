import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ListFilter, Clock, CheckCircle2, BookOpen } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_TOPICS = [
  {
    id: 1,
    topicNumber: "1.1",
    title: "Introduction to Abstract Data Types & Stack ADT",
    unit: "Unit I",
    course: "CS301",
    plannedHours: 2,
    mode: "Chalk & Board + Live Coding",
    coTarget: "CO1",
    status: "Completed",
  },
  {
    id: 2,
    topicNumber: "1.2",
    title: "Array and Linked List Implementation of Stacks",
    unit: "Unit I",
    course: "CS301",
    plannedHours: 2,
    mode: "Interactive PPT",
    coTarget: "CO1",
    status: "Completed",
  },
  {
    id: 3,
    topicNumber: "1.3",
    title: "Infix, Prefix and Postfix Expressions & Conversions",
    unit: "Unit I",
    course: "CS301",
    plannedHours: 3,
    mode: "Problem Solving Workshop",
    coTarget: "CO1",
    status: "Completed",
  },
  {
    id: 4,
    topicNumber: "2.1",
    title: "Tree Terminologies & Binary Tree Properties",
    unit: "Unit II",
    course: "CS301",
    plannedHours: 2,
    mode: "Visual Simulators",
    coTarget: "CO2",
    status: "In Progress",
  },
  {
    id: 5,
    topicNumber: "2.2",
    title: "Binary Tree Traversals - Inorder, Preorder, Postorder",
    unit: "Unit II",
    course: "CS301",
    plannedHours: 3,
    mode: "Live Coding & Algorithm Analysis",
    coTarget: "CO2",
    status: "Pending",
  },
];

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "Unit I", label: "Unit I - Stacks & Queues" },
  { value: "Unit II", label: "Unit II - Trees" },
  { value: "Unit III", label: "Unit III - Graphs" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Pending", label: "Pending" },
];

const Topics = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    unitFilter: "all",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Topics"));
  }, [dispatch]);

  const filteredRecords = MOCK_TOPICS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.topicNumber.toLowerCase().includes(s) ||
      row.title.toLowerCase().includes(s) ||
      row.mode.toLowerCase().includes(s);
    const matchUnit = state.unitFilter === "all" || row.unit === state.unitFilter;
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchUnit && matchStatus;
  });

  const columns = [
    {
      accessor: "topicNumber",
      title: "TOPIC #",
      render: ({ topicNumber }: any) => (
        <span className="font-bold text-[#7c3aed]">{topicNumber}</span>
      ),
    },
    {
      accessor: "title",
      title: "TOPIC NAME",
      render: ({ title, unit }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      ),
    },
    {
      accessor: "plannedHours",
      title: "HOURS",
      render: ({ plannedHours }: any) => (
        <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          {plannedHours} Hrs
        </span>
      ),
    },
    {
      accessor: "mode",
      title: "DELIVERY MODE",
      render: ({ mode }: any) => (
        <span className="text-xs text-gray-700 dark:text-gray-300">{mode}</span>
      ),
    },
    {
      accessor: "coTarget",
      title: "MAPPED CO",
      render: ({ coTarget }: any) => (
        <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {coTarget}
        </span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        let badgeStyle = "bg-gray-100 text-gray-700";
        if (status === "Completed") badgeStyle = "bg-green-50 text-green-700";
        if (status === "In Progress") badgeStyle = "bg-blue-50 text-blue-700";
        if (status === "Pending") badgeStyle = "bg-amber-50 text-amber-700";

        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Topics Management"
        description="Organize modular topics and sub-topics per syllabus unit, planned instructional hours, delivery methodologies, and Course Outcomes."
        icon={<ListFilter className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Add Topic
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Topics</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">24 Topics</p>
          <span className="text-xs text-gray-400">Across 5 Units</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Completed Topics</span>
          <p className="mt-2 text-2xl font-bold text-green-600">14</p>
          <span className="text-xs text-green-600">58% Delivered</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Remaining Topics</span>
          <p className="mt-2 text-2xl font-bold text-amber-600">10</p>
          <span className="text-xs text-amber-600">On Track</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Hours</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">45 Hrs</p>
          <span className="text-xs text-purple-600">Full Coverage</span>
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
            placeholder="Search topics..."
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
          noRecordsText="No topics found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(Topics);

