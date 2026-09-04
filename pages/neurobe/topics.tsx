import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ListFilter,
  Clock,
  CheckCircle2,
  BookOpen,
  Home,
  Check,
  Sparkles,
} from "lucide-react";
import AIGenerateModal from "@/components/common-components/AIGenerateModal";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import PageHeader from "@/components/common-components/PageHeader";
import ApprovedSyllabusTopics from "@/components/academic-setup/ApprovedSyllabusTopics";
import PageFooter from "@/components/common-components/PageFooter";

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
    showGenerateModal: false,
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
    const matchUnit =
      state.unitFilter === "all" || row.unit === state.unitFilter;
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
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const TABS = [
    {
      key: "departments",
      label: "Departments",
      subLabel: "Academic Divisions",
      count: 5,
    },
    {
      key: "programmes",
      label: "Programmes",
      subLabel: "Degrees & Majors",
      count: 4,
    },
    {
      key: "batches",
      label: "Batches",
      subLabel: "Academic Batches",
      count: 6,
    },
    { key: "courses", label: "Courses", subLabel: "Course Catalog", count: 6 },
    {
      key: "psos",
      label: "PSOs",
      subLabel: "Programme Specific Outcomes",
      count: 6,
    },
  ];
  const STEPS = [
    {
      title: "Analyzing Course Syllabus",
      description:
        "Deconstructing 5 syllabus units and 45 contact hours for CS309 — Computer Networks.",
    },
    {
      title: "Topic & Subtopic Decomposition",
      description: "Generating topics and granular subtopics for all 5 units.",
    },
    {
      title: "Knowledge Level Calibration",
      description:
        "Assigning Knowledge Levels (K1–K6) per topic based on complexity mapping.",
    },
    {
      title: "Contact Hour Allocation",
      description:
        "Balancing lecture hours across 45 total hours to fit university parameters.",
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
      <PageHeader
        title="Topics"
        subtitle="Create a detailed topic structure from the approved syllabus."
        icon={<BookOpen className="h-5 w-5 text-[#7c3aed]" />}
        records={`CS309 — Computer Networks`}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {TABS.map((tab) => (
          <StatTabCard
            key={tab.key}
            icon={<Home className="h-5 w-5" />}
            label={tab.label}
            subLabel={tab.subLabel}
            count={tab.count}
            active={state.activeTab === tab.key}
            onClick={() =>
              setState({
                activeTab: tab.key,
                search: "",
                statusFilter: "All Statuses",
                deptFilter: "All Departments",
              })
            }
          />
        ))}
      </div>
      <ApprovedSyllabusTopics courseCode="CS309" />

      <PageFooter
        batch={true}
        status={{ label: "Not Generated", color: "#f97316" }}
        content1="Course: CS309 — Computer Networks"
        actionBtn1={{
          label: "Generate Topic Hierarchy",
          icon: <Sparkles className="h-4 w-4" />,
          onClick: () => setState({ showGenerateModal: true }),

          className: "create-btn",
        }}
      />

      <AIGenerateModal
        open={state.showGenerateModal}
        onClose={() => setState({ showGenerateModal: false })}
        headerIcon={<Sparkles className="h-6 w-6 text-white" />}
        title="Generate Topics with NEURO AI"
        subtitle="CS309 — Computer Networks"
        cancelLabel="Cancel"
        actionLabel="Apply Topics"
        actionBgColor={"bg-color2"}
        onAction={() => setState({ showGenerateModal: false })}
        render={() => (
          <div className="bg-white px-6 py-5">
            {/* Progress */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#7c3aed]">
                  {"TOPICS GENERATED SUCCESSFULLY"}
                </span>
                <span className="text-sm font-bold text-[#7c3aed]">{50}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[#7c3aed] transition-all"
                  style={{ width: `${50}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 py-2">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-green-500 text-green-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
       
      />
    </div>
  );
};

export default PrivateRouter(Topics);
