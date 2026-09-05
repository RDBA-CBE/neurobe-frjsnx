import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, EditIcon, Hourglass, RefreshCw, ReplaceAll, Save, Sparkles } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Success } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StepHeader from "@/components/academic-setup/StepHeader";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import PageFooter from "@/components/common-components/PageFooter";
import GenericTabs from "@/components/common-components/GenericTabs";
import AccordiansStyle from "@/components/common-components/AccordiansStyle";
import { EditPedagogyModal, ReplacePedagogyModal } from "@/components/co-po-mapping/PedagogyModals";
import { useRouter } from "next/navigation";
import TableTitle from "@/components/common-components/TableTitle";
import { UNIT_TABS } from "@/utils/constant.utils";

// ─── Static config ────────────────────────────────────────────────────────────

const STAT_TABS = [
  { key: "approved-topics", label: "Approved Topics", count: 5, icon: <Check className="h-5 w-5" /> },
  { key: "pedagogy-recommendations", label: "Pending Pedagogy Recommendations", subLabel: "Pending Pedagogy Recommendations", count: 4, icon: <Hourglass className="h-5 w-5" /> },
];



// Raw source data — no AccordiansStyle types here
const RAW_UNIT_DATA: Record<string, {
  title: string;
  topics: { id: string; title: string; level: string; hours: string }[];
  recommendations: { id: string; title: string; badge?: string; description: string; selected?: boolean }[];
}> = {
  "unit-1": {
    title: "Unit 1 — Physical Layer & Network Architectures",
    topics: [
      { id: "1.1", title: "Topic 1.1 — Network Models & Layered Architecture", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "1.2", title: "Topic 1.2 — Physical Layer & Transmission Media", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "1.3", title: "Topic 1.3 — Network Topologies & Switching Techniques", level: "Knowledge Level K3", hours: "2.5 Hours" },
      { id: "1.4", title: "Topic 1.4 — Network Performance Metrics", level: "Knowledge Level K2", hours: "2.5 Hours" },
    ],
    recommendations: [
      { id: "r1", title: "Concept Exploration", badge: "Directed", description: "Direct instruction on OSI layers to TCP/IP 5-layer reference models.", selected: true },
      { id: "r2", title: "Guided Discussion", badge: "Directed", description: "Interactive comparison of protocol encapsulation and layer boundaries.", selected: true },
      { id: "r3", title: "Collaborative Learning", description: "Small group mapping of real-world internet protocols to OSI layers." },
    ],
  },
  "unit-2": {
    title: "Unit 2 — Data Link Layer & Error Control",
    topics: [
      { id: "2.1", title: "Topic 2.1 — Framing & Error Detection", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "2.2", title: "Topic 2.2 — Flow Control Protocols", level: "Knowledge Level K3", hours: "2.5 Hours" },
      { id: "2.3", title: "Topic 2.3 — MAC Protocols & CSMA/CD", level: "Knowledge Level K3", hours: "2.5 Hours" },
    ],
    recommendations: [
      { id: "r1", title: "Problem-Based Learning", description: "Solve CRC and checksum problems with real packet examples.", selected: true },
      { id: "r2", title: "Simulation Lab", description: "Use Wireshark to capture and analyze data link frames." },
      { id: "r3", title: "Peer Teaching", description: "Students explain sliding window protocols to each other." },
    ],
  },
  "unit-3": {
    title: "Unit 3 — Network Layer & Routing",
    topics: [
      { id: "3.1", title: "Topic 3.1 — IP Addressing & Subnetting", level: "Knowledge Level K3", hours: "3 Hours" },
      { id: "3.2", title: "Topic 3.2 — Routing Algorithms", level: "Knowledge Level K4", hours: "3 Hours" },
      { id: "3.3", title: "Topic 3.3 — IPv6 & Transition Mechanisms", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "3.4", title: "Topic 3.4 — ICMP & Network Diagnostics", level: "Knowledge Level K3", hours: "2 Hours" },
    ],
    recommendations: [
      { id: "r1", title: "Case Study Analysis", description: "Analyze real-world routing table configurations.", selected: true },
      { id: "r2", title: "Hands-on Lab", description: "Configure static and dynamic routing using Cisco Packet Tracer." },
      { id: "r3", title: "Flipped Classroom", description: "Students watch routing algorithm videos before class discussion." },
    ],
  },
  "unit-4": {
    title: "Unit 4 — Transport Layer & TCP/UDP",
    topics: [
      { id: "4.1", title: "Topic 4.1 — TCP Connection Management", level: "Knowledge Level K3", hours: "3 Hours" },
      { id: "4.2", title: "Topic 4.2 — UDP & Real-time Applications", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "4.3", title: "Topic 4.3 — Congestion Control Mechanisms", level: "Knowledge Level K4", hours: "3 Hours" },
    ],
    recommendations: [
      { id: "r1", title: "Demonstration", description: "Live demo of TCP three-way handshake using network tools.", selected: true },
      { id: "r2", title: "Comparative Analysis", description: "Compare TCP vs UDP performance in different scenarios." },
      { id: "r3", title: "Project Work", description: "Build a simple client-server application using sockets." },
    ],
  },
  "unit-5": {
    title: "Unit 5 — Application Layer & Security",
    topics: [
      { id: "5.1", title: "Topic 5.1 — DNS & HTTP Protocols", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "5.2", title: "Topic 5.2 — Email & FTP Protocols", level: "Knowledge Level K2", hours: "2 Hours" },
      { id: "5.3", title: "Topic 5.3 — Network Security Fundamentals", level: "Knowledge Level K3", hours: "3 Hours" },
    ],
    recommendations: [
      { id: "r1", title: "Interactive Demo", description: "Trace HTTP requests using browser developer tools.", selected: true },
      { id: "r2", title: "Guest Lecture", description: "Industry expert on real-world network security practices." },
      { id: "r3", title: "Research Assignment", description: "Investigate a recent network security breach and present findings." },
    ],
  },
};

