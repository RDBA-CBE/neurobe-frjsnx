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
import EditLessonPlanModal, {
  LessonPlanEditData,
} from "@/components/lesson-plan/EditLessonPlanModal";
import ReviewLessonItemModal, {
  ReviewLessonItemData,
} from "@/components/lesson-plan/ReviewLessonItemModal";
import { useRouter } from "next/router";
import { UNIT_TABS } from "@/utils/constant.utils";
import { Alert } from "@mantine/core";
import AIGenerateModal from "@/components/common-components/AIGenerateModal";
import TextArea from "@/components/FormFields/TextArea.component";
import CheckboxInput from "@/components/FormFields/CheckBoxInput.component";

const STAT_TABS = [
  {
    key: "approve-topics",
    label: "Approved Topics",
    count: 22,
    subLabel: "Approved topics count",
    icon: <Check className="h-5 w-5" />,
  },
  {
    key: "approved-material-hours",
    label: "Approved Materials",
    subLabel: "Approved Material Count",
    count: "0 / 22",
    icon: <Hourglass className="h-5 w-5" />,
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
      status: "Not Generated" | "Approved";
    }[];
  }
> = {
  "unit-1": {
    title: "Unit 1 — Physical Layer & Network Architectures",
    totalHours: 9,
    topics: [
      {
        id: "1.1",
        seq: 1,
        title: "Network Models & Layered Architecture",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networks — Chapter 1",
        reference: "Data Communications and Networking — Chapter 2",
        pedagogy: "Concept Exploration",
        status: "Not Generated",
      },
      {
        id: "1.2",
        seq: 2,
        title: "Physical Layer & Transmission Media",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networks — Chapter 2",
        reference: "Data Communications and Networking — Chapter 3",
        pedagogy: "Guided Discussion",
        status: "Approved",
      },
      {
        id: "1.3",
        seq: 3,
        title: "Network Topologies & Switching Techniques",
        level: "K2",
        hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 2",
        reference: "Data Communications and Networking — Chapter 8",
        pedagogy: "Concept Exploration",
        status: "Not Generated",
      },
      {
        id: "1.4",
        seq: 4,
        title: "Network Performance Metrics",
        level: "K3",
        hours: "2.5 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 1",
        reference: "Computer Networks: A Systems Approach — Chapter 1",
        pedagogy: "Problem-Based Learning",
        status: "Not Generated",
      },
    ],
  },
  "unit-2": {
    title: "Unit 2 — Data Link Layer & Error Control",
    totalHours: 7,
    topics: [
      {
        id: "2.1",
        seq: 1,
        title: "Framing & Error Detection",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networks — Chapter 3",
        reference: "Data Communications and Networking — Chapter 10",
        pedagogy: "Concept Exploration",
        status: "Not Generated",
      },
      {
        id: "2.2",
        seq: 2,
        title: "Flow Control Protocols",
        level: "K3",
        hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 3",
        reference: "Data Communications and Networking — Chapter 11",
        pedagogy: "Problem-Based Learning",
        status: "Not Generated",
      },
      {
        id: "2.3",
        seq: 3,
        title: "MAC Protocols & CSMA/CD",
        level: "K3",
        hours: "2.5 Hours",
        textbook: "Computer Networks — Chapter 4",
        reference: "Computer Networking: A Top-Down Approach — Chapter 5",
        pedagogy: "Simulation Lab",
        status: "Not Generated",
      },
    ],
  },
  "unit-3": {
    title: "Unit 3 — Network Layer & Routing",
    totalHours: 10,
    topics: [
      {
        id: "3.1",
        seq: 1,
        title: "IP Addressing & Subnetting",
        level: "K3",
        hours: "3 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Computer Networking: A Top-Down Approach — Chapter 4",
        pedagogy: "Hands-on Lab",
        status: "Not Generated",
      },
      {
        id: "3.2",
        seq: 2,
        title: "Routing Algorithms",
        level: "K4",
        hours: "3 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Data Communications and Networking — Chapter 14",
        pedagogy: "Case Study Analysis",
        status: "Not Generated",
      },
      {
        id: "3.3",
        seq: 3,
        title: "IPv6 & Transition Mechanisms",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networks — Chapter 5",
        reference: "Computer Networking: A Top-Down Approach — Chapter 4",
        pedagogy: "Flipped Classroom",
        status: "Not Generated",
      },
      {
        id: "3.4",
        seq: 4,
        title: "ICMP & Network Diagnostics",
        level: "K3",
        hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 4",
        reference: "Computer Networks: A Systems Approach — Chapter 3",
        pedagogy: "Guided Discussion",
        status: "Not Generated",
      },
    ],
  },
  "unit-4": {
    title: "Unit 4 — Transport Layer & TCP/UDP",
    totalHours: 8,
    topics: [
      {
        id: "4.1",
        seq: 1,
        title: "TCP Connection Management",
        level: "K3",
        hours: "3 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 3",
        reference: "Computer Networks — Chapter 6",
        pedagogy: "Demonstration",
        status: "Not Generated",
      },
      {
        id: "4.2",
        seq: 2,
        title: "UDP & Real-time Applications",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 3",
        reference: "Data Communications and Networking — Chapter 23",
        pedagogy: "Comparative Analysis",
        status: "Not Generated",
      },
      {
        id: "4.3",
        seq: 3,
        title: "Congestion Control Mechanisms",
        level: "K4",
        hours: "3 Hours",
        textbook: "Computer Networks — Chapter 6",
        reference: "Computer Networking: A Top-Down Approach — Chapter 3",
        pedagogy: "Problem-Based Learning",
        status: "Not Generated",
      },
    ],
  },
  "unit-5": {
    title: "Unit 5 — Application Layer & Security",
    totalHours: 7,
    topics: [
      {
        id: "5.1",
        seq: 1,
        title: "DNS & HTTP Protocols",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 2",
        reference: "Computer Networks — Chapter 7",
        pedagogy: "Interactive Demo",
        status: "Not Generated",
      },
      {
        id: "5.2",
        seq: 2,
        title: "Email & FTP Protocols",
        level: "K2",
        hours: "2 Hours",
        textbook: "Computer Networking: A Top-Down Approach — Chapter 2",
        reference: "Data Communications and Networking — Chapter 26",
        pedagogy: "Concept Exploration",
        status: "Not Generated",
      },
      {
        id: "5.3",
        seq: 3,
        title: "Network Security Fundamentals",
        level: "K3",
        hours: "3 Hours",
        textbook: "Computer Networks — Chapter 8",
        reference: "Computer Networking: A Top-Down Approach — Chapter 8",
        pedagogy: "Guest Lecture",
        status: "Not Generated",
      },
    ],
  },
};

