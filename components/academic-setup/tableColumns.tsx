import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";

// ─── Shared action cell ───────────────────────────────────────────────────────
const ActionCell = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => (
  <div className="flex items-center gap-3">
    <button onClick={onEdit}   className="text-[#000] hover:text-[#7c3aed]"><IconEdit  className="h-4 w-4" /></button>
    <button onClick={onDelete} className="text-[#000] hover:text-red-500" ><IconTrash className="h-4 w-4" /></button>
  </div>
);

const StatusCell = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${status === "Active" ? "bg-green-500" : "bg-red-400"}`} />
    {status}
  </span>
);

const PurpleCode = ({ code }: { code: string }) => (
  <span className="font-medium text-[#7c3aed]">{code}</span>
);

const PurpleBadge = ({ value }: { value: number }) => (
  <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#ede9fe] px-1.5 text-xs font-bold text-[#7c3aed]">
    {value}
  </span>
);

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const MOCK_DEPARTMENTS = [
  { id: 1, code: "CSE", name: "Computer Science & Engineering", hod: "Dr. A. Kumar",  programmes: 3, status: "Active"   },
  { id: 2, code: "ECE", name: "Electronics & Communication",    hod: "Dr. B. Sharma", programmes: 2, status: "Active"   },
  { id: 3, code: "ME",  name: "Mechanical Engineering",         hod: "Dr. C. Patel",  programmes: 2, status: "Active"   },
  { id: 4, code: "CE",  name: "Civil Engineering",              hod: "Dr. D. Reddy",  programmes: 1, status: "Inactive" },
  { id: 5, code: "AI",  name: "Artificial Intelligence",        hod: "Dr. E. Nair",   programmes: 2, status: "Active"   },
];

export const makeDepartmentColumns = (onEdit: (r: any) => void, onDelete: (r: any) => void) => [
  { accessor: "code",       title: "CODE",             render: ({ code }: any)       => <PurpleCode code={code} /> },
  { accessor: "name",       title: "DEPARTMENT NAME",  render: ({ name }: any)       => <span className="text-[#000] dark:text-gray-200">{name}</span> },
  { accessor: "hod",        title: "HEAD OF DEPT",     render: ({ hod }: any)        => <span className="text-[#000] dark:text-[#000]">{hod}</span> },
  { accessor: "programmes", title: "PROGRAMMES",       render: ({ programmes }: any) => <PurpleBadge value={programmes} /> },
  { accessor: "status",     title: "STATUS",           render: ({ status }: any)     => <StatusCell status={status} /> },
  { accessor: "actions",    title: "ACTIONS",          render: (row: any)            => <ActionCell onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /> },
];

// ─── PROGRAMMES ───────────────────────────────────────────────────────────────
export const MOCK_PROGRAMMES = [
  { id: 1, code: "BTECH-CSE", name: "B.Tech Computer Science",        department: "CSE", duration: "4 Years", type: "UG", status: "Active"   },
  { id: 2, code: "BTECH-ECE", name: "B.Tech Electronics & Comm.",     department: "ECE", duration: "4 Years", type: "UG", status: "Active"   },
  { id: 3, code: "MTECH-AI",  name: "M.Tech Artificial Intelligence", department: "AI",  duration: "2 Years", type: "PG", status: "Active"   },
  { id: 4, code: "MBA",       name: "Master of Business Admin.",       department: "MBA", duration: "2 Years", type: "PG", status: "Inactive" },
];

export const makeProgrammeColumns = (onEdit: (r: any) => void, onDelete: (r: any) => void) => [
  { accessor: "code",       title: "CODE",           render: ({ code }: any)       => <PurpleCode code={code} /> },
  { accessor: "name",       title: "PROGRAMME NAME", render: ({ name }: any)       => <span className="text-[#000] dark:text-gray-200">{name}</span> },
  { accessor: "department", title: "DEPARTMENT",     render: ({ department }: any) => <span className="text-[#000] dark:text-[#000]">{department}</span> },
  { accessor: "duration",   title: "DURATION",       render: ({ duration }: any)   => <span className="text-[#000] dark:text-[#000]">{duration}</span> },
  { accessor: "type",       title: "TYPE",           render: ({ type }: any)       => (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{type}</span>
  )},
  { accessor: "status",  title: "STATUS",  render: ({ status }: any)  => <StatusCell status={status} /> },
  { accessor: "actions", title: "ACTIONS", render: (row: any)         => <ActionCell onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /> },
];

// ─── BATCHES ──────────────────────────────────────────────────────────────────
export const MOCK_BATCHES = [
  { id: 1, code: "B2021",  name: "Batch 2021-25", programme: "BTECH-CSE", startYear: 2021, endYear: 2025, students: 120, status: "Active"   },
  { id: 2, code: "B2022",  name: "Batch 2022-26", programme: "BTECH-CSE", startYear: 2022, endYear: 2026, students: 115, status: "Active"   },
  { id: 3, code: "B2023",  name: "Batch 2023-27", programme: "BTECH-ECE", startYear: 2023, endYear: 2027, students: 90,  status: "Active"   },
  { id: 4, code: "B2020",  name: "Batch 2020-24", programme: "BTECH-ME",  startYear: 2020, endYear: 2024, students: 80,  status: "Inactive" },
  { id: 5, code: "B2022M", name: "Batch 2022-24", programme: "MTECH-AI",  startYear: 2022, endYear: 2024, students: 40,  status: "Active"   },
  { id: 6, code: "B2023M", name: "Batch 2023-25", programme: "MTECH-AI",  startYear: 2023, endYear: 2025, students: 38,  status: "Active"   },
];

export const makeBatchColumns = (onEdit: (r: any) => void, onDelete: (r: any) => void) => [
  { accessor: "code",      title: "BATCH CODE", render: ({ code }: any)      => <PurpleCode code={code} /> },
  { accessor: "name",      title: "BATCH NAME", render: ({ name }: any)      => <span className="text-[#000] dark:text-gray-200">{name}</span> },
  { accessor: "programme", title: "PROGRAMME",  render: ({ programme }: any) => <span className="text-[#000] dark:text-[#000]">{programme}</span> },
  { accessor: "startYear", title: "START YEAR", render: ({ startYear }: any) => <span className="text-[#000] dark:text-[#000]">{startYear}</span> },
  { accessor: "endYear",   title: "END YEAR",   render: ({ endYear }: any)   => <span className="text-[#000] dark:text-[#000]">{endYear}</span> },
  { accessor: "students",  title: "STUDENTS",   render: ({ students }: any)  => <PurpleBadge value={students} /> },
  { accessor: "status",    title: "STATUS",     render: ({ status }: any)    => <StatusCell status={status} /> },
  { accessor: "actions",   title: "ACTIONS",    render: (row: any)           => <ActionCell onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /> },
];

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const MOCK_COURSES = [
  { id: 1, code: "CS301", title: "Data Structures",                l: 3, t: 0, p: 2, c: 4, theory: "45 hrs", lab: "30 hrs", status: "Active", department: "CSE" },
  { id: 2, code: "CS302", title: "Database Management Systems",    l: 3, t: 0, p: 2, c: 4, theory: "45 hrs", lab: "30 hrs", status: "Active", department: "CSE" },
  { id: 3, code: "CS303", title: "Operating Systems",              l: 3, t: 0, p: 2, c: 4, theory: "45 hrs", lab: "30 hrs", status: "Active", department: "CSE" },
  { id: 4, code: "CS304", title: "Computer Networks",              l: 3, t: 0, p: 0, c: 3, theory: "45 hrs", lab: "—",      status: "Active", department: "CSE" },
  { id: 5, code: "EC201", title: "Digital Signal Processing",      l: 3, t: 1, p: 0, c: 4, theory: "45 hrs", lab: "15 hrs", status: "Active", department: "ECE" },
  { id: 6, code: "AI101", title: "Foundations of Machine Learning",l: 3, t: 0, p: 2, c: 4, theory: "45 hrs", lab: "30 hrs", status: "Active", department: "AI"  },
];

export const makeCourseColumns = (onEdit: (r: any) => void, onDelete: (r: any) => void) => [
  { accessor: "code",   title: "COURSE CODE",  render: ({ code }: any)   => <PurpleCode code={code} /> },
  { accessor: "title",  title: "COURSE TITLE", render: ({ title }: any)  => <span className="text-[#000] dark:text-gray-200">{title}</span> },
  { accessor: "l",      title: "L",            render: ({ l }: any)      => <span className="text-[#000] dark:text-[#000]">{l}</span> },
  { accessor: "t",      title: "T",            render: ({ t }: any)      => <span className="text-[#000] dark:text-[#000]">{t}</span> },
  { accessor: "p",      title: "P",            render: ({ p }: any)      => <span className="text-[#000] dark:text-[#000]">{p}</span> },
  { accessor: "c",      title: "C",            render: ({ c }: any)      => <PurpleBadge value={c} /> },
  { accessor: "theory", title: "THEORY HOURS", render: ({ theory }: any) => <span className="text-[#000] dark:text-[#000]">{theory}</span> },
  { accessor: "lab",    title: "LAB HOURS",    render: ({ lab }: any)    => <span className="text-[#000] dark:text-[#000]">{lab}</span> },
  { accessor: "status", title: "STATUS",       render: ({ status }: any) => <StatusCell status={status} /> },
  { accessor: "actions",title: "ACTIONS",      render: (row: any)        => <ActionCell onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /> },
];

// ─── PSOs ─────────────────────────────────────────────────────────────────────
export const MOCK_PSOS = [
  { id: 1, code: "PSO1", programme: "BTECH-CSE", description: "Apply knowledge of computing to solve real-world problems.",          status: "Active"   },
  { id: 2, code: "PSO2", programme: "BTECH-CSE", description: "Design and develop software systems using modern engineering tools.", status: "Active"   },
  { id: 3, code: "PSO3", programme: "BTECH-ECE", description: "Analyse and design electronic circuits and communication systems.",   status: "Active"   },
  { id: 4, code: "PSO4", programme: "BTECH-ECE", description: "Apply signal processing techniques to real-time applications.",      status: "Active"   },
  { id: 5, code: "PSO5", programme: "MTECH-AI",  description: "Develop intelligent systems using machine learning algorithms.",     status: "Active"   },
  { id: 6, code: "PSO6", programme: "MTECH-AI",  description: "Evaluate AI models for performance, fairness and robustness.",      status: "Inactive" },
];

export const makePSOColumns = (onEdit: (r: any) => void, onDelete: (r: any) => void) => [
  { accessor: "code",        title: "PSO CODE",    render: ({ code }: any)        => <PurpleCode code={code} /> },
  { accessor: "programme",   title: "PROGRAMME",   render: ({ programme }: any)   => <span className="text-[#000] dark:text-[#000]">{programme}</span> },
  { accessor: "description", title: "DESCRIPTION", render: ({ description }: any) => <span className="max-w-md whitespace-normal text-[#000] dark:text-gray-200">{description}</span> },
  { accessor: "status",      title: "STATUS",      render: ({ status }: any)      => <StatusCell status={status} /> },
  { accessor: "actions",     title: "ACTIONS",     render: (row: any)             => <ActionCell onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} /> },
];
