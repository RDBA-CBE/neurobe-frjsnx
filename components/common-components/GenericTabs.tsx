export interface TabItem {
  key?: string | number;
  label?: string;
  count?: string | number;
}

interface GenericTabsProps {
  tabs: TabItem[];
  activeKey: string | number;
  onChange: (key: string | number) => void;
  rightContent?: React.ReactNode;
  className?: string;
}

const GenericTabs = ({
  tabs,
  activeKey,
  onChange,
  rightContent,
  className = "",
}: GenericTabsProps) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-between  px-1 pb-0 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => {
          const active = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`mb-4 flex items-center gap-3 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? " bg-color2 text-white"
                  : "border-gray-200 text-[#000] hover:text-gray-700 bg-[#fff]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-purple-100 text-color2"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {rightContent && (
        <div className="flex items-center pr-2 text-xs text-gray-400">{rightContent}</div>
      )}
    </div>
  );
};

export default GenericTabs;
