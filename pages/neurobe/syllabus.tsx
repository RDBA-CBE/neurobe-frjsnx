import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { Dropdown, useSetState } from "@/utils/function.utils";
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
import SyllabusApprovedBanner from "@/components/academic-setup/SyllabusApprovedBanner";
import SyllabusApprovedSummary from "@/components/academic-setup/SyllabusApprovedSummary";
import IconEdit from "@/components/Icon/IconEdit";
import IconTrash from "@/components/Icon/IconTrash";
import TableComponent from "@/components/common-components/TableComponent";
import PrimaryButton from "@/components/FormFields/PrimaryButton.component";
import { Check, Sparkles } from "lucide-react";
import CourseOutcomes from "@/components/academic-setup/CourseOutcomes";
import { useRouter, useSearchParams } from "next/navigation";
import Models from "@/imports/models.import";

type ImportType = "user" | "course";

const Syllabus = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  const stepKey = `syllabus_step_${course_id ?? "default"}`;
  const jobKey = `syllabus_job_${course_id ?? "default"}`;

  const getSavedStep = () => {
    try {
      const saved = sessionStorage.getItem(stepKey);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  };

  const getSavedJobId = () => {
    try { return sessionStorage.getItem(jobKey) || null; } catch { return null; }
  };

  const setStep = (step: number) => {
    try { sessionStorage.setItem(stepKey, String(step)); } catch { }
    setState({ currentStep: step });
  };

  const [state, setState] = useSetState({
    importType: "user" as ImportType,
    currentStep: getSavedStep(),
    selectedFile: null as File | null,
    showReview: false,
    activeTab: "coordinator",
    courseData: null as any,
    jobData: null as any,
    course_list: [],
    keep_file: false
  });

  useEffect(() => {
    dispatch(setPageTitle("Syllabus"));
  }, []);

  useEffect(() => {
    if (course_id) {
      course_data(course_id);
      coordinator_course_data();
      // restore job data on refresh if step >= 3
      const savedJobId = getSavedJobId();
      if (savedJobId && getSavedStep() >= 3) {
        job_Data(savedJobId);
      }
    }
  }, [course_id]);

  const course_data = async (id: string) => {
    try {
      const res = await Models.course.detail(id);
      setState({ courseData: res });
      console.log("course detail →", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const coordinator_course_data = async () => {
    try {
      const user = localStorage.getItem("user")
      const u = JSON.parse(user);
      const body = {
        coordinator_id: u?.id
      }
      const res = await Models.course.list(body);
      const dropdown = Dropdown(res, "course_code")
      // setState({ courseData: res });
      console.log("coordinator_course_data detail →", dropdown);
      setState({ course_list: dropdown })
    } catch (error) {
      console.log("error", error);
    }
  };

  const onKeep = () => {
    setState({ keep_file: true })
    console.log("Keep file");
  };

  const onDiscard = () => {
    setState({ keep_file: false })

  };

  const startAIExtraction = async () => {
    try {
      const body = {
        file: state.selectedFile,
        course_id: course_id,
        keep_permanently: state.keep_file

      }
      console.log("body", body);

      const formData = new FormData();
      formData.append("file", state.selectedFile);
      formData.append("course_id", course_id);
      formData.append("regulation", state.courseData?.regulation);
      formData.append("programme", state.courseData?.
        programme_id
      );
      formData.append("academic_year", state.courseData?.
        academic_year
      );



      formData.append("keep_permanently", state.keep_file);



      const res: any = await Models.syllabus.create(formData)
      console.log("res", res);
      if (res?.job_id) {
        try { sessionStorage.setItem(jobKey, String(res.job_id)); } catch { }
        job_Data(res.job_id);
      }


    } catch (error) {
      console.log("error", error);


    }
  }

  const job_Data = async (id: string | number) => {
    try {
      const res = await Models.job.detail(id);
      console.log("job_Data", res);
      setState({ jobData: res });
      setStep(3);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="min-h-screen">
      <CourseBanner
        courseCode={state.courseData?.course_code || ""}
        courseTitle={state.courseData?.course_title || ""}
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme={state.courseData?.programme || ""}
        batch={state.courseData?.batch_name || ""}
        academicYear={state.courseData?.academic_year || ""}
        students={`${state.courseData?.students_count ?? 0} Students`}
        selectedCourse={state.courseData?.course_code || ""}
        courseOptions={state.course_list}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeTab: view })}
      />
      <div className="">
        <SyllabusStepper
          currentStep={state.currentStep}
          statusLabel={
            state.currentStep === 4
              ? "Approved"
              : state.currentStep === 3
                ? "Review Required"
                : "Awaiting Upload"
          }
          statusClassName={
            state.currentStep === 4
              ? "border-green-300 bg-green-50 text-green-600 font-bold"
              : state.currentStep === 3
                ? "border-orange-200 bg-orange-50 text-orange-600 font-bold"
                : ""
          }
        />
        <div className=" mx-6 border-t border-gray-200 dark:border-gray-700" />
        {state.currentStep === 1 && (
          <div className=" py-3 pt-2">
            <StepHeader
              title="Upload Syllabus"
              description="Upload the syllabus document for CS301— Computer Networks."
            />
            <SyllabusUpload
              onFileSelect={(file) => setState({ selectedFile: file })}
            />
            <KeepFilePrompt
              title="Keep the source syllabus file permanently?"
              subTitle=" Choose whether the uploaded source syllabus should be retained permanently."
              actionBtn1={{
                label: "Yes, keep file",
                onClick: onKeep,
              }}
              actionBtn2={{
                label: "No, do not keep file",
                onClick: onDiscard,
              }}
            />
            <NeuroAIInfo />
            <div className="mt-4 flex justify-end">
              <PrimaryButton
                type="button"
                text="Start AI Extraction"
                className="bg-color2 hover:bg-color2"
                icon={<Sparkles className="h-4 w-4" />}
                onClick={() => startAIExtraction()}
              />
            </div>
          </div>
        )}

        {state.currentStep === 3 && (
          <div className=" py-3 pt-2">
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
                  onContinue={() => setStep(4)}
                />
                <div
                  className="grid gap-5"
                  style={{
                    height: "80vh",
                    overflow: "hidden",
                    gridTemplateColumns: "2fr 3fr",
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <PDFViewer
                      file={state.selectedFile}
                      fileName={state.selectedFile?.name}
                      fileSize={
                        state.selectedFile
                          ? `${(
                            state.selectedFile.size /
                            (1024 * 1024)
                          ).toFixed(1)} MB`
                          : ""
                      }
                    />
                  </div>
                  <div className="min-h-0 overflow-hidden">
                    <ExtractedDataPanel />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {state.currentStep === 4 && (
          <div className=" py-3 pt-4">
            <SyllabusApprovedBanner
              courseCode="CS309"
              onProceed={() => router.push("/neurobe/co-po-mapping")}
            />
            <SyllabusApprovedSummary
              courseCode="CS309"
              courseTitle="Computer Networks"
              theoryHours={45}
              labHours={30}
              credits={4}
              ltpc="3 — 0 — 2 — 4"
              onRevise={() => { setStep(3); setState({ showReview: true }); }}
              onProceed={() => router.push("/neurobe/co-po-mapping")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateRouter(Syllabus);
