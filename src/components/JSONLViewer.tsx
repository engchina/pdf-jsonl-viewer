import React from 'react'
import { BboxData } from '../types'

interface JSONLViewerProps {
  data: BboxData[]
  onSelectBbox: (bbox: BboxData) => void
  selectedBbox: BboxData | null
}

const JSONLViewer: React.FC<JSONLViewerProps> = ({ data, onSelectBbox, selectedBbox }) => {
  console.log('Data in JSONLViewer:', data)
  return (
    <div className="jsonl-viewer overflow-auto h-[600px] border border-gray-300 rounded">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Page No</th>
            <th className="px-4 py-2">Seq No</th>
            <th className="px-4 py-2">Sentence</th>
            <th className="px-4 py-2">Detected Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className={`cursor-pointer hover:bg-gray-100 ${selectedBbox?.id === item.id ? 'bg-yellow-200' : ''}`}
              onClick={() => onSelectBbox(item)}
            >
              <td className="border px-4 py-2">{item.page}</td>
              <td className="border px-4 py-2">{item.seq_no}</td>
              <td className="border px-4 py-2">{item.sentence}</td>
              <td className="border px-4 py-2">{item.detected_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JSONLViewer