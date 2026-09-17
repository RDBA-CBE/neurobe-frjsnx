import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, EditIcon, Hourglass, Lightbulb, RefreshCw, ReplaceAll, Save, Sparkles } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState, Success, Failure, Dropdown } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import StatTabCard from "@/components/academic-setup/StatTabCard";
import PageFooter from "@/components/common-components/PageFooter";
import GenericTabs from "@/components/common-components/GenericTabs";
import PedadgogyAccordiansStyle from "@/components/pedagogy/PedadgogyAccordiansStyle";
import { EditPedagogyModal, ReplacePedagogyModal } from "@/components/co-po-mapping/PedagogyModals";
import { useRouter, useSearchParams } from "next/navigation";
import TableTitle from "@/components/common-components/TableTitle";
import PageHeader from "@/components/common-components/PageHeader";
import Models from "@/imports/models.import";

const getErrorMessage = (error: any, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.detail === "string") return error.detail;
  if (typeof error?.error === "string") return error.error;
  return fallback;
};

const Pedagogy = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    activeUnitNumber: 1,
    pedagogyApproved: false,
    activeBannerTab: "coordinator",
    courseDetail: null as any,
    courseList: [] as any[],
    selectedCourse: null as any,
    organization_id: "",
    coordinator_id: "",
    isCourseCoordinator: false,
    pedagogyData: null as any,
    loadingCourses: false,
    loadingCourseDetail: false,
    loadingUnitDetail: false,
    generatingRecommendations: false,
    pollingJob: false,
    savingDraft: false,
    completingReview: false,
  });

  // Modals state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    topicLabel: string;
    topicId?: any;
    pedagogyId?: any;
  }>({ open: false, title: "", description: "", topicLabel: "" });

  const [replaceModal, setReplaceModal] = useState<{
    open: boolean;
    currentTitle: string;
    topicLabel: string;
    topicId?: any;
    selectedOptionId?: any;
    options: { title: string; description: string; id?: any }[];
  }>({ open: false, currentTitle: "", topicLabel: "", options: [] });

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  useEffect(() => {
    dispatch(setPageTitle("Pedagogy & Teaching Methodologies"));
  }, [dispatch]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role === "course_coordinator") {
      setState({
        isCourseCoordinator: true,
        coordinator_id: user.id,
      });
    }
    setState({
      organization_id: user?.organization_id,
    });
    if (user?.organization_id) {
      getAllCourse(user.organization_id);
    } else {
      getAllCourse();
    }
  }, []);

  useEffect(() => {
    if (course_id) {
      getCourseDetails(course_id);
    }
  }, [course_id]);

  // ─── API Integrations ──────────────────────────────────────────────────────────

  const getAllCourse = async (orgId?: any) => {
    try {
      setState({ loadingCourses: true });
      const targetOrg = orgId || state?.organization_id;
      const res: any = await Models.course.list(targetOrg ? { organization_id: targetOrg } : {});
      const dropdown = Dropdown(res, "course_title");
      setState({
        courseList: dropdown,
        loadingCourses: false,
      });

      // If no course_id query parameter, automatically navigate to the first course
      if (!course_id && Array.isArray(res) && res.length > 0) {
        const firstCourse = res[0];
        router.push(`/neurobe/pedagogy?course_id=${firstCourse.id}`);
      }
    } catch (error: any) {
      console.log("error fetching course list", error);
      setState({ loadingCourses: false });
      Failure(getErrorMessage(error, "Failed to fetch course list"));
    }
  };

  const getCourseDetails = async (targetCourseId?: any) => {
    const cid = targetCourseId || course_id;
    if (!cid) return;
    try {
      setState({ loadingCourseDetail: true });
      const res: any = await Models.course.detail(cid);
      setState({
        courseDetail: res,
        selectedCourse: res ? { value: res.id, label: `${res.course_code} - ${res.course_title}` } : null,
        loadingCourseDetail: false,
      });

      const sid = res?.syllabus_id || res?.latest_syllabus?.id;
      if (sid) {
        getUnitDetail(sid, state.activeUnitNumber || 1);
      }
    } catch (error: any) {
      console.log("error fetching course detail", error);
      setState({ loadingCourseDetail: false });
      Failure(getErrorMessage(error, "Failed to fetch course detail"));
    }
  };

  const getUnitDetail = async (syllabusId?: any, unitNumber?: any) => {
    const sid =
      syllabusId ||
      state.pedagogyData?.syllabus_id ||
      state.courseDetail?.latest_syllabus?.id ||
      state.courseDetail?.syllabus_id;
    const uNum = unitNumber ?? state.activeUnitNumber ?? 1;

    if (!sid) return;

    try {
      setState({ loadingUnitDetail: true });
      const res: any = await Models.pedagogy.unit_detail(sid, uNum);
      const data = res?.data || res;

      setState({
        pedagogyData: data,
        activeUnitNumber: data?.selected_unit?.unit_number ?? uNum,
        activeTab: `unit-${data?.selected_unit?.unit_number ?? uNum}`,
        loadingUnitDetail: false,
      });
    } catch (error: any) {
      console.log(`error fetching unit detail for Unit ${uNum}`, error);
      setState({ loadingUnitDetail: false });
      Failure(getErrorMessage(error, `Failed to fetch Unit ${uNum} details`));
    }
  };

  const handleTabChange = (tabKey: string | number) => {
    const keyStr = String(tabKey);
    const unitNum = Number(keyStr.replace("unit-", "")) || 1;
    setState({ activeTab: keyStr, activeUnitNumber: unitNum });
    const sid =
      state.pedagogyData?.syllabus_id ||
      state.courseDetail?.latest_syllabus?.id ||
      state.courseDetail?.syllabus_id;
    if (sid) {
      getUnitDetail(sid, unitNum);
    }
  };

  const handleAcceptPedagogy = async (topicId: any, pedagogyId: any) => {
    try {
      const payload = {
        is_selected: true,
      };

      // Optimistically update is_selected in state for instant UI feedback
      setState((prev: any) => {
        if (!prev.pedagogyData?.selected_unit?.topics) return prev;
        const updatedTopics = prev.pedagogyData.selected_unit.topics.map((t: any) => {
          if (String(t.id) === String(topicId)) {
            const updatedPeds = (t.suggested_pedagogies || []).map((sp: any) => ({
              ...sp,
              is_selected: String(sp.id) === String(pedagogyId),
            }));
            return {
              ...t,
              suggested_pedagogies: updatedPeds,
              pedagogy_status: "Reviewed",
              pedagogy_status_display: "Reviewed",
              pedagogy_status_badge: "success",
            };
          }
          return t;
        });
        return {
          ...prev,
          pedagogyData: {
            ...prev.pedagogyData,
            selected_unit: {
              ...prev.pedagogyData.selected_unit,
              topics: updatedTopics,
            },
          },
        };
      });

      const res: any = await Models.pedagogy.accept(topicId, pedagogyId, payload);
      Success(res?.message || "Teaching method accepted successfully");

      const sid =
        state.pedagogyData?.syllabus_id ||
        state.courseDetail?.latest_syllabus?.id ||
        state.courseDetail?.syllabus_id;
      if (sid) {
        await getUnitDetail(sid, state.activeUnitNumber);
      }
    } catch (error: any) {
      console.log("error accepting pedagogy", error);
      Failure(getErrorMessage(error, "Failed to accept teaching method"));
      const sid =
        state.pedagogyData?.syllabus_id ||
        state.courseDetail?.latest_syllabus?.id ||
        state.courseDetail?.syllabus_id;
      if (sid) {
        getUnitDetail(sid, state.activeUnitNumber);
      }
    }
  };

  const handleEditSubmit = async (formData?: { title: string; description: string }) => {
    if (!editModal.pedagogyId) return;
    try {
      await Models.pedagogy.update(editModal.pedagogyId, {
        pedagogy_name: formData?.title ?? editModal.title,
        methodology: formData?.description ?? editModal.description,
      });
      Success("Teaching method updated successfully");
      setEditModal((p) => ({ ...p, open: false }));
      const sid =
        state.pedagogyData?.syllabus_id ||
        state.courseDetail?.latest_syllabus?.id ||
        state.courseDetail?.syllabus_id;
      getUnitDetail(sid, state.activeUnitNumber);
    } catch (error: any) {
      console.log("error updating pedagogy", error);
      Failure(getErrorMessage(error, "Failed to update teaching method"));
    }
  };

  const handleReplaceSubmit = async (replacementPedagogyId: any) => {
    if (!replaceModal.topicId || !replacementPedagogyId) return;
    try {
      const payload = {
        is_selected: true,
      };
      const res: any = await Models.pedagogy.accept(replaceModal.topicId, replacementPedagogyId, payload);
      Success(res?.message || "Teaching method replaced successfully");
      setReplaceModal((p) => ({ ...p, open: false }));
      const sid =
        state.pedagogyData?.syllabus_id ||
        state.courseDetail?.latest_syllabus?.id ||
        state.courseDetail?.syllabus_id;
      if (sid) {
        getUnitDetail(sid, state.activeUnitNumber);
      }
    } catch (error: any) {
      console.log("error replacing pedagogy", error);
      Failure(getErrorMessage(error, "Failed to replace teaching method"));
    }
  };

  const handleGenerateRecommendations = async () => {
    const sid =
      state.pedagogyData?.syllabus_id ||
      state.courseDetail?.latest_syllabus?.id ||
      state.courseDetail?.syllabus_id;

    if (!sid) {
      Failure("Syllabus ID not found for this course");
      return;
    }

    try {
      setState({ generatingRecommendations: true });
      const res: any = await Models.pedagogy.generate(sid, {});
      const jobId = res?.job_id;
      if (jobId) {
        setState({ pollingJob: true });
        pollRef.current = setInterval(async () => {
          try {
            const jobRes: any = await Models.pedagogy.jobStatus(jobId);
            const status = jobRes?.status ?? jobRes?.state?.live_redis_status ?? jobRes?.result?.status;
            if (status === "complete" || status === "completed" || status === "success" || status === "finished") {
              stopPolling();
              setState({ generatingRecommendations: false, pollingJob: false });
              Success(res?.message || "Pedagogy recommendations generated successfully");
              getUnitDetail(sid, state.activeUnitNumber);
            } else if (status === "failed" || status === "error") {
              stopPolling();
              setState({ generatingRecommendations: false, pollingJob: false });
              Failure(jobRes?.message || "Pedagogy generation job failed");
            }
          } catch (pollError: any) {
            stopPolling();
            setState({ generatingRecommendations: false, pollingJob: false });
            Failure(getErrorMessage(pollError, "Failed to check job status"));
          }
        }, 3000);
      } else {
        setState({ generatingRecommendations: false });
        Success(res?.message || "Pedagogy recommendations generated successfully");
        getUnitDetail(sid, state.activeUnitNumber);
      }
    } catch (error: any) {
      console.log("error generating recommendations", error);
      setState({ generatingRecommendations: false });
      Failure(getErrorMessage(error, "Failed to generate pedagogy recommendations"));
    }
  };

  const handleSaveDraft = async () => {
    const sid =
      state.pedagogyData?.syllabus_id ||
      state.courseDetail?.latest_syllabus?.id ||
      state.courseDetail?.syllabus_id;
    if (!sid) return;
    try {
      setState({ savingDraft: true });
      const endpoint = state.pedagogyData?.bottom_bar?.actions?.save_draft?.endpoint;
      const res: any = await Models.pedagogy.save_draft(sid, {}, endpoint);
      setState({ savingDraft: false });
      Success(res?.message || "Draft saved successfully");
    } catch (error: any) {
      console.log("error saving draft", error);
      setState({ savingDraft: false });
      Failure(getErrorMessage(error, "Failed to save draft"));
    }
  };

  const handleCompleteReview = async () => {
    const sid =
      state.pedagogyData?.syllabus_id ||
      state.courseDetail?.latest_syllabus?.id ||
      state.courseDetail?.syllabus_id;
    if (!sid) return;
    try {
      setState({ completingReview: true });
      const endpoint = state.pedagogyData?.bottom_bar?.actions?.complete_review?.endpoint;
      await Models.pedagogy.approve_topics(sid, {}, endpoint);
      setState({ completingReview: false, pedagogyApproved: true });
      Success("Pedagogy review completed successfully");
      getUnitDetail(sid, state.activeUnitNumber);
    } catch (error: any) {
      console.log("error approving pedagogy", error);
      setState({ completingReview: false });
      Failure(getErrorMessage(error, "Failed to complete pedagogy review"));
    }
  };

  // ─── Dynamic Data Parsing ─────────────────────────────────────────────────────

  const data = state.pedagogyData;

  const isNotGenerated =
    data?.overall_approval_status === "Not Generated" ||
    data?.metrics?.pedagogy_recommendations?.status === "not_generated";

  // Unit tabs from API
  const unitTabs = Array.isArray(data?.unit_tabs)
    ? data.unit_tabs.map((u: any) => ({
        key: `unit-${u.unit_number}`,
        label: `Unit ${u.unit_number}`,
        title: u.unit_title,
        count: u.topics_count ?? 0,
      }))
    : [];

  // Summary counts from API
  const totalUnits = data?.summary?.total_units ?? data?.structure_units ?? unitTabs.length ?? 0;
  const totalTopics = data?.summary?.total_topics ?? data?.target_topics ?? 0;

  // Review progress from API
  const reviewProgress = data?.review_progress;

  // Metrics for StatTabCard - rendered dynamically from API
  const metrics = data?.metrics;

  const STAT_TABS = [
    {
      key: "approved-topics",
      label: "Approved Topics",
      count: metrics?.approved_topics?.display ?? metrics?.approved_topics?.value ?? 0,
      icon: <Check className="h-5 w-5" />,
    },
    {
      key: "pedagogy-recommendations",
      label:  "Pending Pedagogy Recommendations",
      subLabel: "Pending approval of pedagogy recommendations",
      count: metrics?.pending_approval?.display ?? metrics?.pending_approval?.value ?? 0,
      icon: <Hourglass className="h-5 w-5" />,
    },
  ];

  // Topics for PedadgogyAccordiansStyle directly from dynamic selected_unit.topics
  const currentUnitTopics: any[] = Array.isArray(data?.selected_unit?.topics)
    ? data.selected_unit.topics
    : Array.isArray(data?.topics)
    ? data.topics
    : [];

  const accordionTopics = currentUnitTopics.map((topic: any, idx: number) => {
    const topicId = String(topic.id ?? idx + 1);
    const topicCode = topic.topic_code;
    const topicName = topic.topic_name || topic.title || `Topic ${idx + 1}`;
    const displayTitle = topicCode && !topicName.startsWith(topicCode) ? `${topicCode} — ${topicName}` : topicName;

    const isReviewed =
      topic.pedagogy_status === "Reviewed" ||
      topic.pedagogy_status_badge === "success" ||
      topic.suggested_pedagogies?.some((p: any) => p.is_selected);

    const statusLabel = topic.pedagogy_status_display || topic.pedagogy_status || (isReviewed ? "Reviewed" : "Needs Review");
    const statusClass =
      topic.pedagogy_status_badge === "success" || isReviewed
        ? "border border-emerald-300 bg-emerald-50 text-emerald-600 font-semibold"
        : "border border-amber-300 bg-amber-50 text-amber-600 font-semibold";

    const hoursText =
      topic.hours !== undefined && topic.hours !== null
        ? typeof topic.hours === "number"
          ? `${topic.hours} Hours`
          : topic.hours
        : "";

    const badges = [
      topic.knowledge_level
        ? {
            id: "level",
            label: topic.knowledge_level,
            className: "bg-color2-l text-color2 font-bold",
          }
        : null,
      hoursText
        ? {
            id: "hours",
            label: hoursText,
            className: "bg-gray-100 text-pri font-bold dark:bg-gray-800 dark:text-gray-300",
          }
        : null,
      statusLabel
        ? {
            id: "status",
            label: statusLabel,
            className: statusClass,
          }
        : null,
    ].filter(Boolean);

    // Subtopics as pedagogy recommendations from API
    const suggestedPedagogies: any[] = Array.isArray(topic.suggested_pedagogies) ? topic.suggested_pedagogies : [];
    const items = suggestedPedagogies.map((p: any, pi: number) => {
      const pId = String(p.id ?? pi + 1);
      const isSelected = Boolean(p.is_selected);

      const actions: any[] = [
        {
          key: "edit",
          label: "Edit",
          icon: <EditIcon className="h-3.5 w-3.5" />,
          className:
            "flex items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold text-pri hover:border-[#000] hover:text-[#000] dark:border-gray-600 dark:text-gray-300 cursor-pointer",
          onClick: () =>
            setEditModal({
              open: true,
              title: p.pedagogy_name || p.strategy_name || "",
              description: p.methodology || "",
              topicLabel: displayTitle,
              topicId: topic.id,
              pedagogyId: p.id,
            }),
        },
      ];

      if (isSelected) {
        // actions.push({
        //   key: "replace",
        //   label: "Replace",
        //   icon: <ReplaceAll className="h-3.5 w-3.5" />,
        //   className:
        //     "flex items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold text-pri hover:border-[#000] hover:text-[#000] dark:border-gray-600 dark:text-gray-300 cursor-pointer",
        //   onClick: () =>
        //     setReplaceModal({
        //       open: true,
        //       currentTitle: p.pedagogy_name || p.strategy_name || "",
        //       topicLabel: displayTitle,
        //       topicId: topic.id,
        //       selectedOptionId: p.id,
        //       options: suggestedPedagogies.map((r: any) => ({
        //         id: r.id,
        //         title: r.pedagogy_name || r.strategy_name,
        //         description: r.methodology,
        //       })),
        //     }),
        // });
        actions.push({
          key: "selected",
          label: "Selected",
          icon: <Check className="h-3.5 w-3.5" />,
          disabled: true,
          className:
            "flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white cursor-default select-none shadow-xs",
        });
      } else {
        actions.push({
          key: "accept",
          label: "Accept",
          className:
            "rounded-full border border-color2 px-3 py-1 text-xs font-semibold text-color2 hover:bg-color2-l transition-colors cursor-pointer",
          onClick: () => handleAcceptPedagogy(topic.id, p.id),
        });
      }

      return {
        id: pId,
        index: pi + 1,
        title: p.pedagogy_name || p.strategy_name,
        description: p.methodology,
        highlighted: isSelected,
        actions,
      };
    });

    return {
      id: topicId,
      title: displayTitle,
      collapsedBadge: badges,
      expandedBadge: badges,
      items,
    };
  });

  const unitTitle = data?.selected_unit?.unit_title || (data ? `Unit ${state.activeUnitNumber}` : "");
  const unitSubtitle = data?.selected_unit?.subtitle;

  return (
    <div className="min-h-screen">
      <CourseBanner
        courseCode={data?.course_code || state?.courseDetail?.course_code}
        courseTitle={data?.course_title || state?.courseDetail?.course_title}
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme={data?.programme || state?.courseDetail?.programme}
        batch={data?.batch || state?.courseDetail?.batch_name}
        academicYear={data?.academic_year_term || state?.courseDetail?.academic_year}
        students={data?.student_count || state?.courseDetail?.students_count}
        selectedCourse={state.selectedCourse}
        courseOptions={state.courseList}
        onCourseChange={(val) => {
          setState({ selectedCourse: val });
          router.push(`/neurobe/pedagogy?course_id=${val.value}`);
        }}
        activeView={state.activeBannerTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeBannerTab: view })}
      />

      <PageHeader
        title="Pedagogy"
        records={
          data?.course_display_tag ||
          (state.courseDetail ? `${state.courseDetail.course_code} — ${state.courseDetail.course_title}` : "")
        }
        subtitle="Choose suitable teaching methods for the approved topics."
        icon={<Lightbulb className="h-5 w-5 text-color2" />}
      />

      {/* ── Loading indicator when fetching workspace data ── */}
      {state.loadingUnitDetail && !data && (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-color2" />
          <p className="mt-3 text-sm font-semibold text-pri">Loading pedagogy workspace from API...</p>
        </div>
      )}

      {/* ── Empty state when no data is returned from API ── */}
      {!state.loadingUnitDetail && !data && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
          <Lightbulb className="h-10 w-10 text-gray-400" />
          <h3 className="mt-3 text-base font-bold text-[#000] dark:text-white">No Pedagogy Workspace Data</h3>
          <p className="mt-1 max-w-sm text-xs text-pri">
            Please select a course with an approved syllabus to view and assign teaching methods.
          </p>
        </div>
      )}

      {/* ── Dynamic Content Rendered Only from API ── */}
      {data && (
        <>
          {/* ── Stat tabs — rendered dynamically from metrics ── */}
          {STAT_TABS.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {STAT_TABS.map((tab) => (
                <StatTabCard
                  key={tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  subLabel={tab.subLabel}
                  count={tab.count}
                  active={false}
                />
              ))}
            </div>
          )}

          {/* ── Progress bar — shown when recommendations are generated / in progress ── */}
          {!isNotGenerated && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#000] dark:text-white">Pedagogy Review Progress</p>
                  <p className="mt-0.5 text-xs text-pri">
                    {reviewProgress?.subtitle ||
                      `${reviewProgress?.reviewed_count ?? 0} of ${reviewProgress?.total_count ?? totalTopics} Topics Reviewed`}
                  </p>
                </div>
                <span className="text-xs font-semibold text-color2">
                  {reviewProgress?.display || `${reviewProgress?.percentage ?? 0}% Complete`}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-color2 transition-all duration-500"
                  style={{ width: `${reviewProgress?.percentage ?? 0}%` }}
                />
              </div>
            </div>
          )}

          <TableTitle
            title="Approved Topics"
            label={`${totalUnits} Units`}
            subLabel={`${totalTopics} Topics`}
          />

          <div className="mt-4">
            {unitTabs.length > 0 && (
              <GenericTabs
                tabs={unitTabs}
                activeKey={state.activeTab}
                onChange={(unit) => handleTabChange(unit)}
              />
            )}

            {/* ── Accordion with subtopics as pedagogy recommendations ── */}
            <PedadgogyAccordiansStyle
              loading={state.loadingUnitDetail}
              expandable={true}
              topics={accordionTopics}
              title={unitTitle}
              subtitle={unitSubtitle}
              topicCount={data?.selected_unit?.topics_count ?? currentUnitTopics.length}
              topicCountLabel="Topics"
              expandedSectionLabel={
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-color2" />
                  Recommended Teaching Methods
                </span>
              }
              footerContent={
                data?.callout_message ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    {data.callout_message}
                  </span>
                ) : null
              }
              renderModals={() => (
                <>
                  <EditPedagogyModal
                    open={editModal.open}
                    onClose={() => setEditModal((p) => ({ ...p, open: false }))}
                    topicLabel={editModal.topicLabel}
                    initialTitle={editModal.title}
                    initialDescription={editModal.description}
                    onSave={handleEditSubmit}
                  />
                  <ReplacePedagogyModal
                    open={replaceModal.open}
                    onClose={() => setReplaceModal((p) => ({ ...p, open: false }))}
                    topicLabel={replaceModal.topicLabel}
                    currentTitle={replaceModal.currentTitle}
                    options={replaceModal.options}
                    onReplace={(opt: any) => handleReplaceSubmit(opt?.id)}
                  />
                </>
              )}
            />

            {/* ── Bottom PageFooter ── */}
            {isNotGenerated ? (
              <PageFooter
                content1={data?.bottom_bar?.course || data?.course_display_tag || ""}
                content2={data?.callout_message || ""}
                actionBtn1={{
                  label:
                    state.generatingRecommendations || state.pollingJob
                      ? "Generating..."
                      : data?.bottom_bar?.action?.label || "Generate Recommendations with NEURO AI",
                  icon:
                    state.generatingRecommendations || state.pollingJob ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    ),
                  onClick: handleGenerateRecommendations,
                  disabled:
                    state.generatingRecommendations ||
                    state.pollingJob ||
                    data?.bottom_bar?.action?.enabled === false,
                  className: "create-btn",
                }}
                actionBtn2={
                  data?.bottom_bar?.actions?.save_draft
                    ? {
                        label:
                          state.savingDraft
                            ? "Saving..."
                            : data?.bottom_bar?.actions?.save_draft?.label || "Save Draft",
                        icon: state.savingDraft ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />,
                        onClick: handleSaveDraft,
                        disabled: state.savingDraft || data?.bottom_bar?.actions?.save_draft?.enabled === false,
                      }
                    : undefined
                }
              />
            ) : (
              <PageFooter
                content1={
                  data?.bottom_bar?.status ||
                  `Status: ${reviewProgress?.display || "In Progress"}`
                }
                content2={data?.bottom_bar?.course || data?.course_display_tag || ""}
                batch
                actionBtn1={
                  state.pedagogyApproved
                    ? {
                        label: "Next: Lesson Plan",
                        icon: <Check className="h-4 w-4" />,
                        onClick: () => {
                          const cid = course_id || state.selectedCourse?.value || data?.course_id;
                          router.push(cid ? `/neurobe/lesson-plan?course_id=${cid}` : "/neurobe/lesson-plan");
                        },
                        className: "create-btn",
                      }
                    : {
                        label: data?.bottom_bar?.actions?.complete_review?.label || "Complete Pedagogy Review",
                        icon: <Check className="h-4 w-4" />,
                        onClick: handleCompleteReview,
                        disabled:
                          state.completingReview ||
                          data?.bottom_bar?.actions?.complete_review?.enabled === false,
                      }
                }
                actionBtn2={
                  data?.bottom_bar?.actions?.save_draft
                    ? {
                        label:
                          state.savingDraft
                            ? "Saving..."
                            : data?.bottom_bar?.actions?.save_draft?.label || "Save Draft",
                        icon: state.savingDraft ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />,
                        onClick: handleSaveDraft,
                        disabled: state.savingDraft || data?.bottom_bar?.actions?.save_draft?.enabled === false,
                      }
                    : undefined
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateRouter(Pedagogy);
