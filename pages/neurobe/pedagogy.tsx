import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Lightbulb, BookOpen, Layers, Laptop, Check, Pause, Hourglass } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StepHeader from "@/components/academic-setup/StepHeader";
import StatTabCard from "@/components/academic-setup/StatTabCard";

 const TABS = [
    { key: "approved-topics", label: "Approved Topics", count: 5, icon: <Check className="h-5 w-5" /> },
    
    { key: "pedagogy-recommendations", label: "Pending Pedagogy Recommendations", subLabel: "Pending Pedagogy Recommendations", count: 4, icon: <Hourglass className="h-5 w-5" /> },
  ];

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
      <CourseBanner
        courseCode="CS301"
        courseTitle="Computer Networks"
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme="B.Tech CSE"
        batch="2025–2029"
        academicYear="2026–2027 / Semester 3"
        students="40 Students"
        selectedCourse="CS309"
        courseOptions={[
          { value: "CS309", label: "Course: CS309" },
          { value: "CS301", label: "Course: CS301" },
        ]}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeTab}
        onBack={() => console.log("back")}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      <StepHeader
        title="Pedagogy"
        description="Choose suitable teaching methods for the approved topics."
        pill="CS309 — Computer Networks"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {TABS.map((tab) => (
          <StatTabCard
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            subLabel={tab.subLabel}
            count={tab.count}
            active={state.activeTab === tab.key}
          />
        ))}
      </div>

      
    </div>
  );
};

export default PrivateRouter(Pedagogy);
