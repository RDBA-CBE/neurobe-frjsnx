import { BookMarked } from "lucide-react";

interface Book { id: number; label: string; title: string; citation: string; }

interface TextbooksSummaryProps {
  textbooks?: Book[];
  references?: Book[];
}

const DEFAULT_TEXTBOOKS: Book[] = [
  { id: 1, label: "Textbook 01", title: "Computer Networks", citation: "Andrew S. Tanenbaum, David J. Wetherall, 5th Edition, Pearson Education (2013)." },
  { id: 2, label: "Textbook 02", title: "Computer Networking: A Top-Down Approach", citation: "James F. Kurose, Keith W. Ross, 7th Edition, Pearson (2017)." },
];

const DEFAULT_REFERENCES: Book[] = [
  { id: 1, label: "Reference 01", title: "Data Communications and Networking", citation: "Behrouz A. Forouzan, 5th Edition, McGraw Hill (2012)." },
  { id: 2, label: "Reference 02", title: "TCP/IP Illustrated, Volume 1: The Protocols", citation: "W. Richard Stevens, Kevin R. Fall, 2nd Edition, Addison-Wesley (2011)." },
];

const BookCard = ({ book }: { book: Book }) => (
  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
    <span className="mb-2 inline-block rounded-md bg-color2-l px-2.5 py-0.5 text-xs font-bold text-color2 dark:bg-purple-900/20">
      {book.label}
    </span>
    <p className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</p>
    <p className="mt-1 text-sm text-pri">{book.citation}</p>
  </div>
);

const TextbooksSummary = ({
  textbooks = DEFAULT_TEXTBOOKS,
  references = DEFAULT_REFERENCES,
}: TextbooksSummaryProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
    <div className="mb-4 flex items-center gap-2">
      <div className="bg-color2-l flex h-8 w-8 items-center justify-center rounded-lg dark:bg-purple-900/20">
          <BookMarked className="text-color2 h-4.5 w-4.5" />
        </div>
      <h3 className="text-lg font-bold text-color  dark:text-white">Textbooks & Reference Books</h3>
    </div>

    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-pri">Textbooks</p>
    <div className="mb-4 grid grid-cols-2 gap-3">
      {textbooks.map((b) => <BookCard key={b.id} book={b} />)}
    </div>

    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-pri">Reference Books</p>
    <div className="grid grid-cols-2 gap-3">
      {references.map((b) => <BookCard key={b.id} book={b} />)}
    </div>
  </div>
);

export default TextbooksSummary;
