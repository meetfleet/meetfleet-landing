import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker — bundled by Vite via ?url so it's served locally
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/**
 * PdfViewer — renders a PDF as a plain canvas via PDF.js, with NO native
 * browser toolbar, scrollbar, or side gutters. Page navigation + fullscreen
 * + mobile touch swipe gestures are driven by our own floating glass controls.
 */
const PdfViewer = ({ file, className = '' }) => {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(1.414); // page h/w; A4 ≈ √2 until measured
  const wrapRef = useRef(null);

  // Touch swipe tracking for mobile gestures
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Responsive container width measurement via ResizeObserver
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    ro.observe(el);
    if (el.clientWidth > 0) {
      setWidth(el.clientWidth);
    }

    return () => ro.disconnect();
  }, []);

  const onPageLoad = (p) => {
    const vp = p.getViewport({ scale: 1 });
    if (vp.width) setRatio(vp.height / vp.width);
  };

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(numPages || 1, p + 1));
  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.();
  };

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe > 35px & more horizontal than vertical
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      ref={wrapRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative bg-white select-none ${className}`}
      style={width > 0 ? { minHeight: Math.round(width * ratio) } : { minHeight: '400px' }}
    >
      {/* Page canvas — fills the frame, centered */}
      <div className="absolute inset-0 overflow-hidden flex justify-center items-center">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="h-full w-full bg-white" />}
          error={<div className="h-full w-full bg-white flex items-center justify-center text-sm text-gray-400">Failed to load PDF</div>}
          className="w-full flex justify-center"
        >
          {width > 0 && (
            <Page
              pageNumber={page}
              width={width}
              onLoadSuccess={onPageLoad}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={<div className="h-full w-full bg-white" />}
            />
          )}
        </Document>
      </div>

      {/* Floating glass controls — responsive & touch friendly */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 sm:gap-3 z-20 px-4">
        <button
          type="button"
          aria-label="Previous page"
          onClick={prev}
          disabled={page <= 1}
          className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 backdrop-blur-xl text-black/80 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white active:scale-95 disabled:opacity-30 disabled:cursor-default transition-all"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        {/* Page counter pill */}
        <div className="pointer-events-auto flex items-center justify-center px-3.5 h-10 sm:h-11 rounded-full border border-white/80 bg-white/70 backdrop-blur-xl text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-xs sm:text-sm font-medium tracking-wide">
          {page} / {numPages || 1}
        </div>

        <button
          type="button"
          aria-label="Next page"
          onClick={next}
          disabled={numPages > 0 && page >= numPages}
          className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 backdrop-blur-xl text-black/80 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white active:scale-95 disabled:opacity-30 disabled:cursor-default transition-all"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          aria-label="Fullscreen"
          onClick={fullscreen}
          className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 backdrop-blur-xl text-black/80 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white active:scale-95 transition-all"
        >
          <Maximize2 size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
