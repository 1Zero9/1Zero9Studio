'use client'

import { useEffect, useRef } from 'react'

const controlKeys = new Set(['Space', 'ArrowUp', 'ArrowLeft', 'ArrowRight'])
const controlLabels = [
  { code: 'ArrowLeft', label: '←', text: 'Slower' },
  { code: 'Space', label: '↑', text: 'Start / Jump' },
  { code: 'ArrowRight', label: '→', text: 'Faster' },
]

export default function ParkRunEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const sendControl = (code: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'parkrun-control', code },
      window.location.origin
    )
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!controlKeys.has(event.code)) return
      event.preventDefault()
      sendControl(event.code)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-50 hidden place-items-center bg-[#86c7e8] p-6 text-center text-[#17324d] max-lg:[@media_(orientation:portrait)]:grid">
        <div className="max-w-sm border-[4px] border-[#17324d] bg-[#fff6cd] p-6 font-mono shadow-[0_8px_0_#17324d]">
          <p className="text-xs font-black uppercase tracking-[0.22em]">Park Run Dash</p>
          <h2 className="mt-3 text-3xl font-black leading-none">Rotate Phone</h2>
          <p className="mt-4 text-sm font-black">This game runs in landscape. Turn your phone sideways, then use the on-screen controls.</p>
        </div>
      </div>

      <div
        className="relative min-h-0 flex-1 overflow-hidden border-[4px] border-[#17324d] bg-[#73c5ef] shadow-[0_8px_0_#17324d] max-lg:[@media_(orientation:landscape)]:fixed max-lg:[@media_(orientation:landscape)]:inset-0 max-lg:[@media_(orientation:landscape)]:z-30 max-lg:[@media_(orientation:landscape)]:border-0 max-lg:[@media_(orientation:landscape)]:shadow-none"
        onPointerDown={() => iframeRef.current?.focus()}
      >
        <iframe
          ref={iframeRef}
          src="/parkrun-dash/index.html"
          title="Park Run Dash game"
          className="block h-[78vh] min-h-[560px] w-full border-0 max-lg:[@media_(orientation:landscape)]:h-[100svh] max-lg:[@media_(orientation:landscape)]:min-h-0"
          allow="fullscreen"
        />
      </div>

      <div className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 mx-auto hidden w-[min(92vw,520px)] items-center justify-between gap-3 px-2 max-lg:[@media_(orientation:landscape)]:flex">
        {controlLabels.map((control) => (
          <button
            key={control.code}
            type="button"
            aria-label={control.text}
            className="min-h-12 flex-1 border-[3px] border-[#17324d] bg-[#ffd85a] font-mono text-2xl font-black text-[#17324d] shadow-[0_4px_0_#17324d] active:translate-y-[3px] active:shadow-[0_1px_0_#17324d]"
            onPointerDown={(event) => {
              event.preventDefault()
              sendControl(control.code)
            }}
          >
            <span aria-hidden="true">{control.label}</span>
            <span className="block text-[9px] uppercase tracking-[0.12em]">{control.text}</span>
          </button>
        ))}
      </div>
    </>
  )
}
