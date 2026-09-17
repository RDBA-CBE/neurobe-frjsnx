import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Users,
  Sparkles,
  Database,
  BriefcaseBusiness,
  Compass,
  Search,
} from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { Success, useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Models from "@/imports/models.import";
import PageHeader from "@/components/common-components/PageHeader";
import QuestionBankFilter, {
  FilterValues,
} from "@/components/question-bank/QuestionBankFilter";
import QuestionCard, {
  QuestionCardProps,
} from "@/components/question-bank/QuestionCard";
import QuestionDetailCard from "@/components/question-bank/QuestionDetailCard";
import TabButton from "@/components/common-components/TabButton";
import GenericTabs from "@/components/common-components/GenericTabs";
import { QUS_TABS, UNIT_LIST, UNIT_TABS } from "@/utils/constant.utils";
import { EditQuestionModal } from "@/components/academic-setup/Question-bank/EditQuestionModal";
import ViewQuestionModal from "@/components/question-bank/ViewQuestionModal";
import GenerateQuestionsModal from "@/components/question-bank/GenerateQuestionsModal";
import QuestionSetsHeader from "@/components/question-bank/QuestionSetsHeader";
import QuestionSetsSearch from "@/components/question-bank/QuestionSetsSearch";
import QuestionSetBanner from "@/components/question-bank/QuestionSetBanner";
import QuestionSetCard, {
  QuestionSetCardProps,
} from "@/components/question-bank/QuestionSetCard";
import SyllabusStructureSidebar from "@/components/question-bank/SyllabusStructureSidebar";

const QUESTION_SETS: QuestionSetCardProps[] = [
  {
    id: "set-01",
    unit: "Unit 1",
    date: "Aug 18, 2025",
    title: "Unit 1 — Network Models — Set 01",
    topicSummary: "Network Models & Layered Architecture",
    total: 4,
    draft: 2,
    review: 0,
    approved: 2,
    accentColor: "#f97316",
    unitColor: "#fff7ed",
  },
  {
    id: "set-02",
    unit: "Unit 1",
    date: "Aug 19, 2025",
    title: "Unit 1 — Physical Layer — Set 02",
    topicSummary: "Physical Layer & Transmission Media",
    total: 1,
    draft: 0,
    review: 1,
    approved: 0,
    accentColor: "#22c55e",
    unitColor: "#f0fdf4",
  },
  {
    id: "set-03",
    unit: "Unit 2",
    date: "Aug 20, 2025",
    title: "Unit 2 — Error Detection — Set 03",
    topicSummary: "3 Topics • 3 Subtopics",
    total: 5,
    draft: 1,
    review: 1,
    approved: 3,
    accentColor: "#a855f7",
    unitColor: "#faf5ff",
  },
  {
    id: "set-04",
    unit: "Unit 3",
    date: "Aug 21, 2025",
    title: "Unit 3 — IPv4 Subnetting — Set 04",
    topicSummary: "3 Topics • 3 Subtopics",
    total: 4,
    draft: 1,
    review: 0,
    approved: 3,
    accentColor: "#3b82f6",
    unitColor: "#eff6ff",
  },
  {
    id: "set-05",
    unit: "Unit 4",
    date: "Aug 21, 2025",
    title: "Unit 4 — Transport Protocols — Set 05",
    topicSummary: "3 Topics • 3 Subtopics",
    total: 2,
    draft: 0,
    review: 0,
    approved: 2,
    accentColor: "#f59e0b",
    unitColor: "#fffbeb",
  },
  {
    id: "set-06",
    unit: "Unit 5",
    date: "Aug 22, 2025",
    title: "Unit 5 — Application Layer — Set 06",
    topicSummary: "3 Topics • 3 Subtopics",
    total: 4,
    draft: 1,
    review: 1,
    approved: 2,
    accentColor: "#10b981",
    unitColor: "#ecfdf5",
  },
];

const SAMPLE_QUESTIONS: QuestionCardProps[] = [
  {
    id: "Q-CN-001",
    question:
      "What is the total latency for transmitting a 1,500 Byte packet over a 100 Mbps link with a physical length of 10 km (signal velocity = 2 × 10^8 m/s)?",
    unit: "Unit 1",
    topic: "Network Performance Metrics",
    subtopic: "Propagation vs Transmission Delay Calculations",
    tags: [
      { label: "CO1" },
      { label: "K3" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Medium" },
    ],
    specialTag: { label: "Eligible for MCQ Tests", color: "green" },
    status: "approved",
  },
  {
    id: "Q-CN-004",
    question:
      "Why does CSMA/CD enforce a minimum frame size constraint (e.g., 64 bytes) on IEEE 802.3 Ethernet networks?",
    unit: "Unit 2",
    topic: "Medium Access Control (MAC) Sublayer",
    subtopic: "CSMA/CD & Exponential Backoff Algorithm",
    tags: [
      { label: "CO2" },
      { label: "K3" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Medium" },
    ],
    specialTag: { label: "Pending Approval", color: "orange" },
    status: "reviewed",
  },
  {
    id: "Q-CN-007",
    question:
      "In a Go-Back-N ARQ protocol utilizing a 4-bit sequence number, what is the maximum sender window size (W_s) permissible to avoid ambiguous frame acceptance?",
    unit: "Unit 2",
    topic: "Sliding Window Flow Control Protocols",
    subtopic: "Go-Back-N ARQ Window Sizing and Timers",
    tags: [
      { label: "CO2" },
      { label: "K3" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Medium" },
    ],
    status: "approved",
  },
];

const SET_QUESTIONS: QuestionCardProps[] = [
  {
    id: "Q-CN-029",
    question:
      "Which layer of the OSI reference model is primarily responsible for end-to-end packet routing and logical network addressing across heterogeneous subnetworks?",
    unit: "Unit 1",
    topic: "Network Models & Layered Architecture",
    subtopic: "OSI 7-Layer Reference Model",
    tags: [
      { label: "CO1" },
      { label: "K2" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Easy" },
    ],
    specialTag: { label: "Pending Review", color: "gray" },
    status: "draft",
  },
  {
    id: "Q-CN-001",
    question:
      "Which layer of the OSI reference model is primarily responsible for end-to-end packet routing and logical network addressing across heterogeneous subnetworks?",
    unit: "Unit 1",
    topic: "Network Models & Layered Architecture",
    subtopic: "OSI 7-Layer Reference Model",
    tags: [
      { label: "CO1" },
      { label: "K2" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Easy" },
    ],
    specialTag: { label: "Eligible for MCQ Tests", color: "green" },
    status: "approved",
  },
  {
    id: "Q-CN-003",
    question:
      "In a mesh network topology with N nodes, what is the exact number of dedicated full-duplex physical links required to achieve complete inter-node interconnection?",
    unit: "Unit 1",
    topic: "Network Topologies & Switching Techniques",
    subtopic: "Packet Switching vs Circuit Switching",
    tags: [
      { label: "CO1" },
      { label: "K2" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Medium" },
    ],
    specialTag: { label: "Pending Review", color: "gray" },
    status: "draft",
  },
  {
    id: "Q-CN-004",
    question:
      "What is the total latency for transmitting a 1,500 Byte packet over a 100 Mbps link with a physical length of 10 km (signal velocity = 2 × 10^8 m/s)?",
    unit: "Unit 1",
    topic: "Network Performance Metrics",
    subtopic: "Propagation vs Transmission Delay Calculations",
    tags: [
      { label: "CO1" },
      { label: "K3" },
      { label: "MCQ" },
      { label: "2 Marks" },
      { label: "Medium" },
    ],
    specialTag: { label: "Eligible for MCQ Tests", color: "green" },
    status: "approved",
  },
];

const QuestionBank = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    isEditing: false,
    isGenerating: false,
    viewQuestion: null as any,
    activeQTab: "all-questions" as "all-questions" | "question-sets",
    appliedFilters: null as FilterValues | null,
    isSyllabusOpen: false,
    selectedSetId: null as string | null,
    activeBannerTab: "coordinator",
    courseData: null as any,
    loading: false,
    questions: [] as any[],
    approvingId: null as string | null,
    editingQuestion: null as any,
    editingLoading: false,
    viewingQuestion: null as any,
    viewingLoading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("Question Bank"));
  }, [dispatch]);

  // ── Get course data by course_id ──


  useEffect(() => {
    if (course_id) {
      get_course_data();
      question_list()
    }
  }, [course_id]);

  const get_course_data = async () => {
    try {
      if (!course_id) return;

      const response = await Models.course.detail(course_id);
      console.log('✌️Course data --->', response);

      setState({ courseData: response });
    } catch (error: any) {
      console.error('✌️Get course error --->', error);
    }
  };

  const question_list = async () => {
    try {
      const response: any = await Models.question_bank.question_list({});
      console.log('✌️question_list --->', response);

      // Transform API response to QuestionCardProps format
      const transformedQuestions = (response?.items || []).map((q: any) => ({
        id: q.id,
        question: q.text,
        unit: `Unit ${q.unit_number || '-'}`,
        topic: q.topic,
        subtopic: q.subtopic,
        question_code: q.question_code,
        unit_title: q.unit_title,
        course_outcome: q.course_outcome,
        tags: [
          { label: q.knowledge_level },
          { label: "MCQ" },
          { label: `${q.marks || 2} Marks` },
          { label: q.difficulty?.charAt(0).toUpperCase() + q.difficulty?.slice(1) },
        ],
        specialTag:
          q.status === "Approved"
            ? { label: "Eligible for MCQ Tests", color: "green" }
            : q.status === "Draft"
              ? { label: "Pending Review", color: "gray" }
              : { label: "Under Review", color: "orange" },
        status: q.status?.toLowerCase() || "draft",
      }));

      setState({ questions: transformedQuestions });
    } catch (error: any) {
      console.error('✌️Get course error --->', error);
    }
  };

  const genrerate_question = async (data) => {
    try {

      const response = await Models.question_bank.generate(data);
      console.log('genrerate_question --->', response);

      question_list()
      // setState({ courseData: response });
    } catch (error: any) {
      console.error('✌️Get course error --->', error);
    }
  };

  const handleApprove = async (data) => {
    try {
      setState({ approvingId: data?.id });

      const body = {
        "status": "Approved",
      }
      const response = await Models.question_bank.approve_question(data?.id, body);
      console.log('approve_question --->', response);

      await question_list();

      setState({ approvingId: null });
    } catch (error: any) {
      console.error('✌️Approve error --->', error);
      setState({ approvingId: null });
    }
  };

  const handleEdit = async (data) => {
    try {
      setState({ editingLoading: true });

      const response = await Models.question_bank.detail(data?.id);
      console.log('✌️Question detail --->', response);

      setState({
        editingQuestion: response,
        isEditing: true,
        editingLoading: false,
      });
    } catch (error: any) {
      console.error('✌️Edit error --->', error);
      setState({ editingLoading: false });
    }
  };

  const handleEditData = async (data) => {
    {
      try {
        const response = await Models.question_bank.update(state.editingQuestion?.id, data);
        console.log('✌️Question updated --->', response);
        await question_list();
        Success("Question updated")
      } catch (error) {
        console.error('✌️Update error --->', error);
        throw error;
      }
    }

  };

  const handleView = async (question: any) => {
    try {
      setState({ viewingLoading: true });

      const response = await Models.question_bank.detail(question?.id);
      console.log('✌️Question detail for view --->', response);
      
      // Transform API response to ViewQuestionModal props format
      const correctAnswerLetter = response.options?.findIndex((o: any) => o.is_correct) >= 0
        ? String.fromCharCode(65 + response.options.findIndex((o: any) => o.is_correct))
        : null;

      const transformedQuestion = {
        id: response.question_code,
        status: response.status?.toLowerCase() || "draft",
        unit: `Unit ${response.unit_number}`,
        topic: response.topic,
        subtopic: response.subtopic,
        co: response.course_outcome,
        level: response.knowledge_level,
        marks: response.marks,
        difficulty: response.difficulty?.charAt(0).toUpperCase() + response.difficulty?.slice(1),
        question: response.text,
        optionA: response.options?.[0]?.text || "",
        optionB: response.options?.[1]?.text || "",
        optionC: response.options?.[2]?.text || "",
        optionD: response.options?.[3]?.text || "",
        correctAnswer: correctAnswerLetter,
        explanation: response.explanation,
        approvedBy: response.approved_by,
        approvedDate: response.approved_at ? new Date(response.approved_at).toLocaleDateString() : undefined,
      };

      setState({ 
        viewingQuestion: transformedQuestion,
        viewingLoading: false,
      });
    } catch (error: any) {
      console.error('✌️View error --->', error);
      setState({ viewingLoading: false });
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
        courseOptions={[
          { value: state.courseData?.id, label: `Course: ${state.courseData?.course_code}` },
        ]}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeBannerTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeBannerTab: view })}
      />

      <PageHeader
        title="Question Bank"
        records={`${state.courseData?.course_code} — ${state.courseData?.course_title}` || "Question Bank"}
        subtitle={`Create, review, approve, and reuse questions across the course.`}
        icon={<Users className="h-5 w-5 text-color2" />}
        actionBtn4={
          state.isEditing
            ? undefined
            : {
              label: "Generate Questions",
              icon: <Sparkles className="h-4 w-4" />,
              onClick: () => setState({ isGenerating: true }),
            }
        }
      />
      <TabButton
        tabs={[
          {
            key: "all-questions",
            label: "All Questions",
            count: 28,
            icon: <Database className="h-4 w-4" />,
          },
          {
            key: "question-sets",
            label: "Question Sets",
            count: 6,
            icon: <BriefcaseBusiness className="h-4 w-4" />,
          },
        ]}
        activeKey={state.activeQTab}
        onChange={(key) =>
          setState({ activeQTab: key as "all-questions" | "question-sets" })
        }
      />
      {state.activeQTab === "all-questions" && (
        <>
          <div className="mt-6">
            <GenericTabs
              tabs={QUS_TABS}
              activeKey={state.activeTab}
              onChange={(unit) => setState({ activeTab: unit as string })}
              rightContent={
                <div className="flex items-center gap-2 text-xs">
                  <Compass className=" text-color2 h-4  w-4 text-sm font-bold" />
                  <div
                    className="text-color2 cursor-pointer  text-sm font-bold"
                    onClick={() => setState({ isSyllabusOpen: true })}
                  >
                    Browse Syllabus Structure
                  </div>
                </div>
              }
            />
          </div>
          <div className="mt-4">
            <QuestionBankFilter
              onApply={(filters) => setState({ appliedFilters: filters })}
              question={true}
            />
          </div>
          <div className="space-y-3">
            {state.questions.map((q) => (
              <QuestionCard
                key={q.id}
                {...q}
                isApprovingLoading={state.approvingId === q.id}
                onView={() => handleView(q)}
                onEdit={() => handleEdit(q)}
                onApprove={() => handleApprove(q)}
              />
            ))}
          </div>
        </>
      )}

      {state.activeQTab === "question-sets" && (
        <div className="mt-4 space-y-3">
          {!state.selectedSetId ? (
            <>
              <QuestionSetsHeader count={6} />
              <QuestionSetsSearch />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {QUESTION_SETS.map((qs) => (
                  <QuestionSetCard
                    key={qs.title}
                    {...qs}
                    onOpen={() => setState({ selectedSetId: qs.id })}
                  />
                ))}
              </div>

            </>
          ) : (
            <div className="space-y-3">
              {(() => {
                const qs = QUESTION_SETS.find((q) => q.id === state.selectedSetId);
                return qs ? (
                  <QuestionSetBanner
                    unit={qs.unit}
                    title={qs.title}
                    generatedOn={qs.date}
                    totalQuestions={qs.total}
                    approved={qs.approved}
                    accentColor={qs.accentColor}
                    unitColor={qs.unitColor}
                    topics={[qs.topicSummary]}
                  />
                ) : null;
              })()}
              <GenericTabs
                tabs={QUS_TABS}
                activeKey={state.activeTab}
                onChange={(unit) => setState({ activeTab: unit as string })}
                rightContent={
                  <div className="flex items-center gap-2 rounded-xl mb-1 border border-gray-200 bg-white px-4  h-11">
                    <Search className="h-4 w-4 shrink-0 text-[#000]" />
                    <input
                      type="text"
                      placeholder="Search questions in this set..."
                      className="w-64 bg-transparent text-sm text-[#000] placeholder:text-gray-400 outline-none"
                    />
                  </div>
                }
              />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pt-2">
                {SET_QUESTIONS.map((q) => (
                  <QuestionDetailCard
                    key={q.id}
                    {...q}
                    onView={() => setState({ viewQuestion: q })}
                    onEdit={() => setState({ isEditing: true })}
                    onMarkAsReviewed={() => console.log("Mark as reviewed:", q.id)}
                    onApprove={() => console.log("Approve:", q.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SyllabusStructureSidebar
        open={state.isSyllabusOpen}
        onClose={() => setState({ isSyllabusOpen: false })}
        courseCode="CS309 — Computer Networks"
        totalCount={19}
        units={UNIT_LIST}
      />

      <GenerateQuestionsModal
        open={state.isGenerating}
        onClose={() => setState({ isGenerating: false })}
        courseCode={`${state.courseData?.course_code} — ${state.courseData?.course_title}`}
        courseId={state.courseData?.course_code}
        units={state.courseData?.latest_syllabus?.units || []}
        outcomes={state.courseData?.latest_syllabus?.outcomes || []}
        onSubmit={(data) => genrerate_question(data)}
      />

      <EditQuestionModal
        open={state.isEditing}
        onClose={() => setState({ isEditing: false, editingQuestion: null })}
        topicLabel={`${state.courseData?.course_code} — ${state.courseData?.course_title}`}
        code={state.editingQuestion?.question_code}
        questionData={state.editingQuestion}
        outcomes={state.courseData?.latest_syllabus?.outcomes || []}
        onSave={async (data) => handleEditData(data)}
      />

      <ViewQuestionModal
        open={!!state.viewingQuestion}
        onClose={() => setState({ viewingQuestion: null })}
        question={state.viewingQuestion || {
          id: "",
          status: "draft",
          question: "",
        }}
      />
    </div>
  );
};

export default PrivateRouter(QuestionBank);
