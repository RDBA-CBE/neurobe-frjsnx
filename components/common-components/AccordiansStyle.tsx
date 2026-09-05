import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const AccordiansStyle = ({
  expandable = false,
  topics = [],
  title,
  subtitle,
  topicCount,
  topicCountLabel = "Topics",
  expandedSectionLabel,
  footerContent,
  renderModals,
  btnOnClick,
}: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const count = topicCount ?? topics.length;

  const toggle = (id: string) => {
    if (!expandable) return;

    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mb-5" aria-label="accordion section">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* ───────────────── HEADER ───────────────── */}
        <div className="flex items-center justify-between bg-[#111238] px-4 py-3 text-white">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>

            {subtitle && (
              <p className="mt-0.5 text-sm text-white/70">
                {subtitle}
              </p>
            )}
          </div>

          <span className="rounded bg-white/15 px-4 py-1 text-sm font-semibold">
            {count} {topicCountLabel}
          </span>
        </div>

        {/* ───────────────── TOPIC ROWS ───────────────── */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {topics.map((topic: any) => {
            const isOpen = expandedId === topic.id;

            return (
              <div key={topic.id}>
                {/* ───────────── Topic Header Row ───────────── */}
                <div className="flex items-start gap-2 px-5 py-4">
                  {/* Main clickable area */}
                  <button
                    type="button"
                    onClick={() => toggle(topic.id)}
                    disabled={!expandable}
                    className={`flex min-w-0 flex-1 items-start gap-2 text-left transition-colors ${
                      expandable
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        : "cursor-default"
                    }`}
                    aria-expanded={expandable ? isOpen : undefined}
                  >
                    {/* Chevron */}
                    {expandable &&
                      (isOpen ? (
                        <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      ))}

                    {/* Title + Meta */}
                    <span
                      className={`min-w-0 flex-1 font-bold ${
                        expandable ? "" : "py-1"
                      }`}
                    >
                      {topic.title}

                      {/* Verified Status */}
                      {topic.verified && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="block text-sm font-normal text-gray-500">
                            Status:
                          </span>

                          <span
                            className={`h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                              topic?.verified_status === "Approved"
                                ? "border border-green-400 bg-green-50 text-green-600"
                                : "border border-orange-200 bg-orange-50 text-orange-600"
                            }`}
                          >
                            {topic?.verified_status}
                          </span>
                        </div>
                      )}

                      {/* Meta */}
                      {expandable && topic.meta && (
                        <span className="text-pri mt-0.5 block text-xs font-normal">
                          {topic.meta}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* ───────────── RIGHT SIDE ───────────── */}

                  {/* Expandable Badge */}
                  {expandable ? (
                    (() => {
                      const badge = isOpen
                        ? topic.expandedBadge
                        : topic.collapsedBadge;

                      return badge ? (
                        <span
                          className={`h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                            badge.className ??
                            "border border-orange-200 bg-orange-50 text-orange-600"
                          }`}
                        >
                          {badge.label}
                        </span>
                      ) : null;
                    })()
                  ) : topic?.button ? (
                    /* ───────────── CREATE BUTTON ───────────── */
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        btnOnClick?.(topic);
                      }}
                      className="create-btn cursor-pointer"
                    >
                      {topic?.button?.icon}
                      {topic?.button?.label}
                    </button>
                  ) : (
                    /* ───────────── COLLAPSED BADGES ───────────── */
                    topic?.collapsedBadge &&
                    topic.collapsedBadge.map(
                      (item: any, index: number) => (
                        <span
                          key={item.id ?? index}
                          className={`h-fit shrink-0 rounded px-2 py-1 text-xs font-bold ${
                            item.className ??
                            "bg-color2-l text-color2"
                          }`}
                        >
                          {item.label}
                        </span>
                      )
                    )
                  )}
                </div>

                {/* ───────────────── EXPANDED ITEMS ───────────────── */}
                {expandable && isOpen && (
                  <div className="mx-4 mb-3 rounded-xl border bg-violet-50 p-3">
                    {/* Expanded Section Label */}
                    {expandedSectionLabel && (
                      <div className="text-color2 mb-2 flex items-center gap-1 text-sm font-bold tracking-wide">
                        {expandedSectionLabel}
                      </div>
                    )}

                    <div className="space-y-2">
                      {topic.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 ${
                            item.highlighted
                              ? "border border-green-200 bg-green-100/50"
                              : "border border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {/* Index Circle */}
                          <span
                            className={`flex h-fit shrink-0 items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
                              item.highlighted
                                ? "bg-green-700 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {item.index}
                          </span>

                          {/* Title + Badge + Description */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-sm font-semibold">
                                {item.title}
                              </p>

                              {item.badge && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                                    item.badge.className ??
                                    "bg-green-500"
                                  }`}
                                >
                                  {item.badge.label}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-pri text-xs">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-2">
                            {item.actions?.map((action: any) =>
                              action.asTag ? (
                                <span
                                  key={action.key}
                                  className={action.className}
                                >
                                  {action.icon}
                                  {action.label}
                                </span>
                              ) : (
                                <button
                                  key={action.key}
                                  type="button"
                                  className={
                                    action.className ??
                                    "text-pri flex items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold hover:border-[#000] hover:text-[#000]"
                                  }
                                  onClick={() =>
                                    action.onClick?.(item, topic)
                                  }
                                >
                                  {action.icon}
                                  {action.label}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ───────────────── FOOTER ───────────────── */}
        {footerContent && (
          <div className="border-t px-3 py-3">
            <div className="bg-color2-l text-color2 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold">
              {footerContent}
            </div>
          </div>
        )}
      </div>

      {/* ───────────────── MODALS ───────────────── */}
      {renderModals?.()}
    </section>
  );
};

export default AccordiansStyle;