const totalTopics = UNIT_TABS.reduce((a, b) => a + b.count, 0);
const totalUnits = UNIT_TABS.length;
const totalRecs = Object.values(RAW_UNIT_DATA).reduce((s, u) => s + u.recommendations.length, 0);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Pedagogy = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    recommendationsGenerated: false,
    acceptedCount: 0,
    pedagogyApproved: false,
  });

  // accepted set per unit-tab
  const [acceptedMap, setAcceptedMap] = useState<Record<string, Set<string>>>({});

  // modal state — owned here, passed down via renderModals
  const [editModal, setEditModal] = useState<{
    open: boolean; title: string; description: string; topicLabel: string;
  }>({ open: false, title: "", description: "", topicLabel: "" });

  const [replaceModal, setReplaceModal] = useState<{
    open: boolean; currentTitle: string; topicLabel: string;
    options: { title: string; description: string }[];
  }>({ open: false, currentTitle: "", topicLabel: "", options: [] });

  useEffect(() => {
    dispatch(setPageTitle("Pedagogy & Teaching Methodologies"));
  }, [dispatch]);

  const allAccepted = state.acceptedCount >= totalRecs;
  const raw = RAW_UNIT_DATA[state.activeTab];
  const accepted = acceptedMap[state.activeTab] ?? new Set<string>(
    raw?.recommendations.filter((r) => r.selected).map((r) => r.id) ?? []
  );

  const toggleAccept = (unitKey: string, recId: string) => {
    setAcceptedMap((prev) => {
      const current = prev[unitKey] ?? new Set<string>(
        RAW_UNIT_DATA[unitKey]?.recommendations.filter((r) => r.selected).map((r) => r.id) ?? []
      );
      const next = new Set(current);
      if (next.has(recId)) next.delete(recId); else next.add(recId);
      // recount total
      const newMap = { ...prev, [unitKey]: next };
      const total = Object.entries(newMap).reduce((s, [k, set]) => s + set.size, 0);
      setState({ acceptedCount: total });
      return newMap;
    });
  };

  // Build AccordionTopic[] from raw data + accepted state
  const buildTopics = () => {
    if (!raw) return [];
    return raw.topics.map((topic) => {
      const items= raw.recommendations.map((rec, idx) => {
        const isAccepted = accepted.has(rec.id);
        const actions = [];

        actions.push({
          key: "edit",
          label: "Edit",
          icon: <EditIcon className="h-3.5 w-3.5" />,
          className: "flex items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold text-pri hover:border-[#000] hover:text-[#000]",
          onClick: (item) => setEditModal({
            open: true,
            title: item.title,
            description: item.description ?? "",
            topicLabel: topic.title,
          }),
        });

        if (isAccepted) {
          actions.push({
            key: "replace",
            label: "Replace",
            icon: <ReplaceAll className="h-3.5 w-3.5" />,
            className: "flex items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold text-pri hover:border-[#000] hover:text-[#000]",
            onClick: () => setReplaceModal({
              open: true,
              currentTitle: rec.title,
              topicLabel: topic.title,
              options: raw.recommendations.map((r) => ({ title: r.title, description: r.description })),
            }),
          });
          actions.push({
            key: "selected",
            label: "Selected",
            asTag: true,
            className: "rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white",
          });
        } else {
          actions.push({
            key: "accept",
            label: "Accept",
            className: "rounded-full border border-color2 px-3 py-1 text-xs font-semibold text-color2 hover:bg-color2-l",
            onClick: () => toggleAccept(state.activeTab, rec.id),
          });
        }

        return {
          id: rec.id,
          index: idx + 1,
          title: rec.title,
          description: rec.description,
          badge: rec.badge ? { label: rec.badge, className: "bg-green-500" } : undefined,
          highlighted: isAccepted,
          actions,
        };
      });

      return {
        id: topic.id,
        title: topic.title,
        meta: `${topic.level} · ${topic.hours} Hours`,
        collapsedBadge: { label: "Needs Review", className: "border border-orange-200 bg-orange-50 text-orange-600" },
        expandedBadge: { label: "Reviewed", className: "border border-green-200 bg-green-50 text-green-700" },
        items,
      };
    });
  };

  // Initial (pre-generate) topics — no items, just meta badges
  const buildInitialTopics = () => {
    if (!raw) return [];
    return raw.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      collapsedBadge:[ { label: topic.level, className: "bg-color2-l text-color2 font-bold"}, {label: topic.hours, className: "bg-gray-200 text-pri font-bold" } ],
      items: [],
    }));
  };

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
        title="Pedagogy"
        description="Choose suitable teaching methods for the approved topics."
        pill="CS309 — Computer Networks"
      />

      {/* ── Stat tabs — shown only before recommendations are generated ── */}
      {!state.recommendationsGenerated && (
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

      {/* ── Progress bar — shown after recommendations are generated ── */}
      {state.recommendationsGenerated && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#000] dark:text-white">Pedagogy Review Progress</p>
              <p className="mt-0.5 text-xs text-pri">{state.acceptedCount}/{totalRecs} Topics Reviewed</p>
            </div>
            <span className="text-xs font-semibold text-color2">
              {totalRecs > 0 ? Math.round((state.acceptedCount / totalRecs) * 100) : 0}% Complete
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-color2 transition-all duration-500"
              style={{ width: `${totalRecs > 0 ? (state.acceptedCount / totalRecs) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <TableTitle
        title = "Approved topcis"
        label={`${totalUnits} Units`}
        subLabel={`${totalTopics} Topics`}
        />

      <div className="mt-4">
        <GenericTabs
          tabs={UNIT_TABS}
          activeKey={state.activeTab}
          onChange={(unit) => setState({ activeTab: unit as string })}
          // rightContent={`${totalUnits} Units • ${totalTopics} Topics`}
        />

        

        <AccordiansStyle
          expandable={state.recommendationsGenerated}
          topics={state.recommendationsGenerated ? buildTopics() : buildInitialTopics()}
          title={raw?.title}
          subtitle={
            state.recommendationsGenerated
              ? "Click a topic to expand and view recommended teaching methods."
              : "Approved syllabus topics ready for pedagogy assignment."
          }
          expandedSectionLabel={<><Sparkles className="h-3.5 w-3.5" /> Recommended Teaching Methods</>}
          footerContent={
            state.recommendationsGenerated ? (
              <><RefreshCw className="h-3 w-3" /> Review the recommendations above and select the methods that best fit this topic.</>
            ) : (
              <><Sparkles className="h-4 w-4" /> NEURO AI will use each topic, its Knowledge Level, and duration to recommend up to 3 suitable teaching methods.</>
            )
          }
          renderModals={() => (
            <>
              <EditPedagogyModal
                open={editModal.open}
                onClose={() => setEditModal((p) => ({ ...p, open: false }))}
                topicLabel={editModal.topicLabel}
                initialTitle={editModal.title}
                initialDescription={editModal.description}
              />
              <ReplacePedagogyModal
                open={replaceModal.open}
                onClose={() => setReplaceModal((p) => ({ ...p, open: false }))}
                topicLabel={replaceModal.topicLabel}
                currentTitle={replaceModal.currentTitle}
                options={replaceModal.options}
              />
            </>
          )}
        />

        {state.recommendationsGenerated ? (
          <PageFooter
            content1={`Status: ${state.acceptedCount}/${totalRecs} Accepted`}
            content2="Course: CS309 — Computer Networks"
            batch
            actionBtn1={
              state.pedagogyApproved
                ? {
                    label: "Next: Lesson Plan",
                    icon: <Check className="h-4 w-4" />,
                    onClick: () => router.push("/neurobe/lesson-plan"),
                    className: "create-btn",
                  }
                : {
                    label: "Complete Pedagogy Review",
                    icon: <Check className="h-4 w-4" />,
                    onClick: () => { Success("Pedagogy approved successfully"); setState({ pedagogyApproved: true }); },
                    disabled: !allAccepted,
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
            content1="Course: CS309 – Computer Networks"
            content2="PO Version: PO 2025 v1"
            actionBtn1={{
              label: "Generate Recommendations with NEURO AI",
              icon: <Sparkles className="h-4 w-4" />,
              onClick: () => setState({ recommendationsGenerated: true }),
              className: "create-btn",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PrivateRouter(Pedagogy);
