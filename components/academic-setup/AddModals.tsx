import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/FormFields/TextInput.component";
import TextArea from "@/components/FormFields/TextArea.component";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

// ─── Shared modal shell ───────────────────────────────────────────────────────
interface ModalShellProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalShell = ({ title, open, onClose, children }: ModalShellProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#000] dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const ModalFooter = ({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) => (
  <div className="mt-6 flex justify-end gap-3">
    <button
      type="button"
      onClick={onClose}
      className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-color2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
    >
      {submitLabel}
    </button>
  </div>
);

// ─── Option helpers ───────────────────────────────────────────────────────────
const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

const DEPT_OPTS    = toOpts(["CS - Computer Science", "EC - Electronics", "AI - Artificial Intelligence", "ME - Mechanical", "CE - Civil"]);
const STATUS_OPTS  = toOpts(["Active", "Inactive"]);
const PROG_OPTS    = toOpts(["BTECH-CSE", "BTECH-ECE", "MTECH-AI", "MBA"]);
const TYPE_OPTS    = toOpts(["UG", "PG"]);

// ─── CREATE COURSE MODAL ──────────────────────────────────────────────────────
export const CreateCourseModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({
    code: "", title: "", department: null as any, status: null as any,
    lecture: "3", tutorial: "0", practical: "0", credits: "4",
    theoryHours: "", labHours: "",
  });

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell title="Create New Course" open={open} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            title="Course Code"
            required
            placeholder="e.g. CS301"
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
          />
          <TextInput
            title="Course Title"
            required
            placeholder="e.g. Data Structures"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <CustomSelect
            title="Department"
            required
            options={DEPT_OPTS}
            value={form.department}
            onChange={(v) => set("department", v)}
            placeholder="CS - Computer Science"
          />
          <CustomSelect
            title="Status"
            options={STATUS_OPTS}
            value={form.status}
            onChange={(v) => set("status", v)}
            placeholder="Active"
          />
        </div>

        {/* L-T-P-C */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-[#000] dark:text-gray-400">
            L-T-P-C Breakdown (Weekly Hours &amp; Credits)
            <span className="ml-2 cursor-pointer text-[#7c3aed] underline">Calculated Credits ▾</span>
          </p>
          <div className="grid grid-cols-4 gap-3">
            <TextInput title="Lecture"  type="number" value={form.lecture}   onChange={(e) => set("lecture",   e.target.value)} />
            <TextInput title="Tutorial" type="number" value={form.tutorial}  onChange={(e) => set("tutorial",  e.target.value)} />
            <TextInput title="Practical"type="number" value={form.practical} onChange={(e) => set("practical", e.target.value)} />
            <TextInput
              title="Credits"
              type="number"
              value={form.credits}
              onChange={(e) => set("credits", e.target.value)}
              className="border-[#7c3aed] bg-[#ede9fe] text-center font-bold text-[#7c3aed]"
            />
          </div>
        </div>

        {/* Hours */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextInput
            title="Total Theory Hours"
            type="number"
            placeholder="45"
            value={form.theoryHours}
            onChange={(e) => set("theoryHours", e.target.value)}
          />
          <TextInput
            title="Total Lab Hours"
            type="number"
            placeholder="30"
            value={form.labHours}
            onChange={(e) => set("labHours", e.target.value)}
          />
        </div>

        <ModalFooter onClose={onClose} submitLabel="Create Entry" />
      </form>
    </ModalShell>
  );
};

// ─── CREATE DEPARTMENT MODAL ──────────────────────────────────────────────────
export const CreateDepartmentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ code: "", name: "", hod: "", status: null as any });
  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell title="Create New Department" open={open} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput title="Department Code" required placeholder="e.g. CSE" value={form.code} onChange={(e) => set("code", e.target.value)} />
          <TextInput title="Department Name" required placeholder="e.g. Computer Science & Engineering" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <TextInput title="Head of Department" placeholder="e.g. Dr. A. Kumar" value={form.hod} onChange={(e) => set("hod", e.target.value)} />
          <CustomSelect title="Status" options={STATUS_OPTS} value={form.status} onChange={(v) => set("status", v)} placeholder="Active" />
        </div>
        <ModalFooter onClose={onClose} submitLabel="Create Department" />
      </form>
    </ModalShell>
  );
};

// ─── CREATE PROGRAMME MODAL ───────────────────────────────────────────────────
export const CreateProgrammeModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ code: "", name: "", department: null as any, type: null as any, duration: "", status: null as any });
  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell title="Create New Programme" open={open} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput title="Programme Code" required placeholder="e.g. BTECH-CSE" value={form.code} onChange={(e) => set("code", e.target.value)} />
          <TextInput title="Programme Name" required placeholder="e.g. B.Tech Computer Science" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <CustomSelect title="Department" required options={DEPT_OPTS} value={form.department} onChange={(v) => set("department", v)} placeholder="Select Department" />
          <CustomSelect title="Type" required options={TYPE_OPTS} value={form.type} onChange={(v) => set("type", v)} placeholder="UG / PG" />
          <TextInput title="Duration" required placeholder="e.g. 4 Years" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          <CustomSelect title="Status" options={STATUS_OPTS} value={form.status} onChange={(v) => set("status", v)} placeholder="Active" />
        </div>
        <ModalFooter onClose={onClose} submitLabel="Create Programme" />
      </form>
    </ModalShell>
  );
};

// ─── CREATE BATCH MODAL ───────────────────────────────────────────────────────
export const CreateBatchModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ code: "", name: "", programme: null as any, startYear: "", endYear: "", status: null as any });
  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell title="Create New Batch" open={open} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput title="Batch Code" required placeholder="e.g. B2025" value={form.code} onChange={(e) => set("code", e.target.value)} />
          <TextInput title="Batch Name" required placeholder="e.g. Batch 2025-29" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <CustomSelect title="Programme" required options={PROG_OPTS} value={form.programme} onChange={(v) => set("programme", v)} placeholder="Select Programme" />
          <CustomSelect title="Status" options={STATUS_OPTS} value={form.status} onChange={(v) => set("status", v)} placeholder="Active" />
          <TextInput title="Start Year" required type="number" placeholder="e.g. 2025" value={form.startYear} onChange={(e) => set("startYear", e.target.value)} />
          <TextInput title="End Year"   required type="number" placeholder="e.g. 2029" value={form.endYear}   onChange={(e) => set("endYear",   e.target.value)} />
        </div>
        <ModalFooter onClose={onClose} submitLabel="Create Batch" />
      </form>
    </ModalShell>
  );
};

// ─── CREATE PSO MODAL ─────────────────────────────────────────────────────────
export const CreatePSOModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ code: "", programme: null as any, description: "", status: null as any });
  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell title="Create New PSO" open={open} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput title="PSO Code" required placeholder="e.g. PSO1" value={form.code} onChange={(e) => set("code", e.target.value)} />
          <CustomSelect title="Programme" required options={PROG_OPTS} value={form.programme} onChange={(v) => set("programme", v)} placeholder="Select Programme" />
        </div>
        <div className="mt-4">
          <TextArea
            title="Description"
            required
            rows={3}
            placeholder="e.g. Apply knowledge of computing to solve real-world problems."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="mt-4">
          <CustomSelect title="Status" options={STATUS_OPTS} value={form.status} onChange={(v) => set("status", v)} placeholder="Active" />
        </div>
        <ModalFooter onClose={onClose} submitLabel="Create PSO" />
      </form>
    </ModalShell>
  );
};
