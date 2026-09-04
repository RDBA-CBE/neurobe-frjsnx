import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { ModalShell } from "@/components/academic-setup/AddModals";
import TextInput from "@/components/FormFields/TextInput.component";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

// ─── Options ─────────────────────────────────────────────────────────────────

const UNIT_OPTS = [
  { value: "unit-1", label: "Unit 1 — Physical Layer & Network Architectures" },
  { value: "unit-2", label: "Unit 2 — Data Link Layer & Error Control" },
  { value: "unit-3", label: "Unit 3 — Network Layer & Routing" },
  { value: "unit-4", label: "Unit 4 — Transport Layer & TCP/UDP" },
  { value: "unit-5", label: "Unit 5 — Application Layer & Security" },
];

const LEVEL_OPTS = ["K1", "K2", "K3", "K4", "K5", "K6"].map((v) => ({
  value: v,
  label: v,
}));

const STATUS_OPTS = [
  { value: "Approved", label: "Approved" },
  { value: "Needs Review", label: "Needs Review" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddTopicModalProps {
  open: boolean;
  onClose: () => void;
  defaultUnit?: string;
  onAdd?: (topic: {
    title: string;
    unit: string;
    level: string;
    hours: string;
    status: string;
  }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddTopicModal = ({
  open,
  onClose,
  defaultUnit = "unit-1",
  onAdd,
}: AddTopicModalProps) => {
  const [form, setForm] = useState({
    title: "",
    unit: UNIT_OPTS.find((o) => o.value === defaultUnit) ?? UNIT_OPTS[0],
    level: null as any,
    hours: "",
    status: null as any,
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        unit: UNIT_OPTS.find((o) => o.value === defaultUnit) ?? UNIT_OPTS[0],
        level: null,
        hours: "",
        status: null,
      });
    }
  }, [open, defaultUnit]);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd?.({
      title: form.title,
      unit: form.unit?.value ?? defaultUnit,
      level: form.level?.value ?? "K2",
      hours: form.hours,
      status: form.status?.value ?? "Needs Review",
    });
    onClose();
  };

  return (
    <ModalShell
      title="Add Topic"
      subtitle="CS309 — Computer Networks"
      icon={<PlusIcon className="h-3.5 w-3.5" />}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {/* Topic Title */}
        <TextInput
          title="Topic Title"
          required
          placeholder="e.g. Network Models & Layered Architecture"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />

        {/* Unit */}
        <div className="mt-4">
          <CustomSelect
            title="Unit"
            required
            options={UNIT_OPTS}
            value={form.unit}
            onChange={(v) => set("unit", v)}
            placeholder="Select Unit"
          />
        </div>

        {/* Knowledge Level / Hours / Status */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <CustomSelect
            title="Knowledge Level"
            required
            options={LEVEL_OPTS}
            value={form.level}
            onChange={(v) => set("level", v)}
            placeholder="K2"
          />
          <TextInput
            title="Hours"
            type="number"
            required
            placeholder="2"
            value={form.hours}
            onChange={(e) => set("hours", e.target.value)}
          />
          <CustomSelect
            title="Status"
            options={STATUS_OPTS}
            value={form.status}
            onChange={(v) => set("status", v)}
            placeholder="Needs Review"
          />
        </div>

        {/* Footer */}
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
            className="bg-color2 flex items-center gap-1.5 rounded-lg px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Add Topic
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddTopicModal;
