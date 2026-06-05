'use client'

import { useEffect, useRef } from 'react'

const controlKeys = new Set(['Space', 'ArrowUp', 'ArrowLeft', 'ArrowRight'])

export default function ParkRunEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const sendControl = (code: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'parkrun-control', code },
        window.location.origin
      )
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!controlKeys.has(event.code)) return
      event.preventDefault()
      sendControl(event.code)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div
      className="min-h-0 flex-1 overflow-hidden border-[4px] border-[#17324d] bg-[#73c5ef] shadow-[0_8px_0_#17324d]"
      onPointerDown={() => iframeRef.current?.focus()}
    >
      <iframe
        ref={iframeRef}
        src="/parkrun-dash/index.html"
        title="Park Run Dash game"
        className="block h-[78vh] min-h-[560px] w-full border-0"
        allow="fullscreen"
      />
    </div>
  )
}
