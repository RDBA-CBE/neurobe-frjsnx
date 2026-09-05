import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Users,
  Edit,
  RefreshCcw,
  Sparkles,
  BookOpen,
  CheckCircle,
  Info,
  ArrowBigRight,
} from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import PrivateRouter from "@/hook/privateRouter";
import CourseBanner from "@/components/academic-setup/CourseBanner";
import { useRouter } from "next/router";
import AIGenerateModal from "@/components/common-components/AIGenerateModal";
import TextArea from "@/components/FormFields/TextArea.component";
import CheckboxInput from "@/components/FormFields/CheckBoxInput.component";
import PageHeader from "@/components/common-components/PageHeader";
import AccordiansStyleEditor, {
  MaterialSection,
} from "@/components/common-components/AccordiansStyleEditor";
import KeepFilePrompt from "@/components/academic-setup/KeepFilePrompt";

const MATERIAL_SECTIONS: MaterialSection[] = [
  {
    heading: "Conceptual Overview",
    body: "Computer networks interconnect autonomous computational devices to enable reliable resource sharing and distributed data exchange. To manage system complexity and hardware heterogeneity, modern network architectures employ hierarchical modular layering where each protocol layer performs distinct services and encapsulates data for transmission.",
  },
  {
    heading: "Theoretical Foundations & Protocols",
    body: "The Open Systems Interconnection (OSI) 7-Layer Reference Model provides the standard theoretical benchmark:",
    bullets: [
      {
        label: "Physical Layer:",
        text: "Governs unstructured bit stream transmission over physical media (voltages, frequencies, pin configurations).",
      },
      {
        label: "Data Link Layer:",
        text: "Manages node-to-node framing, physical MAC addressing, flow control, and CRC error detection.",
      },
      {
        label: "Network Layer:",
        text: "Handles logical IP addressing, packet forwarding, and dynamic subnet routing across autonomous systems.",
      },
      {
        label: "Transport Layer:",
        text: "Guarantees process-to-process communication, connection management, port multiplexing, and reliable byte-stream transmission (TCP/UDP).",
      },
      {
        label: "Session Layer:",
        text: "Manages dialogue control, token administration, and session checkpoint synchronization.",
      },
      {
        label: "Presentation Layer:",
        text: "Executes data syntax translation, compression algorithms, and cryptographic encryption.",
      },
      {
        label: "Application Layer:",
        text: "Directly interfaces with network software (HTTP/HTTPS, DNS, SMTP, SSH).",
      },
    ],
    footer:
      "The practical TCP/IP Internet Protocol Suite condenses these roles into 4 operational layers: Application, Transport, Internet, and Network Access.",
  },
];

const ViewLearningMaterials = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useSetState({
    activeTab: "unit-1",
    showGenerateModal: false,
    selectedTopic: null as any,
    includeExamples: true,
    includeExercises: true,
    isEditing: false,
    editorValue: "",
    showSavePrompt: false,
  });

  useEffect(() => {
    dispatch(setPageTitle("View Learning Material"));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <CourseBanner
        courseCode="CS301"
        courseTitle="Computer Networks"
        description="Coordinator View — Academic course preparation, syllabus, outcomes mapping, lesson plans, question banking, and CIA paper generation."
        programme="B.Tech CSE"
        batch="2025–2029"
        academicYear="2026–2027 / Semester 3"
        students="40 Students"
        selectedCourse="CS309"
        courseOptions={[
          { value: "CS309", label: "Course: CS309" },
          { value: "CS301", label: "Course: CS301" },
        ]}
        onCourseChange={(val) => console.log("course", val)}
        activeView={state.activeTab}
        onBack={() => router.back()}
        onViewChange={(view) => setState({ activeTab: view })}
      />

      <PageHeader
        title="Network Models & Layered Architecture"
        subtitle={`Institution: <span class="font-bold text-[#000]">Karpagam Institutions, Coimbatore</span>&nbsp;·&nbsp; Admin: <span class="font-bold text-[#000]">Meena Subramanian</span>`}
        icon={<Users className="h-5 w-5 text-[#7c3aed]" />}
        actionBtn3={{
          label: "Regenerate",
          icon: <RefreshCcw className="h-4 w-4" />,
          onClick: () => {},
        }}
        actionBtn4={
          state.isEditing
            ? undefined
            : {
                label: "Edit Material",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => setState({ isEditing: true }),
              }
        }
        editMode={state.isEditing}
        records="TOPIC 1.1"
      />

      {state.showSavePrompt && (
        <KeepFilePrompt
          bg={"bg-light-yellow"}
          border="border-yellow"
          text="text-dark-red"
          icon={<Info className="text-dark-red h-4 w-4" />}
          title="Select a mapping to review the suggested strength and NEURO AI rationale. Accept or edit the suggestion as needed."
          label="Dismiss"
        />
      )}

      <div className="mt-4">
        <AccordiansStyleEditor
          title="Learning Material Document"
          topicCountLabel={
            state.isEditing ? "Edit Mode" : "Review Mode (Read-Only Review)"
          }
          finalValue={state.final}
          saveChanges={state.showSavePrompt}
          sections={MATERIAL_SECTIONS}
          icon={<BookOpen className="h-4 w-4" />}
          isEditing={state.isEditing}
          editorValue={state.editorValue}
          onEditorChange={(val) => setState({ editorValue: val })}
          onSave={() => setState({ isEditing: false, showSavePrompt: false,final:true, })}
          onCancelEdit={() => setState({ isEditing: false, showSavePrompt: false,final:true,  })}
          onBack={() => router.back()}
          actionBtn1={{
            label: "Approve Material",
            icon: <CheckCircle className="h-4 w-4" />,
            onClick: () => {setState({ isEditing: false,showSavePrompt:false,final:true, })},
          }}
          actionBtn2={{
            label: "Edit Material",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => setState({ isEditing: true }),
          }}

          final={{
            label: "Next Question Bank",
            icon: <ArrowBigRight className="h-4 w-4" />,
            onClick: () => {router.push("/neurobe/question-bank")},
          }}



        
          
        />
      </div>

    
    </div>
  );
};

export default PrivateRouter(ViewLearningMaterials);
