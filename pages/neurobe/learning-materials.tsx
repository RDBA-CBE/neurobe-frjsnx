import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FolderGit2, FileText, Download, Upload, FileCode, Video } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import TableComponent from "@/components/academic-setup/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_MATERIALS = [
  {
    id: 1,
    title: "Unit 1: Stacks and Applications Lecture Notes",
    type: "PDF Document",
    unit: "Unit I",
    fileSize: "4.2 MB",
    downloads: 142,
    uploadedOn: "2026-08-01",
    author: "Dr. Arjun Kumar",
  },
  {
    id: 2,
    title: "Stack & Queue Implementation Code Samples (C++ / Java)",
    type: "Source Code Archive",
    unit: "Unit I",
    fileSize: "1.8 MB",
    downloads: 98,
    uploadedOn: "2026-08-04",
    author: "Dr. Arjun Kumar",
  },
  {
    id: 3,
    title: "Binary Tree Traversals Visual Presentation & Handout",
    type: "Presentation (PPTX)",
    unit: "Unit II",
    fileSize: "12.5 MB",
    downloads: 110,
    uploadedOn: "2026-08-10",
    author: "Dr. Arjun Kumar",
  },
  {
    id: 4,
    title: "Graph Traversal BFS & DFS Video Walkthrough",
    type: "Video Link",
    unit: "Unit III",
    fileSize: "Streaming URL",
    downloads: 87,
    uploadedOn: "2026-08-15",
    author: "Dr. Arjun Kumar",
  },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "PDF Document", label: "PDF Documents" },
  { value: "Presentation (PPTX)", label: "Presentations" },
  { value: "Source Code Archive", label: "Code Repositories" },
  { value: "Video Link", label: "Video Recordings" },
];

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "Unit I", label: "Unit I - Stacks & Queues" },
  { value: "Unit II", label: "Unit II - Trees" },
  { value: "Unit III", label: "Unit III - Graphs" },
];

const LearningMaterials = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    typeFilter: "all",
    unitFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Learning Materials"));
  }, [dispatch]);

  const filteredRecords = MOCK_MATERIALS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.title.toLowerCase().includes(s) ||
      row.type.toLowerCase().includes(s) ||
      row.author.toLowerCase().includes(s);
    const matchType =
      state.typeFilter === "all" || row.type === state.typeFilter;
    const matchUnit =
      state.unitFilter === "all" || row.unit === state.unitFilter;
    return matchSearch && matchType && matchUnit;
  });

  const getFormatIcon = (type: string) => {
    if (type.includes("PDF")) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("Code")) return <FileCode className="h-5 w-5 text-blue-500" />;
    if (type.includes("Video")) return <Video className="h-5 w-5 text-purple-500" />;
    return <FolderGit2 className="h-5 w-5 text-amber-500" />;
  };

  const columns = [
    {
      accessor: "title",
      title: "RESOURCE TITLE",
      render: ({ title, type }: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            {getFormatIcon(type)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
            <span className="text-xs text-gray-400">{type}</span>
          </div>
        </div>
      ),
    },
    {
      accessor: "unit",
      title: "UNIT",
      render: ({ unit }: any) => (
        <span className="text-xs font-semibold text-[#7c3aed]">{unit}</span>
      ),
    },
    {
      accessor: "fileSize",
      title: "SIZE",
      render: ({ fileSize }: any) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">{fileSize}</span>
      ),
    },
    {
      accessor: "downloads",
      title: "STUDENT VIEWS / DOWNLOADS",
      render: ({ downloads }: any) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {downloads}
        </span>
      ),
    },
    {
      accessor: "uploadedOn",
      title: "UPLOADED DATE",
      render: ({ uploadedOn }: any) => (
        <span className="text-xs text-gray-500">{uploadedOn}</span>
      ),
    },
    {
      accessor: "actions",
      title: "ACTION",
      render: () => (
        <button className="flex items-center gap-1 text-xs font-semibold text-[#7c3aed] hover:underline">
          <Download className="h-3.5 w-3.5" /> Download
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Learning Materials & Courseware"
        description="Upload, curate, and distribute lecture notes, interactive presentation decks, video lessons, lab manuals, and supplementary reading materials."
        icon={<FolderGit2 className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <Upload className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Uploads</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">18 Files</p>
          <span className="text-xs text-purple-600">4 Categories</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Total Downloads</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">437</p>
          <span className="text-xs text-blue-600">Active Engagement</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Storage Used</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">64.5 MB</p>
          <span className="text-xs text-gray-400">Cloud Storage</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Units Covered</span>
          <p className="mt-2 text-2xl font-bold text-green-600">5 / 5</p>
          <span className="text-xs text-green-600">100% Comprehensive</span>
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
            placeholder="Search learning materials..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <CustomSelect
            options={TYPE_OPTIONS}
            value={TYPE_OPTIONS.find((o) => o.value === state.typeFilter) ?? null}
            onChange={(e) => setState({ typeFilter: e?.value ?? "all" })}
            placeholder="All Formats"
            className="filter-input"
          />
          <CustomSelect
            options={UNIT_OPTIONS}
            value={UNIT_OPTIONS.find((o) => o.value === state.unitFilter) ?? null}
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
          noRecordsText="No learning materials found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(LearningMaterials);

