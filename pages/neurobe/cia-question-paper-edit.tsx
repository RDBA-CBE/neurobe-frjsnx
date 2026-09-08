import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Eye, Save } from "lucide-react";
import { useRouter } from "next/router";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import PageHeader from "@/components/common-components/PageHeader";
import CIAPaperMarksAllocationBar from "@/components/academic-setup/CIAPaperMarksAllocationBar";

const CIAQuestionPaperEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
    activeTab: "cia-paper",
    totalPaperMarks: 100,
    allocatedSectionMarks: 100,
    remainingToAllocate: 0,
  });

  useEffect(() => {
    dispatch(setPageTitle("CIA–1 Question Paper"));
  }, [dispatch]);

  return (
    <div className="min-h-screen space-y-6">
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
        onBack={() => router.push("/neurobe/cia-question-paper")}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      <PageHeader
        title="CIA–1 Question Paper"
        draft="Draft"
        actionBtn2={{
          label: "Save Draft",
          icon: <Save className="h-4 w-4" />,
          onClick: () => console.log("Save Draft"),
          outline: true,
        }}
        actionBtn1={{
          label: "View Draft",
          icon: <Eye className="h-4 w-4" />,
          onClick: () => console.log("View Draft"),
          outline: true,
        }}
      />

      <CIAPaperMarksAllocationBar
        totalPaperMarks={state.totalPaperMarks}
        allocatedSectionMarks={state.allocatedSectionMarks}
        remainingToAllocate={state.remainingToAllocate}
        badgeText="Section Marks Balanced (100%)"
        isBalanced={true}
      />
    </div>
  );
};

export default PrivateRouter(CIAQuestionPaperEdit);
