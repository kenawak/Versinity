"use client"

import { useEffect } from "react"

interface FontLoaderProps {
  fontFamily: string
}

export function FontLoader({ fontFamily }: FontLoaderProps) {
  useEffect(() => {
    // Skip loading default fonts that are already loaded via next/font
    if (fontFamily === "Merriweather" || fontFamily === "Inter") {
      return
    }

    // Check if this font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, "+")}"]`)
    if (existingLink) {
      return
    }

    // Load the font
    const link = document.createElement("link")
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@300;400;700&display=swap`
    link.rel = "stylesheet"
    document.head.appendChild(link)

    // Cleanup
    return () => {
      // We don't remove the link to avoid flashing if the font is used elsewhere
    }
  }, [fontFamily])

  // This component doesn't render anything
  return null
}

