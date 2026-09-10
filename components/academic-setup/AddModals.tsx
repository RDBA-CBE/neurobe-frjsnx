import { useState, useEffect } from "react";
import { Check, Edit, PlusIcon, Search, Users, X } from "lucide-react";
import TextInput from "@/components/FormFields/TextInput.component";
import TextArea from "@/components/FormFields/TextArea.component";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import { Failure } from "@/utils/function.utils";

// ─── Body scroll lock ─────────────────────────────────────────────────────────
const useLockBodyScroll = (active: boolean) => {
  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);
};

// ─── Animated visibility hook (delays unmount for closing animation) ────────
const useAnimatedVisibility = (open: boolean, duration = 220) => {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => { setVisible(false); setClosing(false); }, duration);
      return () => clearTimeout(t);
    }
  }, [open]);

  return { visible, closing };
};

// ─── Shared modal shell ───────────────────────────────────────────────────────
interface ModalShellProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  icon?: any;
  code?: string
}

export const ModalShell = ({
  title,
  subtitle,
  open,
  onClose,
  children,
  icon,
  code
}: ModalShellProps) => {
  const { visible, closing } = useAnimatedVisibility(open);
  useLockBodyScroll(visible);

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ animation: closing ? "fadeOut 0.22s ease forwards" : "fadeIn 0.22s ease" }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        style={{ animation: closing ? "slideDown 0.22s ease forwards" : "slideUp 0.22s ease" }}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <div className='flex items-center gap-2'>
            {icon && (
              <div className="text-color2 w-fit rounded-md bg-gray-200 p-2">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className=" text-base font-semibold text-[#000] dark:text-white">
                  {title}
                </h3>
                {code &&
                  <div className="text-color2 w-fit rounded-md  px-3 py-1 bg-color2-l text-xs font-semibold text-color2">
                    {code}
                  </div>
                }
              </div>
              {subtitle && (
                <p className="mt-0.5 text-xs text-[#000]">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-pri mt-0.5 rounded-full border border-gray-500 p-0.5 hover:text-[#000] dark:hover:text-gray-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const ModalFooter = ({
  onClose,
  submitLabel,
}: {
  onClose: () => void;
  submitLabel: string;
}) => (
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
const toOpt = (v: string | null | undefined) =>
  v ? { value: v, label: v } : null;

const DEPT_OPTS = toOpts([
  "CS - Computer Science",
  "EC - Electronics",
  "AI - Artificial Intelligence",
  "ME - Mechanical",
  "CE - Civil",
]);
const STATUS_OPTS = toOpts(["Active", "Inactive"]);
const PROG_OPTS = toOpts(["BTECH-CSE", "BTECH-ECE", "MTECH-AI", "MBA"]);
const TYPE_OPTS = toOpts(["UG", "PG", "Diploma", "PhD"]);
const BATCH_STATUS_OPTS = toOpts(["Active", "Draft", "Inactive"]);

// ─── CREATE / EDIT COURSE MODAL ───────────────────────────────────────────────
export interface CourseFormData {
  department_id: number;
  course_code: string;
  course_title: string;
  status: string;
  lecture_hours: number;
  tutorial_hours: number;
  practical_hours: number;
  credits: number;
  total_theory_hours: number;
  total_lab_hours: number;
  syllabus_file?: string;
  regulation?: string;
  is_active?: boolean;
}

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: CourseFormData) => void;
  submitting?: boolean;
  departmentOptions?: { value: number | string; label: string }[];
}

export const CreateCourseModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  submitting = false,
  departmentOptions,
}: CourseModalProps) => {
  const isEdit = !!initialData;
  const deptOpts = departmentOptions && departmentOptions.length > 0 ? departmentOptions : DEPT_OPTS;

  const [form, setForm] = useState({
    code: "",
    title: "",
    department: null as any,
    status: { value: "Active", label: "Active" } as any,
    regulation: "R2023",
    lecture: "3",
    tutorial: "0",
    practical: "0",
    credits: "3",
    theoryHours: "45",
    labHours: "0",
  });

  useEffect(() => {
    if (initialData) {
      const foundDept = deptOpts.find(
        (d: any) =>
          d.value === initialData.department_id ||
          d.label === initialData.department_name ||
          d.label === initialData.department
      );
      setForm({
        code: initialData.course_code ?? initialData.code ?? "",
        title: initialData.course_title ?? initialData.title ?? "",
        department: foundDept ?? toOpt(initialData.department_name || initialData.department),
        status: toOpt(initialData.status?.toLowerCase() === "inactive" ? "Inactive" : "Active"),
        regulation: initialData.regulation ?? "R2023",
        lecture: String(initialData.lecture_hours ?? initialData.l ?? "3"),
        tutorial: String(initialData.tutorial_hours ?? initialData.t ?? "0"),
        practical: String(initialData.practical_hours ?? initialData.p ?? "0"),
        credits: String(initialData.credits ?? initialData.c ?? "3"),
        theoryHours: String(initialData.total_theory_hours ?? initialData.theory?.replace(" hrs", "") ?? "45"),
        labHours: String(initialData.total_lab_hours ?? initialData.lab?.replace(" hrs", "") ?? "0"),
      });
    } else {
      setForm({
        code: "",
        title: "",
        department: null,
        status: { value: "Active", label: "Active" },
        regulation: "R2023",
        lecture: "3",
        tutorial: "0",
        practical: "0",
        credits: "3",
        theoryHours: "45",
        labHours: "0",
      });
    }
  }, [initialData, open, deptOpts]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      Failure("Please enter course code");
      return;
    }
    if (!form.title.trim()) {
      Failure("Please enter course title");
      return;
    }
    if (!form.department?.value) {
      Failure("Please select a department");
      return;
    }

    onSubmit({
      department_id: Number(form.department.value) || 0,
      course_code: form.code.trim(),
      course_title: form.title.trim(),
      status: form.status?.value || "Active",
      lecture_hours: Number(form.lecture) || 0,
      tutorial_hours: Number(form.tutorial) || 0,
      practical_hours: Number(form.practical) || 0,
      credits: Number(form.credits) || 0,
      total_theory_hours: Number(form.theoryHours) || 0,
      total_lab_hours: Number(form.labHours) || 0,
      syllabus_file: "",
      regulation: form.regulation || "R2023",
      is_active: (form.status?.value || "Active").toLowerCase() === "active",
    });
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Course" : "Create New Course"}
      icon={
        isEdit ? (
          <Edit className="h-3.5 w-3.5" />
        ) : (
          <PlusIcon className="h-3.5 w-3.5" />
        )
      }
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
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
            options={deptOpts}
            value={form.department}
            onChange={(v) => set("department", v)}
            placeholder="Select Department"
          />
          <CustomSelect
            title="Status"
            options={STATUS_OPTS}
            value={form.status}
            onChange={(v) => set("status", v)}
            placeholder="Active"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextInput
            title="Regulation"
            placeholder="e.g. R2023"
            value={form.regulation}
            onChange={(e) => set("regulation", e.target.value)}
          />
          <div></div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <p className="mb-2 text-xs font-semibold text-[#000] dark:text-[#000]">
              L-T-P-C Breakdown (Weekly Hours &amp; Credits)
            </p>
            <span className="text-color2 ml-2 cursor-pointer text-xs font-bold">
              Credits : {form.credits}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <TextInput
              title="Lecture (L)"
              type="number"
              value={form.lecture}
              onChange={(e) => set("lecture", e.target.value)}
            />
            <TextInput
              title="Tutorial (T)"
              type="number"
              value={form.tutorial}
              onChange={(e) => set("tutorial", e.target.value)}
            />
            <TextInput
              title="Practical (P)"
              type="number"
              value={form.practical}
              onChange={(e) => set("practical", e.target.value)}
            />
            <TextInput
              title="Credits (C)"
              type="number"
              value={form.credits}
              onChange={(e) => set("credits", e.target.value)}
              className="border-[#7c3aed] bg-[#ede9fe] text-center font-bold text-color2"
            />
          </div>
        </div>

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

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-color2 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? "Saving…" : isEdit ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── CREATE / EDIT DEPARTMENT MODAL ──────────────────────────────────────────
export interface DepartmentFormData {
  department_name: string;
  department_short_name: string;
  status: string;
}

interface DeptModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: DepartmentFormData) => void;
  submitting?: boolean;
}

