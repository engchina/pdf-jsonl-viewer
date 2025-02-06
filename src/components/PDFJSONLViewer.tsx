import React, {useEffect, useState} from 'react'
import PDFViewer from './PDFViewer'
import JSONLViewer from './JSONLViewer'
import {BboxData} from '../types'

interface PDFJSONLViewerProps {
    pdfFile: File
    jsonlData: BboxData[]
    pageNumber: number
    onPageChange: (newPage: number) => void
}

const PDFJSONLViewer: React.FC<PDFJSONLViewerProps> = ({pdfFile, jsonlData, pageNumber, onPageChange}) => {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [selectedBbox, setSelectedBbox] = useState<BboxData | null>(null)
    const [goToPage, setGoToPage] = useState('')
    const [pdfPageHeight, setPdfPageHeight] = useState(0)

    useEffect(() => {
        // Set the initial number of pages when the component mounts
        if (jsonlData.length > 0) {
            const maxPage = Math.max(...jsonlData.map(item => item.page))
            setNumPages(maxPage)
        }
    }, [jsonlData])


    const handleSelectBbox = (bbox: BboxData) => {
        setSelectedBbox(bbox)
        onPageChange(bbox.page)
    }

    const handleGoToPage = (e: React.FormEvent) => {
        e.preventDefault()
        const page = parseInt(goToPage, 10)
        if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
            onPageChange(page)
            setGoToPage(String(page))
        }
    }

    const handlePageHeightChange = (height: number) => {
        setPdfPageHeight(height)
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center p-4 border-t">
                <button
                    onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <form onSubmit={handleGoToPage} className="flex items-center">
                    <input
                        type="number"
                        value={goToPage || String(pageNumber)}
                        onChange={(e) => setGoToPage(e.target.value)}
                        min="1"
                        max={numPages || 1}
                        className="w-32 px-2 py-1 border rounded mr-2"
                        placeholder="Page"
                    />
                    <button
                        type="submit"
                        className="px-8 py-2 bg-green-500 text-white rounded"
                    >
                        Go
                    </button>
                </form>
                <button
                    onClick={() => onPageChange(Math.min(pageNumber + 1, numPages || pageNumber))}
                    disabled={pageNumber >= (numPages || 0)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
            {/*<div className="flex-1 flex">*/}
            <div className="flex">
                <div className="w-1/2 p-4">
                    <PDFViewer
                        file={pdfFile}
                        selectedBbox={selectedBbox}
                        pageNumber={pageNumber}
                        onPageChange={onPageChange}
                        numPages={numPages || 0}
                        onPageHeightChange={handlePageHeightChange}
                    />
                </div>
                <div className="w-1/2 p-4">
                    <JSONLViewer
                        data={jsonlData}
                        onSelectBbox={handleSelectBbox}
                        selectedBbox={selectedBbox}
                        currentPage={pageNumber}
                        height={pdfPageHeight}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center p-4 border-t">
                <button
                    onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <form onSubmit={handleGoToPage} className="flex items-center">
                    <input
                        type="number"
                        value={goToPage || String(pageNumber)}
                        onChange={(e) => setGoToPage(e.target.value)}
                        min="1"
                        max={numPages || 1}
                        className="w-32 px-2 py-1 border rounded mr-2"
                        placeholder="Page"
                    />
                    <button
                        type="submit"
                        className="px-8 py-2 bg-green-500 text-white rounded"
                    >
                        Go
                    </button>
                </form>
                <button
                    onClick={() => onPageChange(Math.min(pageNumber + 1, numPages || pageNumber))}
                    disabled={pageNumber >= (numPages || 0)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default PDFJSONLViewer