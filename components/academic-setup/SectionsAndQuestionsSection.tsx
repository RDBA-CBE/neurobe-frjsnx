import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Settings2, Sparkles, Trash2, Settings } from "lucide-react";
import IconPlus from "@/components/Icon/IconPlus";
import { AddQuestionModal, GenerateQuestionsModal } from "@/components/academic-setup/CIAQuestionModals";
import TextInput from "@/components/FormFields/TextInput.component";

export interface CIAQuestion {
  id: string;
  text: string;
  marks: number;
  coTag?: string;
  bloomLevel?: string;
  topic?: string;
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
  onGenerateQuestions?: (sectionId: string) => void;
  onAddQuestion?: (sectionId: string) => void;
  onSectionSettings?: (sectionId: string) => void;
  onSectionsChange?: (sections: CIASection[]) => void;
}

const SectionsAndQuestionsSection = ({
  sections,
  onAddSection,
  onSectionSettings,
  onSectionsChange,
}: SectionsAndQuestionsSectionProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [settingsOpenFor, setSettingsOpenFor] = useState<string | null>(null);
  // draft values while settings panel is open
  const [settingsDraft, setSettingsDraft] = useState<Record<string, { title: string; totalMarks: number }>>({});

  const openSettings = (section: CIASection) => {
    setSettingsDraft((prev) => ({
      ...prev,
      [section.id]: { title: section.title, totalMarks: section.totalMarks },
    }));
    setSettingsOpenFor(section.id);
    // ensure section is expanded when settings open
    setExpandedSections((prev) => new Set([...prev, section.id]));
  };

  const closeSettings = (sectionId: string) => {
    const draft = settingsDraft[sectionId];
    if (draft) {
      const updated = sections.map((s) =>
        s.id === sectionId ? { ...s, title: draft.title, totalMarks: draft.totalMarks } : s,
      );
      onSectionsChange?.(updated);
    }
    setSettingsOpenFor(null);
  };

  const updateDraft = (sectionId: string, field: "title" | "totalMarks", value: string | number) => {
    setSettingsDraft((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };
  const [addModal, setAddModal] = useState<{ open: boolean; sectionId: string; sectionTitle: string; qNo: number }>({
    open: false, sectionId: "", sectionTitle: "", qNo: 1,
  });
  const [generateModal, setGenerateModal] = useState<{ open: boolean; sectionId: string; sectionTitle: string; totalMarks: number }>({
    open: false, sectionId: "", sectionTitle: "", totalMarks: 20,
  });

  const openAdd = (section: CIASection) =>
    setAddModal({ open: true, sectionId: section.id, sectionTitle: section.title, qNo: section.questions.length + 1 });

  const openGenerate = (section: CIASection) =>
    setGenerateModal({ open: true, sectionId: section.id, sectionTitle: section.title, totalMarks: section.totalMarks });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddQuestions = (sectionId: string, newQuestions: CIAQuestion[]) => {
    const updated = sections.map((s) => {
      if (s.id !== sectionId) return s;
      const merged = [...s.questions, ...newQuestions];
      const usedMarks = merged.reduce((sum, q) => sum + q.marks, 0);
      return { ...s, questions: merged, usedMarks };
    });
    onSectionsChange?.(updated);
    setGenerateModal((p) => ({ ...p, open: false }));
  };

  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    const updated = sections.map((s) => {
      if (s.id !== sectionId) return s;
      const filtered = s.questions.filter((q) => q.id !== questionId);
      return { ...s, questions: filtered, usedMarks: filtered.reduce((sum, q) => sum + q.marks, 0) };
    });
    onSectionsChange?.(updated);
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
        <button type="button" onClick={onAddSection} className="create-btn-sec flex items-center gap-1.5">
          <IconPlus className="h-3.5 w-3.5" /> Add Section
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, sIdx) => {
          const isExpanded = expandedSections.has(section.id);
          const isSettingsOpen = settingsOpenFor === section.id;
          const draft = settingsDraft[section.id];
          const isComplete = section.usedMarks >= section.totalMarks;
          // derive label letter from index
          const letter = String.fromCharCode(65 + sIdx);
          return (
            <div key={section.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              {/* Section Header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleSection(section.id)} className="text-pri hover:text-[#000]">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {/* Section letter badge */}
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-color2 text-xs font-bold text-white">
                    {letter}
                  </span>
                  <span className="text-sm font-bold text-[#000] dark:text-white">{section.title}</span>
                  <span className="rounded-full bg-color2-l px-2 py-0.5 text-xs font-semibold text-color2">
                    {section.totalMarks} Marks
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      isSettingsOpen ? closeSettings(section.id) : openSettings(section)
                    }
                    className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold transition-colors ${
                      isSettingsOpen
                        ? "border-color2 bg-color2-l text-color2"
                        : "border-gray-200 bg-white text-pri hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                    }`}
                  >
                    <Settings2 className="h-3 w-3" /> Section Settings
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-pri">
                    Marks Used:{" "}
                    <strong className="text-[#000] dark:text-white">
                      {section.usedMarks} / {section.totalMarks}
                    </strong>
                  </span>
                  {isComplete ? (
                    <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      ✓ Complete
                    </span>
                  ) : (
                    <span className="font-semibold text-red-500">
                      {section.totalMarks - section.usedMarks} Marks Remaining
                    </span>
                  )}
                </div>
              </div>

              {/* ── Inline Section Settings panel ── */}
              {isSettingsOpen && draft && (
                <div className="border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900">
                  {/* Settings label row */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-color2">
                      <Settings2 className="h-3.5 w-3.5" />
                      Section {letter} Settings
                    </span>
                    <button
                      type="button"
                      onClick={() => closeSettings(section.id)}
                      className="text-sm font-semibold text-color2 hover:underline"
                    >
                      Done
                    </button>
                  </div>

                  {/* Two fields */}
                  <div className="flex items-end gap-4">
                    {/* Section Title */}
                    <div className="flex-1">
                      <TextInput
                        title="Section Title"
                        value={draft.title}
                        onChange={(e) => updateDraft(section.id, "title", e.target.value)}
                      />
                    </div>

                    {/* Section Marks Allocation */}
                    <div className="flex-1">
                      <TextInput
                        title="Section Marks Allocation"
                        type="number"
                        min={0}
                        value={draft.totalMarks}
                        onChange={(e) => updateDraft(section.id, "totalMarks", Number(e.target.value))}
                        rightIcon={
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => updateDraft(section.id, "totalMarks", draft.totalMarks + 1)}
                              className="flex h-5 items-center justify-center text-[10px] text-gray-400 hover:text-gray-700"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => updateDraft(section.id, "totalMarks", Math.max(0, draft.totalMarks - 1))}
                              className="flex h-5 items-center justify-center text-[10px] text-gray-400 hover:text-gray-700"
                            >
                              ▼
                            </button>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section Body */}
              {isExpanded && (
                <div className="px-4 py-3">
                  {section.questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-sm font-semibold text-[#000] dark:text-white">No questions added yet.</p>
                      <p className="mt-0.5 text-xs text-pri">Target for Section {letter} is {section.totalMarks} marks.</p>
                      <div className="mt-4 flex items-center gap-3">
                        <button type="button" onClick={() => openGenerate(section)} className="create-btn flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" /> Generate Questions
                        </button>
                        <button type="button" onClick={() => openAdd(section)} className="create-btn-sec flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" /> Add Question
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {section.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex items-start gap-2 flex-1">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-color2-l text-[10px] font-bold text-color2">
                                Q{idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#000] dark:text-white">{q.text}</p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  {q.coTag && (
                                    <span className="rounded bg-color2-l px-1.5 py-0.5 text-[10px] font-bold text-color2">{q.coTag}</span>
                                  )}
                                  {q.bloomLevel && (
                                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-pri dark:bg-gray-700">{q.bloomLevel}</span>
                                  )}
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-pri dark:bg-gray-700">{q.marks} Marks</span>
                                  {q.topic && (
                                    <span className="text-[10px] text-pri">Topic: {q.topic}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button type="button" className="rounded p-1.5 text-pri hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Settings className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(section.id, q.id)}
                                className="rounded p-1.5 text-pri hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer row */}
                      <div className="mt-3 flex items-center justify-between">
                        <button type="button" onClick={() => openAdd(section)} className="create-btn-sec flex items-center gap-1.5 text-xs">
                          <Plus className="h-3.5 w-3.5" /> Add Question
                        </button>
                        <button type="button" onClick={() => openGenerate(section)} className="create-btn flex items-center gap-1.5 text-xs">
                          <Sparkles className="h-3.5 w-3.5" /> Generate More Questions
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-600">
            <p className="text-sm font-semibold text-[#000] dark:text-white">No sections added yet.</p>
            <p className="mt-0.5 text-xs text-pri">Click "Add Section" to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddQuestionModal
        open={addModal.open}
        onClose={() => setAddModal((p) => ({ ...p, open: false }))}
        sectionTitle={addModal.sectionTitle}
        questionNumber={addModal.qNo}
      />
      <GenerateQuestionsModal
        open={generateModal.open}
        onClose={() => setGenerateModal((p) => ({ ...p, open: false }))}
        sectionTitle={generateModal.sectionTitle}
        sectionType="Short Answer Questions"
        targetMarks={generateModal.totalMarks}
        onAddQuestions={(qs) => handleAddQuestions(generateModal.sectionId, qs)}
      />
    </div>
  );
};

export default SectionsAndQuestionsSection;
