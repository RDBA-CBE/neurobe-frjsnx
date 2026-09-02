import { useState } from "react";
import { Layers } from "lucide-react";

interface Topic { id: number; title: string; }
interface Unit { id: number; title: string; hours: number; topics: Topic[]; }

interface UnitTopicsSummaryProps {
  units?: Unit[];
}

const DEFAULT_UNITS: Unit[] = [
  { id: 1, title: "Physical Layer & Network Architectures", hours: 9, topics: [
    { id: 1, title: "Layered Network Architecture: OSI Model vs TCP/IP Protocol Stack" },
    { id: 2, title: "Physical Media: Guided (Twisted Pair, Coaxial, Fiber Optics) and Unguided Transmission" },
    { id: 3, title: "Signal Encoding, Digital Transmission, and Multiplexing (FDM, TDM, WDM)" },
    { id: 4, title: "Network Topologies, Performance Metrics: Bandwidth, Latency, Throughput, and Jitter" },
    { id: 5, title: "Packet Switching vs Circuit Switching Principles" },
  ]},
  { id: 2, title: "Data Link Layer & MAC Protocols", hours: 9, topics: [
    { id: 1, title: "Framing, Flow Control, and Error Control Mechanisms" },
    { id: 2, title: "HDLC and PPP Protocols" },
    { id: 3, title: "Multiple Access Protocols: ALOHA, CSMA/CD, CSMA/CA" },
    { id: 4, title: "IEEE 802.3 Ethernet Standards and Gigabit Ethernet" },
  ]},
  { id: 3, title: "Network Layer & Routing Protocols", hours: 10, topics: [
    { id: 1, title: "IPv4 Addressing, Subnetting, and CIDR" },
    { id: 2, title: "Routing Algorithms: Dijkstra, Bellman-Ford" },
    { id: 3, title: "Routing Protocols: RIP, OSPF, BGP" },
    { id: 4, title: "IPv6 Addressing and Transition Mechanisms" },
  ]},
  { id: 4, title: "Transport Layer & Congestion Control", hours: 9, topics: [
    { id: 1, title: "TCP: Connection Establishment, Flow Control, Congestion Control" },
    { id: 2, title: "UDP: Characteristics and Use Cases" },
    { id: 3, title: "Socket Programming Basics" },
  ]},
  { id: 5, title: "Application Layer & Network Security", hours: 8, topics: [
    { id: 1, title: "HTTP, HTTPS, DNS, FTP, SMTP Protocols" },
    { id: 2, title: "Cryptography: Symmetric, Asymmetric, and Hash Functions" },
    { id: 3, title: "Firewalls, IDS, and VPN Technologies" },
  ]},
];

const UnitTopicsSummary = ({ units = DEFAULT_UNITS }: UnitTopicsSummaryProps) => {
  const [activeUnit, setActiveUnit] = useState(0);
  const totalHours = units.reduce((s, u) => s + u.hours, 0);
  const unit = units[activeUnit];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <div className="bg-color2-l flex h-8 w-8 items-center justify-center rounded-lg dark:bg-purple-900/20">
          <Layers className="text-color2 h-4.5 w-4.5" />
        </div>
          <h3 className="text-lg font-bold text-color dark:text-white">Units & Topics</h3>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {units.length} Units • {totalHours} Hours
        </span>
      </div>

      {/* Unit cards row */}
      <div className="mb-4 grid grid-cols-5 gap-3">
        {units.map((u, i) => (
          <button
            key={u.id}
            onClick={() => setActiveUnit(i)}
            className={`rounded-xl border p-3 text-left transition-all ${
              i === activeUnit
                ? "border-color2 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${i === activeUnit ? "text-color2" : "text-gray-500"}`}>
                Unit {String(u.id).padStart(2, "0")}
              </span>
              <span className={`text-xs text-color2 font-semibold`}>
                {u.hours} hrs
              </span>
            </div>
            <p className={`mt-1 text-xs font-medium leading-snug ${i === activeUnit ? "text-color2" : "text-gray-700 dark:text-gray-300"}`}>
              {u.title}
            </p>
          </button>
        ))}
      </div>

      {/* Topics detail */}
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-color2 ">Unit {String(unit.id).padStart(2, "0")}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{unit.title}</p>
          </div>
          <span className="rounded-full border border-purple-200 px-3 py-1 text-xs font-semibold text-color2 bg-color2-l">
            {unit.hours} Lecture Hours
          </span>
        </div>
        <p className="mb-3 text-sm font-bold text-color">Topics ({unit.topics.length})</p>
        <div className="space-y-2">
          {unit.topics.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-purple-50 text-xs font-bold text-color2">{t.id}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{t.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitTopicsSummary;
