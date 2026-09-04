import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  EditIcon,
  Hourglass,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Success } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StepHeader from "@/components/academic-setup/StepHeader";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import TableTitle from "@/components/common-components/TableTitle";
import GenericTabs from "@/components/common-components/GenericTabs";
import AccordiansStyle from "@/components/common-components/AccordiansStyle";
import PageFooter from "@/components/common-components/PageFooter";
import AddTopicModal from "@/components/academic-setup/AddTopicModal";
import { useRouter } from "next/navigation";

// ─── Raw unit data ─────────────────────────────────────────────────────────────

type TopicStatus = "Approved" | "Needs Review";

interface SubTopic {
  id: string;
  title: string;
  hours: string;
  level: string;
  status: TopicStatus;
}

interface UnitData {
  title: string;
  topics: { id: string; title: string; level: string; hours: string; subtopics: SubTopic[] }[];
}

const RAW_UNIT_DATA: Record<string, UnitData> = {
  "unit-1": {
    title: "Unit 1 — Physical Layer & Network Architectures",
    topics: [
      {
        id: "1", title: "Layered Network Architecture: OSI Model vs TCP/IP Protocol Stack",
        level: "Knowledge Level K2", hours: "4 Hours",
        subtopics: [
          { id: "1.1", title: "Network Models & Layered Architecture", hours: "2", level: "K2", status: "Approved" },
          { id: "1.2", title: "Physical Layer & Transmission Media", hours: "2", level: "K2", status: "Needs Review" },
        ],
      },
      {
        id: "2", title: "Physical Media: Guided and Unguided Transmission",
        level: "Knowledge Level K2", hours: "5 Hours",
        subtopics: [
          { id: "2.1", title: "Network Topologies & Switching Techniques", hours: "2.5", level: "K2", status: "Needs Review" },
          { id: "2.2", title: "Network Performance Metrics", hours: "2.5", level: "K3", status: "Needs Review" },
        ],
      },
      {
        id: "3", title: "Signal Encoding, Digital Transmission, and Multiplexing",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "3.1", title: "Signal Encoding Techniques", hours: "2", level: "K2", status: "Approved" },
        ],
      },
      {
        id: "4", title: "Network Topologies, Performance Metrics",
        level: "Knowledge Level K3", hours: "1.5 Hours",
        subtopics: [
          { id: "4.1", title: "Bandwidth & Latency Analysis", hours: "1.5", level: "K3", status: "Approved" },
        ],
      },
    ],
  },
  "unit-2": {
    title: "Unit 2 — Data Link Layer & Error Control",
    topics: [
      {
        id: "1", title: "Framing, Flow Control, and Error Control Mechanisms",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "1.1", title: "Framing & Error Detection", hours: "2", level: "K2", status: "Approved" },
        ],
      },
      {
        id: "2", title: "HDLC and PPP Protocols",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "2.1", title: "HDLC Frame Structure", hours: "2", level: "K2", status: "Needs Review" },
        ],
      },
      {
        id: "3", title: "Multiple Access Protocols: ALOHA, CSMA/CD, CSMA/CA",
        level: "Knowledge Level K3", hours: "2.5 Hours",
        subtopics: [
          { id: "3.1", title: "ALOHA & CSMA Variants", hours: "2.5", level: "K3", status: "Approved" },
        ],
      },
    ],
  },
  "unit-3": {
    title: "Unit 3 — Network Layer & Routing",
    topics: [
      {
        id: "1", title: "IPv4 Addressing, Subnetting, and CIDR",
        level: "Knowledge Level K3", hours: "3 Hours",
        subtopics: [
          { id: "1.1", title: "IPv4 Subnetting & CIDR", hours: "3", level: "K3", status: "Approved" },
        ],
      },
      {
        id: "2", title: "Routing Algorithms: Dijkstra, Bellman-Ford",
        level: "Knowledge Level K3", hours: "2.5 Hours",
        subtopics: [
          { id: "2.1", title: "Dijkstra & Bellman-Ford", hours: "2.5", level: "K3", status: "Needs Review" },
        ],
      },
      {
        id: "3", title: "Routing Protocols: RIP, OSPF, BGP",
        level: "Knowledge Level K2", hours: "2.5 Hours",
        subtopics: [
          { id: "3.1", title: "RIP, OSPF & BGP Overview", hours: "2.5", level: "K2", status: "Approved" },
        ],
      },
      {
        id: "4", title: "IPv6 Addressing and Transition Mechanisms",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "4.1", title: "IPv6 & Transition Strategies", hours: "2", level: "K2", status: "Needs Review" },
        ],
      },
    ],
  },
  "unit-4": {
    title: "Unit 4 — Transport Layer & Congestion Control",
    topics: [
      {
        id: "1", title: "TCP: Connection Establishment, Flow Control, Congestion Control",
        level: "Knowledge Level K3", hours: "3 Hours",
        subtopics: [
          { id: "1.1", title: "TCP Handshake & Flow Control", hours: "3", level: "K3", status: "Approved" },
        ],
      },
      {
        id: "2", title: "UDP: Characteristics and Use Cases",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "2.1", title: "UDP Use Cases", hours: "2", level: "K2", status: "Needs Review" },
        ],
      },
      {
        id: "3", title: "Socket Programming Basics",
        level: "Knowledge Level K3", hours: "4 Hours",
        subtopics: [
          { id: "3.1", title: "Socket API & Programming", hours: "4", level: "K3", status: "Approved" },
        ],
      },
    ],
  },
  "unit-5": {
    title: "Unit 5 — Application Layer & Network Security",
    topics: [
      {
        id: "1", title: "HTTP, HTTPS, DNS, FTP, SMTP Protocols",
        level: "Knowledge Level K2", hours: "3 Hours",
        subtopics: [
          { id: "1.1", title: "Application Layer Protocols", hours: "3", level: "K2", status: "Approved" },
        ],
      },
      {
        id: "2", title: "Cryptography: Symmetric, Asymmetric, and Hash Functions",
        level: "Knowledge Level K3", hours: "3 Hours",
        subtopics: [
          { id: "2.1", title: "Cryptographic Techniques", hours: "3", level: "K3", status: "Needs Review" },
        ],
      },
      {
        id: "3", title: "Firewalls, IDS, and VPN Technologies",
        level: "Knowledge Level K2", hours: "2 Hours",
        subtopics: [
          { id: "3.1", title: "Firewalls & VPN", hours: "2", level: "K2", status: "Approved" },
        ],
      },
    ],
  },
};

