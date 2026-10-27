import { useEffect, useRef, useState } from 'react'

export default function usePersistedState(adapter) {
  const adapterRef = useRef(adapter)
  adapterRef.current = adapter

  const [state, setState] = useState(() => adapter.load())
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    adapterRef.current.save(state)
  }, [state])

  return [state, setState]
}
