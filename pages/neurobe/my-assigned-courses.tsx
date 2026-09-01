import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";
import { BookOpen, User2Icon } from "lucide-react";
import CourseCard from "@/components/academic-setup/CourseCard";

const MOCK_ASSIGNED_COURSES = [
  {
    id: 1,
    code: "CS301",
    title: "Data Structures & Algorithms",
    programme: "B.E. Computer Science",
    batch: "2023-2027",
    semester: "Semester 5",
    credits: 4,
    studentsCount: 64,
    role: "Course Coordinator & Instructor",
    status: "Active",
  },
  {
    id: 2,
    code: "CS402",
    title: "Database Management Systems",
    programme: "B.E. Computer Science",
    batch: "2023-2027",
    semester: "Semester 5",
    credits: 3,
    studentsCount: 62,
    role: "Course Instructor",
    status: "Active",
  },
  {
    id: 3,
    code: "AI201",
    title: "Introduction to Artificial Intelligence",
    programme: "B.Tech AI & DS",
    batch: "2024-2028",
    semester: "Semester 3",
    credits: 4,
    studentsCount: 58,
    role: "Course Coordinator & Instructor",
    status: "Active",
  },
  {
    id: 4,
    code: "CS504",
    title: "Cloud Computing Architectures",
    programme: "B.E. Computer Science",
    batch: "2022-2026",
    semester: "Semester 7",
    credits: 3,
    studentsCount: 55,
    role: "Course Instructor",
    status: "Completed",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
];

const PROGRAMME_OPTIONS = [
  { value: "all", label: "All Programmes" },
  { value: "B.E. Computer Science", label: "B.E. Computer Science" },
  { value: "B.Tech AI & DS", label: "B.Tech AI & DS" },
];

const MOCK_CARDS = [
  {
    isNew: true,
    code: "CS301",
    credits: "4 Credits • L-3 : T-0 : P-2",
    role: "Coordinator + Instructor",
    title: "Computer Networks",
    programme: "B.Tech CSE",
    batch: "2025-2029",
    term: "Semester 3",
    students: "43 Students",
    prepItems: [
      { label: "SYLLABUS", status: "not_started" as const },
      { label: "CO-PO MAPPING", status: "not_started" as const },
      { label: "TOPICS", status: "not_started" as const },
      { label: "PEDAGOGY", status: "not_started" as const },
      { label: "LESSON PLAN", status: "not_started" as const },
      { label: "LEARNING MATERIALS", status: "not_started" as const },
      { label: "QUESTION BANK", status: "not_started" as const },
      { label: "CIA QUESTION PAPER", status: "not_started" as const },
    ],
    nextAction: "Upload Syllabus",
    instructors:
      "Instructors: Arun Kumar (Coordinator), Priya Selvam (Instructor)",
    actionLabel: "Start Course Preparation",
  },
  {
    code: "CS201",
    credits: "4 Credits • L-3 : T-0 : P-2",
    role: "Coordinator + Instructor",
    title: "Data Structures",
    readiness: "78%",
    programme: "B.Tech CSE",
    batch: "2025-2029 Batch",
    term: "Semester 3",
    students: "41 Students",
    prepItems: [
      { label: "SYLLABUS", status: "approved" as const },
      { label: "CO-PO MAPPING", status: "review" as const },
      { label: "TOPICS", status: "approved" as const },
      { label: "PEDAGOGY", status: "approved" as const },
      { label: "LESSON PLAN", status: "draft" as const },
      {
        label: "QUESTION BANK",
        status: "approved" as const,
        extra: "68 Questions",
      },
      { label: "LEARNING MATERIALS", status: "draft" as const },
      { label: "CIA", status: "draft" as const },
    ],
    nextAction: "Review CO-PO mapping",
    instructors:
      "Instructors: Arun Kumar (Coordinator), Priya Selvam (Instructor)",
    actionLabel: "Enter Course Workspace",
  },
];

const MyAssignedCourses = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    programmeFilter: "all",
    loading: false,
    type: "all_semester",
  });

  useEffect(() => {
    dispatch(setPageTitle("My Assigned Courses"));
  }, [dispatch]);

  const filteredRecords = MOCK_ASSIGNED_COURSES.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.code.toLowerCase().includes(s) ||
      row.title.toLowerCase().includes(s) ||
      row.programme.toLowerCase().includes(s);
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    const matchProg =
      state.programmeFilter === "all" ||
      row.programme === state.programmeFilter;
    return matchSearch && matchStatus && matchProg;
  });

  const columns = [
    {
      accessor: "code",
      title: "COURSE CODE",
      render: ({ code }: any) => (
        <span className="font-semibold text-[#7c3aed]">{code}</span>
      ),
    },
    {
      accessor: "title",
      title: "COURSE TITLE",
      render: ({ title, programme }: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500">{programme}</p>
        </div>
      ),
    },
    {
      accessor: "batch",
      title: "BATCH & SEMESTER",
      render: ({ batch, semester }: any) => (
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-200">{batch}</p>
          <span className="text-xs text-gray-400">{semester}</span>
        </div>
      ),
    },
    {
      accessor: "credits",
      title: "CREDITS",
      render: ({ credits }: any) => (
        <span className="inline-flex rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {credits} Credits
        </span>
      ),
    },
    {
      accessor: "studentsCount",
      title: "STUDENTS",
      render: ({ studentsCount }: any) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {studentsCount} Enrolled
        </span>
      ),
    },
    {
      accessor: "role",
      title: "MY ROLE",
      render: ({ role }: any) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {role}
        </span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            status === "Active"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "Active" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {status}
        </span>
      ),
    },
  ];

  const semester = [
    {
      label: "All Semsters",
      value: "all_semester",
    },
    {
      label: "Semester 3",
      value: "semester_3",
    },
    {
      label: "Semester 4",
      value: "semester_4",
    },
  ];

  const onAction=(data)=>{
    console.log("onAction", data)
    
  }

  return (
    <div className="min-h-screen">
      <PageBanner
        badges={[
          {
            label: "Course Coordinator",
            className: "bg-[#1244cc] text-white px-3.5 py-1 font-medium",
          },
          {
            label: "Instructor access included",
            dot: true,
            className:
              "bg-[#043e2e] text-[#10b981] border border-[#065f46] px-3.5 py-1 font-medium",
          },
        ]}
        title="My Assigned Courses"
        description="Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and classroom execution."
        stats={[
          { label: "COURSES", value: 2 },
          {
            label: "AVG READINESS",
            value: "80.5%",
            valueColor: "text-[#10b981]",
          },
          { label: "ENROLLED STUDENTS", value: 84 },
        ]}
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-[300px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by code, title..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="border-input w-full rounded-lg border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <p>Semester : </p>

          <div className="bg-sec-dark flex shrink-0 items-center gap-2 rounded-lg px-1 py-1">
            {semester.map((sem) => (
              <button
                key={sem.value}
                onClick={() => setState({ type: sem.value })}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  state.type === sem.value
                    ? "text-color2 rounded-lg bg-[#fff] shadow-sm"
                    : "hover:text-pri text-[#000] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {sem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="panel">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {MOCK_CARDS.map((card) => (
            <CourseCard key={card.code} {...card} onAction={()=>onAction(card)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivateRouter(MyAssignedCourses);