export const CreateDepartmentModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  submitting = false,
}: DeptModalProps) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    code: "",
    name: "",
    status: { value: "Active", label: "Active" } as any,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.department_short_name ?? initialData.code ?? "",
        name: initialData.department_name ?? initialData.name ?? "",
        status: toOpt(initialData.status?.toLowerCase() === "inactive" ? "Inactive" : "Active"),
      });
    } else {
      setForm({ code: "", name: "", status: { value: "Active", label: "Active" } });
    }
  }, [initialData, open]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      Failure("Please enter department name");
      return;
    }
    if (!form.code?.trim()) {
      Failure("Please enter department short name / code");
      return;
    }

    onSubmit({
      department_name: form.name.trim(),
      department_short_name: form.code.trim(),
      status: (form.status?.value ?? "Active").toLowerCase(),
    });
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Department" : "Create New Department"}
      icon={isEdit ? <Edit className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <TextInput
            title="Department Name"
            required
            placeholder="e.g. Computer Science & Engineering"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              title="Department Code"
              required
              placeholder="e.g. CSE"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
            />
            <CustomSelect
              title="Status"
              options={STATUS_OPTS}
              value={form.status}
              onChange={(v) => set("status", v)}
              placeholder="Active"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-color2 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? "Saving…" : isEdit ? "Update Department" : "Create Department"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── CREATE / EDIT PROGRAMME MODAL ───────────────────────────────────────────
export interface ProgrammeFormData {
  department_id: number;
  programme_name: string;
  short_name: string;
  degree_level: string;
  status: string;
}

interface ProgModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: ProgrammeFormData) => void;
  submitting?: boolean;
  departmentOptions?: { value: number | string; label: string }[];
}

