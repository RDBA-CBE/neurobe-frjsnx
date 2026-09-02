import { GraduationCap } from "lucide-react";

interface CO {
  id: string;
  description: string;
  knowledge: string;
}

interface CourseOutcomesSummaryProps {
  cos?: CO[];
}

const DEFAULT_COS: CO[] = [
  {
    id: "CO1",
    description:
      "Explain the principles of layered network architectures, transmission media, and physical layer signal encoding.",
    knowledge: "K2 Understand",
  },
  {
    id: "CO2",
    description:
      "Apply error detection, framing, and Medium Access Control (MAC) protocols for local area networks.",
    knowledge: "K3 Apply",
  },
  {
    id: "CO3",
    description:
      "Analyze IP addressing, subnetting schemes, and routing algorithms (OSPF, BGP, RIP) across heterogeneous networks.",
    knowledge: "K4 Analyze",
  },
  {
    id: "CO4",
    description:
      "Evaluate end-to-end transport layer protocols (TCP/UDP), flow control, congestion management, and connection states.",
    knowledge: "K4 Analyze",
  },
  {
    id: "CO5",
    description:
      "Design network applications utilizing DNS, HTTP, SMTP, and client-server socket programming primitives.",
    knowledge: "K5 Evaluate",
  },
  {
    id: "CO6",
    description:
      "Develop secure communication modules and evaluate network performance under realistic traffic conditions.",
    knowledge: "K6 Create",
  },
];

const CourseOutcomesSummary = ({
  cos = DEFAULT_COS,
}: CourseOutcomesSummaryProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-color2-l flex h-8 w-8 items-center justify-center rounded-lg dark:bg-purple-900/20">
          <GraduationCap className="text-color2 h-4.5 w-4.5" />
        </div>
        <h3 className="text-color text-lg font-bold dark:text-white">
          Course Outcomes & Knowledge Levels
        </h3>
      </div>
      <span className="text-color2 text-sm font-semibold">
        {cos.length} COs
      </span>
    </div>
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {cos.map((co) => (
        <div key={co.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-color2 rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold dark:bg-purple-900/20">
              {co.id}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {co.description}
            </span>
          </div>
          <span className="text-color2 ml-4 shrink-0 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-sm  font-bold dark:bg-purple-900/20">
            {co.knowledge}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CourseOutcomesSummary;
