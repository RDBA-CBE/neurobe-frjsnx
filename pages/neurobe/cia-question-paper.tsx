import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Plus, Eye, Save, FileQuestion, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Dropdown, Failure } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import PageHeader from "@/components/common-components/PageHeader";
import CIAQuestionPaperStatusCard from "@/components/academic-setup/CIAQuestionPaperStatusCard";
import CIAPaperMarksAllocationBar from "@/components/academic-setup/CIAPaperMarksAllocationBar";
import CIAPaperReviewCard, {
  SectionPreviewItem,
} from "@/components/academic-setup/CIAPaperReviewCard";
import CIASectionsQuestionsCard, {
  SectionItem,
} from "@/components/academic-setup/CIASectionsQuestionsCard";
import CIAPaperFinalizationActions from "@/components/academic-setup/CIAPaperFinalizationActions";
import PaperSetupSection from "@/components/academic-setup/PaperSetupSection";
import { CIASection } from "@/components/academic-setup/SectionsAndQuestionsSection";
import Models from "@/imports/models.import";

const getErrorMessage = (error: any, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.detail === "string") return error.detail;
  if (typeof error?.error === "string") return error.error;
  return fallback;
};

const INITIAL_SECTIONS: SectionItem[] = [
  {
    id: "sec-a",
    sectionLetter: "A",
    title: "Short Answer Questions",
    totalMarks: "20 Marks",
    questionsCount: 4,
    marksUsed: "20 / 20",
    isComplete: true,
    questions: [
      {
        id: "q1",
        qNo: "Q1",
        text: "State the difference between protocol independence and layered abstraction in network architecture.",
        co: "CO1",
        kLevel: "K1",
        marks: "5 Marks",
        topic: "Network Models & Layered Architecture",
      },
      {
        id: "q2",
        qNo: "Q2",
        text: "Explain the difference between bit stuffing and byte stuffing with a simple frame delimiter example.",
        co: "CO2",
        kLevel: "K2",
        marks: "5 Marks",
        topic: "Data Link Layer & Framing",
      },
      {
        id: "q3",
        qNo: "Q3",
        text: "Define the purpose of Time-to-Live (TTL) field in an IPv4 packet header.",
        co: "CO3",
        kLevel: "K1",
        marks: "5 Marks",
        topic: "Network Layer & Routing Protocols",
      },
      {
        id: "q4",
        qNo: "Q4",
        text: "Distinguish between port numbers and socket addresses in the transport layer.",
        co: "CO4",
        kLevel: "K2",
        marks: "5 Marks",
        topic: "Transport Layer Protocols",
      },
    ],
  },
  {
    id: "sec-b",
    sectionLetter: "B",
    title: "Descriptive Questions",
    totalMarks: "65 Marks",
    remainingMarksText: "25 Marks Remaining",
    isComplete: false,
    questions: [
      {
        id: "q5",
        qNo: "Q5",
        text: "Explain the role of the Network Layer and contrast virtual circuit packet switching with datagram networks.",
        co: "CO2",
        kLevel: "K2",
        marks: "15 Marks",
        topic: "Network Layer & Routing Protocols",
      },
      {
        id: "q6",
        qNo: "Q6",
        text: "Analyze the working principle of the TCP three-way handshake and describe how connection teardown is achieved using FIN packets.",
        co: "CO4",
        kLevel: "K3",
        marks: "15 Marks",
        topic: "TCP Connection Lifecycle & Three-Way Handshake",
      },
      {
        id: "q7",
        qNo: "Q7",
        text: "Given the generator polynomial G(x) = x^4 + x + 1 and data bits 1101011011, calculate the transmitted frame using Cyclic Redundancy Check.",
        co: "CO2",
        kLevel: "K3",
        marks: "10 Marks",
        topic: "Error Detection (CRC, Checksum, Parity)",
      },
    ],
  },
  {
    id: "sec-c",
    sectionLetter: "C",
    title: "Application Questions",
    totalMarks: "15 Marks",
    isComplete: true,
    questions: [
      {
        id: "q8",
        qNo: "Q8",
        text: "Design a variable length subnet masking (VLSM) scheme for an organization allocated 192.168.1.0/24 with three departments having 60, 28, and 12 hosts respectively. List network IDs, broadcast IDs, and usable IP ranges.",
        co: "CO3",
        kLevel: "K3",
        marks: "15 Marks",
        topic: "IPv4 Addressing, Subnetting & CIDR",
      },
    ],
  },
];

