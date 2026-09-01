import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BookOpen, Users, Clock, Award } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

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

const MyAssignedCourses = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    programmeFilter: "all",
    loading: false,
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
      state.programmeFilter === "all" || row.programme === state.programmeFilter;
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

  return (
    <div className="min-h-screen">
      <PageBanner
        title="My Assigned Courses"
        description="View and manage academic courses assigned to you as Course Coordinator or Instructor for current and previous academic terms."
        icon={<BookOpen className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Courses</span>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <span className="text-xs text-green-600">Current Semester</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Students</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">184</p>
          <span className="text-xs text-gray-400">Across 3 Batches</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Credit Load</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">11</p>
          <span className="text-xs text-gray-400">Credits / Week</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Coordinator Roles</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">2</p>
          <span className="text-xs text-emerald-600">Courses Lead</span>
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
            placeholder="Search by code, title..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={PROGRAMME_OPTIONS}
            value={
              PROGRAMME_OPTIONS.find((o) => o.value === state.programmeFilter) ??
              null
            }
            onChange={(e) =>
              setState({ programmeFilter: e?.value ?? "all" })
            }
            placeholder="All Programmes"
            className="filter-input"
          />
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
          noRecordsText="No assigned courses found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(MyAssignedCourses);

