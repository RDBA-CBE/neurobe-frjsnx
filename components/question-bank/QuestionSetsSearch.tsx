import { Search } from "lucide-react";
import { useState } from "react";
import CustomSelect from "@/components/FormFields/CustomSelect.component";

const UNIT_OPTIONS = [
  { value: "all", label: "All Units" },
  { value: "unit-1", label: "Unit 1" },
  { value: "unit-2", label: "Unit 2" },
  { value: "unit-3", label: "Unit 3" },
  { value: "unit-4", label: "Unit 4" },
];

interface QuestionSetsSearchProps {
  onSearch?: (value: string) => void;
  onUnitChange?: (unit: string) => void;
}

const QuestionSetsSearch = ({ onSearch, onUnitChange }: QuestionSetsSearchProps) => {
  const [unit, setUnit] = useState(UNIT_OPTIONS[0]);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-2">
      <Search className="h-4 w-4 shrink-0 text-gray-400" />
      <input
        type="text"
        placeholder="Search Question Sets by name or topic..."
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <CustomSelect
        options={UNIT_OPTIONS}
        value={unit}
        onChange={(val) => {
          if (val) {
            setUnit(val as typeof UNIT_OPTIONS[0]);
            onUnitChange?.(val.value as string);
          }
        }}
        isSearchable={false}
        isClearable={false}
        className="w-36"
      />
    </div>
  );
};

export default QuestionSetsSearch;
