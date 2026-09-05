import React from "react";

interface PageBannerProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  actionBtn1?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    view?: boolean;
  };
  actionBtn2?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  actionBtn3?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  actionBtn4?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  editMode?: boolean;
  records?: string;
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  actionBtn1,
  records,
  actionBtn2,
  actionBtn3,
  actionBtn4,
  editMode,
}: PageBannerProps & { records?: string }) => {
  return (
    <div className="panel mb-4 flex items-start gap-4 rounded-xl border border-gray-100 px-5 py-5 lg:justify-between">
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
          {actionBtn3 ? (
            <div className="flex items-center gap-2 pt-2">
            <span
              className={`h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                //  topic?.verified_status === "Approved"
                "border border-purple-400 bg-purple-50 text-purple-600"
                //  : "border border-orange-200 bg-orange-50 text-orange-600"
              }`}
            >
              {"AI Generated"}
            </span>
            <span
            className={`h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
              "border border-orange-200 bg-orange-50 text-orange-600"
            }`}
          >
            {"Review Required"}
          </span>
          {editMode &&
          <span
              className={`h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                //  topic?.verified_status === "Approved"
                "border border-purple-400 bg-purple-50 text-purple-600"
                //  : "border border-orange-200 bg-orange-50 text-orange-600"
              }`}
            >
              {"Edit Mode"}
            </span>
            }
          </div>
          ) : (
            <p
              className="mt-0.5 text-xs text-[#000]"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>
      </div>
      {(actionBtn3 || actionBtn4) && (
        <div className="flex items-center gap-2">
          {actionBtn4 && (
            <button onClick={actionBtn4?.onClick} className="create-btn">
              {actionBtn4?.icon}
              {actionBtn4?.label}
            </button>
          )}
          {actionBtn3 && (
            <button onClick={actionBtn3?.onClick} className="create-btn-sec">
              {actionBtn3?.icon}
              {actionBtn3?.label}
            </button>
          )}
        </div>
      )}
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
