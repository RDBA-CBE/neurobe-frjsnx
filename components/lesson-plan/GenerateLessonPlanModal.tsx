import { Check, CheckCircle2, Sparkles } from "lucide-react";
import { ModalShell } from "@/components/academic-setup/AddModals";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenerateLessonPlanModalProps {
  open: boolean;
  onClose: () => void;
  /** e.g. "CS309 — Computer Networks" */
  courseLabel?: string;
  stats?: {
    topics: number;
    units: number;
    hours: number;
  };
  onReview?: () => void;
}

// ─── Static generation steps ──────────────────────────────────────────────────

const GENERATION_STEPS = [
  {
    title: "Ingesting Approved Topics & Syllabus",
    description: "Loading 5 units, 22 approved topics, and 45 contact hours for CS309",
  },
  {
    title: "Allocating Lecture Hours & Sequencing",
    description: "Balancing lecture hours (1–3 hrs) per topic to reach 45 contact hours",
  },
  {
    title: "Calibrating Knowledge Levels & Pedagogies",
    description: "Aligning Bloom cognitive levels (K1–K4) with active teaching methods",
  },
  {
    title: "Mapping Textbooks & Reference Chapters",
    description: "Associating Tanenbaum, Kurose-Ross, and Forouzan textbook sections",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const GenerateLessonPlanModal = ({
  open,
  onClose,
  courseLabel = "CS309 — Computer Networks",
  stats = { topics: 22, units: 5, hours: 45 },
  onReview,
}: GenerateLessonPlanModalProps) => {
  return (
    <ModalShell
      title="Generate Lesson Plan with NEURO AI"
      subtitle={courseLabel}
      icon={<Sparkles className="h-3.5 w-3.5" />}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-4">

        {/* ── Success banner + progress bar ── */}
        <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              <span className="text-sm font-bold text-green-700">
                Lesson Plan Generated Successfully
              </span>
            </div>
            <span className="text-sm font-bold text-green-700">100%</span>
          </div>
          <div className="h-1.5 w-full bg-green-100">
            <div className="h-full w-full rounded-full bg-green-500" />
          </div>
        </div>

        {/* ── Generation steps ── */}
        <div className="space-y-2">
          {GENERATION_STEPS.map((step) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#000]">{step.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">
          <div className="flex flex-col items-center py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Topics
            </span>
            <span className="mt-1 text-base font-bold text-[#000]">
              {stats.topics} Topics
            </span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Units
            </span>
            <span className="mt-1 text-base font-bold text-[#000]">
              {stats.units} Units
            </span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Hours
            </span>
            <span className="mt-1 text-base font-bold text-color2">
              {stats.hours} Hours
            </span>
          </div>
        </div>

        {/* ── Review CTA ── */}
        <button
          type="button"
          onClick={() => { onReview?.(); onClose(); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-color2 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Review Generated Lesson Plan
          <span className="text-base leading-none">→</span>
        </button>

      </div>
    </ModalShell>
  );
};

export default GenerateLessonPlanModal;
