interface MappingMatrixHeaderProps {
  title?: string;
  version?: string;
}

const LEGEND = [
  { label: "3 – High", bg: "bg-green-800", text: "text-white", char: "3" },
  { label: "2 – Medium", bg: "bg-blue-700", text: "text-white", char: "2" },
  { label: "1 – Low", bg: "bg-amber-600", text: "text-white", char: "1" },
  { label: "– No Mapping", bg: "bg-gray-300", text: "text-[#000]", char: "–" },
];

const MappingMatrixHeader = ({
  title = "CO1–CO6 × PO1–PO12 Mapping Matrix",
  version = "PO 2025 v1",
}: MappingMatrixHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
    {/* Title + version badge */}
    <h3 className="text-sm font-bold text-gray-800 dark:text-white">
      {title}
      <span className="text-color2 ml-2 rounded-full bg-[#ede9fe] px-2 py-0.5 text-xs font-semibold">
        {version}
      </span>
    </h3>

    {/* Legend */}
    <div className="flex flex-wrap items-center gap-3 text-xs text-[#000]">
      <span className="font-semibold">Mapping Strength:</span>
      {LEGEND.map((l) => (
        <span key={l.label} className="flex items-center gap-1">
          <span
            className={`inline-flex h-2 w-2 items-center justify-center rounded-full text-[10px] font-bold ${l.bg} ${l.text}`}
          >
            {/* {l.char} */}
          </span>
          {l.label}
        </span>
      ))}
      <span className="bg-color2-l text-color2 rounded-md px-2 py-1 font-bold flex items-center gap-1 ">
        {" "}
        <span
          className={`bg-color2 inline-flex h-1.5 w-1.5 items-center justify-center rounded-full text-[10px] font-bold`}
        >
          {" "}
          {""}
        </span>
        AI Suggested
      </span>
    </div>
  </div>
);

export default MappingMatrixHeader;
