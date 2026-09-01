import React from "react";

interface PageBannerProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  actionBtn1?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  actionBtn2?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  records: string;
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  actionBtn1,
  records,
  actionBtn2,
}: PageBannerProps & { records: string }) => {
  return (
    <div className="panel mb-4 flex items-start lg:justify-between gap-4 rounded-xl border border-gray-100 px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe]">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="section-ti">{title}</p>
            <span className="text-color2 bg-color2-l rounded-full px-2 py-0.5 text-xs font-semibold">
              {records}
            </span>
          </div>
          <p
            className="mt-0.5 text-xs text-[#000]"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>
      </div>
      {(actionBtn1 || actionBtn2) && (
        <div className="flex items-center gap-2">
          {actionBtn2 && (
            <button onClick={actionBtn2?.onClick} className="create-btn-sec">
              {actionBtn2?.icon}
              {actionBtn2?.label}
            </button>
          )}
          {actionBtn1 && (
            <button onClick={actionBtn1?.onClick} className="create-btn">
              {actionBtn1?.icon}
              {actionBtn1?.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