// ─── Static config ─────────────────────────────────────────────────────────────

const STAT_TABS = [
  {
    key: "total-topics",
    label: "Total Topics",
    subLabel: "Across all units",
    count: 22,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    key: "approved",
    label: "Approved Topics",
    subLabel: "Ready for lesson plan",
    count: 10,
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    key: "needs-review",
    label: "Needs Review",
    subLabel: "Pending approval",
    count: 12,
    icon: <Hourglass className="h-5 w-5" />,
  },
  {
    key: "contact-hours",
    label: "Contact Hours",
    subLabel: "Total teaching hours",
    count: 45,
    icon: <Clock className="h-5 w-5" />,
  },
];

const UNIT_TABS = [
  { key: "unit-1", label: "Unit 1", count: 4 },
  { key: "unit-2", label: "Unit 2", count: 3 },
  { key: "unit-3", label: "Unit 3", count: 4 },
  { key: "unit-4", label: "Unit 4", count: 3 },
  { key: "unit-5", label: "Unit 5", count: 3 },
];

const GENERATE_STEPS = [
  {
    title: "Analyzing Course Syllabus",
    description: "Deconstructing 5 syllabus units and 45 contact hours for CS309 — Computer Networks.",
  },
  {
    title: "Topic & Subtopic Decomposition",
    description: "Generating topics and granular subtopics for all 5 units.",
  },
  {
    title: "Knowledge Level Calibration",
    description: "Assigning Knowledge Levels (K1–K6) per topic based on complexity mapping.",
  },
  {
    title: "Contact Hour Allocation",
    description: "Balancing lecture hours across 45 total hours to fit university parameters.",
  },
];

const totalTopics = UNIT_TABS.reduce((a, b) => a + b.count, 0);
const totalUnits = UNIT_TABS.length;

