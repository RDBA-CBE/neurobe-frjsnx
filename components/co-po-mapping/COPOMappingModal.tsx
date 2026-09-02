import { useEffect, useState } from "react";
import { X, Pencil, CheckCircle, Cpu } from "lucide-react";

const useLockBodyScroll = (active: boolean) => {
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);
};

const useAnimatedVisibility = (open: boolean, duration = 220) => {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, duration);
      return () => clearTimeout(t);
    }
  }, [open]);
  return { visible, closing };
};

const PO_DESCRIPTIONS: Record<string, string> = {
  PO1: "Engineering Knowledge — Apply knowledge of mathematics, science, engineering fundamentals, and computer science specialization to the solution of complex engineering problems.",
  PO2: "Problem Analysis — Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.",
  PO3: "Design/Development of Solutions — Design solutions for complex engineering problems and design system components or processes.",
  PO4: "Conduct Investigations of Complex Problems — Use research-based knowledge and methods including design of experiments.",
  PO5: "Modern Tool Usage — Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.",
  PO6: "The Engineer and Society — Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal, and cultural issues.",
  PO7: "Environment and Sustainability — Understand the impact of professional engineering solutions in societal and environmental contexts.",
  PO8: "Ethics — Apply ethical principles and commit to professional ethics and responsibilities.",
  PO9: "Individual and Team Work — Function effectively as an individual, and as a member or leader in diverse teams.",
  PO10: "Communication — Communicate effectively on complex engineering activities with the engineering community and society at large.",
  PO11: "Project Management and Finance — Demonstrate knowledge and understanding of engineering and management principles.",
  PO12: "Life-long Learning — Recognize the need for, and have the preparation and ability to engage in independent and life-long learning.",
  PSO1: "Apply core computing concepts to design and develop efficient software systems and applications.",
  PSO2: "Utilize modern tools, frameworks, and methodologies to solve real-world computing problems.",
};

const SCORE_CONFIG: Record<
  number,
  { label: string; bg: string; desc: string }
> = {
  3: { label: "Mapping Strength: 3", bg: "bg-green-800", desc: "High" },
  2: { label: "Mapping Strength: 2", bg: "bg-blue-700", desc: "Medium" },
  1: { label: "Mapping Strength: 1", bg: "bg-amber-600", desc: "Low" },
  0: { label: "No Mapping", bg: "bg-gray-300", desc: "No Mapping" },
};

const AI_RATIONALE: Record<string, string> = {
  PO1: "Applies foundational engineering and mathematical principles to layered network architectures, framing protocols, error detection (CRC), and transmission mediums.",
  PO2: "Requires systematic analysis of network topologies, protocol behaviors, and failure scenarios to derive substantiated engineering conclusions.",
  PO3: "Involves designing network components, subnetting schemes, and protocol stacks to address complex connectivity requirements.",
  PO4: "Demands experimental investigation of network performance metrics, packet loss, and latency under varying conditions.",
  PO5: "Utilizes simulation tools, network analyzers, and modern protocol frameworks to model and evaluate network behavior.",
  PO6: "Considers societal implications of network design decisions including privacy, accessibility, and regulatory compliance.",
  PO7: "Evaluates environmental impact of network infrastructure deployment and promotes sustainable networking practices.",
  PO8: "Addresses ethical responsibilities in network security, data privacy, and responsible use of communication systems.",
  PO9: "Collaborative network design projects require effective teamwork, role distribution, and leadership in technical environments.",
  PO10: "Communicates network design specifications, performance reports, and technical documentation to diverse stakeholders.",
  PO11: "Applies project management principles to plan, budget, and execute network infrastructure deployment projects.",
  PO12: "Encourages continuous learning to keep pace with evolving networking standards, protocols, and technologies.",
  PSO1: "Directly applies core computing and networking concepts to design robust and efficient communication systems.",
  PSO2: "Leverages modern networking tools, simulators, and frameworks to solve real-world connectivity and performance challenges.",
};

