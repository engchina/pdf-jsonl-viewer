import React, {useState} from 'react'
import {FileText, Upload} from 'lucide-react'
import PDFJSONLViewer from './components/PDFJSONLViewer'
import ErrorBoundary from './components/ErrorBoundary'
import {BboxData} from './types'

function App() {
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [jsonlFile, setJsonlFile] = useState<File | null>(null)
    const [jsonlData, setJsonlData] = useState<BboxData[]>([])
    const [isBothUploaded, setIsBothUploaded] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)

    const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPdfFile(event.target.files[0])
            setIsBothUploaded(!!jsonlFile)
            setPageNumber(1)
            // 重置文件输入的值，允许用户重新选择相同文件
            event.target.value = ''
        }
    }

    const handleJsonlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0]
            setJsonlFile(file)
            setIsBothUploaded(!!pdfFile)
            setPageNumber(1)

            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                const lines = content.split('\n').filter(line => line.trim() !== '')
                lines.forEach((line, index) => {
                    try {
                        const parsedLine = JSON.parse(line)
                        console.log(`Line ${index + 1}:`, parsedLine)
                        if (!parsedLine.detected_type) {
                            console.warn(`Line ${index + 1} is missing detected_type`)
                        }
                    } catch (error) {
                        console.error(`Error parsing line ${index + 1}:`, error)
                    }
                })

                const parsedData = lines.map(line => JSON.parse(line))
                console.table(parsedData)
                setJsonlData(parsedData)
            }
            reader.readAsText(file)

            // 重置文件输入的值，允许用户重新选择相同文件
            event.target.value = ''
        }
    }

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">PDF Viewer with Bbox Highlighting</h1>
            <div className="flex justify-center space-x-4 mb-8">
                <label
                    className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                    <Upload className="mr-2"/>
                    Upload PDF
                    <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden"/>
                </label>
                <label
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
                    <FileText className="mr-2"/>
                    Upload JSONL
                    <input type="file" accept=".jsonl" onChange={handleJsonlUpload} className="hidden"/>
                </label>
            </div>
            {isBothUploaded && (
                <ErrorBoundary>
                    <PDFJSONLViewer
                        pdfFile={pdfFile!}
                        jsonlData={jsonlData}
                        pageNumber={pageNumber}
                        onPageChange={setPageNumber}
                    />
                </ErrorBoundary>
            )}
        </div>
    )
}

export default App