const totalTopics = UNIT_TABS.reduce((a, b) => a + b.count, 0);
const totalUnits = UNIT_TABS.length;
const totalRecs = Object.values(RAW_UNIT_DATA).reduce(
  (s, u) => s + u.topics.length,
  0
);

const LearningMeterials = () => {
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
            unit.topics.filter((t) => t.status === "Approved").map((t) => t.id)
          ),
        ])
      )
  );

  const totalTopicCount = Object.values(RAW_UNIT_DATA).reduce(
    (s, u) => s + u.topics.length,
    0
  );
  const totalReviewedCount = Object.values(reviewedMap).reduce(
    (s, set) => s + set.size,
    0
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
      button: {
        label: `Generate Material`,
        icon: <Sparkles className="h-3 w-3" />,
      },
      verified: topic.status,
      verified_status: topic.status,

      items: [],
    }));
  };

  // ── Generated: flat table columns matching the screenshot ──
  const lessonPlanColumns = [
    {
      accessor: "seq",
      title: "SEQ",
      render: ({ seq }: any) => (
        <span className="text-color2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-bold">
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
        <span className="text-color2 text-xs font-semibold">{pedagogy}</span>
      ),
    },
    {
      accessor: "status",
      title: "STATUS",
      render: ({
        status,
        id,
        seq,
        title,
        level,
        hours,
        textbook,
        reference,
        pedagogy,
      }: any) => {
        const isReviewed =
          status === "Reviewed" ||
          (reviewedMap[state.activeTab]?.has(id) ?? false);

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
                  id,
                  seq,
                  title,
                  level,
                  hours,
                  textbook,
                  reference,
                  pedagogy,
                  unitLabel: raw?.title ?? "",
                },
              })
            }
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 transition-colors hover:border-orange-400 hover:bg-orange-100"
          >
            • Need Review
          </button>
        );
      },
    },
    {
      accessor: "id",
      title: "EDIT",
      render: ({
        title,
        id,
        seq,
        level,
        hours,
        textbook,
        reference,
        pedagogy,
        status,
      }: any) => (
        <button
          type="button"
          onClick={() =>
            setEditModal({
              open: true,
              data: {
                id,
                seq,
                title,
                level,
                hours,
                textbook,
                reference,
                pedagogy,
                status,
                unitLabel: raw?.title ?? "",
              },
            })
          }
          className="hover:text-color2 flex items-center gap-1 text-xs font-semibold text-gray-500"
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
        title="Learning Materials"
        description="Generate, review, edit, and approve learning materials for approved course topics."
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
        title="Learning Material List"
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
          <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
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
            subtitle="4 Approved Topics"
            btnOnClick={(data: any) => setState({ showGenerateModal: true, selectedTopic: data })}
          />
        )}
      </div>
      <AIGenerateModal
        subtitle={state.selectedTopic?.title?.replace(/^Topic [\d.]+ — /, "") ?? ""}
        title="Generate Learning Material"
        onClose={() => setState({ showGenerateModal: false, selectedTopic: null })}
        open={state.showGenerateModal}
        
        onAction={() => {
          setState({ showGenerateModal: false, selectedTopic: null })
          router.push("/neurobe/view-learning-materials")}}
        actionIcon={<Sparkles className="h-4 w-4" />}
        actionLabel="Generate with NEURO AI"
        render={() => (
          <div className="space-y-5 bg-white p-5">
            {/* Selected Topic */}
            <div className="rounded-xl bg-purple-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-color2">
                Selected Topic
              </p>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-bold text-color2">
                  Topic {state.selectedTopic?.id}
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {state.selectedTopic?.title?.replace(/^Topic [\d.]+ — /, "")}
                </span>
              </div>
            </div>

            {/* Textarea */}
            <TextArea
              title="Material Instructions"
              name="materialInstructions"
              placeholder="Explain this topic clearly for engineering students."
              rows={5}
            />

            {/* Checkboxes */}
            <div className="space-y-3">
              <CheckboxInput
                checked={state.includeExamples ?? true}
                onChange={(v) => setState({ includeExamples: v })}
                label="Include Examples"
                labelStyle="text-sm font-semibold text-gray-800"
              />
              <CheckboxInput
                checked={state.includeExercises ?? true}
                onChange={(v) => setState({ includeExercises: v })}
                label="Include Exercises"
                labelStyle="text-sm font-semibold text-gray-800"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PrivateRouter(LearningMeterials);
