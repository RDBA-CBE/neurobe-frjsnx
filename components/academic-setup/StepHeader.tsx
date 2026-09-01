interface StepHeaderProps {
  title: string;
  description: string;
}

const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <div className="panel mb-5 border border-gray-200 px-6 py-4 dark:border-gray-700">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default StepHeader;
