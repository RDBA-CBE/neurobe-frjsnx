import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";

import SyllabusStepper from "@/components/academic-setup/SyllabusStepper";
import StepHeader from "@/components/academic-setup/StepHeader";
import SyllabusUpload from "@/components/academic-setup/SyllabusUpload";
import ImportProgressStepper from "@/components/bulk-import/ImportProgressStepper";
import DownloadTemplate from "@/components/bulk-import/DownloadTemplate";
import FileUploadDropzone from "@/components/bulk-import/FileUploadDropzone";
import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";
import TableComponent from "@/components/common-components/TableComponent";

type ImportType = "user" | "course";

const STEP_STATUS_LABELS: Record<number, string> = {
  1: "Awaiting Upload",
  2: "Validating",
  3: "Reviewing Results",
  4: "Import Complete",
};

const Syllabus = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    importType: "user" as ImportType,
    currentStep: 1,
    selectedFile: null as File | null,
    activeTab: "coordinator",
  });

  useEffect(() => {
    dispatch(setPageTitle("Syllabus"));
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
      <CourseBanner
        courseCode="CS301"
        courseTitle="Computer Networks"
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme="B.Tech CSE"
        batch="2025–2029"
        academicYear="2026–2027 / Semester 3"
        students="40 Students"
        selectedCourse="CS309"
        courseOptions={[
          { value: "CS309", label: "Course: CS309" },
          { value: "CS301", label: "Course: CS301" },
        ]}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeTab}
        onBack={() => console.log("back")}
        onViewChange={(view) => setState({ activeTab: view })}
      />
      <div className="panel">
        <SyllabusStepper currentStep={1} statusLabel="Awaiting Upload" />
        <div className=" mx-6 border-t border-gray-200 dark:border-gray-700" />

        <div className="px-6 py-3">
          <StepHeader
            title="Upload Syllabus"
            description="Upload the syllabus document for CS301— Computer Networks."
          />
          <SyllabusUpload onFileSelect={(file) => setState({ selectedFile: file })} />
        </div>
      </div>
      {/* <BulkImportBanner
        importType={state.importType}
        onTypeChange={(type) =>
          setState({ importType: type, currentStep: 1, selectedFile: null })
        }
      /> */}

      {/* Progress stepper */}
      {/* <ImportProgressStepper
        currentStep={state.currentStep}
        statusLabel={STEP_STATUS_LABELS[state.currentStep]}
      /> */}

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
              className={`dark:text-white" flex cursor-pointer flex-col justify-between space-y-2 rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800
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
              <p
                className={
                  " text-md font-semibold text-green-500 dark:text-white "
                }
              >
                Ready to Move
              </p>
              <span className={"text-3xl font-bold   dark:text-white"}>10</span>
              <p className={"text-pri text-xs"}>Ready for import</p>
            </div>
            <div
              className={`dark:text-white" flex cursor-pointer  flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-[#000] transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800
      `}
            >
              <p
                className={
                  " text-md font-semibold text-red-500 dark:text-white "
                }
              >
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

export default PrivateRouter(Syllabus);
