interface StatTabCardProps {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
}

const StatTabCard = ({
  icon,
  label,
  subLabel,
  count,
  active,
  onClick,
}: StatTabCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col cursor-pointer  justify-between rounded-2xl border p-5 transition-all duration-200 ${
        active
          ? "border-transparent bg-[#7c3aed] text-white shadow-lg"
          : "border-gray-200 bg-white text-gray-800 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      }`}
    >
      <div className="flex flex-row justify-between gap-1">
        <div className={`${active ? "text-[#fff] font-bold p-2 h-fit rounded-md" : "text-[#7c3aed] bg-color2-l p-2 h-fit rounded-md "}`}>
          {icon}
        </div>
        <span
          className={`text-3xl font-bold ${
            active ? "text-white" : "text-gray-800 dark:text-white"
          }`}
        >
          {count}
        </span>
      </div>

      <p
        className={`mt-2 text-lg font-bold ${
          active ? "text-white" : "text-gray-800 dark:text-white"
        }`}
      >
        {label}
      </p>
      <p className={`text-xs ${active ? "text-white/80" : "text-pri"}`}>
        {subLabel}
      </p>
    </div>
  );
};

export default StatTabCard;
