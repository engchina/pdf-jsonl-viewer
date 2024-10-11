import React, {useMemo} from 'react'
import {BboxData} from '../types'
import DOMPurify from 'dompurify';


interface JSONLViewerProps {
    data: BboxData[]
    onSelectBbox: (bbox: BboxData) => void
    selectedBbox: BboxData | null
    currentPage: number
}

const JSONLViewer: React.FC<JSONLViewerProps> = ({data, onSelectBbox, selectedBbox, currentPage}) => {
    const filteredData = useMemo(() => data.filter(item => item.page === currentPage), [data, currentPage])

    return (
        <div className="jsonl-viewer overflow-auto h-[800px] border border-gray-300 rounded">
            <table className="w-full">
                <thead>
                <tr className="bg-gray-100">
                    <th className="w-1/8 px-2 py-2">Page No</th>
                    <th className="w-1/8 px-2 py-2">Seq No</th>
                    <th className="w-4/8 px-2 py-2">Sentence</th>
                    <th className="w-1/8 px-2 py-2">Detected Type</th>
                    <th className="w-1/8 px-2 py-2">Type</th>
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

const JSONLRow: React.FC<JSONLRowProps> = React.memo(({item, isSelected, onSelect}) => {
    return (
        <tr
            className={`cursor-pointer ${isSelected ? 'bg-yellow-200 hover:bg-yellow-200' : 'hover:bg-gray-100'}`}
            onClick={() => onSelect(item)}
        >
            <td className="border w-1/8 px-2 py-2">{item.page}</td>
            <td className="border w-1/8 px-2 py-2">{item.seq_no}</td>
            <td
                className="border w-4/8 px-2 py-2"
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.sentence)}}
            />
            <td className="border w-4/8 px-2 py-2">{item.detected_type}</td>
            <td className="border w-1/8 px-2 py-2">{item.type}</td>
        </tr>
    )
})

export default JSONLViewer