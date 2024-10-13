import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { BboxData } from '../types'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// Set the CMap URL for non-Latin characters
const cMapUrl = 'https://unpkg.com/pdfjs-dist/cmaps/';
const cMapPacked = true;

interface PDFViewerProps {
    file: File
    selectedBbox: BboxData | null
    pageNumber: number
    onPageChange: (newPage: number) => void
    numPages: number
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, selectedBbox, pageNumber, onPageChange, numPages }) => {
    const [pageWidth, setPageWidth] = useState<number>(0)
    const [pageHeight, setPageHeight] = useState<number>(0)
    const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const pageRef = useRef<HTMLDivElement>(null)

    // Memoize the options object to prevent unnecessary re-renders
    const options = useMemo(() => ({
        cMapUrl,
        cMapPacked,
        standardFontDataUrl: 'https://unpkg.com/pdfjs-dist/standard_fonts/'
    }), [])

    const onDocumentLoadSuccess = useCallback(({ numPages: loadedPages }: { numPages: number }) => {
        onPageChange(1) // Reset to first page when a new document is loaded
        if (loadedPages !== numPages) {
            onPageChange(loadedPages) // Update the number of pages in the parent component
        }
    }, [onPageChange, numPages])

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
            console.log(x0, y0, x1, y1)

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
                    onLoadError={(error: Error) => console.error('Error loading PDF:', error)}
                    options={options}
                >
                    <div ref={pageRef} style={{ position: 'relative' }}>
                        <Page
                            key={`page_${pageNumber}`}
                            pageNumber={pageNumber}
                            renderAnnotationLayer={false}
                            renderTextLayer={true}
                            width={pageWidth}
                            onLoadSuccess={onPageLoadSuccess}
                            onRenderError={(error: Error) => console.error('Error rendering page:', error)}
                        />
                        {renderHighlight()}
                    </div>
                </Document>
            </div>
        </div>
    )
}

export default PDFViewer