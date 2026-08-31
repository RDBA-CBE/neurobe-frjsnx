import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";

import BulkImportBanner from "@/components/bulk-import/BulkImportBanner";
import ImportProgressStepper from "@/components/bulk-import/ImportProgressStepper";
import DownloadTemplate from "@/components/bulk-import/DownloadTemplate";
import FileUploadDropzone from "@/components/bulk-import/FileUploadDropzone";

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

  const handleDownload = () => {
    // placeholder — wire up real download URL when API is ready
    const filename =
      state.importType === "user"
        ? "user_import_template.xlsx"
        : "course_import_template.xlsx";
    console.log("Downloading template:", filename);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <ul className="mb-1 flex space-x-2 text-xs font-medium text-[#000] dark:text-gray-400">
        <li>Karpagam Institutions</li>
        <li className="before:content-['>'] before:mx-1.5 text-color2 uppercase">
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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Download template */}
        <div className="panel px-6 py-6">
          <DownloadTemplate
            importType={state.importType}
            onDownload={handleDownload}
          />
        </div>

        {/* File upload */}
        <div className="panel px-6 py-6">
          <FileUploadDropzone
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivateRouter(BulkImport);
