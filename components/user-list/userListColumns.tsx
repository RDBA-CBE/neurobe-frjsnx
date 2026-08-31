import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";
import IconEye from "@/components/Icon/IconEye";

// ─── Shared cells ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
];

const getColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const AvatarCell = ({ name, sub }: { name: string; sub: string }) => (
  <div className="flex items-center gap-2.5">
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getColor(name)}`}>
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{name}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  </div>
);

const RoleBadge = ({ role }: { role: string }) => {
  const map: Record<string, string> = {
    "Course Coordinator": "bg-purple-50 text-purple-700",
    "Course Instructor":  "bg-blue-50 text-blue-700",
    "Student":            "bg-gray-100 text-[#000]",
    "ERP Admin":          "bg-orange-50 text-orange-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[role] ?? "bg-gray-100 text-[#000]"}`}>
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
    status === "Active"   ? "bg-green-50 text-green-700" :
    status === "Inactive" ? "bg-red-50 text-red-600"     :
    status === "Locked"   ? "bg-yellow-50 text-yellow-700" :
    "bg-gray-100 text-[#000]"
  }`}>
    <span className={`h-1.5 w-1.5 rounded-full ${
      status === "Active"   ? "bg-green-500"  :
      status === "Inactive" ? "bg-red-400"    :
      status === "Locked"   ? "bg-yellow-500" : "bg-gray-400"
    }`} />
    {status}
  </span>
);

const TypeBadge = ({ type }: { type: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
    type === "Faculty / Staff" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-[#000]"
  }`}>
    {type}
  </span>
);

// ─── Mock data ────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1,  name: "Arun Kumar",        sub: "Joined 2022",  email: "arun.kumar@karpagam.edu",      regNo: "FAC-CSE-038", role: "Course Coordinator", department: "Computer Science & Eng...", programme: "B.E. Computer Science...", batch: "Faculty / Staff", status: "Active",   type: "Faculty / Staff" },
  { id: 2,  name: "Priya Selvan",      sub: "Joined 2021",  email: "priya.selvan@karpagam.edu",    regNo: "FAC-CSE-042", role: "Course Instructor",  department: "Computer Science & Eng...", programme: "B.E. Computer Science...", batch: "Faculty / Staff", status: "Active",   type: "Faculty / Staff" },
  { id: 3,  name: "Kevin Raj",         sub: "Joined 2023",  email: "kevin.raj@karpagam.edu",       regNo: "FAC-CSE-044", role: "Student",            department: "Computer Science & Eng...", programme: "B.E. Computer Science...", batch: "2023-2026",       status: "Active",   type: "Student" },
  { id: 4,  name: "Nivetha Krishnan",  sub: "Joined 2022",  email: "nivetha.krishnan@karpag...",   regNo: "24C0068",     role: "Student",            department: "Computer Science & Eng...", programme: "B.E. Computer Science...", batch: "2024-2028",       status: "Active",   type: "Student" },
  { id: 5,  name: "Sanjay Murugan",    sub: "Joined 2022",  email: "sanjay.murugan@karpagam...",   regNo: "FAC-ADS-002", role: "Course Coordinator", department: "Artificial Intelligence & D...", programme: "D.Tech Artificial Intelligen...", batch: "Faculty / Staff", status: "Inactive", type: "Faculty / Staff" },
  { id: 6,  name: "Harini Ramesh",     sub: "Joined 2023",  email: "harini.ramesh@student.ka...",  regNo: "23A1019",     role: "Student",            department: "Artificial Intelligence & D...", programme: "D.Tech Artificial Intelligen...", batch: "2023-2027",       status: "Locked",   type: "Student" },
  { id: 7,  name: "Vignesh Kumar",     sub: "Joined 2021",  email: "vignesh.kumar@karpagam...",    regNo: "FAC-BCE-031", role: "Course Coordinator", department: "Electronics & Communica...", programme: "B.E. Electronics & Comm...", batch: "Faculty / Staff", status: "Inactive", type: "Faculty / Staff" },
  { id: 8,  name: "Keerthana Kaveri",  sub: "Joined 2023",  email: "keerthana.kaveri@student...",  regNo: "22IT055",     role: "Student",            department: "Information Technology",       programme: "D.Tech Information Techn...", batch: "2022-2026",       status: "Active",   type: "Student" },
  { id: 9,  name: "Meena Subramanian", sub: "Joined 2020",  email: "meena.subramanian@karpag...",  regNo: "ADM-JRP-001", role: "ERP Admin",          department: "Academic Office & Exam...", programme: "Institutional Administration", batch: "Faculty / Staff", status: "Active",   type: "Faculty / Staff" },
];

// ─── Column definitions — defined outside <DataTable> ─────────────────────────
export const USER_LIST_COLUMNS = [
  {
    accessor: "name",
    title: "NAME / JOINED",
    render: ({ name, sub }: any) => <AvatarCell name={name} sub={sub} />,
  },
  {
    accessor: "email",
    title: "EMAIL",
    render: ({ email }: any) => (
      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span className="text-gray-400">✉</span> {email}
      </span>
    ),
  },
  {
    accessor: "regNo",
    title: "REGISTER NO.",
    render: ({ regNo }: any) => (
      <span className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">{regNo}</span>
    ),
  },
  {
    accessor: "role",
    title: "ROLE",
    render: ({ role }: any) => <RoleBadge role={role} />,
  },
  {
    accessor: "department",
    title: "DEPARTMENT",
    render: ({ department }: any) => (
      <span className="text-xs text-[#000] dark:text-gray-400">{department}</span>
    ),
  },
  {
    accessor: "programme",
    title: "PROGRAMME",
    render: ({ programme }: any) => (
      <span className="text-xs text-[#000] dark:text-gray-400">{programme}</span>
    ),
  },
  {
    accessor: "batch",
    title: "BATCH",
    render: ({ batch }: any) => (
      <span className="text-xs text-[#000] dark:text-gray-400">{batch}</span>
    ),
  },
  {
    accessor: "status",
    title: "STATUS",
    render: ({ status }: any) => <StatusBadge status={status} />,
  },
  {
    accessor: "type",
    title: "ACTIONS",
    render: ({ type }: any) => (
      <div className="flex items-center gap-2">
        <TypeBadge type={type} />
        <button className="text-gray-400 hover:text-[#7c3aed]" title="Edit"><IconEdit className="h-4 w-4" /></button>
        <button className="text-gray-400 hover:text-red-500" title="Delete"><IconTrash className="h-4 w-4" /></button>
      </div>
    ),
  },
];
