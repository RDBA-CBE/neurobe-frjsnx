import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BookOpen,
  BookOpenCheck,
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
import { useSetState, Success, Failure, Dropdown } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";

const getErrorMessage = (error: any, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.detail === "string") return error.detail;
  if (typeof error?.error === "string") return error.error;
  return fallback;
};
import StepHeader from "@/components/academic-setup/StepHeader";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import TableTitle from "@/components/common-components/TableTitle";
import GenericTabs from "@/components/common-components/GenericTabs";
import AccordiansStyle from "@/components/common-components/AccordiansStyle";
import PageFooter from "@/components/common-components/PageFooter";
import AddTopicModal from "@/components/academic-setup/AddTopicModal";
import { useRouter, useSearchParams } from "next/navigation";
import { UNIT_TABS } from "@/utils/constant.utils";
import PageHeader from "@/components/common-components/PageHeader";
import Models from "@/imports/models.import";

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

const fallbackTotalTopics = UNIT_TABS.reduce((a, b) => a + b.count, 0);
const fallbackTotalUnits = UNIT_TABS.length;

// count all subtopics across all units
const fallbackTotalSubtopics = Object.values(RAW_UNIT_DATA).reduce(
  (s, u) => s + u.topics.reduce((ts, t) => ts + t.subtopics.length, 0),
  0,
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const Topics = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    activeUnitNumber: 1,
    activeStatTab: "total-topics",
    topicsGenerated: false,
    approvedCount: 0,
    topicsApproved: false,
    showGenerateModal: false,
    activeBannerTab: "coordinator",
    selectedCourse: null,
    courseDetail: null as any,
    courseList: [] as any[],
    organization_id: "",
    coordinator_id: "",
    isCourseCoordinator: false,
    unitsList: [] as any[],
    unitDetailsMap: {} as Record<number, any>,
    loadingUnits: false,
    loadingUnitDetail: false,
  });

  const course_id = useSearchParams().get("course_id");

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
      getCourseDetails();
    } else {
      getUnits(1);
    }
  }, [course_id]);

  // "API Integration"
  const getAllCourse = async (orgId?: any) => {
    try {
      const targetOrg = orgId || state?.organization_id;
      const res: any = await Models.course.list(targetOrg ? { organization_id: targetOrg } : {});
      const dropdown = Dropdown(res, "course_title");
      setState({
        courseList: dropdown,
      });
      if (!course_id && res && res.length > 0) {
        const firstCourse = res[0];
        getCourseDetails(firstCourse.id);
      }
    } catch (error: any) {
      console.log("error fetching course list", error);
      Failure(getErrorMessage(error, "Failed to fetch course list"));
    }
  };

  const getCourseDetails = async (targetCourseId?: any) => {
    const cid = targetCourseId || course_id;
    if (!cid) return;
    try {
      const res: any = await Models.course.detail(cid);
      setState({
        courseDetail: res,
        selectedCourse: res ? { value: res.id, label: `${res.course_code} - ${res.course_title}` } : null,
      });
      const sid = res?.syllabus_id || res?.syllabus?.id || 1;
      getUnits(sid);
    } catch (error: any) {
      console.log("error fetching course detail", error);
      Failure(getErrorMessage(error, "Failed to fetch course detail"));
      getUnits(1);
    }
  };

  const getUnits = async (syllabusId?: any) => {
    const sid = syllabusId || state.courseDetail?.syllabus_id || 1;
    try {
      setState({ loadingUnits: true });
      const res: any = await Models.topics.units(sid);
      const unitsData = Array.isArray(res) ? res : res?.data || [];
      if (unitsData && unitsData.length > 0) {
        const initialUnit = unitsData[0];
        const initialUnitNum = initialUnit.unit_number || 1;
        const initialTabKey = `unit-${initialUnitNum}`;

        setState({
          unitsList: unitsData,
          activeTab: initialTabKey,
          activeUnitNumber: initialUnitNum,
          loadingUnits: false,
        });

        getUnitDetail(sid, initialUnitNum);
      } else {
        setState({ loadingUnits: false });
        getUnitDetail(sid, 1);
      }
    } catch (error: any) {
      console.log("error fetching units", error);
      setState({ loadingUnits: false });
      Failure(getErrorMessage(error, "Failed to fetch syllabus units"));
    }
  };

  const getUnitDetail = async (syllabusId?: any, unitNumber?: any) => {
    const sid = syllabusId || state.courseDetail?.syllabus_id || state.unitsList?.[0]?.syllabus_id || 1;
    const uNum = unitNumber ?? state.activeUnitNumber ?? 1;
    try {
      setState({ loadingUnitDetail: true });
      const res: any = await Models.topics.unit_detail(sid, uNum);
      const data = res?.data || res;
      setState((prev: any) => ({
        loadingUnitDetail: false,
        unitDetailsMap: {
          ...(prev.unitDetailsMap || {}),
          [uNum]: data,
        },
      }));
    } catch (error: any) {
      console.log("error fetching unit detail", error);
      setState({ loadingUnitDetail: false });
      Failure(getErrorMessage(error, `Failed to fetch Unit ${uNum} details`));
    }
  };

  const handleTabChange = (tabKey: string | number) => {
    const keyStr = String(tabKey);
    const selectedUnit = state.unitsList?.find(
      (u: any) => `unit-${u.unit_number}` === keyStr || String(u.unit_number) === keyStr
    );
    const unitNum = selectedUnit?.unit_number ?? (Number(keyStr.replace("unit-", "")) || 1);

    setState({
      activeTab: keyStr,
      activeUnitNumber: unitNum,
    });

    const sid = state.courseDetail?.syllabus_id || state.unitsList?.[0]?.syllabus_id || 1;
    getUnitDetail(sid, unitNum);
  };

  const unitsList = state.unitsList && state.unitsList.length > 0 ? state.unitsList : [];
  const totalUnits = unitsList.length > 0 ? unitsList.length : fallbackTotalUnits;
  const totalTopics = unitsList.length > 0
    ? unitsList.reduce((acc: number, u: any) => acc + (u.topics?.length || 0), 0)
    : fallbackTotalTopics;

  const unitTabs = unitsList.map((u: any) => {
        const detailTopics = state.unitDetailsMap?.[u.unit_number]?.topics;
        const count = Array.isArray(detailTopics)
          ? detailTopics.length
          : (u.topics?.length || 0);
        return {
          key: `unit-${u.unit_number}`,
          label: `Unit ${u.unit_number}`,
          count,
        };
      })
    ;

  const totalContactHours =
    unitsList.length > 0
      ? unitsList.reduce((acc: number, u: any) => acc + (u.theory_hours || 0) + (u.lab_hours || 0), 0)
      : 45;

  const activeUnitNum = state.activeUnitNumber || Number(String(state.activeTab).replace("unit-", "")) || 1;

  const activeUnitFromList = state.unitsList?.find(
    (u: any) => u.unit_number === activeUnitNum || `unit-${u.unit_number}` === state.activeTab
  );

  const activeUnitDetail = state.unitDetailsMap?.[activeUnitNum];

  const raw = RAW_UNIT_DATA[state.activeTab];

  const getUnitTitleText = () => {
    const rawTitle =
      activeUnitDetail?.unit_title ||
      activeUnitDetail?.title ||
      activeUnitDetail?.unit?.unit_title ||
      activeUnitFromList?.unit_title;

    if (!rawTitle) return raw?.title || `Unit ${activeUnitNum}`;
    if (rawTitle.toLowerCase().startsWith("unit")) {
      return rawTitle;
    }
    return `Unit ${activeUnitNum} — ${rawTitle}`;
  };

  const currentUnitTitle = getUnitTitleText();

  let apiTopics: any[] | null = null;
  if (activeUnitDetail) {
    if (Array.isArray(activeUnitDetail)) {
      apiTopics = activeUnitDetail;
    } else if (Array.isArray(activeUnitDetail.topics)) {
      apiTopics = activeUnitDetail.topics;
    } else if (Array.isArray(activeUnitDetail.data?.topics)) {
      apiTopics = activeUnitDetail.data.topics;
    } else if (Array.isArray(activeUnitDetail.data)) {
      apiTopics = activeUnitDetail.data;
    } else if (Array.isArray(activeUnitDetail.workspace?.topics)) {
      apiTopics = activeUnitDetail.workspace.topics;
    }
  }
  if (!apiTopics || apiTopics.length === 0) {
    if (Array.isArray(activeUnitFromList?.topics) && activeUnitFromList.topics.length > 0) {
      apiTopics = activeUnitFromList.topics;
    }
  }

  const computedTotalSubtopics =  unitsList.reduce((acc: number, u: any) => {
        const topicsArr = state.unitDetailsMap?.[u.unit_number]?.topics || u.topics || [];
        const subsCount = topicsArr.reduce((sAcc: number, t: any) => sAcc + (t.subtopics?.length || 2), 0);
        return acc + subsCount;
      }, 0)
    

  const approvedInUnit = approvedMap[state.activeTab] ?? new Set<string>();
  const totalApproved = Object.values(approvedMap).reduce((s, set) => s + set.size, 0);
  const allApproved = totalApproved >= computedTotalSubtopics;

  const statTabs = [
    {
      key: "total-topics",
      label: "Total Topics",
      subLabel: "Across all units",
      count: totalTopics,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      key: "approved",
      label: "Approved Topics",
      subLabel: "Ready for lesson plan",
      count: totalApproved,
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      key: "needs-review",
      label: "Needs Review",
      subLabel: "Pending approval",
      count: Math.max(0, computedTotalSubtopics - totalApproved),
      icon: <Hourglass className="h-5 w-5" />,
    },
    {
      key: "contact-hours",
      label: "Contact Hours",
      subLabel: "Total teaching hours",
      count: totalContactHours,
      icon: <Clock className="h-5 w-5" />,
    },
  ];

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
    if (apiTopics && apiTopics.length > 0) {
      return apiTopics.map((topic: any, idx: number) => {
        const topicId = topic.id || topic.topic_code || `${idx + 1}`;
        const topicName = topic.topic_name || topic.title || topic.topic_description || "Topic";
        const displayTitle = topic.topic_code && !topicName.startsWith(topic.topic_code)
          ? `${topic.topic_code} — ${topicName}`
          : topicName;

        const levelBadge =
          topic.level ||
          (topic.knowledge_level ? `Knowledge Level ${topic.knowledge_level}` : null) ||
          (topic.learning_sequence ? `Sequence: ${topic.learning_sequence}` : "Knowledge Level K2");

        const avgHours = activeUnitFromList?.theory_hours
          ? `${Math.round((activeUnitFromList.theory_hours / (apiTopics?.length || 1)) * 10) / 10} Hours`
          : "2 Hours";
        const hoursBadge = topic.hours || (topic.theory_hours ? `${topic.theory_hours} Hours` : avgHours);

        return {
          id: `${state.activeTab}-${topicId}`,
          title: displayTitle,
          collapsedBadge: [
            { label: levelBadge, className: "bg-color2-l text-color2 font-bold" },
            { label: hoursBadge, className: "bg-gray-200 text-pri font-bold" },
          ],
          items: [],
        };
      });
    }

    // if (apiTopics.length <== 0) return [];
    // return raw.topics.map((topic) => ({
    //   id: `${state.activeTab}-${topic.id}`,
    //   title: topic.title,
    //   collapsedBadge: [
    //     { label: topic.level, className: "bg-color2-l text-color2 font-bold" },
    //     { label: topic.hours, className: "bg-gray-200 text-pri font-bold" },
    //   ],
    //   items: [],
    // }));
  };

  // ── Post-generate: expandable topics with subtopic items ─────────────────────
  const buildGeneratedTopics = () => {
    const sourceTopics =  apiTopics ;
    return sourceTopics.map((topic: any, tIdx: number) => {
      const topicId = topic.id || topic.topic_code || `${tIdx + 1}`;
      const topicName = topic.topic_name || topic.title || topic.topic_description || `Topic ${tIdx + 1}`;
      const topicTitle = topic.topic_code && !topicName.startsWith(topic.topic_code)
        ? `${topic.topic_code} — ${topicName}`
        : topicName;

      const subtopicsList = (topic.subtopics && topic.subtopics.length > 0)
        ? topic.subtopics
        : (raw?.topics?.[tIdx]?.subtopics || [
            {
              id: `${topicId}.1`,
              title: `${topicName} — Foundations & Core Principles`,
              hours: "2",
              level: "K2",
              status: "Approved",
            },
            {
              id: `${topicId}.2`,
              title: `${topicName} — Applications & Evaluation`,
              hours: "2",
              level: "K3",
              status: "Needs Review",
            },
          ]);

      const items = subtopicsList.map((sub: any, idx: number) => {
        const subId = String(sub.id || `${topicId}.${idx + 1}`);
        const isApproved = approvedInUnit.has(subId) || sub.status === "Approved";
        const actions = [
          {
            key: "level",
            label: sub.level || (sub.knowledge_level ? `K${sub.knowledge_level}` : "K2"),
            asTag: true as const,
            className: "rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600",
          },
          {
            key: "hours",
            label: `${sub.hours || sub.theory_hours || 2} Hours`,
            asTag: true as const,
            className: "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-[#000]",
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
                onClick: () => toggleApprove(state.activeTab, subId),
              },
          {
            key: "edit",
            label: "",
            icon: <EditIcon className="h-3.5 w-3.5" />,
            className:
              "flex items-center rounded-full border border-gray-300 p-1.5 text-[#000] hover:border-color2 hover:text-color2",
          },
        ];

        return {
          id: subId,
          index: idx + 1,
          title: sub.subtopic_name || sub.title || `Topic ${subId}`,
          highlighted: isApproved,
          actions,
        };
      });

      const approvedCount = subtopicsList.filter((s: any) =>
        approvedInUnit.has(String(s.id)) || s.status === "Approved"
      ).length;

      return {
        id: `${state.activeTab}-${topicId}`,
        title: topicTitle,
        meta: `${topic.level || (topic.knowledge_level ? `Knowledge Level ${topic.knowledge_level}` : null) || "Knowledge Level K2"} · ${topic.hours || (topic.theory_hours ? `${topic.theory_hours} Hours` : "2 Hours")}`,
        collapsedBadge: {
          label: `${approvedCount}/${subtopicsList.length} Approved`,
          className:
            approvedCount === subtopicsList.length && subtopicsList.length > 0
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-orange-200 bg-orange-50 text-orange-600",
        },
        expandedBadge: {
          label: `${approvedCount}/${subtopicsList.length} Approved`,
          className:
            approvedCount === subtopicsList.length && subtopicsList.length > 0
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
        courseCode={state?.courseDetail?.course_code}
        courseTitle={state?.courseDetail?.course_title}
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme={state?.courseDetail?.programme}
        batch={state?.courseDetail?.batch_name}
        academicYear={`${state?.courseDetail?.batch_name} / Semester 3`}
        students={state?.courseDetail?.students_count}
        selectedCourse={state.selectedCourse}
        courseOptions={state.courseList}
        onCourseChange={(val) => {
          setState({ selectedCourse: val });
          router.push(`/neurobe/topics?course_id=${val.value}`);
        }}
        activeView={state.activeBannerTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeBannerTab: view })}
      />

      {/* ── Step header ── */}
      <PageHeader
        title="Topics"
        records={
          state.courseDetail
            ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
            : "CS309 — Computer Networks"
        }
        subtitle="Create a detailed topic structure from the approved syllabus."
        icon={<BookOpenCheck className="h-5 w-5 text-color2" />}
      />

      {/* ── Stat cards — hidden after generation ── */}
      {!state.topicsGenerated && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {statTabs.map((tab) => (
            <StatTabCard
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              subLabel={tab.subLabel}
              count={tab.count}
              active={state.activeStatTab === tab.key}
              onClick={() => setState({ activeStatTab: tab.key })}
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
              <p className="mt-0.5 text-xs text-pri">{totalApproved}/{computedTotalSubtopics} Topics Approved</p>
            </div>
            <span className="text-xs font-semibold text-color2">
              {computedTotalSubtopics > 0 ? Math.round((totalApproved / computedTotalSubtopics) * 100) : 0}% Complete
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-color2 transition-all duration-500"
              style={{ width: `${computedTotalSubtopics > 0 ? (totalApproved / computedTotalSubtopics) * 100 : 0}%` }}
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
          tabs={unitTabs}
          activeKey={state.activeTab}
          onChange={(unit) => handleTabChange(unit)}
          rightContent={
            (state.loadingUnits || state.loadingUnitDetail) ? (
              <div className="flex items-center gap-1.5 text-xs text-color2 font-semibold">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Loading unit details...
              </div>
            ) : null
          }
        />

        <AccordiansStyle
          expandable={state.topicsGenerated}
          topics={state.topicsGenerated ? buildGeneratedTopics() : buildInitialTopics()}
          title={currentUnitTitle}
          subtitle={
            state.topicsGenerated
              ? "Click a topic to expand and review subtopics."
              : (activeUnitDetail?.unit_overview || activeUnitFromList?.unit_overview || "Syllabus topics ready for NEURO AI generation.")
          }
          topicCount={apiTopics?.length || (state.topicsGenerated ? buildGeneratedTopics()?.length : buildInitialTopics()?.length)}
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
            content1={`Approved: ${totalApproved}/${computedTotalSubtopics} Topics`}
            content2={
              state.courseDetail
                ? `Course: ${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                : "Course: CS309 — Computer Networks"
            }
            batch
            actionBtn1={
              state.topicsApproved
                ? {
                    label: "Next: Pedagogy",
                    icon: <Check className="h-4 w-4" />,
                    onClick: () => {
                      const cid = course_id || state.selectedCourse?.value || state.courseDetail?.id;
                      router.push(cid ? `/neurobe/pedagogy?course_id=${cid}` : "/neurobe/pedagogy");
                    },
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
            content1={
              state.courseDetail
                ? `Course: ${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                : "Course: CS309 — Computer Networks"
            }
            content2={`${totalContactHours} Contact Hours · ${totalUnits} Units`}
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
                <p className="text-xs text-white/60">
                  {state.courseDetail
                    ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}`
                    : "CS309 — Computer Networks"}
                </p>
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
                      <p className="text-sm font-bold text-[#000] dark:text-white">{step.title}</p>
                      <p className="text-xs text-pri">{step.description}</p>
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