// count all subtopics across all units
const totalSubtopics = Object.values(RAW_UNIT_DATA).reduce(
  (s, u) => s + u.topics.reduce((ts, t) => ts + t.subtopics.length, 0),
  0,
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const Topics = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    topicsGenerated: false,
    approvedCount: 0,
    topicsApproved: false,
    showGenerateModal: false,
  });

  // per-unit accepted (approved) subtopic IDs
  const [approvedMap, setApprovedMap] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(
      Object.entries(RAW_UNIT_DATA).map(([unitKey, unit]) => [
        unitKey,
        new Set(
          unit.topics.flatMap((t) =>
            t.subtopics.filter((s) => s.status === "Approved").map((s) => s.id),
          ),
        ),
      ]),
    ),
  );

  const [addTopicModal, setAddTopicModal] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle("Topics"));
  }, [dispatch]);

  const raw = RAW_UNIT_DATA[state.activeTab];

  const approvedInUnit = approvedMap[state.activeTab] ?? new Set<string>();

  const totalApproved = Object.values(approvedMap).reduce((s, set) => s + set.size, 0);
  const allApproved = totalApproved >= totalSubtopics;

  const toggleApprove = (unitKey: string, subId: string) => {
    setApprovedMap((prev) => {
      const next = new Set<string>(prev[unitKey] ?? new Set<string>());
      if (next.has(subId)) next.delete(subId); else next.add(subId);
      const newMap = { ...prev, [unitKey]: next };
      const total = Object.values(newMap).reduce((s, set) => s + set.size, 0);
      setState({ approvedCount: total });
      return newMap;
    });
  };

  // ── Pre-generate: plain topic rows with level + hours badges ─────────────────
  const buildInitialTopics = () => {
    if (!raw) return [];
    return raw.topics.map((topic) => ({
      id: `${state.activeTab}-${topic.id}`,
      title: topic.title,
      collapsedBadge: [
        { label: topic.level, className: "bg-color2-l text-color2 font-bold" },
        { label: topic.hours, className: "bg-gray-200 text-pri font-bold" },
      ],
      items: [],
    }));
  };

  // ── Post-generate: expandable topics with subtopic items ─────────────────────
  const buildGeneratedTopics = () => {
    if (!raw) return [];
    return raw.topics.map((topic) => {
      const items = topic.subtopics.map((sub, idx) => {
        const isApproved = approvedInUnit.has(sub.id);
        const actions = [
          {
            key: "level",
            label: sub.level,
            asTag: true as const,
            className: "rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600",
          },
          {
            key: "hours",
            label: `${sub.hours} Hours`,
            asTag: true as const,
            className: "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600",
          },
          isApproved
            ? {
                key: "status",
                label: "Approved",
                asTag: true as const,
                className: "rounded-full border border-green-400 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600",
              }
            : {
                key: "status",
                label: "• Needs Review",
                asTag: false as const,
                className:
                  "inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-500 hover:border-orange-400 hover:bg-orange-100 cursor-pointer",
                onClick: () => toggleApprove(state.activeTab, sub.id),
              },
          {
            key: "edit",
            label: "",
            icon: <EditIcon className="h-3.5 w-3.5" />,
            className:
              "flex items-center rounded-full border border-gray-300 p-1.5 text-gray-400 hover:border-color2 hover:text-color2",
          },
        ];

        return {
          id: sub.id,
          index: idx + 1,
          title: `Topic ${sub.id} — ${sub.title}`,
          highlighted: isApproved,
          actions,
        };
      });

      const approvedCount = topic.subtopics.filter((s) => approvedInUnit.has(s.id)).length;

      return {
        id: `${state.activeTab}-${topic.id}`,
        title: topic.title,
        meta: `${topic.level} · ${topic.hours}`,
        collapsedBadge: {
          label: `${approvedCount}/${topic.subtopics.length} Approved`,
          className:
            approvedCount === topic.subtopics.length
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-orange-200 bg-orange-50 text-orange-600",
        },
        expandedBadge: {
          label: `${approvedCount}/${topic.subtopics.length} Approved`,
          className:
            approvedCount === topic.subtopics.length
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-orange-200 bg-orange-50 text-orange-600",
        },
        items,
      };
    });
  };

  return (
    <div className="min-h-screen">
      {/* ── Course banner ── */}
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

      {/* ── Step header ── */}
      <StepHeader
        title="Topics"
        description="Create a detailed topic structure from the approved syllabus."
        pill="CS309 — Computer Networks"
      />

      {/* ── Stat cards — hidden after generation ── */}
      {!state.topicsGenerated && (
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
      )}

      {/* ── Progress bar — shown after generation ── */}
      {state.topicsGenerated && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#000] dark:text-white">Topic Approval Progress</p>
              <p className="mt-0.5 text-xs text-pri">{totalApproved}/{totalSubtopics} Topics Approved</p>
            </div>
            <span className="text-xs font-semibold text-color2">
              {totalSubtopics > 0 ? Math.round((totalApproved / totalSubtopics) * 100) : 0}% Complete
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-color2 transition-all duration-500"
              style={{ width: `${totalSubtopics > 0 ? (totalApproved / totalSubtopics) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Section title ── */}
      <TableTitle
        title="Topics from Approved Syllabus"
        label={`${totalUnits} Units`}
        subLabel={`${totalTopics} Topics`}
      />

      {/* ── Unit tabs + accordion ── */}
      <div className="mt-4">
        <GenericTabs
          tabs={UNIT_TABS}
          activeKey={state.activeTab}
          onChange={(unit) => setState({ activeTab: unit as string })}
        />

        <AccordiansStyle
          expandable={state.topicsGenerated}
          topics={state.topicsGenerated ? buildGeneratedTopics() : buildInitialTopics()}
          title={raw?.title}
          subtitle={
            state.topicsGenerated
              ? "Click a topic to expand and review subtopics."
              : "Syllabus topics ready for NEURO AI generation."
          }
          expandedSectionLabel={
            <><BookOpen className="h-3.5 w-3.5" /> Subtopics</>
          }
          footerContent={
            state.topicsGenerated ? (
              <><RefreshCw className="h-3 w-3" /> Review subtopics and approve each one. Click a Needs Review badge to approve.</>
            ) : (
              <><Sparkles className="h-4 w-4" /> NEURO AI will decompose each topic into subtopics, assign knowledge levels, and allocate contact hours.</>
            )
          }
        />

        {/* ── Footer ── */}
        {state.topicsGenerated ? (
          <PageFooter
            content1={`Approved: ${totalApproved}/${totalSubtopics} Topics`}
            content2="Course: CS309 — Computer Networks"
            batch
            actionBtn1={
              state.topicsApproved
                ? {
                    label: "Next: Pedagogy",
                    icon: <Check className="h-4 w-4" />,
                    onClick: () => router.push("/neurobe/pedagogy"),
                    className: "create-btn",
                  }
                : {
                    label: "Approve Topics",
                    icon: <Check className="h-4 w-4" />,
                    onClick: () => {
                      Success("Topics approved successfully");
                      setState({ topicsApproved: true });
                    },
                    disabled: !allApproved,
                  }
            }
            actionBtn2={{
              label: "Add Topic",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => setAddTopicModal(true),
            }}
          />
        ) : (
          <PageFooter
            content1="Course: CS309 — Computer Networks"
            content2="45 Contact Hours · 5 Units"
            actionBtn1={{
              label: "Generate Topics with NEURO AI",
              icon: <Sparkles className="h-4 w-4" />,
              onClick: () => setState({ showGenerateModal: true }),
              className: "create-btn",
            }}
          />
        )}
      </div>

      {/* ── Add Topic modal ── */}
      <AddTopicModal
        open={addTopicModal}
        onClose={() => setAddTopicModal(false)}
        defaultUnit={state.activeTab}
      />

      {/* ── Generate Topics modal ── */}
      {state.showGenerateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ animation: "fadeIn 0.22s ease" }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setState({ showGenerateModal: false })} />
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            style={{ animation: "slideUp 0.22s ease" }}
          >
            {/* Modal header */}
            <div className="flex items-center gap-3 bg-[#111238] px-5 py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-color2">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Generate Topics with NEURO AI</p>
                <p className="text-xs text-white/60">CS309 — Computer Networks</p>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              {/* Progress */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-color2">Topics Generated Successfully</span>
                  <span className="text-sm font-bold text-color2">100%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-2 w-full rounded-full bg-color2 transition-all" />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {GENERATE_STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setState({ showGenerateModal: false })}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setState({ showGenerateModal: false, topicsGenerated: true })}
                className="bg-color2 flex items-center gap-1.5 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <Check className="h-3.5 w-3.5" /> Apply Topics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateRouter(Topics);
