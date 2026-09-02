import { useState, useCallback } from "react";
import { Document, Page, pdfjs,  } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | string;
  fileName?: string;
  fileSize?: string;
}

const PDFViewer = ({ file, fileName = "Document.pdf", fileSize = "" }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));

  return (
    <div className="flex h-full flex-col rounded-xl bg-[#1a1f2e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{fileName}</p>
          <p className="text-xs text-white/50">Original Document{fileSize ? ` • ${fileSize}` : ""}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="rounded p-1 text-white/60 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-white/70">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="rounded p-1 text-white/60 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="rounded p-1 text-white/60 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-white/70">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="rounded p-1 text-white/60 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-40 items-center justify-center text-white/50 text-sm">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex h-40 items-center justify-center text-red-400 text-sm">
              Failed to load PDF.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer
            renderAnnotationLayer
            className="mx-auto shadow-lg"
          />
        </Document>
      </div>

      {/* Footer hint */}
      <div className="border-t border-white/10 px-4 py-2 text-center text-xs text-white/40">
        Click any bordered section in the document to view corresponding extracted fields.
      </div>
    </div>
  );
};

export default PDFViewer;
