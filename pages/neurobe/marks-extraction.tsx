import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import PageBanner from "@/components/common-components/PageBanner";
import TableComponent from "@/components/common-components/TableComponent";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_EXTRACTIONS = [
  {
    id: 1,
    batchTitle: "CIA-1 Marks Sheet (Batch 2023-2027 Sec-A)",
    course: "CS301 - Data Structures & Algorithms",
    format: "Excel (.xlsx)",
    totalRows: 64,
    validRows: 64,
    errorRows: 0,
    extractedOn: "2026-08-22",
    status: "Extracted & Verified",
  },
  {
    id: 2,
    batchTitle: "CIA-1 Marks Sheet (Batch 2023-2027 Sec-B)",
    course: "CS301 - Data Structures & Algorithms",
    format: "OCR Answer Booklet Scan",
    totalRows: 62,
    validRows: 60,
    errorRows: 2,
    extractedOn: "2026-08-23",
    status: "Requires Review",
  },
  {
    id: 3,
    batchTitle: "Assignment 1 Submission Scores",
    course: "CS301 - Data Structures & Algorithms",
    format: "LMS CSV Export",
    totalRows: 64,
    validRows: 64,
    errorRows: 0,
    extractedOn: "2026-08-25",
    status: "Extracted & Verified",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Extracted & Verified", label: "Extracted & Verified" },
  { value: "Requires Review", label: "Requires Review" },
];

const MarksExtraction = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Marks Extraction"));
  }, [dispatch]);

  const filteredRecords = MOCK_EXTRACTIONS.filter((row) => {
    const s = state.search.toLowerCase();
    const matchSearch =
      !s ||
      row.batchTitle.toLowerCase().includes(s) ||
      row.course.toLowerCase().includes(s) ||
      row.format.toLowerCase().includes(s);
    const matchStatus =
      state.statusFilter === "all" || row.status === state.statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      accessor: "batchTitle",
      title: "MARKS EXTRACTION BATCH",
      render: ({ batchTitle, course }: any) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{batchTitle}</p>
          <p className="text-xs text-gray-500">{course}</p>
        </div>
      ),
    },
    {
      accessor: "format",
      title: "SOURCE FORMAT",
      render: ({ format }: any) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {format}
        </span>
      ),
    },
    {
      accessor: "totalRows",
      title: "ROWS EXTRACTED",
      render: ({ totalRows, validRows }: any) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {validRows} / {totalRows}
        </span>
      ),
    },
    {
      accessor: "errorRows",
      title: "ERRORS",
      render: ({ errorRows }: any) =>
        errorRows > 0 ? (
          <span className="inline-flex items-center gap-1 font-bold text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" /> {errorRows} Errors
          </span>
        ) : (
          <span className="text-xs text-green-600 font-semibold">0 Errors</span>
        ),
    },
    {
      accessor: "extractedOn",
      title: "EXTRACTION DATE",
      render: ({ extractedOn }: any) => (
        <span className="text-xs text-gray-500">{extractedOn}</span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status }: any) => {
        const isErr = status === "Requires Review";
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isErr ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageBanner
        title="Automated Marks Extraction"
        description="Extract, validate, and synchronize assessment scores from external spreadsheets, LMS exports, or scanned evaluation rubrics into student academic records."
        icon={<FileSpreadsheet className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex justify-end">
        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <Upload className="h-4 w-4" />
          Extract New Marks File
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Processed Batches</span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <span className="text-xs text-purple-600">Total Uploads</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Records Synchronized</span>
          <p className="mt-2 text-2xl font-bold text-green-600">188</p>
          <span className="text-xs text-green-600">Marks Stored</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Validation Accuracy</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">98.9%</p>
          <span className="text-xs text-blue-600">Automated Checks</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-medium text-gray-500">Pending Review</span>
          <p className="mt-2 text-2xl font-bold text-amber-600">2 Rows</p>
          <span className="text-xs text-amber-600">Correction Needed</span>
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
            placeholder="Search extraction batch..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
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
          noRecordsText="No marks extraction batches found"
        />
      </div>
    </div>
  );
};

export default PrivateRouter(MarksExtraction);

