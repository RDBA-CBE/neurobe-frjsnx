import { useState } from "react";
import { CheckCircle2, Pencil, Settings2, Sparkle } from "lucide-react";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const KNOWLEDGE_OPTIONS = [
  { value: "K1", label: "K1 Remember" },
  { value: "K2", label: "K2 Understand" },
  { value: "K3", label: "K3 Apply" },
  { value: "K4", label: "K4 Analyze" },
  { value: "K5", label: "K5 Evaluate" },
  { value: "K6", label: "K6 Create" },
];

const INITIAL_COS = [
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
    description: "Apply error detection, framing, and Medium Access Control (MAC) protocols for local area networks.",
    reason: 'Action verb "Apply error detection (CRC) and MAC protocols" maps to procedural application under K3.',
    accepted: false,
  },
  {
    id: "CO3",
    knowledge: "K4",
    description: "Analyze IP addressing, subnetting schemas, and routing algorithms (OSPF, BGP, RIP) across heterogeneous networks.",
    reason: 'Keywords "Analyze IP subnetting and shortest-path routing convergence" match Knowledge Level K4 Analyze tier.',
    accepted: true,
  },
  {
    id: "CO4",
    knowledge: "K3",
    description: "Apply transport layer protocols such as TCP and UDP to design reliable end-to-end communication.",
    reason: 'Action verb "Apply" maps to K3 Apply in Bloom\'s Taxonomy.',
    accepted: false,
  },
  {
    id: "CO5",
    knowledge: "K2",
    description: "Understand application layer protocols including HTTP, DNS, FTP, and SMTP.",
    reason: 'Action verb "Understand" maps to K2 Understand in Bloom\'s Taxonomy.',
    accepted: true,
  },
  {
    id: "CO6",
    knowledge: "K5",
    description: "Evaluate network security mechanisms including cryptography, firewalls, and intrusion detection systems.",
    reason: 'Action verb "Evaluate" maps to K5 Evaluate in Bloom\'s Taxonomy.',
    accepted: false,
  },
];

const CourseOutcomes = () => {
  const [cos, setCos] = useState(INITIAL_COS);

  const acceptedCount = cos.filter((c) => c.accepted).length;

  const handleAccept = (id: string) =>
    setCos((prev) => prev.map((c) => (c.id === id ? { ...c, accepted: true } : c)));

  const handleKnowledgeChange = (id: string, value: string) =>
    setCos((prev) => prev.map((c) => (c.id === id ? { ...c, knowledge: value } : c)));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary2 text-xs font-bold text-color2">2</span>
          <h3 className="text-sm font-extrabold  uppercase tracking-wide text-gray-900 dark:text-white">Course Outcomes & Knowledge Levels</h3>
        </div>
        <span className="text-md font-bold text-color2">{acceptedCount} / {cos.length} Accepted</span>
      </div>

      <div className="space-y-4">
        {cos.map((co) => (
          <div
            key={co.id}
            className="rounded-xl border border-purple-100 p-4 dark:border-purple-900/30"
          >
            {/* Top row */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-bold text-white dark:bg-gray-100 dark:text-gray-900">
                  {co.id}
                </span>
                <div className="w-36">
                  <CustomSelect
                    options={KNOWLEDGE_OPTIONS}
                    value={KNOWLEDGE_OPTIONS.find((o) => o.value === co.knowledge) || null}
                    onChange={(opt: any) => handleKnowledgeChange(co.id, opt?.value)}
                    isSearchable={false}
                    isClearable={false}
                  />
                </div>
                <span className="rounded-md bg-sec px-2.5 py-0.5 text-md font-medium text-color2 dark:bg-purple-900/20">
                  AI Inferred Knowledge Level
                </span>
              </div>

              <div className="flex items-center gap-2">
                {co.accepted ? (
                  <span className="flex items-center gap-1.5 rounded-md border border-green-400 px-3 py-0.5 text-md font-semibold text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                  </span>
                ) : (
                  <button
                    onClick={() => handleAccept(co.id)}
                    className="flex items-center gap-1.5 rounded-md bg-green-500 px-3 py-0.5 text-md font-semibold text-white hover:bg-green-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                  </button>
                )}
                <button className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
            </div>

            {/* Description */}
            {co.accepted ? (
              <p className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">{co.description}</p>
            ) : (
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{co.description}</p>
            )}

            {/* Reason box */}
            <div className="flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2.5 dark:bg-purple-900/10">
              <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-color2" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-color2">Reason for Inferred Knowledge Level: </strong>
                {co.reason}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOutcomes;
