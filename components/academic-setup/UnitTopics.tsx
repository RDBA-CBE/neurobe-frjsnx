import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface Topic {
  id: number;
  title: string;
}

interface Unit {
  id: number;
  title: string;
  hours: number;
  topics: Topic[];
}

const INITIAL_UNITS: Unit[] = [
  {
    id: 1,
    title: "Physical Layer & Network Architectures",
    hours: 9,
    topics: [
      { id: 1, title: "Layered Network Architecture, OSI Model vs TCP/IP Protocol Stack" },
      { id: 2, title: "Physical Media: Guided (Twisted Pair, Coaxial, Fiber Optics) and Unguided Transmission" },
      { id: 3, title: "Signal Encoding, Modulation Techniques, and Multiplexing (FDM, TDM, WDM)" },
      { id: 4, title: "Error Detection and Correction: Parity, CRC, and Hamming Codes" },
      { id: 5, title: "Switching Techniques: Circuit, Packet, and Message Switching" },
    ],
  },
  {
    id: 2,
    title: "Data Link Layer & MAC Protocols",
    hours: 9,
    topics: [
      { id: 1, title: "Framing, Flow Control, and Error Control Mechanisms" },
      { id: 2, title: "HDLC and PPP Protocols" },
      { id: 3, title: "Multiple Access Protocols: ALOHA, CSMA/CD, CSMA/CA" },
      { id: 4, title: "IEEE 802.3 Ethernet Standards and Gigabit Ethernet" },
    ],
  },
  {
    id: 3,
    title: "Network Layer & Routing",
    hours: 9,
    topics: [
      { id: 1, title: "IPv4 Addressing, Subnetting, and CIDR" },
      { id: 2, title: "Routing Algorithms: Dijkstra, Bellman-Ford" },
      { id: 3, title: "Routing Protocols: RIP, OSPF, BGP" },
      { id: 4, title: "IPv6 Addressing and Transition Mechanisms" },
    ],
  },
  {
    id: 4,
    title: "Transport Layer Protocols",
    hours: 9,
    topics: [
      { id: 1, title: "TCP: Connection Establishment, Flow Control, Congestion Control" },
      { id: 2, title: "UDP: Characteristics and Use Cases" },
      { id: 3, title: "Socket Programming Basics" },
    ],
  },
  {
    id: 5,
    title: "Application Layer & Network Security",
    hours: 9,
    topics: [
      { id: 1, title: "HTTP, HTTPS, DNS, FTP, SMTP Protocols" },
      { id: 2, title: "Cryptography: Symmetric, Asymmetric, and Hash Functions" },
      { id: 3, title: "Firewalls, IDS, and VPN Technologies" },
    ],
  },
];

const UnitTopics = () => {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);

  const totalHours = units.reduce((sum, u) => sum + u.hours, 0);

  const deleteTopic = (unitId: number, topicId: number) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, topics: u.topics.filter((t) => t.id !== topicId) }
          : u
      )
    );
  };

  const addTopic = (unitId: number) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              topics: [
                ...u.topics,
                { id: u.topics.length + 1, title: "New Topic" },
              ],
            }
          : u
      )
    );
  };

  const updateHours = (unitId: number, hours: number) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, hours } : u))
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary2 text-xs font-bold text-color2 mt-0.5">3</span>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-color1 dark:text-white">Unit Titles, Hours & Topics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Curriculum units with lecture topic sequences.</p>
          </div>
        </div>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap self-center">
          {units.length} Units • {totalHours} Total Hours
        </span>
      </div>

      <div className="space-y-4">
        {units.map((unit) => (
          <div key={unit.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            {/* Unit row */}
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-md btn-green px-3 py-1.5 text-sm font-bold text-white whitespace-nowrap">
                Unit {String(unit.id).padStart(2, "0")}
              </span>
              <input
                value={unit.title}
                onChange={(e) =>
                  setUnits((prev) =>
                    prev.map((u) => (u.id === unit.id ? { ...u, title: e.target.value } : u))
                  )
                }
                size={unit.title.length || 1}
                className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-800 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <span className="text-sm text-gray-500">Hours:</span>
                <input
                  disabled
                  type="number"
                  value={unit.hours}
                  onChange={(e) => updateHours(unit.id, Number(e.target.value))}
                  className="w-14 rounded-lg border border-gray-200 py-1.5 text-center text-sm font-bold text-gray-800 tabular-nums dark:border-gray-600 dark:bg-gray-800 dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Topics header */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-md py-1 font-extrabold uppercase tracking-wide text-color1 dark:text-gray-300">
                Topics ({unit.topics.length})
              </span>
              <button
                onClick={() => addTopic(unit.id)}
                className="flex items-center gap-1 text-sm font-semibold text-green hover:text-green-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add Topic
              </button>
            </div>

            {/* Topic list */}
            <div className="space-y-2">
              {unit.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-700"
                >
                  <span className="w-4 text-xs font-semibold text-gray-400">{topic.id}</span>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{topic.title}</span>
                  <button
                    onClick={() => deleteTopic(unit.id, topic.id)}
                    className="text-color1 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitTopics;
