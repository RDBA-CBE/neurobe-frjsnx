import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";

interface Book {
  id: number;
  title: string;
  authors: string;
  edition: string;
  publisher: string;
}

const EMPTY_BOOK = { title: "", authors: "", edition: "", publisher: "" };

const INITIAL_TEXTBOOKS: Book[] = [
  { id: 1, title: "Computer Networks", authors: "Andrew S. Tanenbaum, David J. Wetherall", edition: "5th Edition", publisher: "Pearson Education, 2013" },
  { id: 2, title: "Computer Networking: A Top-Down Approach", authors: "James F. Kurose, Keith W. Ross", edition: "7th Edition", publisher: "Pearson, 2017" },
];

const INITIAL_REFERENCES: Book[] = [
  { id: 1, title: "Data Communications and Networking", authors: "Behrouz A. Forouzan", edition: "", publisher: "" },
  { id: 2, title: "TCP/IP Illustrated, Volume 1: The Protocols", authors: "W. Richard Stevens, Kevin R. Fall", edition: "", publisher: "" },
];

const TEXTBOOK_FIELDS = [
  { key: "title" as const, label: "Title" },
  { key: "authors" as const, label: "Author(s)" },
  { key: "edition" as const, label: "Edition / Year" },
  { key: "publisher" as const, label: "Publisher" },
];

const REFERENCE_FIELDS = [
  { key: "title" as const, label: "Title" },
  { key: "authors" as const, label: "Author(s)" },
];

const Modal = ({
  title, fields, form, onChange, onClose, onSubmit,
}: {
  title: string;
  fields: { key: keyof typeof EMPTY_BOOK; label: string }[];
  form: typeof EMPTY_BOOK;
  onChange: (key: keyof typeof EMPTY_BOOK, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">{f.label}</label>
            <input
              value={form[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-color2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
        <button onClick={onSubmit} className="rounded-lg bg-color2 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Add</button>
      </div>
    </div>
  </div>
);

const BookCard = ({
  book, label, labelClass, showEditionPublisher, onDelete, onChange,
}: {
  book: Book;
  label: string;
  labelClass: string;
  showEditionPublisher: boolean;
  onDelete: () => void;
  onChange: (field: keyof Book, value: string) => void;
}) => (
  <div className="rounded-xl border border-gray-200 p-4 bg-grey dark:border-gray-700">
    <div className="mb-3 flex items-center justify-between">
      <span className={`rounded-md px-2.5 py-0.5 text-sm font-semibold ${labelClass}`}>{label}</span>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Title</label>
        <input value={book.title} onChange={(e) => onChange("title", e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Author(s)</label>
        <input value={book.authors} onChange={(e) => onChange("authors", e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
      </div>
      {showEditionPublisher && (
        <>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Edition / Year</label>
            <input value={book.edition} onChange={(e) => onChange("edition", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Publisher</label>
            <input value={book.publisher} onChange={(e) => onChange("publisher", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          </div>
        </>
      )}
    </div>
  </div>
);

const PrescribedTextbooks = () => {
  const [textbooks, setTextbooks] = useState<Book[]>(INITIAL_TEXTBOOKS);
  const [references, setReferences] = useState<Book[]>(INITIAL_REFERENCES);
  const [showTextbookModal, setShowTextbookModal] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_BOOK });

  const updateBook = (list: Book[], setList: any, id: number, field: keyof Book, value: string) =>
    setList(list.map((b: Book) => (b.id === id ? { ...b, [field]: value } : b)));

  const deleteBook = (list: Book[], setList: any, id: number) =>
    setList(list.filter((b: Book) => b.id !== id));

  const openModal = (type: "textbook" | "ref") => {
    setForm({ ...EMPTY_BOOK });
    type === "textbook" ? setShowTextbookModal(true) : setShowRefModal(true);
  };

  const submitTextbook = () => {
    setTextbooks((prev) => [...prev, { id: prev.length + 1, ...form }]);
    setShowTextbookModal(false);
  };

  const submitReference = () => {
    setReferences((prev) => [...prev, { id: prev.length + 1, ...form }]);
    setShowRefModal(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {showTextbookModal && (
        <Modal title="Add Textbook" fields={TEXTBOOK_FIELDS} form={form}
          onChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))}
          onClose={() => setShowTextbookModal(false)} onSubmit={submitTextbook} />
      )}
      {showRefModal && (
        <Modal title="Add Reference" fields={REFERENCE_FIELDS} form={form}
          onChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))}
          onClose={() => setShowRefModal(false)} onSubmit={submitReference} />
      )}

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary2 text-xs font-bold text-color2 mt-0.5">5</span>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">Prescribed Textbooks & Reference Literature</h3>
            <p className="text-xs text-gray-400 mt-0.5">Standard BoS references with edition, author, and publisher citations.</p>
          </div>
        </div>
        <button onClick={() => openModal("textbook")}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-color2 px-3 py-1.5 text-sm font-semibold text-color2 hover:bg-primary2 self-center">
          <Plus className="h-4 w-4" /> Add Textbook
        </button>
      </div>

      {/* Primary Textbooks */}
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-pri">Primary Textbooks</p>
      <div className="mb-5 space-y-3">
        {textbooks.map((book, i) => (
          <BookCard key={book.id} book={book}
            label={`Textbook ${String(i + 1).padStart(2, "0")}`}
            labelClass="bg-purple-50 text-color2 dark:bg-purple-900/20"
            showEditionPublisher
            onDelete={() => deleteBook(textbooks, setTextbooks, book.id)}
            onChange={(field, value) => updateBook(textbooks, setTextbooks, book.id, field, value)} />
        ))}
      </div>

      {/* Reference Books */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-pri">Reference Books</p>
        <button onClick={() => openModal("ref")}
          className="flex items-center gap-1 text-sm font-semibold text-color2 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add Reference
        </button>
      </div>
      <div className="space-y-3">
        {references.map((book, i) => (
          <BookCard key={book.id} book={book}
            label={`Ref ${String(i + 1).padStart(2, "0")}`}
            labelClass="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            showEditionPublisher={false}
            onDelete={() => deleteBook(references, setReferences, book.id)}
            onChange={(field, value) => updateBook(references, setReferences, book.id, field, value)} />
        ))}
      </div>
    </div>
  );
};

export default PrescribedTextbooks;
