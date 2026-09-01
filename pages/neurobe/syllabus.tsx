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
import KeepFilePrompt from "@/components/academic-setup/KeepFilePrompt";
import NeuroAIInfo from "@/components/academic-setup/NeuroAIInfo";
import ExtractionComplete from "@/components/academic-setup/ExtractionComplete";
import ReviewModeBar from "@/components/academic-setup/ReviewModeBar";
import PDFViewer from "@/components/academic-setup/PDFViewer";
import ExtractedDataPanel from "@/components/academic-setup/ExtractedDataPanel";
import ImportProgressStepper from "@/components/bulk-import/ImportProgressStepper";
import DownloadTemplate from "@/components/bulk-import/DownloadTemplate";
import FileUploadDropzone from "@/components/bulk-import/FileUploadDropzone";
import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";
import TableComponent from "@/components/common-components/TableComponent";
import PrimaryButton from "@/components/FormFields/PrimaryButton.component";
import { Sparkles } from "lucide-react";

type ImportType = "user" | "course";


const Syllabus = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    importType: "user" as ImportType,
    currentStep: 1,
    selectedFile: null as File | null,
    showReview: false,
    activeTab: "coordinator",
  });

  useEffect(() => {
    dispatch(setPageTitle("Syllabus"));
  }, []);


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
        <SyllabusStepper
          currentStep={state.currentStep}
          statusLabel={state.currentStep === 3 ? "Review Required" : "Awaiting Upload"}
          statusClassName={state.currentStep === 3 ? "border-orange-200 bg-orange-50 text-orange-600 font-bold" : ""}
        />
        <div className=" mx-6 border-t border-gray-200 dark:border-gray-700" />
        {state.currentStep === 1 && (

        <div className="px-6 py-3 pt-2">
          <StepHeader
            title="Upload Syllabus"
            description="Upload the syllabus document for CS301— Computer Networks."
          />
          <SyllabusUpload
            onFileSelect={(file) => setState({ selectedFile: file })}
          />
          <KeepFilePrompt
            onKeep={() => console.log("keep")}
            onDiscard={() => console.log("discard")}
          />
          <NeuroAIInfo />
          <div className="mt-4 flex justify-end">
            <PrimaryButton
              type="button"
              text="Start AI Extraction"
              className="bg-color2 hover:bg-color2"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={() => setState({ currentStep: 3 })}
            />
          </div>
          
        </div>
          )}

        {state.currentStep === 3 && (
          <div className="px-6 py-3 pt-2">
            {!state.showReview ? (
              <ExtractionComplete
                fileName={state.selectedFile?.name}
                onReview={() => setState({ showReview: true })}
                progress={50}
              />
            ) : (
              <>
                <ReviewModeBar
                  onSaveDraft={() => console.log("save draft")}
                  onContinue={() => console.log("continue")}
                />
                <div className="grid grid-cols-2 gap-5" style={{ height: "80vh" }}>
                  <PDFViewer
                    file={state.selectedFile}
                    fileName={state.selectedFile?.name}
                    fileSize={state.selectedFile ? `${(state.selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : ""}
                  />
                  <ExtractedDataPanel />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateRouter(Syllabus);
