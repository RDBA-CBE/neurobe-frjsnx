import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FileSpreadsheet, Eye, Printer, CheckCircle2, Clock } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_CIA_PAPERS = [
  {
    id: 1,
    title: "Continuous Internal Assessment I (CIA-I)",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    unitsCovered: "Unit I, Unit II",
    totalMarks: 50,
    examDate: "2026-09-15",
    duration: "90 Mins",
    status: "Approved",
  },
  {
    id: 2,
    title: "Continuous Internal Assessment II (CIA-II)",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    unitsCovered: "Unit III, Unit IV",
    totalMarks: 50,
    examDate: "2026-10-20",
    duration: "90 Mins",
    status: "Draft",
  },
  {
    id: 3,
    title: "Model Examination",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    unitsCovered: "Units I to V",
    totalMarks: 100,
    examDate: "2026-11-25",
    duration: "180 Mins",
    status: "Pending Review",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Approved", label: "Approved" },
  { value: "Draft", label: "Draft" },
  { value: "Pending Review", label: "Pending Review" },
];

const CIAQuestionPaper = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("CIA Question Paper"));
  }, [dispatch]);

  const filteredRecords = MOCK_CIA_PAPERS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.title.toLowerCase().includes(s) ||
      row.course.toLowerCase().includes(s) ||
      row.unitsCovered.toLowerCase().includes(s);
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      accessor: "title",
      title: "ASSESSMENT TITLE",
      render: ({ title, course }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500">{course}</p>
        </div>
      ),
    },
    {
      accessor: "unitsCovered",
      title: "SYLLABUS COVERAGE",
      render: ({ unitsCovered }: any) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {unitsCovered}
        </span>
      ),
    },
    {
      accessor: "totalMarks",
      title: "MAX MARKS",
      render: ({ totalMarks }: any) => (
        <span className="font-bold text-[#7c3aed]">{totalMarks} Marks</span>
      ),
    },
    {
      accessor: "examDate",
      title: "EXAM DATE & DURATION",
      render: ({ examDate, duration }: any) => (
        <div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{examDate}</p>
          <span className="text-[11px] text-gray-400">{duration}</span>
        </div>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        let badge = "bg-green-50 text-green-700";
        if (status === "Draft") badge = "bg-gray-100 text-gray-700";
        if (status === "Pending Review") badge = "bg-amber-50 text-amber-700";

        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessor: "actions",
      title: "ACTIONS",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded bg-purple-50 px-2 py-1 text-xs font-semibold text-[#7c3aed] hover:bg-purple-100">
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="CIA Question Paper Generator"
        description="Author, auto-generate, format, and manage Continuous Internal Assessment (CIA) and Model Exam question papers mapped to CO targets and Bloom's taxonomy weights."
        icon={<FileSpreadsheet className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Create New Question Paper
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Scheduled Exams</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">3 Papers</p>
          <span className="text-xs text-purple-600">Semester Cycle</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Approved Papers</span>
          <p className="mt-2 text-2xl font-bold text-green-600">1</p>
          <span className="text-xs text-green-600">HOD Signed</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Bloom's Check</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">100%</p>
          <span className="text-xs text-blue-600">OBE Verified</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Marks</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">200</p>
          <span className="text-xs text-gray-400">Total Internal Pool</span>
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
            placeholder="Search exam papers..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
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
          noRecordsText="No question papers found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(CIAQuestionPaper);

