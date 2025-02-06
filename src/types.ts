export interface BboxData {
    id: string
    page: number
    seq_no: number
    sentence: string
    type: string
    text_location: {
        location: [number, number, number, number][]
    };
    detected_type: string
}