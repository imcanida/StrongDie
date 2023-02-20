import { useRef, useEffect } from 'react'

export const useOnFirstLoad = (event: () => void) => {
  const dataFetchedRef = useRef(false)
  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    event()
  }, [event])
}
