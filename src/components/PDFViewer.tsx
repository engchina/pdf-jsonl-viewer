import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { BboxData } from '../types'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  file: File
  selectedBbox: BboxData | null
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, selectedBbox }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const [pageHeight, setPageHeight] = useState<number>(0)
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }, [])

  useEffect(() => {
    if (selectedBbox) {
      setPageNumber(selectedBbox.page)
    }
  }, [selectedBbox])

  // Update page dimensions based on container size
  useEffect(() => {
    const updatePageDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        setPageWidth(containerWidth - 32) // Subtract padding
      }
    }

    updatePageDimensions()
    window.addEventListener('resize', updatePageDimensions)
    return () => window.removeEventListener('resize', updatePageDimensions)
  }, [])

  // Store page height and PDF dimensions after render
  const onPageLoadSuccess = useCallback((page: any) => {
    const viewport = page.getViewport({ scale: 1 })
    setPdfDimensions({ width: viewport.width, height: viewport.height })
    setPageHeight(page.height * (pageWidth / page.width))
  }, [pageWidth])

  // Scroll to highlighted text
  useEffect(() => {
    if (selectedBbox && containerRef.current && pageHeight > 0) {
      const [, y0] = selectedBbox.text_location.location[0]
      // Convert PDF coordinates to screen coordinates
      const screenY = pageHeight - (y0 * pageHeight)
      containerRef.current.scrollTop = screenY - 100 // Scroll with offset
    }
  }, [selectedBbox, pageHeight])

  const renderHighlight = useCallback(() => {
    if (selectedBbox && selectedBbox.page === pageNumber && pageHeight > 0 && pdfDimensions) {
      const [x0, y0, x1, y1] = selectedBbox.text_location.location[0]
      console.log(x0)
      console.log(y0)
      console.log(x1)
      console.log(y1)

      // Convert PDF coordinates to screen coordinates
      // PDF coordinates start from bottom-left, we need to convert to top-left
      const scale = pageWidth / pdfDimensions.width

      const screenX = x0 * scale
      const screenY = pageHeight - (y0 * (pageHeight / pdfDimensions.height))
      const width = (x1 - x0) * scale
      const height = (y0 - y1) * (pageHeight / pdfDimensions.height)

      return (
        <div
          style={{
            position: 'absolute',
            left: `${screenX}px`,
            top: `${screenY}px`,
            width: `${width}px`,
            height: `${height}px`,
            border: '2px solid rgba(255, 0, 0, 0.5)',
            backgroundColor: 'rgba(255, 255, 0, 0.2)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )
    }
    return null
  }, [selectedBbox, pageNumber, pageWidth, pageHeight, pdfDimensions])

  return (
    <div
      className="pdf-viewer w-full h-full min-h-0 flex flex-col"
      ref={containerRef}
    >
      <div className="flex-1 overflow-auto p-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
          <div ref={pageRef} style={{ position: 'relative' }}>
            <Page
              key={`page_${pageNumber}`}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              width={pageWidth}
              onLoadSuccess={onPageLoadSuccess}
              error={(error) => <div>Error loading page: {error.message}</div>}
              onRenderError={(error) => console.error('Error rendering page:', error)}
            />
            {renderHighlight()}
          </div>
        </Document>
      </div>
      <div className="flex justify-between items-center p-4 border-t">
        <button
          onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages || pageNumber))}
          disabled={pageNumber >= (numPages || 0)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default PDFViewer