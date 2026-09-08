import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Plus, Eye, Save } from "lucide-react";
import { useRouter } from "next/router";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import PageHeader from "@/components/common-components/PageHeader";
import CIAQuestionPaperStatusCard from "@/components/academic-setup/CIAQuestionPaperStatusCard";
import CIAPaperMarksAllocationBar from "@/components/academic-setup/CIAPaperMarksAllocationBar";

const CIAQuestionPaper = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
    activeTab: "cia-paper",
    isEditing: false,
    totalPaperMarks: 100,
    allocatedSectionMarks: 100,
    remainingToAllocate: 0,
  });

  useEffect(() => {
    dispatch(setPageTitle(state.isEditing ? "CIA–1 Question Paper" : "CIA Question Paper"));
  }, [dispatch, state.isEditing]);

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
        onBack={() => state.isEditing ? setState({ isEditing: false }) : console.log("back")}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      {state.isEditing ? (
        <>
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
        </>
      ) : (
        <>
          <PageHeader
            title="Course Artifacts"
            draft="DRAFT"
            actionBtn1={{
              label: "Create CIA Paper",
              icon: <Plus className="h-4 w-4" />,
              onClick: () =>
                setState({
                  isConfiguring: true,
                  modalMode: "create",
                  activeConfigCode: "MCQ-CN-2026-T3",
                }),
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CIAQuestionPaperStatusCard
              status="draft"
              title="CIA–1 Question Paper"
              courseCodeTitle="CS309 — Computer Networks"
              progressData={{
                sectionsCompleted: "2 of 3 Sections Completed",
                marksFilled: "75 of 100 Marks Filled",
                lastEdited: "Last Edited: 2026–09–02 11:30 AM",
              }}
              onViewDraft={() => console.log("View Draft")}
              onResumeEditing={() => {
                setState({ isEditing: true });
                router.push("/neurobe/cia-question-paper-edit");
              }}
            />

            <CIAQuestionPaperStatusCard
              status="approved"
              title="CIA–2 Question Paper"
              courseCodeTitle="CS309 — Computer Networks"
              approvedData={{
                totalMarks: "100 Marks",
                sections: 3,
                questions: 10,
                lastUpdated: "Last Updated: 2026–08–25 04:15 PM",
              }}
              onViewPaper={() => console.log("View Paper")}
              onPrint={() => console.log("Print Paper")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateRouter(CIAQuestionPaper);

