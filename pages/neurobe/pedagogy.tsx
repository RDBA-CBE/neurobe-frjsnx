import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Lightbulb, BookOpen, Layers, Laptop } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_PEDAGOGY = [
  {
    id: 1,
    code: "PED-01",
    name: "Flipped Classroom & Pre-class Reading",
    category: "Active Learning",
    tools: "LMS Videos, Interactive Quizzes",
    mappedUnits: "Unit I, Unit II",
    usageCount: 12,
    status: "Active",
  },
  {
    id: 2,
    code: "PED-02",
    name: "Peer Instruction & Think-Pair-Share",
    category: "Collaborative Learning",
    tools: "PollEverywhere, Concept Tests",
    mappedUnits: "Unit I, Unit III",
    usageCount: 8,
    status: "Active",
  },
  {
    id: 3,
    code: "PED-03",
    name: "Hands-on Code Walkthrough & Debugging",
    category: "Experiential Learning",
    tools: "VS Code, GitHub Classrooms",
    mappedUnits: "Unit II, Unit IV",
    usageCount: 16,
    status: "Active",
  },
  {
    id: 4,
    code: "PED-04",
    name: "Case Study & Real-world System Architecture",
    category: "Problem-Based Learning",
    tools: "System Design Blueprints",
    mappedUnits: "Unit V",
    usageCount: 6,
    status: "Active",
  },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Active Learning", label: "Active Learning" },
  { value: "Collaborative Learning", label: "Collaborative Learning" },
  { value: "Experiential Learning", label: "Experiential Learning" },
  { value: "Problem-Based Learning", label: "Problem-Based Learning" },
];

const Pedagogy = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    categoryFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Pedagogy & Teaching Methodologies"));
  }, [dispatch]);

  const filteredRecords = MOCK_PEDAGOGY.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.code.toLowerCase().includes(s) ||
      row.name.toLowerCase().includes(s) ||
      row.tools.toLowerCase().includes(s);
    const matchCat =
      state.categoryFilter === "all" || row.category === state.categoryFilter;
    return matchSearch && matchCat;
  });

  const columns = [
    {
      accessor: "code",
      title: "METHOD ID",
      render: ({ code }: any) => (
        <span className="font-bold text-[#7c3aed]">{code}</span>
      ),
    },
    {
      accessor: "name",
      title: "PEDAGOGY / METHODOLOGY NAME",
      render: ({ name, tools }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500">Tools: {tools}</p>
        </div>
      ),
    },
    {
      accessor: "category",
      title: "LEARNING CATEGORY",
      render: ({ category }: any) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {category}
        </span>
      ),
    },
    {
      accessor: "mappedUnits",
      title: "APPLICABLE UNITS",
      render: ({ mappedUnits }: any) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {mappedUnits}
        </span>
      ),
    },
    {
      accessor: "usageCount",
      title: "SESSIONS PLANNED",
      render: ({ usageCount }: any) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {usageCount} Sessions
        </span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Pedagogy & Teaching Strategies"
        description="Design and manage outcome-based teaching-learning pedagogical methods, collaborative techniques, active learning tools, and ICT-enabled delivery."
        icon={<Lightbulb className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Add Pedagogy Method
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Active Methods</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">4 Methods</p>
          <span className="text-xs text-green-600">OBE Aligned</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Active Learning</span>
          <p className="mt-2 text-2xl font-bold text-purple-600">65%</p>
          <span className="text-xs text-purple-600">Of Course Delivery</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">ICT Integration</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">100%</p>
          <span className="text-xs text-blue-600">Digital Tools Enabled</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Planned Sessions</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">42</p>
          <span className="text-xs text-gray-400">Recorded Sessions</span>
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
            placeholder="Search pedagogy methods..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <CustomSelect
            options={CATEGORY_OPTIONS}
            value={
              CATEGORY_OPTIONS.find((o) => o.value === state.categoryFilter) ??
              null
            }
            onChange={(e) =>
              setState({ categoryFilter: e?.value ?? "all" })
            }
            placeholder="All Categories"
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
          noRecordsText="No pedagogical methods found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(Pedagogy);

