import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Success, Failure } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";

import BulkImportBanner from "@/components/bulk-import/BulkImportBanner";
import ImportProgressStepper from "@/components/bulk-import/ImportProgressStepper";
import DownloadTemplate from "@/components/bulk-import/DownloadTemplate";
import FileUploadDropzone from "@/components/bulk-import/FileUploadDropzone";
import TableComponent from "@/components/common-components/TableComponent";
import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";
import Models from "@/imports/models.import";

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
    isDownloading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Bulk Import"));
  }, []);

  const handleFileSelect = (file: File) => {
    setState({ selectedFile: file, currentStep: 2 });
  };

  console.log("selectedFile", state.selectedFile);

  const handleDownload = () => {
    if (state.importType === "user") {
      UserTemplate();
    } else {
      CourseTemplate();
    }
  };

  // API integrations

  const UserTemplate = async () => {
    try {
      setState({ isDownloading: true });
      const response: any = await Models.user_import.downloadTemplate();
      setState({ userTemplate: response });

      let filename = "users_bulk_import_template.csv";
      const disposition = response?.headers?.["content-disposition"];
      if (disposition) {
        const filenameMatch = disposition.match(
          /filename\*?=['"]?(?:UTF-\d['"])?([^;\r\n"']*)['"]?/i
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].trim());
        }
      }

      const blobData =
        response?.data instanceof Blob
          ? response.data
          : response instanceof Blob
          ? response
          : new Blob([response?.data || response], {
              type: response?.headers?.["content-type"] || "text/csv;charset=utf-8;",
            });

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Success("User template downloaded successfully");
    } catch (error: any) {
      console.error("Error downloading user template:", error);
      Failure(typeof error === "string" ? error : "Failed to download user template");
    } finally {
      setState({ isDownloading: false });
    }
  };

  const CourseTemplate = async () => {
    try {
      setState({ isDownloading: true });
      const response: any = await Models.course_import.downloadTemplate();
      setState({ courseTemplate: response });

      let filename = "courses_bulk_import_template.csv";
      const disposition = response?.headers?.["content-disposition"];
      if (disposition) {
        const filenameMatch = disposition.match(
          /filename\*?=['"]?(?:UTF-\d['"])?([^;\r\n"']*)['"]?/i
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].trim());
        }
      }

      const blobData =
        response?.data instanceof Blob
          ? response.data
          : response instanceof Blob
          ? response
          : new Blob([response?.data || response], {
              type: response?.headers?.["content-type"] || "text/csv;charset=utf-8;",
            });

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Success("Course template downloaded successfully");
    } catch (error: any) {
      console.error("Error downloading course template:", error);
      Failure(typeof error === "string" ? error : "Failed to download course template");
    } finally {
      setState({ isDownloading: false });
    }
  };
  

  const importFile = async () => {
    try {
      if (state.selectedFile) {
        if (state.importType === "user") {
          const response: any = await Models.user_import.import(state.selectedFile);
          Success("User imported successfully");
          console.log("response", response);
        } else {
          const response: any = await Models.course_import.import(state.selectedFile);
          Success("Course imported successfully");
          console.log("response", response);
        }
      } else {
        Failure("Please select a file");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const tabledata = [
    {
      accessor: "code",
      title: "CODE",
      render: ({ code }: any) => (
        <span className="font-medium text-color2">{code}</span>
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
        <span className="text-[#000] dark:text-[#000]">{hod}</span>
      ),
    },
    {
      accessor: "programmes",
      title: "PROGRAMMES",
      render: ({ programmes }: any) => (
        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#ede9fe] px-1.5 text-xs font-bold text-color2">
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
          <button className="text-[#000] hover:text-color2">
            <IconEdit className="h-4 w-4" />
          </button>
          <button className="text-[#000] hover:text-red-500">
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
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
            loading={state.isDownloading}
          />
        </div>

        {/* File upload */}
        <div className="panel px-6 py-6">
          <FileUploadDropzone onFileSelect={handleFileSelect} Validate={importFile} />
        </div>
      </div>

      {state.selectedFile && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
            <div
              className={`dark:text-white" flex cursor-pointer space-y-2 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800`}
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
              className={`dark:text-white" flex cursor-pointer  flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800`}
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
              className={`dark:text-white" flex cursor-pointer  flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800`}
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
