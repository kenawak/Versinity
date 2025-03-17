"use client"

import { useState } from "react"

interface DebugPanelProps {
  enabled?: boolean
  state: Record<string, any>
}

export function DebugPanel({ enabled = false, state }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false)

  if (!enabled) return null

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 p-2 bg-black text-white rounded-full"
      >
        {isVisible ? "Hide" : "Debug"}
      </button>

      {isVisible && (
        <div className="fixed bottom-16 left-4 z-50 p-4 bg-black/80 text-white rounded-lg w-80 max-h-80 overflow-auto">
          <h3 className="text-sm font-bold mb-2">App State</h3>
          <div className="text-xs space-y-1">
            {Object.entries(state).map(([key, value]) => (
              <div key={key} className="border-b border-white/20 pb-1">
                <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

