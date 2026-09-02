import { useState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import CourseOutcomes from "@/components/academic-setup/CourseOutcomes";
import UnitTopics from "@/components/academic-setup/UnitTopics";
import LabExperiments from "@/components/academic-setup/LabExperiments";
import PrescribedTextbooks from "@/components/academic-setup/PrescribedTextbooks";

const TABS = ["All Fields", "Course Details", "COs & Knowledge Levels", "Units & Topics", "Lab Experiments"];

const KNOWLEDGE_OPTIONS = [
  { value: "K1", label: "K1 Remember" },
  { value: "K2", label: "K2 Understand" },
  { value: "K3", label: "K3 Apply" },
  { value: "K4", label: "K4 Analyze" },
  { value: "K5", label: "K5 Evaluate" },
  { value: "K6", label: "K6 Create" },
];

const ExtractedDataPanel = () => {
  const [activeTab, setActiveTab] = useState("All Fields");
  const [courseCode, setCourseCode] = useState("CS309");
  const [courseTitle, setCourseTitle] = useState("Computer Networks");
  const [L, setL] = useState("3");
  const [T, setT] = useState("0");
  const [P, setP] = useState("2");
  const [C, setC] = useState("4");

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    "Course Details": useRef<HTMLDivElement>(null),
    "COs & Knowledge Levels": useRef<HTMLDivElement>(null),
    "Units & Topics": useRef<HTMLDivElement>(null),
    "Lab Experiments": useRef<HTMLDivElement>(null),
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "All Fields") {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const ref = sectionRefs[tab as keyof typeof sectionRefs];
    if (ref?.current && scrollRef.current) {
      const containerTop = scrollRef.current.getBoundingClientRect().top;
      const sectionTop = ref.current.getBoundingClientRect().top;
      const offset = scrollRef.current.scrollTop + (sectionTop - containerTop) - 8;
      scrollRef.current.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-primary-custom text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Textbooks accept row */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <span>Textbooks:</span>
        <button className="flex items-center gap-1 rounded-md bg-primary2 px-3 py-1 text-color2 font-semibold hover:bg-color2/20">
          <CheckCircle2 className="h-4 w-4" /> Accept All Inferred Levels
        </button>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* Section 1 — Course Identification */}
        <div ref={sectionRefs["Course Details"]} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary2 text-xs font-bold text-color2 dark:bg-gray-100 dark:text-gray-900">1</span>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">Course Identification & L-T-P-C Structure</h3>
            </div>
            <span className="text-xs text-gray-400">Editable extracted fields</span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Course Code:</label>
              <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)}
              disabled
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Course Title:</label>
              <input
              disabled value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-4 gap-3">
            {[["Lecture (L):", L, setL], ["Tutorial (T):", T, setT], ["Practical (P):", P, setP], ["Credits (C):", C, setC]].map(([label, val, setter]: any) => (
              <div key={label}>
                <label className="mb-1 block text-xs text-gray-500">{label}</label>
                <input disabled value={val} onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Theory Hours: <strong className="text-gray-800 dark:text-gray-200">45 hrs</strong> (45 periods) &nbsp; Lab Hours: <strong className="text-gray-800 dark:text-gray-200">30 hrs</strong> (30 periods)</span>
            <span className="text-md font-bold text-color2">Total Contact: 75 hrs</span>
          </div>
        </div>

        {/* Section 2 — Course Outcomes */}
        <div ref={sectionRefs["COs & Knowledge Levels"]}>
          <CourseOutcomes />
        </div>

        {/* Section 3 — Unit Titles, Hours & Topics */}
        <div ref={sectionRefs["Units & Topics"]}>
          <UnitTopics />
        </div>

        {/* Section 4 — Lab Experiments */}
        <div ref={sectionRefs["Lab Experiments"]}>
          <LabExperiments />
        </div>

        {/* Section 5 — Prescribed Textbooks */}
        <PrescribedTextbooks />

      </div>
    </div>
  );
};

export default ExtractedDataPanel;
