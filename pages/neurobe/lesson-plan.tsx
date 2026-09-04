import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Hourglass,
  Check,
  ClipboardCheck,
  Sparkles,
  Save,
  EditIcon,
} from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { Success, useSetState } from "@/utils/function.utils";
import TableComponent from "@/components/common-components/TableComponent";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StepHeader from "@/components/academic-setup/StepHeader";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import TableTitle from "@/components/common-components/TableTitle";
import GenericTabs from "@/components/common-components/GenericTabs";
import AccordiansStyle from "@/components/common-components/AccordiansStyle";
import PageFooter from "@/components/common-components/PageFooter";
import GenerateLessonPlanModal from "@/components/lesson-plan/GenerateLessonPlanModal";
import EditLessonPlanModal, { LessonPlanEditData } from "@/components/lesson-plan/EditLessonPlanModal";
import ReviewLessonItemModal, { ReviewLessonItemData } from "@/components/lesson-plan/ReviewLessonItemModal";
import { useRouter } from "next/router";

const MOCK_LESSON_PLANS = [
  {
    id: 1,
    sessionNo: 1,
    unit: "Unit I",
    topic: "Introduction to Stacks & LIFO Principle",
    plannedDate: "2026-08-05",
    actualDate: "2026-08-05",
    pedagogy: "Chalk & Board + Animation",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 2,
    sessionNo: 2,
    unit: "Unit I",
    topic: "Array Implementation of Stacks & Operations",
    plannedDate: "2026-08-07",
    actualDate: "2026-08-07",
    pedagogy: "Live Coding Walkthrough",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 3,
    sessionNo: 3,
    unit: "Unit I",
    topic: "Infix to Postfix Expression Conversion Algorithm",
    plannedDate: "2026-08-10",
    actualDate: "2026-08-12",
    pedagogy: "Problem Solving Workshop",
    coMapped: "CO1",
    status: "Completed",
  },
  {
    id: 4,
    sessionNo: 4,
    unit: "Unit II",
    topic: "Binary Search Trees: Insertion & Search",
    plannedDate: "2026-08-14",
    actualDate: "-",
    pedagogy: "Interactive Visualizer",
    coMapped: "CO2",
    status: "In Progress",
  },
  {
    id: 5,
    sessionNo: 5,
    unit: "Unit II",
    topic: "Tree Deletion & AVL Tree Balancing",
    plannedDate: "2026-08-17",
    actualDate: "-",
    pedagogy: "Flipped Classroom",
    coMapped: "CO2",
    status: "Scheduled",
  },
];

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "Unit I", label: "Unit I - Stacks & Queues" },
  { value: "Unit II", label: "Unit II - Trees" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Scheduled", label: "Scheduled" },
];

