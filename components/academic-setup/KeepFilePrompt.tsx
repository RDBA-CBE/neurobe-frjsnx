interface KeepFilePromptProps {
  onKeep?: () => void;
  onDiscard?: () => void;
}

const KeepFilePrompt = ({ onKeep, onDiscard }: KeepFilePromptProps) => {
  return (
    <div className=" mb-5 flex items-center bg-primary2 justify-between border-[1px] rounded-xl border-color2 px-6 py-4 dark:border-gray-700">
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          Keep the source syllabus file permanently?
        </p>
        <p className="mt-0.5 text-sm text-gray-500">
          Choose whether the uploaded source syllabus should be retained permanently.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={onKeep}
          className="rounded-lg bg-primary-custom px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Yes, keep file
        </button>
        <button
          onClick={onDiscard}
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-200 rounded-md transition-all p-2"
        >
          No, do not keep file
        </button>
      </div>
    </div>
  );
};

export default KeepFilePrompt;
