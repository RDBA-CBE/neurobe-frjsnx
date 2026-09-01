import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BarChart3, TrendingUp, Award, Users } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_RESULTS = [
  {
    id: 1,
    assessment: "Continuous Internal Assessment I (CIA-I)",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    appeared: 64,
    passed: 60,
    passPercentage: "93.75%",
    highestScore: "49 / 50",
    averageScore: "38.2 / 50",
    status: "Published",
  },
  {
    id: 2,
    assessment: "Online MCQ Quiz 1",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    appeared: 62,
    passed: 59,
    passPercentage: "95.16%",
    highestScore: "20 / 20",
    averageScore: "16.8 / 20",
    status: "Published",
  },
  {
    id: 3,
    assessment: "Assignment 1: Stacks and ADT Design",
    course: "CS301 - Data Structures & Algorithms",
    batch: "2023-2027",
    appeared: 64,
    passed: 64,
    passPercentage: "100.0%",
    highestScore: "10 / 10",
    averageScore: "8.9 / 10",
    status: "Published",
  },
];

const ResultsAnalysis = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Results & Analysis"));
  }, [dispatch]);

  const filteredRecords = MOCK_RESULTS.filter((row) => {
    const s = state.search.toLowerCase();
    return (
      !s ||
      row.assessment.toLowerCase().includes(s) ||
      row.course.toLowerCase().includes(s)
    );
  });

  const columns = [
    {
      accessor: "assessment",
      title: "ASSESSMENT COMPONENT",
      render: ({ assessment, course }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{assessment}</p>
          <p className="text-xs text-gray-500">{course}</p>
        </div>
      ),
    },
    {
      accessor: "appeared",
      title: "APPEARED / ENROLLED",
      render: ({ appeared }: any) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">{appeared} Students</span>
      ),
    },
    {
      accessor: "passPercentage",
      title: "PASS RATE (%)",
      render: ({ passPercentage, passed, appeared }: any) => (
        <div>
          <span className="font-bold text-green-600">{passPercentage}</span>
          <p className="text-[11px] text-gray-400">
            {passed} of {appeared} Passed
          </p>
        </div>
      ),
    },
    {
      accessor: "averageScore",
      title: "AVERAGE SCORE",
      render: ({ averageScore }: any) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">{averageScore}</span>
      ),
    },
    {
      accessor: "highestScore",
      title: "TOP SCORE",
      render: ({ highestScore }: any) => (
        <span className="font-bold text-[#7c3aed]">{highestScore}</span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => (
        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Assessment Results & Performance Analysis"
        description="Analyze formative and summative assessment performance, grade distributions, pass percentages, statistical averages, and cohort benchmark comparisons."
        icon={<BarChart3 className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Overall Pass Rate</span>
          <p className="mt-2 text-2xl font-bold text-green-600">95.4%</p>
          <span className="text-xs text-green-600">+3.2% vs last term</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Class Average</span>
          <p className="mt-2 text-2xl font-bold text-purple-600">76.4%</p>
          <span className="text-xs text-purple-600">Target: 70%</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Distinction (Score &gt;80%)</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">28</p>
          <span className="text-xs text-blue-600">43.7% of cohort</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Remedial Required</span>
          <p className="mt-2 text-2xl font-bold text-amber-600">4</p>
          <span className="text-xs text-amber-600">Identified for Coaching</span>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="mb-4 flex max-w-[300px] items-center">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search assessments..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <TableComponent
          records={filteredRecords}
          columns={columns}
          loading={state.loading}
          noRecordsText="No results records found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(ResultsAnalysis);

