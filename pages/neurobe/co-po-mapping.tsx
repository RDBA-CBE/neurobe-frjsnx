import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { GitFork, Target, CheckCircle2, ShieldCheck } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/academic-setup/PageBanner";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";

const MOCK_MAPPINGS = [
  {
    coCode: "CO1",
    description: "Understand the fundamentals of linear and non-linear data structures.",
    bloomLevel: "K2 - Understand",
    poMap: { PO1: 3, PO2: 2, PO3: 1, PO4: 0, PO5: 1, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 0, PO12: 2 },
    psoMap: { PSO1: 3, PSO2: 2 },
  },
  {
    coCode: "CO2",
    description: "Apply appropriate data structures for problem solving and algorithm design.",
    bloomLevel: "K3 - Apply",
    poMap: { PO1: 3, PO2: 3, PO3: 2, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 2, PO10: 1, PO11: 1, PO12: 2 },
    psoMap: { PSO1: 3, PSO2: 3 },
  },
  {
    coCode: "CO3",
    description: "Analyze the time and space complexity of fundamental algorithms.",
    bloomLevel: "K4 - Analyze",
    poMap: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 2, PO10: 1, PO11: 1, PO12: 3 },
    psoMap: { PSO1: 3, PSO2: 2 },
  },
  {
    coCode: "CO4",
    description: "Design efficient searching, sorting, and graph traversal solutions.",
    bloomLevel: "K5 - Evaluate",
    poMap: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 1, PO7: 0, PO8: 1, PO9: 2, PO10: 2, PO11: 2, PO12: 3 },
    psoMap: { PSO1: 3, PSO2: 3 },
  },
  {
    coCode: "CO5",
    description: "Formulate algorithmic strategies to address complex computing problems.",
    bloomLevel: "K6 - Create",
    poMap: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 1, PO7: 1, PO8: 1, PO9: 3, PO10: 2, PO11: 2, PO12: 3 },
    psoMap: { PSO1: 3, PSO2: 3 },
  },
];

const COURSE_OPTIONS = [
  { value: "CS301", label: "CS301 - Data Structures & Algorithms" },
  { value: "CS402", label: "CS402 - Database Management Systems" },
  { value: "AI201", label: "AI201 - Artificial Intelligence" },
];

const COPOMapping = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search: "",
    selectedCourse: "CS301",
    loading: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("CO-PO Mapping"));
  }, [dispatch]);

  const filteredRecords = MOCK_MAPPINGS.filter((row) => {
    const s = state.search.toLowerCase();
    return (
      !s ||
      row.coCode.toLowerCase().includes(s) ||
      row.description.toLowerCase().includes(s) ||
      row.bloomLevel.toLowerCase().includes(s)
    );
  });

  const poHeaders = ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11", "PO12"];
  const psoHeaders = ["PSO1", "PSO2"];

  const getScoreBadge = (score: number) => {
    if (score === 3) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 font-bold text-[#7c3aed] text-xs">
          3
        </span>
      );
    }
    if (score === 2) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 font-bold text-blue-700 text-xs">
          2
        </span>
      );
    }
    if (score === 1) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 font-bold text-amber-700 text-xs">
          1
        </span>
      );
    }
    return <span className="text-gray-300">-</span>;
  };

  return (
    <div className="min-h-screen">
      <PageBanner
        title="CO-PO & PSO Mapping"
        description="Establish correlation matrices mapping Course Outcomes (COs) to Programme Outcomes (POs) and Programme Specific Outcomes (PSOs) with correlation levels."
        icon={<GitFork className="h-7 w-7 text-color2" />}
        imageUrl="/assets/images/neurobe/Rectangle.png"
      />

      {/* Action Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-white">Selected Course:</span>
          <div className="w-80">
            <CustomSelect
              options={COURSE_OPTIONS}
              value={COURSE_OPTIONS.find((o) => o.value === state.selectedCourse) ?? null}
              onChange={(e) => setState({ selectedCourse: e?.value ?? "CS301" })}
              placeholder="Select Course"
            />
          </div>
        </div>

        <button className="bg-color2 hover:bg-color2 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white shadow">
          <IconPlus className="h-4 w-4" />
          Edit CO-PO Matrix
        </button>
      </div>

      {/* Legend Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 font-bold text-[#7c3aed] text-sm">3</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-white">Level 3 (High)</p>
            <p className="text-[11px] text-gray-400">Substantial Correlation</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 font-bold text-blue-700 text-sm">2</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-white">Level 2 (Medium)</p>
            <p className="text-[11px] text-gray-400">Moderate Correlation</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 font-bold text-amber-700 text-sm">1</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-white">Level 1 (Low)</p>
            <p className="text-[11px] text-gray-400">Slight Correlation</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-white">NBA Compliance</p>
            <p className="text-[11px] text-green-600">Aligned with Criteria 3</p>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="mb-4 flex max-w-[300px] items-center">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search CO statements..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <th className="px-4 py-3 font-semibold">CO</th>
              <th className="px-4 py-3 font-semibold min-w-[220px]">COURSE OUTCOME STATEMENT</th>
              <th className="px-4 py-3 font-semibold">BLOOM LEVEL</th>
              {poHeaders.map((po) => (
                <th key={po} className="px-2 py-3 text-center font-bold text-gray-800 dark:text-gray-200">
                  {po}
                </th>
              ))}
              {psoHeaders.map((pso) => (
                <th key={pso} className="px-2 py-3 text-center font-bold text-[#7c3aed]">
                  {pso}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredRecords.map((row) => (
              <tr key={row.coCode} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-[#7c3aed]">{row.coCode}</td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.description}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {row.bloomLevel}
                  </span>
                </td>
                {poHeaders.map((po) => (
                  <td key={po} className="px-2 py-3 text-center">
                    {getScoreBadge((row.poMap as any)[po] ?? 0)}
                  </td>
                ))}
                {psoHeaders.map((pso) => (
                  <td key={pso} className="px-2 py-3 text-center">
                    {getScoreBadge((row.psoMap as any)[pso] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrivateRouter(COPOMapping);