export const CreateProgrammeModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  submitting = false,
  departmentOptions,
}: ProgModalProps) => {
  const isEdit = !!initialData;
  const deptOpts = departmentOptions && departmentOptions.length > 0 ? departmentOptions : DEPT_OPTS;

  const [form, setForm] = useState({
    name: "",
    short_name: "",
    department: null as any,
    degree_level: { value: "UG", label: "UG" } as any,
    status: { value: "Active", label: "Active" } as any,
  });

  useEffect(() => {
    if (initialData) {
      const foundDept = deptOpts.find(
        (d: any) =>
          d.value === initialData.department_id ||
          d.label === initialData.department_name ||
          d.label === initialData.department
      );
      setForm({
        name: initialData.programme_name ?? initialData.name ?? "",
        short_name: initialData.short_name ?? initialData.code ?? "",
        department: foundDept ?? toOpt(initialData.department_name || initialData.department),
        degree_level: toOpt(initialData.degree_level ?? initialData.type ?? "UG"),
        status: toOpt(initialData.status?.toLowerCase() === "inactive" ? "Inactive" : "Active"),
      });
    } else {
      setForm({
        name: "",
        short_name: "",
        department: null,
        degree_level: { value: "UG", label: "UG" },
        status: { value: "Active", label: "Active" },
      });
    }
  }, [initialData, open, deptOpts]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Failure("Please enter programme name");
      return;
    }
    if (!form.short_name.trim()) {
      Failure("Please enter short name");
      return;
    }
    if (!form.department?.value) {
      Failure("Please select an associated department");
      return;
    }

    onSubmit({
      department_id: Number(form.department.value) || 0,
      programme_name: form.name.trim(),
      short_name: form.short_name.trim(),
      degree_level: form.degree_level?.value || "UG",
      status: form.status?.value || "Active",
    });
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Programme" : "Create New Programme"}
      icon={
        isEdit ? (
          <Edit className="h-3.5 w-3.5" />
        ) : (
          <PlusIcon className="h-3.5 w-3.5" />
        )
      }
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          title="Programme Name"
          required
          placeholder="e.g. B.Tech Computer Science"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextInput
            title="Short Name"
            required
            placeholder="e.g. BTECH-CSE"
            value={form.short_name}
            onChange={(e) => set("short_name", e.target.value)}
          />

          <CustomSelect
            title="Associated Department"
            required
            options={deptOpts}
            value={form.department}
            onChange={(v) => set("department", v)}
            placeholder="Select Department"
          />
          <CustomSelect
            title="Degree Level"
            required
            options={TYPE_OPTS}
            value={form.degree_level}
            onChange={(v) => set("degree_level", v)}
            placeholder="UG / PG"
          />
          <CustomSelect
            title="Status"
            options={STATUS_OPTS}
            value={form.status}
            onChange={(v) => set("status", v)}
            placeholder="Active"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-color2 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? "Saving…" : isEdit ? "Update Programme" : "Create Programme"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── CREATE / EDIT BATCH MODAL ────────────────────────────────────────────────
export interface BatchFormData {
  name: string;
  programme_id: number;
  start_year: number;
  end_year: number;
  status: string;
  is_active: boolean;
}

interface BatchModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (formData: BatchFormData) => void;
  submitting?: boolean;
  programmeOptions?: { value: number | string; label: string }[];
}

