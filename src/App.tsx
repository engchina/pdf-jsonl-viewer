import React, { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import PDFViewer from './components/PDFViewer'
import JSONLViewer from './components/JSONLViewer'
import ErrorBoundary from './components/ErrorBoundary'
import { BboxData } from './types'

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [jsonlFile, setJsonlFile] = useState<File | null>(null)
  const [jsonlData, setJsonlData] = useState<BboxData[]>([])
  const [selectedBbox, setSelectedBbox] = useState<BboxData | null>(null)

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0])
    }
  }

  const handleJsonlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setJsonlFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split('\n').filter(line => line.trim() !== '')
        lines.forEach((line, index) => {
          try {
            const parsedLine = JSON.parse(line);
            console.log(`Line ${index + 1}:`, parsedLine);
            if (!parsedLine.detected_type) {
              console.warn(`Line ${index + 1} is missing detected_type`);
            }
          } catch (error) {
            console.error(`Error parsing line ${index + 1}:`, error);
          }
        });

        const parsedData = lines.map(line => JSON.parse(line))
        // console.log('Parsed JSONL data:', parsedData)
        console.table(parsedData)
        setJsonlData(parsedData)
      }
      reader.readAsText(file)
    }
  }

  // const handleJsonlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0]
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       const content = e.target?.result as string
  //       const lines = content.split('\n').filter(line => line.trim() !== '')
  //       const parsedData = lines.map(line => {
  //         try {
  //           return JSON.parse(line) as BboxData
  //         } catch (error) {
  //           console.error('Error parsing JSON line:', error)
  //           return null
  //         }
  //       }).filter((item): item is BboxData => item !== null)
  //       console.log('Parsed JSONL data:', parsedData)
  //       setJsonlData(parsedData)
  //     }
  //     reader.readAsText(file)
  //   }
  // }

  const handleSelectBbox = (bbox: BboxData) => {
    setSelectedBbox(bbox)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">PDF Viewer with Bbox Highlighting</h1>
      <div className="flex justify-center space-x-4 mb-8">
        <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
          <Upload className="mr-2" />
          Upload PDF
          <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
        </label>
        <label className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
          <FileText className="mr-2" />
          Upload JSONL
          <input type="file" accept=".jsonl" onChange={handleJsonlUpload} className="hidden" />
        </label>
      </div>
      {pdfFile && jsonlFile && (
        <div className="flex space-x-4">
          <div className="w-1/2">
            <ErrorBoundary>
              <PDFViewer file={pdfFile} selectedBbox={selectedBbox} />
            </ErrorBoundary>
          </div>
          <div className="w-1/2">
            <JSONLViewer data={jsonlData} onSelectBbox={handleSelectBbox} selectedBbox={selectedBbox} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App