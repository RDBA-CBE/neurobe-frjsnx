import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Upload, Users } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import {
  MOCK_USERS,
  makeUserListColumns,
} from "@/components/user-list/userListColumns";
import AddUserModal from "@/components/user-list/AddUserModal";
import BulkImportModal from "@/components/user-list/BulkImportModal";
import PrivateRouter from "@/hook/privateRouter";
import TableComponent from "@/components/common-components/TableComponent";
import PageHeader from "@/components/common-components/PageHeader";

import CustomSelect from "@/components/FormFields/CustomSelect.component";
import TextInput from "@/components/FormFields/TextInput.component";

const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

const ROLE_OPTS   = toOpts(["All Roles", "Course Coordinator", "Course Instructor", "Student", "ERP Admin"]);
const DEPT_OPTS   = toOpts(["All Departments", "Computer Science & Engineering", "Electronics & Communication", "Artificial Intelligence", "Information Technology"]);
const PROG_OPTS   = toOpts(["All Programmes", "B.E. Computer Science", "B.Tech ECE", "D.Tech AI", "D.Tech IT"]);
const BATCH_OPTS  = toOpts(["All Batches", "Faculty / Staff", "2021-2025", "2022-2026", "2023-2027", "2024-2028"]);
const STATUS_OPTS = toOpts(["All Status", "Active", "Inactive", "Locked"]);

const UserList = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search:       "",
    roleFilter:   null as any,
    deptFilter:   null as any,
    progFilter:   null as any,
    batchFilter:  null as any,
    statusFilter: null as any,
    loading:      false,
    showModal:    false,
    showBulkModal:false,
    editRow:      null as any,
    page:         1,
  });

  const openCreate = ()         => setState({ showModal: true,  editRow: null });
  const openEdit   = (row: any) => setState({ showModal: true,  editRow: row  });
  const closeModal = ()         => setState({ showModal: false, editRow: null });

  useEffect(() => {
    dispatch(setPageTitle("User List"));
  }, []);

  // ── filter ─────────────────────────────────────────────────────────────────
  const records = MOCK_USERS.filter((r) => {
    const s = state.search.toLowerCase();
    const matchSearch  = !s || r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || r.regNo.toLowerCase().includes(s);
    const matchRole    = !state.roleFilter   || state.roleFilter.value   === "All Roles"        || r.role       === state.roleFilter.label;
    const matchDept    = !state.deptFilter   || state.deptFilter.value   === "All Departments"  || r.department.startsWith(state.deptFilter.label.slice(0, 10));
    const matchProg    = !state.progFilter   || state.progFilter.value   === "All Programmes"   || r.programme.startsWith(state.progFilter.label.slice(0, 10));
    const matchBatch   = !state.batchFilter  || state.batchFilter.value  === "All Batches"      || r.batch      === state.batchFilter.label;
    const matchStatus  = !state.statusFilter || state.statusFilter.value === "All Status"       || r.status     === state.statusFilter.label;
    return matchSearch && matchRole && matchDept && matchProg && matchBatch && matchStatus;
  });

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <PageHeader
        title="User List"
        subtitle={`Institution: <span class="font-bold text-[#000]">Karpagam Institutions, Coimbatore</span>
            &nbsp;·&nbsp; Admin: <span class="font-bold text-[#000]">Meena Subramanian`}
        icon={<Users className="h-5 w-5 text-[#7c3aed]" />}
        actionBtn1={{
          label: "Add User",
          icon: <IconPlus className="h-4 w-4" />,
          onClick: openCreate,
        }}
        actionBtn2={{
          label: "Bulk Import",
          icon: <Upload className="h-4 w-4" />,
          onClick: () => setState({ showBulkModal: true }),
        }}
        records={`${MOCK_USERS.length} Records`}
      />
      

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
           <TextInput
            placeholder="Search by name, email, register number..."
              type="text"
              value={state.search}
              onChange={(e) => setState({ search: e.target.value })}
              icon={<IconSearch className="h-4 w-4" />}
            />
        
        </div>
        <CustomSelect options={ROLE_OPTS}   value={state.roleFilter}   onChange={(v) => setState({ roleFilter:   v })} placeholder="All Roles"        className="filter-input" isClearable />
        <CustomSelect options={DEPT_OPTS}   value={state.deptFilter}   onChange={(v) => setState({ deptFilter:   v })} placeholder="All Departments"  className="filter-input" isClearable />
        <CustomSelect options={PROG_OPTS}   value={state.progFilter}   onChange={(v) => setState({ progFilter:   v })} placeholder="All Programmes"   className="filter-input" isClearable />
        <CustomSelect options={BATCH_OPTS}  value={state.batchFilter}  onChange={(v) => setState({ batchFilter:  v })} placeholder="All Batches"      className="filter-input" isClearable />
        <CustomSelect options={STATUS_OPTS} value={state.statusFilter} onChange={(v) => setState({ statusFilter: v })} placeholder="All Status"        className="filter-input" isClearable />
      </div>

      {/* ── User Directory label ────────────────────────────────────────────── */}
      {/* <div className="mb-2 flex items-center gap-2 px-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-white">
          User Directory
        </p>
        <span className="text-xs text-[#000]">
          Shown {records.length} of {MOCK_USERS.length}
        </span>
      </div> */}

      {/* ── Table — columns passed as prop, defined in userListColumns.tsx ─── */}
      <div className="panel">
        <TableComponent
          records={records}
          columns={makeUserListColumns(openEdit)}
          loading={state.loading}
          noRecordsText="No users found"
        />
      </div>

      {/* ── Footer count ───────────────────────────────────────────────────── */}
      <p className="mt-3 text-xs text-[#000]">
        Showing 1–{records.length} of {MOCK_USERS.length} users
      </p>

      {/* ── Add User Modal ─────────────────────────────────────────────────── */}
      <AddUserModal
        open={state.showModal}
        onClose={closeModal}
        initialData={state.editRow}
      />
      <BulkImportModal
        open={state.showBulkModal}
        onClose={() => setState({ showBulkModal: false })}
      />
    </div>
  );
};

export default PrivateRouter(UserList);