export const CreateBatchModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  submitting = false,
  programmeOptions,
}: BatchModalProps) => {
  const isEdit = !!initialData;
  const progOpts = programmeOptions && programmeOptions.length > 0 ? programmeOptions : PROG_OPTS;

  const [form, setForm] = useState({
    name: "",
    programme: null as any,
    start_year: "",
    end_year: "",
    status: { value: "Draft", label: "Draft" } as any,
  });

  useEffect(() => {
    if (initialData) {
      const foundProg = progOpts.find(
        (p: any) =>
          p.value === initialData.programme_id ||
          p.label === initialData.programme_name ||
          p.label === initialData.programme
      );
      setForm({
        name: initialData.name ?? initialData.batch ?? "",
        programme: foundProg ?? toOpt(initialData.programme_name || initialData.programme),
        start_year: String(initialData.start_year ?? initialData.startYear ?? ""),
        end_year: String(initialData.end_year ?? initialData.endYear ?? ""),
        status: toOpt(initialData.status ?? "Draft"),
      });
    } else {
      setForm({
        name: "",
        programme: null,
        start_year: "",
        end_year: "",
        status: { value: "Draft", label: "Draft" },
      });
    }
  }, [initialData, open, progOpts]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Failure("Please enter batch name");
      return;
    }
    if (!form.programme?.value) {
      Failure("Please select a programme");
      return;
    }
    if (!form.start_year) {
      Failure("Please enter start year");
      return;
    }
    if (!form.end_year) {
      Failure("Please enter end year");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      programme_id: Number(form.programme.value) || 0,
      start_year: Number(form.start_year) || 0,
      end_year: Number(form.end_year) || 0,
      status: form.status?.value || "Draft",
      is_active: (form.status?.value || "Draft").toLowerCase() === "active",
    });
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Batch" : "Create New Batch"}
      icon={
        isEdit ? (
          <Edit className="h-3.5 w-3.5" />
        ) : (
          <PlusIcon className="h-3.5 w-3.5" />
        )
      }
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            title="Batch Name"
            required
            placeholder="e.g. Batch 2024-2028"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <CustomSelect
            title="Programme"
            required
            options={progOpts}
            value={form.programme}
            onChange={(v) => set("programme", v)}
            placeholder="Select Programme"
          />
          <TextInput
            title="Start Year"
            required
            type="number"
            placeholder="e.g. 2024"
            value={form.start_year}
            onChange={(e) => set("start_year", e.target.value)}
          />
          <TextInput
            title="End Year"
            required
            type="number"
            placeholder="e.g. 2028"
            value={form.end_year}
            onChange={(e) => set("end_year", e.target.value)}
          />
        </div>
        <CustomSelect
          title="Status"
          options={BATCH_STATUS_OPTS}
          value={form.status}
          onChange={(v) => set("status", v)}
          placeholder="Select Status"
          className="mt-4"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-color2 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? "Saving…" : isEdit ? "Update Batch" : "Create Batch"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── CREATE / EDIT PSO MODAL ──────────────────────────────────────────────────
interface PSOModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

