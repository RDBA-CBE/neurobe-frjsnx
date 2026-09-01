import { useState, useEffect } from "react";
import { CheckCircle2, Edit, PlusIcon } from "lucide-react";
import { ModalShell } from "@/components/academic-setup/AddModals";
import TextInput from "@/components/FormFields/TextInput.component";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const toOpt  = (v: string | null | undefined) => v ? { value: v, label: v } : null;

const PROGRAMME_OPTS   = toOpts(["B.Tech Computer Science & Engg", "B.Tech Electronics & Comm", "M.Tech Artificial Intelligence", "MBA"]);
const BATCH_OPTS       = toOpts(["2025-2029", "2024-2028", "2023-2027", "2022-2026"]);
const TERM_OPTS        = toOpts(["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]);
const COURSE_OPTS      = toOpts(["CS301 - Data Structures (4 Credits)", "CS302 - Database Management Systems (4 Credits)", "CS303 - Operating Systems (4 Credits)", "EC201 - Digital Signal Processing (4 Credits)", "AI101 - Foundations of Machine Learning (4 Credits)"]);
const COORDINATOR_OPTS = toOpts(["Arun Kumar (FAC-CSE-018)", "Priya Selvan (FAC-CSE-042)", "Vignesh Kumar (FAC-BCE-031)", "Priya Balwani (FAC-CSE-044)"]);
const ALL_INSTRUCTORS  = ["Arun Kumar", "Priya Selvam", "Sanjay Murugan", "Vignesh Kumar", "Deepa Nair", "Dr. Senthil Nathan"];

interface Props { open: boolean; onClose: () => void; initialData?: any; }

const CourseOfferingModal = ({ open, onClose, initialData }: Props) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    programme:   null as any,
    batch:       null as any,
    ay:          "",
    term:        null as any,
    course:      null as any,
    coordinator: null as any,
    instructors: ["Arun Kumar", "Priya Selvam"] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        programme:   toOpt(initialData.programme),
        batch:       toOpt(initialData.batch),
        ay:          initialData.ay ?? "",
        term:        toOpt(initialData.term),
        course:      toOpt(initialData.course),
        coordinator: toOpt(initialData.coordinator ? `${initialData.coordinator} (FAC-CSE-018)` : null),
        instructors: initialData.instructors ?? [],
      });
    } else {
      setForm({ programme: null, batch: null, ay: "", term: null, course: null, coordinator: null, instructors: ["Arun Kumar", "Priya Selvam"] });
    }
  }, [initialData, open]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const toggleInstructor = (name: string) =>
    setForm((p) => ({
      ...p,
      instructors: p.instructors.includes(name)
        ? p.instructors.filter((i) => i !== name)
        : [...p.instructors, name],
    }));

  const coordinatorName = form.coordinator?.label?.split(" (")[0] ?? "";

  return (
    <ModalShell
      title={isEdit ? "Edit Course Offering" : "Create Course Offering"}
      // subtitle="Configure delivery instance for an academic course offering with faculty bindings."
      icon={isEdit ? <Edit className="w-3.5 h-3.5" /> : <PlusIcon className="w-3.5 h-3.5" />}
      open={open}
      onClose={onClose}
    >
      <form
        id="co-form"
        onSubmit={(e) => { e.preventDefault(); onClose(); }}
      >
        <div className="space-y-4">

          {/* Row 1: Programme + Batch */}
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect title="Academic Programme" required options={PROGRAMME_OPTS} value={form.programme} onChange={(v) => set("programme", v)} placeholder="B.Tech Computer Science & Engg" />
            <CustomSelect title="Batch"              required options={BATCH_OPTS}     value={form.batch}      onChange={(v) => set("batch",      v)} placeholder="2025-2029" />
          </div>

          {/* Row 2: Academic Year + Term */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput title="Academic Year" required placeholder="2026-27" value={form.ay} onChange={(e) => set("ay", e.target.value)} />
            <CustomSelect title="Academic Term / Semester" required options={TERM_OPTS} value={form.term} onChange={(v) => set("term", v)} placeholder="Semester 3" />
          </div>

          {/* Course */}
          <CustomSelect title="Course" required options={COURSE_OPTS} value={form.course} onChange={(v) => set("course", v)} placeholder="CS301 - Data Structures (4 Credits)" />

          {/* Coordinator box */}
          <div className="rounded-xl border border-[#ede9fe] bg-[#faf8ff] p-4 dark:border-purple-800 dark:bg-purple-900/10">
            <CustomSelect
              title="Assigned Course Coordinator"
              required
              options={COORDINATOR_OPTS}
              value={form.coordinator}
              onChange={(v) => set("coordinator", v)}
              placeholder="Arun Kumar (FAC-CSE-018)"
            />
            {coordinatorName && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="font-semibold">{coordinatorName}</span> will automatically receive Instructor access for this course.
                </span>
              </div>
            )}
          </div>

          {/* Additional Instructors */}
          <div>
            <p className="mb-2 text-sm font-bold text-[#000] dark:text-gray-300">
              Additional Course Instructor(s)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_INSTRUCTORS.map((name) => {
                const checked = form.instructors.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleInstructor(name)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      checked
                        ? "border-[#7c3aed] bg-[#ede9fe] text-[#7c3aed]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-[#7c3aed] bg-[#7c3aed]" : "border-gray-300"}`}>
                      {checked && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {name}
                    {name === "Arun Kumar" && <span className="ml-auto text-yellow-400">☆</span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer — same pattern as AddModals */}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancel
          </button>
          <button type="submit" className="bg-color2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90">
            {isEdit ? "Update Offering" : "Create Offering"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default CourseOfferingModal;