const CIAQuestionPaper = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  const [state, setState] = useSetState({
    search: "",
    statusFilter: "all",
    loading: false,
    activeTab: "coordinator",
    isEditing: false,
    totalPaperMarks: 100,
    allocatedSectionMarks: 100,
    remainingToAllocate: 0,
    sections: INITIAL_SECTIONS,
    courseDetail: null as any,
    courseList: [] as any[],
    selectedCourse: null as any,
    organization_id: "",
    coordinator_id: "",
    isCourseCoordinator: false,
    loadingCourses: false,
    loadingCourseDetail: false,
    ciaPapers: null as any,
    loadingCIA: false,
  });

  useEffect(() => {
    dispatch(
      setPageTitle(
        state.isEditing ? "CIA–1 Question Paper" : "CIA Question Paper",
      ),
    );
  }, [dispatch, state.isEditing]);

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


  // api integration

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
      // getCIA()

      // If no course_id query parameter, automatically navigate to the first course
      if (!course_id && Array.isArray(courseData) && courseData.length > 0) {
        const firstCourse = courseData[0];
        router.push(`/neurobe/cia-question-paper?course_id=${firstCourse.id}`);
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
      setState({
        courseDetail: res,
        syllabus_id : res?.syllabus_id || res?.latest_syllabus?.id,
        selectedCourse: res ? { value: res.id, label: `${res.course_code} - ${res.course_title}` } : null,
        loadingCourseDetail: false,
      });
    const sid = res?.syllabus_id || res?.latest_syllabus?.id;
      if (sid) {
        getCIA(sid);
      }
    } catch (error: any) {
      console.log("error fetching course detail", error);
      setState({ loadingCourseDetail: false });
      Failure(getErrorMessage(error, "Failed to fetch course detail"));
    }
  };

  const getCIA = async (syllabus_id?: any) => {
    try {
      setState({ loadingCIA: true });
      const res: any = await Models.cia.get_cia(syllabus_id);
      const data = res?.data || res;
      setState({
        ciaPapers: data,
        loadingCIA: false,
      });
    } catch (error: any) {
      console.log("error fetching CIA", error);
      setState({ loadingCIA: false });
      Failure(getErrorMessage(error, "Failed to fetch CIA"));
    }
  };

  const reviewSections: SectionPreviewItem[] = state.sections.map((sec) => ({
    id: sec.id,
    sectionTitle: `SECTION ${sec.sectionLetter} — ${sec.title.toUpperCase()}`,
    totalMarksText: `[${sec.totalMarks.toString().toUpperCase()}]`,
    questions: sec.questions.map((q, idx) => ({
      id: q.id,
      qNoNumber: q.qNo.replace(/^Q/i, "") || idx + 1,
      text: q.text,
      marks: q.marks,
      co: q.co,
      kLevel: q.kLevel,
      topic: q.topic,
    })),
  }));

  const papersList: any[] = Array.isArray(state.ciaPapers?.papers)
    ? state.ciaPapers.papers
    : Array.isArray(state.ciaPapers)
    ? state.ciaPapers
    : [];

  return (
    <div className="min-h-screen space-y-6">
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
          setState({ selectedCourse: val });
          router.push(`/neurobe/cia-question-paper?course_id=${val.value}`);
        }}
        activeView={state.activeTab}
        onBack={() =>
          state.isEditing ? setState({ isEditing: false }) : router.back()
        }
        onViewChange={(view) => setState({ activeTab: view })}
      />

      {state.isEditing ? (
        <>
          <PageHeader
            title="CIA–1 Question Paper"
            icon={<FileQuestion className="text-color2 h-5 w-5" />}
            records={
              state.courseDetail
                ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                : "Draft"
            }
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
            totalPaperMarks={state.totalPaperMarks}
            allocatedSectionMarks={state.allocatedSectionMarks}
            remainingToAllocate={state.remainingToAllocate}
            badgeText="Section Marks Balanced (100%)"
            isBalanced={true}
          />

          <CIASectionsQuestionsCard
            title="2. Sections & Questions"
            subtitle="Allocate marks per section and compose syllabus-aligned questions"
            sections={state.sections}
            onAddSection={() => console.log("Add Section")}
            onAddQuestion={(secId) => console.log("Add Question to", secId)}
            onGenerateQuestions={(secId) =>
              console.log("Generate Questions for", secId)
            }
            onDeleteQuestion={(secId, qId) =>
              console.log("Delete Question", qId, "from", secId)
            }
            onDeleteSection={(secId) => console.log("Delete Section", secId)}
            onSectionSettings={(secId) =>
              console.log("Section Settings for", secId)
            }
          />

          <CIAPaperReviewCard
            title="3. Review & Finalize"
            subtitle="Academic printable preview of the question paper"
            sections={reviewSections}
            onFinalInspection={() => console.log("Final Inspection")}
          />

          <CIAPaperFinalizationActions
            onBackToEditSections={() => setState({ isEditing: false })}
            onSaveDraft={() => console.log("Save Draft")}
            onApproveFinalize={() => console.log("Approve & Finalize")}
            totalPaperMarks={state.totalPaperMarks}
          />
        </>
      ) : (
        <>
          <PageHeader
            title="CIA-1 Question Paper"
            subtitle="Create CIA Question Paper"
            records={
              state.courseDetail
                ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                : ""
            }
            icon={<FileQuestion className="text-color2 h-5 w-5" />}
            actionBtn1={{
              label: "Create CIA Paper",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => {
                const cid = course_id || state.selectedCourse?.value;
                router.push(
                  cid
                    ? `/neurobe/cia-question-paper/create-cia-question-paper?course_id=${cid}`
                    : "/neurobe/cia-question-paper/create-cia-question-paper",
                );
              },
            }}
          />

          {state.loadingCIA && (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin text-color2" />
              <p className="mt-3 text-sm font-semibold text-pri">Loading CIA question papers...</p>
            </div>
          )}

          {!state.loadingCIA && papersList.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
              <FileQuestion className="h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-base font-bold text-[#000] dark:text-white">No CIA Question Papers</h3>
              <p className="mt-1 max-w-sm text-xs text-pri">
                No question papers have been created for this course yet. Click &quot;Create CIA Paper&quot; above to start.
              </p>
            </div>
          )}

          {!state.loadingCIA && papersList.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {papersList.map((paper: any, idx: number) => {
                const isDraft = String(paper.status).toLowerCase() === "draft";
                const cid = course_id || state.selectedCourse?.value;
                const courseTitleDisplay =
                  paper.course_display ||
                  (state.courseDetail
                    ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                    : "");

                return (
                  <CIAQuestionPaperStatusCard
                    key={paper.id || idx}
                    status={isDraft ? "draft" : "approved"}
                    title={paper.paper_name || `CIA Question Paper ${idx + 1}`}
                    courseCodeTitle={courseTitleDisplay}
                    progressData={{
                      sectionsCompleted:
                        paper.progress_display ||
                        `${paper.completed_sections_count ?? 0} of ${paper.sections_count ?? 0} Sections Completed`,
                      marksFilled:
                        paper.marks_display ||
                        `${paper.filled_marks ?? 0} of ${paper.total_marks ?? 0} Marks Filled`,
                      lastEdited: paper.updated_at ? `Last Edited: ${paper.updated_at}` : undefined,
                    }}
                    approvedData={{
                      totalMarks:
                        typeof paper.total_marks === "number"
                          ? `${paper.total_marks} Marks`
                          : paper.total_marks || "100 Marks",
                      sections: paper.sections_count ?? 0,
                      questions: paper.questions_count ?? 0,
                      lastUpdated: paper.updated_at ? `Last Updated: ${paper.updated_at}` : undefined,
                    }}
                    onViewDraft={() => {
                      router.push(
                        cid
                          ? `/neurobe/cia-question-paper/cia-question-paper-preview?course_id=${cid}&paper_id=${paper.id}`
                          : `/neurobe/cia-question-paper/cia-question-paper-preview?paper_id=${paper.id}`,
                      );
                    }}
                    onResumeEditing={() => {
                      setState({ isEditing: true });
                      router.push(
                        cid
                          ? `/neurobe/cia-question-paper/cia-question-paper-edit?course_id=${cid}&paper_id=${paper.id}`
                          : `/neurobe/cia-question-paper/cia-question-paper-edit?paper_id=${paper.id}`,
                      );
                    }}
                    onViewPaper={() => {
                      router.push(
                        cid
                          ? `/neurobe/cia-question-paper/cia-question-paper-preview?course_id=${cid}&paper_id=${paper.id}`
                          : `/neurobe/cia-question-paper/cia-question-paper-preview?paper_id=${paper.id}`,
                      );
                    }}
                    onPrint={() => {
                      if (typeof window !== "undefined") {
                        window.print();
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrivateRouter(CIAQuestionPaper);
