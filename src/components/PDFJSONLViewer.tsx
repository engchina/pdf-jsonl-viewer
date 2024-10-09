import React, { useState, useEffect } from 'react'
import PDFViewer from './PDFViewer'
import JSONLViewer from './JSONLViewer'
import { BboxData } from '../types'

interface PDFJSONLViewerProps {
    pdfFile: File
    jsonlData: BboxData[]
}

const PDFJSONLViewer: React.FC<PDFJSONLViewerProps> = ({ pdfFile, jsonlData }) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number | null>(null)
    const [selectedBbox, setSelectedBbox] = useState<BboxData | null>(null)

    useEffect(() => {
        // Set the initial number of pages when the component mounts
        if (jsonlData.length > 0) {
            const maxPage = Math.max(...jsonlData.map(item => item.page))
            setNumPages(maxPage)
        }
    }, [jsonlData])

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage)
    }

    const handleSelectBbox = (bbox: BboxData) => {
        setSelectedBbox(bbox)
        setPageNumber(bbox.page)
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex">
                <div className="w-1/2 p-4">
                    <PDFViewer
                        file={pdfFile}
                        selectedBbox={selectedBbox}
                        pageNumber={pageNumber}
                        onPageChange={handlePageChange}
                        numPages={numPages || 0}
                    />
                </div>
                <div className="w-1/2 p-4">
                    <JSONLViewer
                        data={jsonlData}
                        onSelectBbox={handleSelectBbox}
                        selectedBbox={selectedBbox}
                        currentPage={pageNumber}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center p-4 border-t">
                <button
                    onClick={() => handlePageChange(Math.max(pageNumber - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button
                    onClick={() => handlePageChange(Math.min(pageNumber + 1, numPages || pageNumber))}
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