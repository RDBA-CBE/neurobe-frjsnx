import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  GitFork,
  Target,
  CheckCircle2,
  ShieldCheck,
  Home,
  GraduationCap,
  Lightbulb,
  GitBranch,
  Check,
  GitCompare,
  Save,
} from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import PageBanner from "@/components/common-components/PageBanner";
import CustomSelect from "@/components/FormFields/CustomSelect.component";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import StepHeader from "@/components/academic-setup/StepHeader";
import MappingMatrixHeader from "@/components/co-po-mapping/MappingMatrixHeader";
import TableComponent from "@/components/common-components/TableComponent";
import PageFooter from "@/components/common-components/PageFooter";

const MOCK_MAPPINGS = [
  {
    coCode: "CO1",
    description:
      "Understand the fundamentals of linear and non-linear data structures.",
    bloomLevel: "K2 - Understand",
    poMap: {
      PO1: 3,
      PO2: 2,
      PO3: 1,
      PO4: 0,
      PO5: 1,
      PO6: 0,
      PO7: 0,
      PO8: 0,
      PO9: 1,
      PO10: 1,
      PO11: 0,
      PO12: 2,
    },
    psoMap: { PSO1: 3, PSO2: 2 },
  },
  {
    coCode: "CO2",
    description:
      "Apply appropriate data structures for problem solving and algorithm design.",
    bloomLevel: "K3 - Apply",
    poMap: {
      PO1: 3,
      PO2: 3,
      PO3: 2,
      PO4: 2,
      PO5: 2,
      PO6: 0,
      PO7: 0,
      PO8: 0,
      PO9: 2,
      PO10: 1,
      PO11: 1,
      PO12: 2,
    },
    psoMap: { PSO1: 3, PSO2: 3 },
  },
  {
    coCode: "CO3",
    description:
      "Analyze the time and space complexity of fundamental algorithms.",
    bloomLevel: "K4 - Analyze",
    poMap: {
      PO1: 3,
      PO2: 3,
      PO3: 3,
      PO4: 3,
      PO5: 2,
      PO6: 0,
      PO7: 0,
      PO8: 0,
      PO9: 2,
      PO10: 1,
      PO11: 1,
      PO12: 3,
    },
    psoMap: { PSO1: 3, PSO2: 2 },
  },
  {
    coCode: "CO4",
    description:
      "Design efficient searching, sorting, and graph traversal solutions.",
    bloomLevel: "K5 - Evaluate",
    poMap: {
      PO1: 3,
      PO2: 3,
      PO3: 3,
      PO4: 2,
      PO5: 3,
      PO6: 1,
      PO7: 0,
      PO8: 1,
      PO9: 2,
      PO10: 2,
      PO11: 2,
      PO12: 3,
    },
    psoMap: { PSO1: 3, PSO2: 3 },
  },
  {
    coCode: "CO5",
    description:
      "Formulate algorithmic strategies to address complex computing problems.",
    bloomLevel: "K6 - Create",
    poMap: {
      PO1: 3,
      PO2: 3,
      PO3: 3,
      PO4: 3,
      PO5: 3,
      PO6: 1,
      PO7: 1,
      PO8: 1,
      PO9: 3,
      PO10: 2,
      PO11: 2,
      PO12: 3,
    },
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

  const approve = () => {};

  const poHeaders = [
    "PO1",
    "PO2",
    "PO3",
    "PO4",
    "PO5",
    "PO6",
    "PO7",
    "PO8",
    "PO9",
    "PO10",
    "PO11",
    "PO12",
  ];
  const psoHeaders = ["PSO1", "PSO2"];

  const getScoreBadge = (score: number) => {
    if (score === 3) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-xs font-bold text-white ">
          3
        </span>
      );
    }
    if (score === 2) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white ">
          2
        </span>
      );
    }
    if (score === 1) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white ">
          1
        </span>
      );
    }
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-xs font-bold text-[#000]">
        -
      </span>
    );
  };

  const TABS = [
    {
      key: "course_outcome",
      label: "Course Outcome",
      // subLabel: "Academic Divisions",
      count: 5,
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      key: "program_outcome",
      label: "Program Outcome",
      // subLabel: "Degrees & Majors",
      count: 4,
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      key: "ai_suggestions",
      label: "AI Generated Mapping Suggestions",
      subLabel: "Mappig Needs Review",
      count: 6,
      icon: <GitCompare className="h-5 w-5" />,
    },

    {
      key: "mapping_verified",
      label: "Mapping Verified",
      subLabel: "AI-generated mappings verified by the Coordinator",
      count: 0,
      icon: <Check className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <CourseBanner
        courseCode="CS301"
        courseTitle="Computer Networks"
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme="B.Tech CSE"
        batch="2025–2029"
        academicYear="2026–2027 / Semester 3"
        students="40 Students"
        selectedCourse="CS309"
        courseOptions={[
          { value: "CS309", label: "Course: CS309" },
          { value: "CS301", label: "Course: CS301" },
        ]}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeTab}
        onBack={() => console.log("back")}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      <StepHeader
        title="CO–PO Mapping"
        description="AI-assisted mapping between approved Course Outcomes and the selected Program Outcome version. Review each suggested mapping and rationale before approval."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {TABS.map((tab) => (
          <StatTabCard
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            subLabel={tab.subLabel}
            count={tab.count}
            active={state.activeTab === tab.key}
          />
        ))}
      </div>

      {/* CO-PO Mapping Matrix */}
      <div className="panel">
        <MappingMatrixHeader
          title="CO1–CO6 × PO1–PO12 Mapping Matrix"
          version="PO 2025 v1"
        />

        {/* TableComponent with dynamic columns */}
        <TableComponent
          records={filteredRecords}
          loading={state.loading}
          noRecordsText="No CO-PO mappings found"
          columns={[
            {
              accessor: "coCode",
              title: "COURSE OUTCOME",
              render: ({ coCode, description, bloomLevel }: any) => (
                <div className="min-w-[200px]">
                  <p className="bg-color2-l text-color2 w-fit rounded-md px-2 py-1 text-xs font-bold">
                    {coCode}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#000] dark:text-gray-400">
                    {description}
                  </p>
                </div>
              ),
            },
            ...poHeaders.map((po) => ({
              accessor: po,
              title: po,
              render: (row: any) => (
                <div className="relative flex justify-center">
                  {getScoreBadge(row.poMap?.[po] ?? 0)}
                  <div className="bg-color2 absolute right-1.5  top-0 inline-flex h-1.5 w-1.5 rounded-full"></div>
                </div>
              ),
            })),
          ]}
        />
      </div>

      <div className="mt-4">
        <PageFooter
        batch = {true}  
          content1={`Course: CS309 – Computer Networks `}
          content2 = {'PO Version: PO 2025 v1'}
          actionBtn1={{
            label: "Approve Mapping",
            icon: <Check className="h-4 w-4" />,
            onClick: approve,
            disabled: true,
          }}
           actionBtn2={{
          label: "Save Draft",
          icon: <Save className="h-4 w-4" />,
          onClick: () => setState({ showBulkModal: true }),
        }}
        />
      </div>
    </div>
  );
};

export default PrivateRouter(COPOMapping);
