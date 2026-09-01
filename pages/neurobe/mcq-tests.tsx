import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CheckSquare, Clock, Users, Play, Award } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_MCQ_TESTS = [
  {
    id: 1,
    title: "Unit 1: Stacks & Queues Online Quiz",
    course: "CS301 - Data Structures & Algorithms",
    questionsCount: 20,
    totalMarks: 20,
    duration: "30 Mins",
    scheduledOn: "2026-08-18 10:00 AM",
    submissions: "62/64",
    avgScore: "16.8 / 20",
    status: "Completed",
  },
  {
    id: 2,
    title: "Binary Trees & Traversals Rapid Assessment",
    course: "CS301 - Data Structures & Algorithms",
    questionsCount: 15,
    totalMarks: 15,
    duration: "20 Mins",
    scheduledOn: "2026-09-02 02:00 PM",
    submissions: "0/64",
    avgScore: "-",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Graph Theory & Spanning Trees Test",
    course: "CS301 - Data Structures & Algorithms",
    questionsCount: 25,
    totalMarks: 25,
    duration: "40 Mins",
    scheduledOn: "2026-09-20 11:00 AM",
    submissions: "0/64",
    avgScore: "-",
    status: "Draft",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Completed", label: "Completed" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Draft", label: "Draft" },
];

const MCQTests = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("MCQ Tests"));
  }, [dispatch]);

  const filteredRecords = MOCK_MCQ_TESTS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.title.toLowerCase().includes(s) ||
      row.course.toLowerCase().includes(s);
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      accessor: "title",
      title: "TEST TITLE & COURSE",
      render: ({ title, course }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500">{course}</p>
        </div>
      ),
    },
    {
      accessor: "questionsCount",
      title: "QUESTIONS & MARKS",
      render: ({ questionsCount, totalMarks }: any) => (
        <span className="text-xs font-semibold text-[#7c3aed]">
          {questionsCount} Qs ({totalMarks} Marks)
        </span>
      ),
    },
    {
      accessor: "duration",
      title: "DURATION & SCHEDULE",
      render: ({ duration, scheduledOn }: any) => (
        <div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{scheduledOn}</p>
          <span className="text-[11px] text-gray-400">{duration}</span>
        </div>
      ),
    },
    {
      accessor: "submissions",
      title: "SUBMISSIONS",
      render: ({ submissions, avgScore }: any) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{submissions}</p>
          {avgScore !== "-" && <span className="text-[11px] text-green-600">Avg: {avgScore}</span>}
        </div>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        let badge = "bg-green-50 text-green-700";
        if (status === "Scheduled") badge = "bg-blue-50 text-blue-700";
        if (status === "Draft") badge = "bg-gray-100 text-gray-700";

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
        title="Online MCQ Tests & Quizzes"
        description="Design, conduct, schedule, and evaluate auto-graded online multiple choice tests, concept quizzes, and timed formative assessments."
        icon={<CheckSquare className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Create MCQ Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Quizzes</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">3 Tests</p>
          <span className="text-xs text-purple-600">Formative Cycle</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Avg Class Score</span>
          <p className="mt-2 text-2xl font-bold text-green-600">84%</p>
          <span className="text-xs text-green-600">High Attainment</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Participation</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">96.8%</p>
          <span className="text-xs text-blue-600">62/64 Submitted</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Next Test</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Sep 02</p>
          <span className="text-xs text-amber-600">In 24 Hours</span>
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
            placeholder="Search tests..."
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
          noRecordsText="No MCQ tests found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(MCQTests);

