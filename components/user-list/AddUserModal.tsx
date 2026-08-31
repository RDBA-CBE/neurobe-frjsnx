import { useState } from "react";
import { X, Info } from "lucide-react";
import TextInput from "@/components/FormFields/TextInput.component";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

const ROLE_OPTS  = toOpts(["Course Coordinator", "Course Instructor", "Student", "ERP Admin"]);
const DEPT_OPTS  = toOpts(["Computer Science & Engineering", "Electronics & Communication", "Artificial Intelligence", "Information Technology", "Mechanical Engineering"]);
const PROG_OPTS  = toOpts(["B.E. Computer Science and Engineering", "B.Tech Electronics & Communication", "D.Tech Artificial Intelligence", "D.Tech Information Technology", "MBA"]);
const BATCH_OPTS = toOpts(["2024-2028", "2023-2027", "2022-2026", "2021-2025", "Faculty / Staff"]);

const AddUserModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", regNo: "",
    role: null as any, department: null as any,
    programme: null as any, batch: null as any,
  });
  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-gray-900">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ede9fe]">
              <svg className="h-5 w-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Add New User</h3>
              <p className="text-xs text-gray-400">Fill in user details: role, department, programme and batch.</p>
            </div>
          </div>
          <button onClick={onClose} className="mt-1 text-gray-400 hover:text-[#000] dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-user-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <div className="space-y-4">

              {/* First + Last name row */}
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  title="First Name"
                  required
                  placeholder="e.g. Arun"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
                <TextInput
                  title="Last Name"
                  required
                  placeholder="e.g. Kumar"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>

              <TextInput
                title="Email"
                required
                type="email"
                placeholder="e.g. arun@karpagam.edu"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />

              <TextInput
                title="Registry / Employee Number"
                required
                placeholder="e.g. FAC-CSE-038 / 24C0068"
                value={form.regNo}
                onChange={(e) => set("regNo", e.target.value)}
              />

              <CustomSelect
                title="Role"
                required
                options={ROLE_OPTS}
                value={form.role}
                onChange={(v) => set("role", v)}
                placeholder="Select role..."
              />

              <CustomSelect
                title="Department"
                required
                options={DEPT_OPTS}
                value={form.department}
                onChange={(v) => set("department", v)}
                placeholder="Computer Science & Engineering"
              />

              <CustomSelect
                title="Programme"
                required
                options={PROG_OPTS}
                value={form.programme}
                onChange={(v) => set("programme", v)}
                placeholder="B.E. Computer Science and Engineering"
              />

              <CustomSelect
                title="Batch"
                required
                options={BATCH_OPTS}
                value={form.batch}
                onChange={(v) => set("batch", v)}
                placeholder="2024-2028"
              />

              {/* Info notice */}
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Upon saving, an automated welcome email with initial temporary access credentials and OBC clearance will be queued for immediate delivery.
                </p>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-user-form"
            className="bg-color2 flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Create User
          </button>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
