import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Settings2, Sparkles } from "lucide-react";
import IconPlus from "@/components/Icon/IconPlus";

export interface CIAQuestion {
  id: string;
  text: string;
  marks: number;
  coTag?: string;
  bloomLevel?: string;
}

export interface CIASection {
  id: string;
  title: string;
  totalMarks: number;
  usedMarks: number;
  questions: CIAQuestion[];
}

interface SectionsAndQuestionsSectionProps {
  sections: CIASection[];
  onAddSection: () => void;
  onGenerateQuestions: (sectionId: string) => void;
  onAddQuestion: (sectionId: string) => void;
  onSectionSettings: (sectionId: string) => void;
}

const SectionsAndQuestionsSection = ({
  sections,
  onAddSection,
  onGenerateQuestions,
  onAddQuestion,
  onSectionSettings,
}: SectionsAndQuestionsSectionProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="panel mb-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="section-ti">2. Sections &amp; Questions</h3>
          <p className="mt-0.5 text-xs text-pri">
            Allocate marks per section and compose syllabus-aligned questions.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSection}
          className="create-btn flex items-center gap-1.5"
        >
          <IconPlus className="h-3.5 w-3.5" />
          Add Section
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="text-pri hover:text-[#000]"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <span className="text-sm font-bold text-[#000] dark:text-white">
                    {section.title}
                  </span>
                  <span className="rounded-full bg-color2-l px-2 py-0.5 text-xs font-semibold text-color2">
                    {section.totalMarks} Marks
                  </span>
                  <button
                    type="button"
                    onClick={() => onSectionSettings(section.id)}
                    className="create-btn px-2 py-1.5 !text-xs"
                  >
                    <Settings2 className="h-3 w-3" />
                    Section Settings
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-pri">
                  <span>
                    Marks Used:{" "}
                    <strong className="text-[#000] dark:text-white">
                      {section.usedMarks} / {section.totalMarks}
                    </strong>
                  </span>
                  {section.usedMarks < section.totalMarks && (
                    <span className="text-amber-600">
                      ({section.totalMarks - section.usedMarks} Marks Remaining)
                    </span>
                  )}
                </div>
              </div>

              {/* Section Body */}
              {isExpanded && (
                <div className="px-4 py-4">
                  {section.questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-sm font-semibold text-[#000] dark:text-white">
                        No questions added yet.
                      </p>
                      <p className="mt-0.5 text-xs text-pri">
                        Target for Section: {section.totalMarks} marks
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onGenerateQuestions(section.id)}
                          className="create-btn flex items-center gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Questions
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddQuestion(section.id)}
                          className="create-btn-sec flex items-center gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Question
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {section.questions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <span className="mt-0.5 text-xs font-bold text-pri">
                              Q{idx + 1}.
                            </span>
                            <p className="text-sm text-[#000] dark:text-white">
                              {q.text}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {q.coTag && (
                              <span className="rounded bg-color2-l px-2 py-0.5 text-xs font-semibold text-color2">
                                {q.coTag}
                              </span>
                            )}
                            <span className="text-xs font-bold text-[#000] dark:text-white">
                              {q.marks} M
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => onGenerateQuestions(section.id)}
                          className="create-btn flex items-center gap-1.5 text-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Questions
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddQuestion(section.id)}
                          className="create-btn-sec flex items-center gap-1.5 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-600">
            <p className="text-sm font-semibold text-[#000] dark:text-white">
              No sections added yet.
            </p>
            <p className="mt-0.5 text-xs text-pri">
              Click "Add Section" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionsAndQuestionsSection;