const STAT_TABS = [
  {
    key: "total-topics",
    label: " Total Topics",
    count: 22,
    subLabel: "Approved curriculum count",
    icon: <Check className="h-5 w-5" />,
  },
  {
    key: "total-hours",
    label: "Total Hours",
    subLabel: "Allocated semester teaching time",
    count: 45,
    icon: <Hourglass className="h-5 w-5" />,
  },
  {
    key: "reviewed",
    label: "Reviewed",
    subLabel: "Lesson Plan Review",
    count: 3,
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
];

const RAW_UNIT_DATA: Record<
  string,
  {
    title: string;
    totalHours: number;
    topics: {
      id: string;
      seq: number;
      title: string;
      level: string;
      hours: string;
      textbook: string;
      reference: string;
      pedagogy: string;
      status: "Reviewed" | "Needs Review";
    }[];
  }
> = {
  "unit-1": {
    title: "Unit 1 — Physical Layer & Network Architectures",
    totalHours: 9,
    topics: [
      {
        id: "1.1", seq: 1,
        title: "Network Models & Layered Architecture",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networks — Chapter 1",
        reference: "Data Communications and Networking — Chapter 2",
        pedagogy: "Concept Exploration",
        status: "Reviewed",
      },
      {
        id: "1.2", seq: 2,
        title: "Physical Layer & Transmission Media",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networks — Chapter 2",
        reference: "Data Communications and Networking — Chapter 3",
        pedagogy: "Guided Discussion",
        status: "Needs Review",
      },
      {
        id: "1.3", seq: 3,
        title: "Network Topologies & Switching Techniques",
        level: "K2", hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 2",
        reference: "Data Communications and Networking — Chapter 8",
        pedagogy: "Concept Exploration",
        status: "Needs Review",
      },
      {
        id: "1.4", seq: 4,
        title: "Network Performance Metrics",
        level: "K3", hours: "2.5 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 1",
        reference: "Computer Networks: A Systems Approach — Chapter 1",
        pedagogy: "Problem-Based Learning",
        status: "Needs Review",
      },
    ],
  },
  "unit-2": {
    title: "Unit 2 — Data Link Layer & Error Control",
    totalHours: 7,
    topics: [
      {
        id: "2.1", seq: 1,
        title: "Framing & Error Detection",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networks — Chapter 3",
        reference: "Data Communications and Networking — Chapter 10",
        pedagogy: "Concept Exploration",
        status: "Needs Review",
      },
      {
        id: "2.2", seq: 2,
        title: "Flow Control Protocols",
        level: "K3", hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 3",
        reference: "Data Communications and Networking — Chapter 11",
        pedagogy: "Problem-Based Learning",
        status: "Needs Review",
      },
      {
        id: "2.3", seq: 3,
        title: "MAC Protocols & CSMA/CD",
        level: "K3", hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 4",
        reference: "Computer Networking: A Top-Down Approach — Chapter 5",
        pedagogy: "Simulation Lab",
        status: "Needs Review",
      },
    ],
  },
  "unit-3": {
    title: "Unit 3 — Network Layer & Routing",
    totalHours: 10,
    topics: [
      {
        id: "3.1", seq: 1,
        title: "IP Addressing & Subnetting",
        level: "K3", hours: "3 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Computer Networking: A Top-Down Approach — Chapter 4",
        pedagogy: "Hands-on Lab",
        status: "Needs Review",
      },
      {
        id: "3.2", seq: 2,
        title: "Routing Algorithms",
        level: "K4", hours: "3 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Data Communications and Networking — Chapter 14",
        pedagogy: "Case Study Analysis",
        status: "Needs Review",
      },
      {
        id: "3.3", seq: 3,
        title: "IPv6 & Transition Mechanisms",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Computer Networking: A Top-Down Approach — Chapter 4",
        pedagogy: "Flipped Classroom",
        status: "Needs Review",
      },
      {
        id: "3.4", seq: 4,
        title: "ICMP & Network Diagnostics",
        level: "K3", hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 4",
        reference: "Computer Networks: A Systems Approach — Chapter 3",
        pedagogy: "Guided Discussion",
        status: "Needs Review",
      },
    ],
  },
  "unit-4": {
    title: "Unit 4 — Transport Layer & TCP/UDP",
    totalHours: 8,
    topics: [
      {
        id: "4.1", seq: 1,
        title: "TCP Connection Management",
        level: "K3", hours: "3 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 3",
        reference: "Computer Networks — Chapter 6",
        pedagogy: "Demonstration",
        status: "Needs Review",
      },
      {
        id: "4.2", seq: 2,
        title: "UDP & Real-time Applications",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 3",
        reference: "Data Communications and Networking — Chapter 23",
        pedagogy: "Comparative Analysis",
        status: "Needs Review",
      },
      {
        id: "4.3", seq: 3,
        title: "Congestion Control Mechanisms",
        level: "K4", hours: "3 Hours",
        textbook: "Computer Networks — Chapter 6",
        reference: "Computer Networking: A Top-Down Approach — Chapter 3",
        pedagogy: "Problem-Based Learning",
        status: "Needs Review",
      },
    ],
  },
  "unit-5": {
    title: "Unit 5 — Application Layer & Security",
    totalHours: 7,
    topics: [
      {
        id: "5.1", seq: 1,
        title: "DNS & HTTP Protocols",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 2",
        reference: "Computer Networks — Chapter 7",
        pedagogy: "Interactive Demo",
        status: "Needs Review",
      },
      {
        id: "5.2", seq: 2,
        title: "Email & FTP Protocols",
        level: "K2", hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 2",
        reference: "Data Communications and Networking — Chapter 26",
        pedagogy: "Concept Exploration",
        status: "Needs Review",
      },
      {
        id: "5.3", seq: 3,
        title: "Network Security Fundamentals",
        level: "K3", hours: "3 Hours",
        textbook: "Computer Networks — Chapter 8",
        reference: "Computer Networking: A Top-Down Approach — Chapter 8",
        pedagogy: "Guest Lecture",
        status: "Needs Review",
      },
    ],
  },
};

const UNIT_TABS = [
  { key: "unit-1", label: "Unit 1", count: 4 },
  { key: "unit-2", label: "Unit 2", count: 3 },
  { key: "unit-3", label: "Unit 3", count: 4 },
  { key: "unit-4", label: "Unit 4", count: 3 },
  { key: "unit-5", label: "Unit 5", count: 3 },
];

const totalTopics = UNIT_TABS.reduce((a, b) => a + b.count, 0);
const totalUnits = UNIT_TABS.length;
const totalRecs = Object.values(RAW_UNIT_DATA).reduce(
  (s, u) => s + u.topics.length,
  0,
);

const LessonPlan = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    search: "",
    unitFilter: "all",
    statusFilter: "all",
    loading: false,
    activeTab: "unit-1",
  });

  useEffect(() => {
    dispatch(setPageTitle("Lesson Plan"));
  }, [dispatch]);

  const raw = RAW_UNIT_DATA[state.activeTab];

  // modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: LessonPlanEditData | null;
  }>({ open: false, data: null });

  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    data: ReviewLessonItemData | null;
    unitKey: string;
    topicId: string;
  }>({ open: false, data: null, unitKey: "", topicId: "" });

  const [generateModal, setGenerateModal] = useState(false);

  // ── Per-unit reviewed topic tracking ──────────────────────────────────────
  // Pre-seed with topics that already have status "Reviewed" in RAW_UNIT_DATA
  const [reviewedMap, setReviewedMap] = useState<Record<string, Set<string>>>(
    () =>
      Object.fromEntries(
        Object.entries(RAW_UNIT_DATA).map(([unitKey, unit]) => [
          unitKey,
          new Set(
            unit.topics
              .filter((t) => t.status === "Reviewed")
              .map((t) => t.id),
          ),
        ]),
      ),
  );

  const totalTopicCount = Object.values(RAW_UNIT_DATA).reduce(
    (s, u) => s + u.topics.length,
    0,
  );
  const totalReviewedCount = Object.values(reviewedMap).reduce(
    (s, set) => s + set.size,
    0,
  );
  const allReviewed = totalReviewedCount >= totalTopicCount;

  const markReviewed = (unitKey: string, topicId: string) => {
    setReviewedMap((prev) => {
      const next = new Set<string>(prev[unitKey] ?? new Set<string>());
      next.add(topicId);
      return { ...prev, [unitKey]: next };
    });
  };

  // ── Pre-generate: topics list for the accordion (level + hours badges only) ──
  const buildInitialTopics = () => {
    if (!raw) return [];
    return raw.topics.map((topic) => ({
      id: topic.id,
      title: `Topic ${topic.id} — ${topic.title}`,
      collapsedBadge: [
        { label: `Knowledge Level ${topic.level}`, className: "bg-color2-l text-color2 font-bold" },
        { label: topic.hours, className: "bg-gray-200 text-pri font-bold" },
      ],
      items: [],
    }));
  };

  // ── Generated: flat table columns matching the screenshot ──
  const lessonPlanColumns = [
    {
      accessor: "seq",
      title: "SEQ",
      render: ({ seq }: any) => (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-color2">
          {String(seq).padStart(2, "0")}
        </span>
      ),
    },
    {
      accessor: "title",
      title: "TOPIC",
      render: ({ title, id }: any) => (
        <div>
          <p className="font-semibold text-[#000] dark:text-white">{title}</p>
          <p className="mt-0.5 text-xs text-gray-400">Topic {id}</p>
        </div>
      ),
    },
    {
      accessor: "level",
      title: "LEVEL",
      render: ({ level }: any) => (
        <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-600">
          {level}
        </span>
      ),
    },
    {
      accessor: "textbook",
      title: "BOOKS & REFERENCES",
      render: ({ textbook, reference }: any) => (
        <div className="min-w-0">
          <p className="text-xs text-[#000]">
            <span className="font-semibold">Textbook:</span> {textbook}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            <span className="font-semibold">Reference:</span> {reference}
          </p>
        </div>
      ),
    },
    {
      accessor: "hours",
      title: "HOURS",
      render: ({ hours }: any) => (
        <span className="text-xs font-semibold text-[#000]">{hours}</span>
      ),
    },
    {
      accessor: "pedagogy",
      title: "PEDAGOGY",
      render: ({ pedagogy }: any) => (
        <span className="text-xs font-semibold text-color2">{pedagogy}</span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({ status, id, seq, title, level, hours, textbook, reference, pedagogy }: any) => {
        const isReviewed =
          status === "Reviewed" || (reviewedMap[state.activeTab]?.has(id) ?? false);

        return isReviewed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            Reviewed <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ) : (
          <button
            type="button"
            onClick={() =>
              setReviewModal({
                open: true,
                unitKey: state.activeTab,
                topicId: id,
                data: {
                  id, seq, title, level, hours, textbook, reference, pedagogy,
                  unitLabel: raw?.title ?? "",
                },
              })
            }
            className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 hover:border-orange-400 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            • Needs Review
          </button>
        );
      },
    },
    {
      accessor: "id",
      title: "EDIT",
      render: ({ title, id, seq, level, hours, textbook, reference, pedagogy, status }: any) => (
        <button
          type="button"
          onClick={() =>
            setEditModal({
              open: true,
              data: {
                id, seq, title, level, hours, textbook, reference, pedagogy, status,
                unitLabel: raw?.title ?? "",
              },
            })
          }
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-color2"
        >
          <EditIcon className="h-3.5 w-3.5" /> Edit
        </button>
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

      <StepHeader
        title="Lesson Plan"
        description="Create a teaching plan using the approved topics, books, hours, and pedagogies."
        pill="CS309 — Computer Networks"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {STAT_TABS.map((tab) => (
          <StatTabCard
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            subLabel={tab.subLabel}
            count={tab.count}
            active={state.activeTab === tab.key}
          />
        ))}
      </div>

      <TableTitle
        title="Approved topcis"
        label={`${totalUnits} Units`}
        subLabel={`${totalTopics} Topics`}
      />

      <div className="mt-4">
        <GenericTabs
          tabs={UNIT_TABS}
          activeKey={state.activeTab}
          onChange={(unit) => setState({ activeTab: unit as string })}
        />

        {state.recommendationsGenerated ? (
          /* ── Generated: flat table with header ── */
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 mb-5">
            {/* dark header */}
            <div className="flex items-center justify-between bg-[#111238] px-4 py-3 text-white">
              <div>
                <h3 className="text-lg font-bold">{raw?.title}</h3>
                <p className="mt-0.5 text-sm text-white/70">
                  Approved topic sequencing and teaching methods
                </p>
              </div>
              <span className="rounded bg-white/15 px-4 py-1 text-sm font-semibold">
                {raw?.totalHours} Hours
              </span>
            </div>
            <TableComponent
              records={raw?.topics ?? []}
              columns={lessonPlanColumns}
            />
          </div>
        ) : (
          /* ── Pre-generate: accordion with level/hours badges ── */
          <AccordiansStyle
            expandable={false}
            topics={buildInitialTopics()}
            title={raw?.title}
            subtitle="Approved syllabus topics ready for lesson plan generation."
            footerContent={
              <>
                <Sparkles className="h-4 w-4" /> NEURO AI will sequence all 22
                topics, assign textbook chapters, calibrate session hours, and
                link pedagogy methods.
              </>
            }
          />
        )}
      </div>

      {state.recommendationsGenerated ? (
        <PageFooter
          content1={`Reviewed: ${totalReviewedCount}/${totalTopicCount} Topics`}
          content2="Course: CS309 — Computer Networks"
          batch
          actionBtn1={
            state.lessonApproved
              ? {
                  label: "Next:Learning Material",
                  icon: <Check className="h-4 w-4" />,
                  onClick: () => router.push("neurobe/learning-materials"),
                  className: "create-btn",
                }
              : {
                  label: "Complete Lesson Plan Review",
                  icon: <Check className="h-4 w-4" />,
                  onClick: () => {
                    Success("Lesson plan review completed successfully");
                    setState({ lessonApproved: true });
                  },
                  disabled: !allReviewed,
                }
          }
          actionBtn2={{
            label: "Save Draft",
            icon: <Save className="h-4 w-4" />,
            onClick: () => {},
          }}
        />
      ) : (
        <PageFooter
          content1="Ready to synthesize the 22-session Lesson Plan?"
          actionBtn1={{
            label: "Generate Lesson Plan with NEURO AI",
            icon: <Sparkles className="h-4 w-4" />,
            onClick: () => setGenerateModal(true),
            className: "create-btn",
          }}
        />
      )}

      <GenerateLessonPlanModal
        open={generateModal}
        onClose={() => setGenerateModal(false)}
        courseLabel="CS309 — Computer Networks"
        stats={{ topics: 22, units: 5, hours: 45 }}
        onReview={() => setState({ recommendationsGenerated: true })}
      />

      <EditLessonPlanModal
        open={editModal.open}
        onClose={() => setEditModal((p) => ({ ...p, open: false }))}
        data={editModal.data}
      />

      <ReviewLessonItemModal
        open={reviewModal.open}
        onClose={() => setReviewModal((p) => ({ ...p, open: false }))}
        data={reviewModal.data}
        onAccept={() => markReviewed(reviewModal.unitKey, reviewModal.topicId)}
      />
    </div>
  );
};

export default PrivateRouter(LessonPlan);
