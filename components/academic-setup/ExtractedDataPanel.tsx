import { useState } from "react";
import { CheckCircle2, Pencil, Settings2 } from "lucide-react";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const TABS = ["All Fields", "Course Details", "COs & Knowledge Levels", "Units & Topics", "Lab Experiments"];

const KNOWLEDGE_OPTIONS = [
  { value: "K1", label: "K1 Remember" },
  { value: "K2", label: "K2 Understand" },
  { value: "K3", label: "K3 Apply" },
  { value: "K4", label: "K4 Analyze" },
  { value: "K5", label: "K5 Evaluate" },
  { value: "K6", label: "K6 Create" },
];

const MOCK_COS = [
  {
    id: "CO1",
    knowledge: "K2",
    description: "Explain the principles of layered network architectures, physical transmission media, and physical layer signal encoding.",
    reason: 'Action verb "Explain" maps to K2 Understand in Bloom\'s Taxonomy.',
    accepted: true,
  },
  {
    id: "CO2",
    knowledge: "K3",
    description: "Apply error detection, framing, and MAC protocols for local area networks.",
    reason: 'Action verb "Apply" maps to K3 Apply in Bloom\'s Taxonomy.',
    accepted: false,
  },
];

const ExtractedDataPanel = () => {
  const [activeTab, setActiveTab] = useState("All Fields");
  const [courseCode, setCourseCode] = useState("CS309");
  const [courseTitle, setCourseTitle] = useState("Computer Networks");
  const [L, setL] = useState("3");
  const [T, setT] = useState("0");
  const [P, setP] = useState("2");
  const [C, setC] = useState("4");

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
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
        <button className="flex items-center gap-1 text-primary font-medium hover:underline">
          <CheckCircle2 className="h-4 w-4" /> Accept All Inferred Levels
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 space-y-4 overflow-auto">

        {/* Section 1 — Course Identification */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white dark:bg-gray-100 dark:text-gray-900">1</span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white">Course Identification & L-T-P-C Structure</h3>
            </div>
            <span className="text-xs text-gray-400">Editable extracted fields</span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Course Code:</label>
              <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Course Title:</label>
              <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-4 gap-3">
            {[["Lecture (L):", L, setL], ["Tutorial (T):", T, setT], ["Practical (P):", P, setP], ["Credits (C):", C, setC]].map(([label, val, setter]: any) => (
              <div key={label}>
                <label className="mb-1 block text-xs text-gray-500">{label}</label>
                <input value={val} onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Theory Hours: <strong className="text-gray-800 dark:text-gray-200">45 hrs</strong> (45 periods) &nbsp; Lab Hours: <strong className="text-gray-800 dark:text-gray-200">30 hrs</strong> (30 periods)</span>
            <span className="font-semibold text-primary">Total Contact: 75 hrs</span>
          </div>
        </div>

        {/* Section 2 — Course Outcomes */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white dark:bg-gray-100 dark:text-gray-900">2</span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white">Course Outcomes & Knowledge Levels</h3>
            </div>
            <span className="text-xs font-medium text-primary">4 / 6 Accepted</span>
          </div>

          <div className="space-y-4">
            {MOCK_COS.map((co) => (
              <div key={co.id} className="rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-gray-900 px-2.5 py-0.5 text-xs font-bold text-white dark:bg-gray-100 dark:text-gray-900">{co.id}</span>
                    <div className="w-36">
                      <CustomSelect
                        options={KNOWLEDGE_OPTIONS}
                        value={KNOWLEDGE_OPTIONS.find((o) => o.value === co.knowledge) || null}
                        onChange={() => {}}
                        isSearchable={false}
                        isClearable={false}
                      />
                    </div>
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-purple-900/20">AI Inferred Knowledge Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {co.accepted ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Accepted
                      </span>
                    ) : (
                      <button className="flex items-center gap-1 rounded-full border border-green-300 px-3 py-1 text-xs font-semibold text-green-600 hover:bg-green-50">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                      </button>
                    )}
                    <button className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                </div>
                <p className="mb-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">{co.description}</p>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Settings2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span><strong className="text-gray-700 dark:text-gray-300">Reason for Inferred Knowledge Level:</strong> {co.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExtractedDataPanel;
