import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Award, Target, CheckCircle2, TrendingUp } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_ATTAINMENTS = [
  {
    id: 1,
    coCode: "CO1",
    statement: "Understand the fundamentals of linear and non-linear data structures.",
    target: "70.0%",
    directAttainment: "84.5%",
    indirectAttainment: "88.0%",
    overallAttainment: "85.2%",
    level: 3,
    status: "Attained",
  },
  {
    id: 2,
    coCode: "CO2",
    statement: "Apply appropriate data structures for problem solving and algorithm design.",
    target: "70.0%",
    directAttainment: "78.2%",
    indirectAttainment: "82.5%",
    overallAttainment: "79.1%",
    level: 3,
    status: "Attained",
  },
  {
    id: 3,
    coCode: "CO3",
    statement: "Analyze the time and space complexity of fundamental algorithms.",
    target: "70.0%",
    directAttainment: "72.4%",
    indirectAttainment: "76.0%",
    overallAttainment: "73.1%",
    level: 2,
    status: "Attained",
  },
  {
    id: 4,
    coCode: "CO4",
    statement: "Design efficient searching, sorting, and graph traversal solutions.",
    target: "70.0%",
    directAttainment: "68.5%",
    indirectAttainment: "74.0%",
    overallAttainment: "69.6%",
    level: 2,
    status: "Partially Attained",
  },
  {
    id: 5,
    coCode: "CO5",
    statement: "Formulate algorithmic strategies to address complex computing problems.",
    target: "70.0%",
    directAttainment: "74.8%",
    indirectAttainment: "80.0%",
    overallAttainment: "75.8%",
    level: 3,
    status: "Attained",
  },
];

const COURSE_OPTIONS = [
  { value: "CS301", label: "CS301 - Data Structures & Algorithms" },
  { value: "CS402", label: "CS402 - Database Management Systems" },
  { value: "AI201", label: "AI201 - Artificial Intelligence" },
];

const COPOAttainment = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    selectedCourse: "CS301",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("CO-PO Attainment"));
  }, [dispatch]);

  const filteredRecords = MOCK_ATTAINMENTS.filter((row) => {
    const s = state.search.toLowerCase();
    return (
      !s ||
      row.coCode.toLowerCase().includes(s) ||
      row.statement.toLowerCase().includes(s)
    );
  });

  const columns = [
    {
      accessor: "coCode",
      title: "CO",
      render: ({ coCode }: any) => (
        <span className="font-bold text-[#7c3aed]">{coCode}</span>
      ),
    },
    {
      accessor: "statement",
      title: "COURSE OUTCOME STATEMENT",
      render: ({ statement }: any) => (
        <span className="text-xs text-gray-800 dark:text-gray-200">{statement}</span>
      ),
    },
    {
      accessor: "target",
      title: "TARGET SET",
      render: ({ target }: any) => (
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{target}</span>
      ),
    },
    {
      accessor: "directAttainment",
      title: "DIRECT ATTAINMENT (80%)",
      render: ({ directAttainment }: any) => (
        <span className="font-medium text-blue-600">{directAttainment}</span>
      ),
    },
    {
      accessor: "indirectAttainment",
      title: "INDIRECT ATTAINMENT (20%)",
      render: ({ indirectAttainment }: any) => (
        <span className="font-medium text-purple-600">{indirectAttainment}</span>
      ),
    },
    {
      accessor: "overallAttainment",
      title: "OVERALL (%)",
      render: ({ overallAttainment }: any) => (
        <span className="font-bold text-gray-900 dark:text-white">{overallAttainment}</span>
      ),
    },
    {
      accessor: "level",
      title: "LEVEL (1-3)",
      render: ({ level }: any) => (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 font-bold text-[#7c3aed] text-xs">
          {level}
        </span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        const isAttained = status === "Attained";
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isAttained ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAttained ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="CO-PO Attainment Computation"
        description="Compute, analyze, and document Direct (CIA + Assignments + End Sem) and Indirect (Course Exit Surveys) Course Outcome attainments."
        icon={<Award className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Course Selection */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-white">Selected Course:</span>
          <div className="w-80">
            <CustomSelect
              options={COURSE_OPTIONS}
              value={COURSE_OPTIONS.find((o) => o.value === state.selectedCourse) ?? null}
              onChange={(e) => setState({ selectedCourse: e?.value ?? "CS301" })}
              placeholder="Select Course"
            />
          </div>
        </div>

        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          Calculate Attainment Matrix
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Average CO Attainment</span>
          <p className="mt-2 text-2xl font-bold text-green-600">76.6%</p>
          <span className="text-xs text-green-600">Target: 70.0% Met</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Attained COs</span>
          <p className="mt-2 text-2xl font-bold text-purple-600">4 / 5</p>
          <span className="text-xs text-purple-600">80% Fully Achieved</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Direct vs Indirect Weight</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">80:20</p>
          <span className="text-xs text-gray-400">Institutional Ratio</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Overall Course Level</span>
          <p className="mt-2 text-2xl font-bold text-[#7c3aed]">2.8 / 3.0</p>
          <span className="text-xs text-[#7c3aed]">High Attainment</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex max-w-[300px] items-center">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search COs..."
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
          noRecordsText="No attainment records found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(COPOAttainment);

