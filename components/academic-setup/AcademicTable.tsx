import { DataTable } from "mantine-datatable";
import IconLoader from "@/components/Icon/IconLoader";

interface AcademicTableProps {
  records: any[];
  columns: any[];
  loading?: boolean;
  noRecordsText?: string;
}

const AcademicTable = ({ records, columns, loading, noRecordsText = "No records found" }: AcademicTableProps) => {
  return (
    <DataTable
      noRecordsText={noRecordsText}
      highlightOnHover
      className="whitespace-nowrap table-style"
      records={records}
      columns={columns}
      fetching={loading}
      customLoader={
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-6 w-6 animate-spin text-[#7c3aed]" />
        </div>
      }
      minHeight={200}
    />
  );
};

export default AcademicTable;
