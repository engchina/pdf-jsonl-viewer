import React, { useMemo } from 'react'
import { BboxData } from '../types'

interface JSONLViewerProps {
  data: BboxData[]
  onSelectBbox: (bbox: BboxData) => void
  selectedBbox: BboxData | null
  currentPage: number
}

const JSONLViewer: React.FC<JSONLViewerProps> = ({ data, onSelectBbox, selectedBbox, currentPage }) => {
  const filteredData = useMemo(() => data.filter(item => item.page === currentPage), [data, currentPage])

  return (
      <div className="jsonl-viewer overflow-auto h-[1200px] border border-gray-300 rounded">
        <table className="w-full">
          <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-2">Page No</th>
            <th className="px-2 py-2">Seq No</th>
            <th className="px-4 py-2">Sentence</th>
            <th className="px-2 py-2"> Type</th>
            <th className="px-2 py-2">Detected Type</th>
          </tr>
          </thead>
          <tbody>
          {filteredData.map((item) => (
              <JSONLRow
                  key={item.id}
                  item={item}
                  isSelected={selectedBbox?.id === item.id}
                  onSelect={onSelectBbox}
              />
          ))}
          </tbody>
        </table>
      </div>
  )
}

interface JSONLRowProps {
  item: BboxData
  isSelected: boolean
  onSelect: (bbox: BboxData) => void
}

const JSONLRow: React.FC<JSONLRowProps> = React.memo(({ item, isSelected, onSelect }) => {
  return (
      <tr
          className={`cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-yellow-200' : ''}`}
          onClick={() => onSelect(item)}
      >
        <td className="border px-2 py-2">{item.page}</td>
        <td className="border px-2 py-2">{item.seq_no}</td>
        <td className="border px-4 py-2">{item.sentence}</td>
        <td className="border px-2 py-2">{item.type}</td>
        <td className="border px-2 py-2">{item.detected_type}</td>
      </tr>
  )
})

export default JSONLViewer