import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Dropdown, Failure } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import PaperSetupSection from "@/components/academic-setup/PaperSetupSection";
import SectionsAndQuestionsSection, {
  CIASection,
} from "@/components/academic-setup/SectionsAndQuestionsSection";
import ReviewAndFinalizeSection from "@/components/academic-setup/ReviewAndFinalizeSection";
import PageHeader from "@/components/common-components/PageHeader";
import { Eye, Plus, Save } from "lucide-react";
import CIAPaperMarksAllocationBar from "@/components/academic-setup/CIAPaperMarksAllocationBar";
import { useRouter, useSearchParams } from "next/navigation";
import Models from "@/imports/models.import";

const getErrorMessage = (error: any, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.detail === "string") return error.detail;
  if (typeof error?.error === "string") return error.error;
  return fallback;
};

const DEFAULT_SECTIONS: CIASection[] = [
  {
    id: "section-a",
    title: "Short Answer Questions",
    totalMarks: 20,
    usedMarks: 80,
    questions: [],
  },
];

const CreateCIAPaper = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  const [state, setState] = useSetState({
    activeTab: "coordinator",
    paperName: "CIA-1 Question Paper",
    totalMarks: "100",
    course: null as any,
    sections: DEFAULT_SECTIONS as CIASection[],
    allocatedSectionMarks: 20,
    remainingToAllocate: 80,
    courseDetail: null as any,
    courseList: [] as any[],
    selectedCourse: null as any,
    organization_id: "",
    coordinator_id: "",
    isCourseCoordinator: false,
    loadingCourses: false,
    loadingCourseDetail: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Create CIA Question Paper"));
  }, [dispatch]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role === "course_coordinator") {
      setState({
        isCourseCoordinator: true,
        coordinator_id: user.id,
      });
    }
    setState({
      organization_id: user?.organization_id,
    });
    if (user?.organization_id) {
      getAllCourse(user.organization_id);
    } else {
      getAllCourse();
    }
  }, []);

  useEffect(() => {
    if (course_id) {
      getCourseDetails(course_id);
    }
  }, [course_id]);

  const getAllCourse = async (orgId?: any) => {
    try {
      setState({ loadingCourses: true });
      const targetOrg = orgId || state?.organization_id;
      const res: any = await Models.course.list(targetOrg ? { organization_id: targetOrg } : {});
      const courseData = Array.isArray(res) ? res : res?.data || [];
      const dropdown = Dropdown(courseData, "course_title");
      setState({
        courseList: dropdown,
        loadingCourses: false,
      });

      // If no course_id query parameter, automatically navigate to the first course
      if (!course_id && Array.isArray(courseData) && courseData.length > 0) {
        const firstCourse = courseData[0];
        router.push(`/neurobe/cia-question-paper/create-cia-question-paper?course_id=${firstCourse.id}`);
      }
    } catch (error: any) {
      console.log("error fetching course list", error);
      setState({ loadingCourses: false });
      Failure(getErrorMessage(error, "Failed to fetch course list"));
    }
  };

  const getCourseDetails = async (targetCourseId?: any) => {
    const cid = targetCourseId || course_id;
    if (!cid) return;
    try {
      setState({ loadingCourseDetail: true });
      const res: any = await Models.course.detail(cid);
      const sel = res ? { value: res.id, label: `${res.course_code} - ${res.course_title}` } : null;
      setState({
        courseDetail: res,
        selectedCourse: sel,
        course: sel,
        loadingCourseDetail: false,
      });
    } catch (error: any) {
      console.log("error fetching course detail", error);
      setState({ loadingCourseDetail: false });
      Failure(getErrorMessage(error, "Failed to fetch course detail"));
    }
  };

  const handlePaperChange = (field: string, value: any) => {
    setState({ [field]: value });
    if (field === "course" && value?.value) {
      setState({ selectedCourse: value });
      router.push(`/neurobe/cia-question-paper/create-cia-question-paper?course_id=${value.value}`);
    }
  };

  const handleAddSection = () => {
    const newSection: CIASection = {
      id: `section-${Date.now()}`,
      title: `Section ${String.fromCharCode(65 + state.sections.length)}`,
      totalMarks: 100,
      usedMarks: 0,
      questions: [],
    };
    setState({ sections: [...state.sections, newSection] });
  };

  return (
    <div className="min-h-screen">
      <CourseBanner
        courseCode={state?.courseDetail?.course_code}
        courseTitle={state?.courseDetail?.course_title}
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme={state?.courseDetail?.programme}
        batch={state?.courseDetail?.batch_name}
        academicYear={state?.courseDetail?.academic_year}
        students={state?.courseDetail?.students_count}
        selectedCourse={state.selectedCourse}
        courseOptions={state.courseList}
        onCourseChange={(val) => {
          setState({ selectedCourse: val, course: val });
          router.push(`/neurobe/cia-question-paper/create-cia-question-paper?course_id=${val.value}`);
        }}
        activeView={state.activeTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      <PageHeader
        title="Create CIA Question Paper"
        subtitle="Create CIA Question Paper"
        records={
          state.courseDetail
            ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
            : ""
        }
        icon={<Plus className="text-color2 h-5 w-5" />}
        actionBtn2={{
          label: "Save Draft",
          icon: <Save className="h-4 w-4" />,
          onClick: () => {},
        }}
        actionBtn1={{
          label: "View Draft",
          icon: <Eye className="h-4 w-4" />,
          onClick: () => {
            const cid = course_id || state.selectedCourse?.value;
            router.push(
              cid
                ? `/neurobe/cia-question-paper/cia-question-paper-preview?course_id=${cid}`
                : "/neurobe/cia-question-paper/cia-question-paper-preview",
            );
          },
        }}
      />

      <CIAPaperMarksAllocationBar
        totalPaperMarks={state.totalMarks || "100"}
        allocatedSectionMarks={state.allocatedSectionMarks}
        remainingToAllocate={state.remainingToAllocate}
        badgeText="80 marks remaining to allocate"
        badgeColor="#78350F"
        isBalanced={true}
      />

      {/* 1. Paper Setup */}
      <PaperSetupSection
        paperName={state.paperName}
        totalMarks={state.totalMarks}
        course={state.course || state.selectedCourse}
        courseOptions={state.courseList}
        step="Step 1 of 3"
        onChange={handlePaperChange}
      />

      {/* 2. Sections & Questions */}
      <SectionsAndQuestionsSection
        sections={state.sections}
        onAddSection={handleAddSection}
        onSectionSettings={(id) => console.log("settings", id)}
        onSectionsChange={(updated) => setState({ sections: updated })}
      />

      {/* 3. Review & Finalize */}
      <ReviewAndFinalizeSection
        onBackToEdit={() => console.log("back to edit")}
        onSaveDraft={() => console.log("save draft")}
        onApproveFinalize={() => console.log("approve")}
      />
    </div>
  );
};

export default PrivateRouter(CreateCIAPaper);
