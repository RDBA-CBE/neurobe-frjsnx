import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";

import BulkImportBanner from "@/components/bulk-import/BulkImportBanner";
import ImportProgressStepper from "@/components/bulk-import/ImportProgressStepper";
import DownloadTemplate from "@/components/bulk-import/DownloadTemplate";
import FileUploadDropzone from "@/components/bulk-import/FileUploadDropzone";
import TableComponent from "@/components/academic-setup/TableComponent";
import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";

type ImportType = "user" | "course";

const STEP_STATUS_LABELS: Record<number, string> = {
  1: "Awaiting Upload",
  2: "Validating",
  3: "Reviewing Results",
  4: "Import Complete",
};

const BulkImport = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    importType: "user" as ImportType,
    currentStep: 1,
    selectedFile: null as File | null,
  });

  useEffect(() => {
    dispatch(setPageTitle("Bulk Import"));
  }, []);

  const handleFileSelect = (file: File) => {
    setState({ selectedFile: file, currentStep: 2 });
  };

  console.log("selectedFile", state.selectedFile);

  const handleDownload = () => {
    // placeholder — wire up real download URL when API is ready
    const filename =
      state.importType === "user"
        ? "user_import_template.xlsx"
        : "course_import_template.xlsx";
    console.log("Downloading template:", filename);
  };

  const tabledata = [
    {
      accessor: "code",
      title: "CODE",
      render: ({ code }: any) => (
        <span className="font-medium text-[#7c3aed]">{code}</span>
      ),
    },
    {
      accessor: "name",
      title: "DEPARTMENT NAME",
      render: ({ name }: any) => (
        <span className="text-[#000] dark:text-gray-200">{name}</span>
      ),
    },
    {
      accessor: "hod",
      title: "HEAD OF DEPT",
      render: ({ hod }: any) => (
        <span className="text-[#000] dark:text-gray-400">{hod}</span>
      ),
    },
    {
      accessor: "programmes",
      title: "PROGRAMMES",
      render: ({ programmes }: any) => (
        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#ede9fe] px-1.5 text-xs font-bold text-[#7c3aed]">
          {programmes}
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
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "Active" ? "bg-green-500" : "bg-red-400"
            }`}
          />
          {status}
        </span>
      ),
    },
    {
      accessor: "actions",
      title: "ACTIONS",
      render: () => (
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-[#7c3aed]">
            <IconEdit className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-red-500">
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <ul className="mb-1 flex space-x-2 text-xs font-medium text-[#000] dark:text-gray-400">
        <li>Karpagam Institutions</li>
        <li className="text-color2 uppercase before:mx-1.5 before:content-['>']">
          Bulk Import
        </li>
      </ul>

      {/* Page title */}
      <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
        Bulk Import
      </h1>

      {/* Banner — import type toggle */}
      <BulkImportBanner
        importType={state.importType}
        onTypeChange={(type) =>
          setState({ importType: type, currentStep: 1, selectedFile: null })
        }
      />

      {/* Progress stepper */}
      <ImportProgressStepper
        currentStep={state.currentStep}
        statusLabel={STEP_STATUS_LABELS[state.currentStep]}
      />

      {/* Two-column content area */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Download template */}
        <div className="panel px-6 py-6">
          <DownloadTemplate
            importType={state.importType}
            onDownload={handleDownload}
          />
        </div>

        {/* File upload */}
        <div className="panel px-6 py-6">
          <FileUploadDropzone onFileSelect={handleFileSelect} />
        </div>
      </div>

      {state.selectedFile && (
        <>
         <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <div
            className={`dark:text-white" flex cursor-pointer space-y-2 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800
      `}
          >
            <p className={"text-md font-semibold dark:text-white "}>
              Total Rows
            </p>
            <span
              className={"text-3xl font-bold  text-[#000] dark:text-white"}
            >
              10
            </span>
            <p className={"text-pri text-xs"}>Rows in Uploaded File</p>
          </div>
          <div
            className={`dark:text-white" flex cursor-pointer  flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800
      `}
          >
            <p className={" text-md font-semibold text-green-500 dark:text-white "}>
             Ready to Move
            </p>
            <span
              className={"text-3xl font-bold   dark:text-white"}
            >
              10
            </span>
            <p className={"text-pri text-xs"}>Ready for import</p>
          </div>
          <div
            className={`dark:text-white" flex cursor-pointer  flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800
      `}
          >
            <p className={" text-md font-semibold text-red-500 dark:text-white "}>
              Rows with error
            </p>
            <span
              className={"text-3xl font-bold  text-[#000] dark:text-white"}
            >
              10
            </span>
            <p className={"text-pri text-xs"}>Require Corrections</p>
          </div>
          </div>

          <div className="panel">
            <TableComponent
              records={[]}
              columns={tabledata}
              loading={state.loading}
              noRecordsText="No records Found"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateRouter(BulkImport);