export const CreatePSOModal = ({
  open,
  onClose,
  initialData,
}: PSOModalProps) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    code: "",
    programme: null as any,
    description: "",
    status: null as any,
    version: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? "",
        programme: toOpt(initialData.programme),
        description: initialData.description ?? "",
        status: toOpt(initialData.status),
        version: initialData.version ?? "",
      });
    } else {
      setForm({
        code: "",
        programme: null,
        description: "",
        status: null,
        version: "",
      });
    }
  }, [initialData, open]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <ModalShell
      title={isEdit ? "Edit PSO" : "Create New PSO"}
      icon={
        isEdit ? (
          <Edit className="h-3.5 w-3.5" />
        ) : (
          <PlusIcon className="h-3.5 w-3.5" />
        )
      }
      open={open}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            title="PSO Code"
            required
            placeholder="e.g. PSO1"
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
          />
          <CustomSelect
            title="Programme"
            required
            options={PROG_OPTS}
            value={form.programme}
            onChange={(v) => set("programme", v)}
            placeholder="Select Programme"
          />
        </div>
        <div className="mt-4">
          <TextArea
            title="Description"
            required
            rows={3}
            placeholder="e.g. Apply knowledge of computing..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <TextInput
            title="Version"
            required
            placeholder="e.g. v1.04"
            value={form.version}
            onChange={(e) => set("version", e.target.value)}
          />
          <CustomSelect
            title="Status"
            options={STATUS_OPTS}
            value={form.status}
            onChange={(v) => set("status", v)}
            placeholder="Active"
          />
        </div>
        <ModalFooter
          onClose={onClose}
          submitLabel={isEdit ? "Update PSO" : "Create PSO"}
        />
      </form>
    </ModalShell>
  );
};

// ─── ENROLL STUDENTS MODAL ────────────────────────────────────────────────────

export interface EnrollableStudent {
  id: string | number;
  regNo: string;
  name: string;
  programme: string;
  batch: string;
  email: string;
}

interface EnrollStudentsModalProps {
  open: boolean;
  onClose: () => void;
  courseCode?: string;
  courseTitle?: string;
  availableStudents?: EnrollableStudent[];
  onEnroll?: (selected: EnrollableStudent[]) => void;
}

export const EnrollStudentsModal = ({
  open,
  onClose,
  courseCode = "CS309",
  courseTitle = "Computer Networks",
  availableStudents = [],
  onEnroll,
}: EnrollStudentsModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (!open) { setSearch(""); setSelectedIds(new Set()); }
  }, [open]);

  const filtered = availableStudents.filter((s) => {
    const q = search.toLowerCase();
    return (
      !q ||
      s.regNo.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  const toggle = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleEnroll = () => {
    const selected = availableStudents.filter((s) => selectedIds.has(s.id));
    onEnroll?.(selected);
    onClose();
  };

  const count = selectedIds.size;

  return (
    <ModalShell
      title="Enroll Students"
      subtitle={`Select existing students to add to ${courseCode} — ${courseTitle}.`}
      icon={<Users className="h-3.5 w-3.5" />}
      open={open}
      onClose={onClose}
    >
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000]" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-color2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* List label */}
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#000]">
        Available Students ({filtered.length})
      </p>

      {/* Student list */}
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#000]">No students found.</p>
        ) : (
          filtered.map((student) => {
            const isSelected = selectedIds.has(student.id);
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => toggle(student.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? "border-color2 bg-color2-l"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                {/* checkbox */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                    isSelected ? "border-color2 bg-color2" : "border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </span>

                {/* info */}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${isSelected ? "text-color2" : "text-[#000] dark:text-white"}`}>
                    {student.regNo} — {student.name}
                  </p>
                  <p className="text-xs text-[#000]">
                    {student.programme} • Batch {student.batch}
                  </p>
                  <p className="text-xs text-[#000]">{student.email}</p>
                </div>

                {isSelected && (
                  <span className="shrink-0 rounded-full bg-color2-l px-2.5 py-0.5 text-xs font-semibold text-color2">
                    Selected
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-color2">
          {count > 0 ? `${count} student${count > 1 ? "s" : ""} selected` : ""}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={count === 0}
            onClick={handleEnroll}
            className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all ${
              count === 0
                ? "cursor-not-allowed bg-color2/40"
                : "bg-color2 hover:opacity-90"
            }`}
          >
            Enroll {count > 0 ? `${count} Student${count > 1 ? "s" : ""}` : "Student"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
