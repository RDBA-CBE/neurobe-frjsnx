import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { HelpCircle, Brain, BookOpen, Layers } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Define Abstract Data Type (ADT). List advantages of using Stacks in memory management.",
    unit: "Unit I",
    bloom: "K1 - Remember",
    marks: 2,
    coMapped: "CO1",
    difficulty: "Easy",
  },
  {
    id: 2,
    question: "Write an algorithm to evaluate postfix expressions using Stacks with complexity analysis.",
    unit: "Unit I",
    bloom: "K3 - Apply",
    marks: 8,
    coMapped: "CO1",
    difficulty: "Medium",
  },
  {
    id: 3,
    question: "Construct an AVL Tree for given sequence of elements and show single and double rotations.",
    unit: "Unit II",
    bloom: "K4 - Analyze",
    marks: 16,
    coMapped: "CO2",
    difficulty: "Hard",
  },
  {
    id: 4,
    question: "Compare and contrast BFS and DFS graph traversals in terms of memory consumption and optimality.",
    unit: "Unit III",
    bloom: "K4 - Analyze",
    marks: 8,
    coMapped: "CO3",
    difficulty: "Medium",
  },
  {
    id: 5,
    question: "Design an optimal dynamic programming solution for the 0/1 Knapsack Problem.",
    unit: "Unit V",
    bloom: "K6 - Create",
    marks: 16,
    coMapped: "CO5",
    difficulty: "Hard",
  },
];

const BLOOM_OPTIONS = [
  { value: "all", label: "All Bloom's Levels" },
  { value: "K1 - Remember", label: "K1 - Remember" },
  { value: "K2 - Understand", label: "K2 - Understand" },
  { value: "K3 - Apply", label: "K3 - Apply" },
  { value: "K4 - Analyze", label: "K4 - Analyze" },
  { value: "K5 - Evaluate", label: "K5 - Evaluate" },
  { value: "K6 - Create", label: "K6 - Create" },
];

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "Unit I", label: "Unit I" },
  { value: "Unit II", label: "Unit II" },
  { value: "Unit III", label: "Unit III" },
  { value: "Unit V", label: "Unit V" },
];

const QuestionBank = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    bloomFilter: "all",
    unitFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Question Bank"));
  }, [dispatch]);

  const filteredRecords = MOCK_QUESTIONS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.question.toLowerCase().includes(s) ||
      row.bloom.toLowerCase().includes(s) ||
      row.difficulty.toLowerCase().includes(s);
    const matchBloom =
      state.bloomFilter === "all" || row.bloom === state.bloomFilter;
    const matchUnit =
      state.unitFilter === "all" || row.unit === state.unitFilter;
    return matchSearch && matchBloom && matchUnit;
  });

  const columns = [
    {
      accessor: "question",
      title: "QUESTION DESCRIPTION",
      render: ({ question, unit }: any) => (
        <div className="max-w-lg">
          <p className="font-medium text-gray-900 dark:text-white leading-relaxed">
            {question}
          </p>
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      ),
    },
    {
      accessor: "marks",
      title: "MARKS",
      render: ({ marks }: any) => (
        <span className="inline-flex rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
          {marks} Marks
        </span>
      ),
    },
    {
      accessor: "bloom",
      title: "BLOOM'S TAXONOMY",
      render: ({ bloom }: any) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {bloom}
        </span>
      ),
    },
    {
      accessor: "coMapped",
      title: "CO",
      render: ({ coMapped }: any) => (
        <span className="font-bold text-[#7c3aed]">{coMapped}</span>
      ),
    },
    {
      accessor: "difficulty",
      title: "DIFFICULTY",
      render: ({ difficulty }: any) => {
        let style = "bg-green-50 text-green-700";
        if (difficulty === "Medium") style = "bg-amber-50 text-amber-700";
        if (difficulty === "Hard") style = "bg-red-50 text-red-700";

        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
            {difficulty}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Question Bank Repository"
        description="Comprehensive bank of multi-tier assessment questions categorized by Bloom's cognitive taxonomy levels, Course Outcomes (COs), and difficulty ratings."
        icon={<HelpCircle className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Questions</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">128</p>
          <span className="text-xs text-purple-600">Across 5 Units</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Higher Order (K4-K6)</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">42%</p>
          <span className="text-xs text-blue-600">NBA Criteria Met</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">2-Mark Questions</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">60</p>
          <span className="text-xs text-gray-400">Part-A Pool</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">16-Mark Questions</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">48</p>
          <span className="text-xs text-gray-400">Part-B & C Pool</span>
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
            placeholder="Search questions..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={BLOOM_OPTIONS}
            value={
              BLOOM_OPTIONS.find((o) => o.value === state.bloomFilter) ?? null
            }
            onChange={(e) => setState({ bloomFilter: e?.value ?? "all" })}
            placeholder="All Bloom's Levels"
            className="filter-input"
          />
          <CustomSelect
            options={UNIT_OPTIONS}
            value={
              UNIT_OPTIONS.find((o) => o.value === state.unitFilter) ?? null
            }
            onChange={(e) => setState({ unitFilter: e?.value ?? "all" })}
            placeholder="All Units"
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
          noRecordsText="No questions found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(QuestionBank);

