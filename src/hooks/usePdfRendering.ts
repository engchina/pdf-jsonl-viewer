import {useCallback, useEffect, useRef, useState} from 'react'

export const usePdfRendering = () => {
    const [pageNumber, setPageNumberState] = useState(1)
    const pageNumberRef = useRef(pageNumber)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMountedRef = useRef(true)

    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const setPageNumber = useCallback((newPageNumber: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
                setPageNumberState(newPageNumber)
                pageNumberRef.current = newPageNumber
            }
        }, 300)
    }, [])

    const renderPage = useCallback((pageComponent: React.ReactNode) => {
        return {
            key: pageNumberRef.current,
            children: pageComponent
        }
    }, [])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    console.log('usePdfRendering pageNumber: ', pageNumber)
    return {pageNumber, setPageNumber, renderPage}
}