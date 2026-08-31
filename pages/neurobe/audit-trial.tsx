import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Upload, Users } from "lucide-react";
import { setPageTitle } from "@/store/themeConfigSlice";
import { useSetState } from "@/utils/function.utils";
import IconSearch from "@/components/Icon/IconSearch";
import IconPlus from "@/components/Icon/IconPlus";
import { MOCK_USERS, USER_LIST_COLUMNS } from "@/components/user-list/userListColumns";
import AddUserModal from "@/components/user-list/AddUserModal";
import PrivateRouter from "@/hook/privateRouter";
import TableComponent from "@/components/academic-setup/TableComponent";

const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

const ROLE_OPTS   = ["All Roles", "Course Coordinator", "Course Instructor", "Student", "ERP Admin"];
const DEPT_OPTS   = ["All Departments", "Computer Science & Engineering", "Electronics & Communication", "Artificial Intelligence", "Information Technology"];
const PROG_OPTS   = ["All Programmes", "B.E. Computer Science", "B.Tech ECE", "D.Tech AI", "D.Tech IT"];
const BATCH_OPTS  = ["All Batches", "Faculty / Staff", "2021-2025", "2022-2026", "2023-2027", "2024-2028"];
const STATUS_OPTS = ["All Status", "Active", "Inactive", "Locked"];

const UserList = () => {
  const dispatch = useDispatch();

  const [state, setState] = useSetState({
    search:      "",
    roleFilter:  "All Roles",
    deptFilter:  "All Departments",
    progFilter:  "All Programmes",
    batchFilter: "All Batches",
    statusFilter:"All Status",
    loading:     false,
    showModal:   false,
    page:        1,
  });

  useEffect(() => { dispatch(setPageTitle("User List")); }, []);

  // ── filter ─────────────────────────────────────────────────────────────────
  const records = MOCK_USERS.filter((r) => {
    const s = state.search.toLowerCase();
    const matchSearch = !s || r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || r.regNo.toLowerCase().includes(s);
    const matchRole   = state.roleFilter   === "All Roles"        || r.role       === state.roleFilter;
    const matchDept   = state.deptFilter   === "All Departments"  || r.department.startsWith(state.deptFilter.slice(0, 10));
    const matchProg   = state.progFilter   === "All Programmes"   || r.programme.startsWith(state.progFilter.slice(0, 10));
    const matchBatch  = state.batchFilter  === "All Batches"      || r.batch      === state.batchFilter;
    const matchStatus = state.statusFilter === "All Status"       || r.status     === state.statusFilter;
    return matchSearch && matchRole && matchDept && matchProg && matchBatch && matchStatus;
  });

  const selectCls = "rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-7 text-xs text-gray-700 outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <div className="min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="panel px-5 py-3 mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-700 dark:text-white" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Users</h1>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-[#000] dark:bg-gray-700 dark:text-gray-300">
              {MOCK_USERS.length} Total Registered
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            Institution: <span className="font-medium text-[#000]">Karpagam Institutions, Coimbatore</span>
            &nbsp;·&nbsp; Admin: <span className="font-medium text-[#000]">Meena Subramanian</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-[#000] hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Upload className="h-4 w-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setState({ showModal: true })}
            className="bg-color2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <IconPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="panel mb-4 flex flex-wrap items-center gap-3 px-5 py-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, register number..."
            value={state.search}
            onChange={(e) => setState({ search: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#7c3aed] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <select value={state.roleFilter}   onChange={(e) => setState({ roleFilter:   e.target.value })} className={selectCls}>
          {ROLE_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={state.deptFilter}   onChange={(e) => setState({ deptFilter:   e.target.value })} className={selectCls}>
          {DEPT_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={state.progFilter}   onChange={(e) => setState({ progFilter:   e.target.value })} className={selectCls}>
          {PROG_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={state.batchFilter}  onChange={(e) => setState({ batchFilter:  e.target.value })} className={selectCls}>
          {BATCH_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={state.statusFilter} onChange={(e) => setState({ statusFilter: e.target.value })} className={selectCls}>
          {STATUS_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* ── User Directory label ────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-white">User Directory</p>
        <span className="text-xs text-gray-400">Shown {records.length} of {MOCK_USERS.length}</span>
      </div>

      {/* ── Table — columns passed as prop, defined in userListColumns.tsx ─── */}
      <div className="panel">
        <TableComponent
          records={records}
          columns={USER_LIST_COLUMNS}
          loading={state.loading}
          noRecordsText="No users found"
        />
      </div>

      {/* ── Footer count ───────────────────────────────────────────────────── */}
      <p className="mt-3 text-xs text-gray-400">
        Showing 1–{records.length} of {MOCK_USERS.length} users
      </p>

      {/* ── Add User Modal ─────────────────────────────────────────────────── */}
      <AddUserModal open={state.showModal} onClose={() => setState({ showModal: false })} />
    </div>
  );
};

export default PrivateRouter(UserList);