interface COPOMappingModalProps {
  open: boolean;
  onClose: () => void;
  coCode: string;
  coDescription: string;
  bloomLevel: string;
  poKey: string;
  score: number;
  onAccept: (coCode: string, poKey: string) => void;
}

const COPOMappingModal = ({
  open,
  onClose,
  coCode,
  coDescription,
  bloomLevel,
  poKey,
  score,
  onAccept,
}: COPOMappingModalProps) => {
  const { visible, closing } = useAnimatedVisibility(open);
  useLockBodyScroll(visible);

  if (!visible) return null;

  const scoreConf = SCORE_CONFIG[score] ?? SCORE_CONFIG[0];
  const poDesc = PO_DESCRIPTIONS[poKey] ?? "";
  const rationale =
    AI_RATIONALE[poKey] ?? "AI rationale not available for this mapping.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        animation: closing
          ? "fadeOut 0.22s ease forwards"
          : "fadeIn 0.22s ease",
      }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative  w-full max-w-lg rounded-lg bg-white shadow-2xl dark:bg-gray-900"
        style={{
          animation: closing
            ? "slideDown 0.22s ease forwards"
            : "slideUp 0.22s ease",
        }}
      >
        {/* Header */}
        <div className="bg-color1 flex items-start justify-between rounded-t-lg px-5 py-4">
          <div>
            <p className="text-xs  pb-3">
              <span className="rounded-md bg-white/10 p-1 px-2 font-semibold text-white/90">
                {coCode} × {poKey}
              </span>{" "} {" "}
              <span className="text-xs  text-white/80">Mapping Details</span>
            </p>
            <h3 className=" section-ti !text-[#fff]">
              CO–PO Mapping Review
            </h3>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 rounded-full border border-white/40 p-0.5 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          {/* CO Section */}
          <div className="rounded-xl border border-gray-200  p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-color2-l text-color2 rounded px-2 py-0.5 text-xs font-bold">
                {coCode}
              </span>
              <span className="text-sm font-bold text-[#000] dark:text-white">
                Course Outcome
              </span>
            </div>
            <p className="pt-2 text-xs text-pri dark:text-white/70">
              {coDescription}
            </p>
            
          </div>

          {/* PO Section */}
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-[#000] px-2 py-0.5 text-xs font-bold text-white">
                {poKey}
              </span>
              <span className="text-sm font-bold text-[#000] dark:text-white">
                {poKey.startsWith("PSO")
                  ? "Program Specific Outcome"
                  : "Engineering Knowledge"}
              </span>
            </div>
            <p className="text-xs pt-2 text-pri dark:text-white/70">{poDesc}</p>
          </div>

          {/* Mapping Strength */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-[#000] dark:text-white">
                Suggested Mapping Value:
              </span>
              <span className="text-color2 text-sm font-bold">
                Value: {score || "–"}
              </span>
            </div>
            <div
              className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 ${
                score > 0
                  ? "bg-green-50 dark:bg-green-900/20 border border-gray-200"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${scoreConf.bg}`}
              >
                {score || "–"}
              </span>
              <div>
                <p className="text-xs font-semibold text-[#000] dark:text-white">
                  {scoreConf.label}
                </p>
                <p className="text-color2 text-[10px]">Suggested by NEURO AI</p>
              </div>
            </div>
          </div>
          <div className="mb-1.5 flex items-center gap-1.5">
              <Cpu className="text-color2 h-3.5 w-3.5" />
              <span className="text-color2 text-sm font-bold">
                NEURO AI Rationale
              </span>
            </div>

          {/* AI Rationale */}
          <div className="bg-color2-l rounded-xl p-3">
            
            <p className="text-xs leading-relaxed text-[#000] dark:text-white/80">
              {rationale}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-700 mt-5">
          <button
            onClick={onClose}
            className="create-btn-sec"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Mapping
          </button>
          <button
            onClick={() => onAccept(coCode, poKey)}
            className="create-btn"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Accept Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

export default COPOMappingModal;
