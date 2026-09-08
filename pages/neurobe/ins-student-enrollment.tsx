import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserCheck, Users, GraduationCap, CheckCircle2 } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_ENROLLED_STUDENTS = [
  {
    id: 1,
    regNo: "717823P101",
    name: "Aadhavan K",
    email: "aadhavan.k@college.edu",
    section: "Section A",
    batch: "2023-2027",
    programme: "B.E. Computer Science",
    attendance: "94%",
    status: "Enrolled",
  },
  {
    id: 2,
    regNo: "717823P102",
    name: "Bhavana S",
    email: "bhavana.s@college.edu",
    section: "Section A",
    batch: "2023-2027",
    programme: "B.E. Computer Science",
    attendance: "88%",
    status: "Enrolled",
  },
  {
    id: 3,
    regNo: "717823P103",
    name: "Charan Kumar V",
    email: "charan.v@college.edu",
    section: "Section A",
    batch: "2023-2027",
    programme: "B.E. Computer Science",
    attendance: "78%",
    status: "Enrolled",
  },
  {
    id: 4,
    regNo: "717823P104",
    name: "Deepika R",
    email: "deepika.r@college.edu",
    section: "Section B",
    batch: "2023-2027",
    programme: "B.E. Computer Science",
    attendance: "96%",
    status: "Enrolled",
  },
  {
    id: 5,
    regNo: "717823P105",
    name: "Elango M",
    email: "elango.m@college.edu",
    section: "Section B",
    batch: "2023-2027",
    programme: "B.E. Computer Science",
    attendance: "64%",
    status: "Short Attendance",
  },
];

const SECTION_OPTIONS = [
  { value: "all", label: "All Sections" },
  { value: "Section A", label: "Section A" },
  { value: "Section B", label: "Section B" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Enrolled", label: "Enrolled" },
  { value: "Short Attendance", label: "Short Attendance" },
];

const StudentEnrollment = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    sectionFilter: "all",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Student Enrollment"));
  }, [dispatch]);

  const filteredRecords = MOCK_ENROLLED_STUDENTS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.regNo.toLowerCase().includes(s) ||
      row.name.toLowerCase().includes(s) ||
      row.email.toLowerCase().includes(s);
    const matchSection =
      state.sectionFilter === "all" || row.section === state.sectionFilter;
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchSection && matchStatus;
  });

  const columns = [
    {
      accessor: "regNo",
      title: "REGISTER NUMBER",
      render: ({ regNo }: any) => (
        <span className="font-bold text-[#7c3aed]">{regNo}</span>
      ),
    },
    {
      accessor: "name",
      title: "STUDENT NAME & EMAIL",
      render: ({ name, email }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      ),
    },
    {
      accessor: "section",
      title: "SECTION",
      render: ({ section, batch }: any) => (
        <div>
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{section}</span>
          <p className="text-[11px] text-gray-400">{batch}</p>
        </div>
      ),
    },
    {
      accessor: "attendance",
      title: "ATTENDANCE",
      render: ({ attendance }: any) => {
        const val = parseInt(attendance);
        const color = val >= 75 ? "text-green-600 font-bold" : "text-red-600 font-bold";
        return <span className={color}>{attendance}</span>;
      },
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        const isShort = status === "Short Attendance";
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isShort ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isShort ? "bg-red-500" : "bg-green-500"
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
        title="Student Enrollment & Sections"
        description="Manage enrolled students for assigned courses, manage section groupings, monitor course attendance thresholds, and track eligibility."
        icon={<UserCheck className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Enroll Student
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Enrolled</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">64</p>
          <span className="text-xs text-purple-600">Active Students</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Average Attendance</span>
          <p className="mt-2 text-2xl font-bold text-green-600">89.2%</p>
          <span className="text-xs text-green-600">Above Threshold</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Short Attendance (&lt;75%)</span>
          <p className="mt-2 text-2xl font-bold text-red-600">1</p>
          <span className="text-xs text-red-600">Needs Attention</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Sections</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">2</p>
          <span className="text-xs text-gray-400">Sec A &amp; Sec B</span>
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
            placeholder="Search student by name, reg no..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={SECTION_OPTIONS}
            value={
              SECTION_OPTIONS.find((o) => o.value === state.sectionFilter) ??
              null
            }
            onChange={(e) =>
              setState({ sectionFilter: e?.value ?? "all" })
            }
            placeholder="All Sections"
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
          noRecordsText="No students enrolled"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(StudentEnrollment);

