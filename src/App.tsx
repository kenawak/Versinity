"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart, Share2, Info, ChevronDown, ChevronUp, Moon, Sun, Bookmark, Settings, X } from "lucide-react"
import { cn } from "./lib/utils"
import type { Verse } from "@/types"
import { fetchRandomVerse } from "@/lib/bible-api"
import { fetchBackgroundImage } from "@/lib/unsplash-api"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { DebugPanel } from "@/components/debug-panel"

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [verses, setVerses] = useState<Verse[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [textSize, setTextSize] = useState("medium") // small, medium, large
  const [fontFamily, setFontFamily] = useState(searchParams.get("font") || "Merriweather")
  const [showFontSettings, setShowFontSettings] = useState(false)
  const [showReference, setShowReference] = useState(true)

  // Navigation lock to prevent multiple navigations at once
  const [isNavigating, setIsNavigating] = useState(false)

  // Touch handling
  const touchStartY = useRef(0)
  const mainRef = useRef<HTMLDivElement>(null)

  // Load initial data
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    // Load text size preference
    const savedTextSize = localStorage.getItem("textSize")
    if (savedTextSize) {
      setTextSize(savedTextSize)
    }

    // Load font preference
    const savedFont = localStorage.getItem("fontFamily")
    if (savedFont) {
      setFontFamily(savedFont)
    } else if (searchParams.get("font")) {
      setFontFamily(searchParams.get("font") || "Merriweather")
    }

    // Initial load of verses
    loadInitialVerses()
  }, [searchParams])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating) return

      if (e.key === "ArrowUp") {
        e.preventDefault()
        navigateToVerse("up")
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        navigateToVerse("down")
      } else if (e.key === "Escape") {
        // Close info panel or font settings when Escape is pressed
        if (showInfo) {
          setShowInfo(false)
        } else if (showFontSettings) {
          setShowFontSettings(false)
        }
      } else if (e.key === "i") {
        // Toggle info panel with 'i' key
        toggleInfo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isNavigating, currentIndex, verses.length, showInfo, showFontSettings])

  // Mouse wheel handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating || showFontSettings) return

      if (e.deltaY < 0) {
        // Scroll up
        navigateToVerse("down")
      } else if (e.deltaY > 0) {
        // Scroll down
        navigateToVerse("up")
      }
    }

    window.addEventListener("wheel", handleWheel)
    return () => window.removeEventListener("wheel", handleWheel)
  }, [isNavigating, showFontSettings])

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isNavigating || showFontSettings) return

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchEndY - touchStartY.current

      // Require a minimum swipe distance
      if (Math.abs(deltaY) < 50) return

      if (deltaY < 0) {
        // Swipe up
        navigateToVerse("up")
      } else {
        // Swipe down
        navigateToVerse("down")
      }
    }

    const element = mainRef.current
    if (element) {
      element.addEventListener("touchstart", handleTouchStart)
      element.addEventListener("touchend", handleTouchEnd)

      return () => {
        element.removeEventListener("touchstart", handleTouchStart)
        element.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isNavigating, currentIndex, verses.length, showFontSettings])

  // Save verses to localStorage for the favorites page
  useEffect(() => {
    if (verses.length > 0) {
      localStorage.setItem("verses", JSON.stringify(verses))
    }
  }, [verses])

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  // Save text size preference
  useEffect(() => {
    localStorage.setItem("textSize", textSize)
  }, [textSize])

  // Save font preference
  useEffect(() => {
    localStorage.setItem("fontFamily", fontFamily)

    // Update URL with font parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("font", fontFamily)

    // Update URL without refreshing the page
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ path: url }, "", url)

    // Load the font if it's not one of our default fonts
    if (fontFamily !== "Merriweather" && fontFamily !== "Inter") {
      const link = document.createElement("link")
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@300;400;700&display=swap`
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }
  }, [fontFamily, searchParams])

  const loadInitialVerses = async () => {
    setIsLoading(true)
    try {
      const initialVerses = await Promise.all([loadVerseWithImage(), loadVerseWithImage(), loadVerseWithImage()])
      setVerses(initialVerses.filter(Boolean) as Verse[])
    } catch (error) {
      console.error("Failed to load initial verses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadVerseWithImage = async (): Promise<Verse | null> => {
    try {
      const verse = await fetchRandomVerse()
      const imageUrl = await fetchBackgroundImage()
      return { ...verse, imageUrl }
    } catch (error) {
      console.error("Error loading verse with image:", error)
      return null
    }
  }

  const loadMoreVerses = async () => {
    try {
      const newVerse = await loadVerseWithImage()
      if (newVerse) {
        setVerses((prev) => [...prev, newVerse])
      }
    } catch (error) {
      console.error("Failed to load more verses:", error)
    }
  }

  // Simplified navigation function with lock
  const navigateToVerse = async (direction: "up" | "down") => {
    // Prevent navigation if already navigating
    if (isNavigating) return

    // Set navigating lock
    setIsNavigating(true)

    try {
      if (direction === "up") {
        // Move to next verse
        if (currentIndex < verses.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          // Load more verses when we're at the end
          await loadMoreVerses()
          setCurrentIndex(currentIndex + 1)
        }
      } else if (direction === "down" && currentIndex > 0) {
        // Move to previous verse
        setCurrentIndex(currentIndex - 1)
      }

      // Hide info when changing verses
      setShowInfo(false)
    } finally {
      // Release navigation lock after a delay
      setTimeout(() => {
        setIsNavigating(false)
      }, 500) // 500ms delay to prevent rapid navigation
    }
  }

  const toggleFavorite = (verseId: string) => {
    const newFavorites = favorites.includes(verseId)
      ? favorites.filter((id) => id !== verseId)
      : [...favorites, verseId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const shareVerse = () => {
    if (!verses[currentIndex]) return

    const { text, reference } = verses[currentIndex]
    const verseText = `${text} - ${reference}`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(verseText)
        .then(() => alert("Verse copied to clipboard!"))
        .catch((err) => console.error("Failed to copy verse:", err))
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = verseText
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        alert("Verse copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy verse:", err)
      }

      document.body.removeChild(textArea)
    }
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const cycleTextSize = () => {
    const sizes = ["small", "medium", "large"]
    const currentIndex = sizes.indexOf(textSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setTextSize(sizes[nextIndex])
  }

  const getTextSizeClass = () => {
    switch (textSize) {
      case "small":
        return "text-xl md:text-2xl"
      case "large":
        return "text-3xl md:text-4xl"
      default:
        return "text-2xl md:text-3xl"
    }
  }

  const getCommentaryTextSizeClass = () => {
    switch (textSize) {
      case "small":
        return "text-base md:text-lg"
      case "large":
        return "text-xl md:text-2xl"
      default:
        return "text-lg md:text-xl"
    }
  }

  const toggleFontSettings = () => {
    setShowFontSettings(!showFontSettings)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
        <div className="text-terracotta dark:text-terracotta/80 text-xl">Loading verses...</div>
      </div>
    )
  }

  if (!verses.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
        <div className="text-terracotta dark:text-terracotta/80 text-xl">
          Unable to load verses. Please check your connection and try again.
        </div>
      </div>
    )
  }

  const currentVerse = verses[currentIndex]
  const isFavorite = favorites.includes(currentVerse.id)

  return (
    <main
      ref={mainRef}
      className="min-h-screen bg-cream dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${currentVerse.imageUrl})` }}
        />

        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Settings bar */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={cycleTextSize}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white text-xs font-bold"
            aria-label="Change text size"
          >
            {textSize === "small" ? "A" : textSize === "medium" ? "A+" : "A++"}
          </button>
          <button
            onClick={toggleFontSettings}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Font settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Verse Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div
            className={cn(
              "text-white leading-relaxed max-w-2xl mx-auto transition-all duration-300",
              getTextSizeClass(),
            )}
            style={{ fontFamily: fontFamily }}
          >
            {currentVerse.text}
          </div>

          {showReference && (
            <div className="text-lg text-white/80 mt-4 animate-fadeIn" style={{ fontFamily: fontFamily }}>
              {currentVerse.reference}
            </div>
          )}

          {/* Navigation arrows */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-8">
            {currentIndex > 0 && (
              <button
                onClick={() => !isNavigating && navigateToVerse("down")}
                className={cn(
                  "p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors animate-bounce",
                  isNavigating && "opacity-50 cursor-not-allowed",
                )}
                disabled={isNavigating}
                aria-label="Previous verse"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </button>
            )}
            {currentIndex < verses.length - 1 && (
              <button
                onClick={() => !isNavigating && navigateToVerse("up")}
                className={cn(
                  "p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors animate-bounce",
                  isNavigating && "opacity-50 cursor-not-allowed",
                )}
                disabled={isNavigating}
                aria-label="Next verse"
              >
                <ChevronUp className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            <button
              onClick={() => toggleFavorite(currentVerse.id)}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("w-6 h-6", isFavorite ? "fill-terracotta text-terracotta" : "text-white")} />
            </button>
            <button
              onClick={toggleInfo}
              className={cn(
                "p-3 rounded-full backdrop-blur-sm transition-colors",
                showInfo ? "bg-terracotta/60 hover:bg-terracotta/70" : "bg-white/20 hover:bg-white/30",
              )}
              aria-label="Show verse information"
            >
              <Info className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={shareVerse}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Share verse"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <Link
              to="/favorites"
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="View favorites"
            >
              <Bookmark className="w-6 h-6 text-white" />
            </Link>
          </div>

          {/* Navigation status indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-sans">
            {isNavigating ? (
              <span className="animate-pulse">Navigating...</span>
            ) : (
              <span>Swipe or use arrow keys to navigate</span>
            )}
          </div>
        </div>

        {/* Commentary Section - Bottom Left */}
        {showInfo && currentVerse.commentary && (
  <div className="absolute bottom-20 left-8 max-w-2xl w-full animate-fadeIn">
    <div className="relative">
      <div className="absolute right-0 top-0">
        <button
          onClick={toggleInfo}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Close commentary"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <h3 className="text-xl text-white mb-3" style={{ fontFamily: fontFamily }}>
        Commentary
      </h3>

      <div
        className="text-white/90 leading-relaxed"
        style={{ fontFamily: fontFamily }}
      >
        {currentVerse.commentary}
      </div>
    </div>
  </div>
)}

        {/* Font Settings Panel */}
        {showFontSettings && (
          <FontSettings currentFont={fontFamily} onFontChange={setFontFamily} onClose={toggleFontSettings} />
        )}
      </div>
      <DebugPanel
        enabled={false}
        state={{
          currentIndex,
          versesCount: verses.length,
          isNavigating,
          fontFamily,
          textSize,
        }}
      />
    </main>
  )
}

// Available fonts for the font picker
const availableFonts = [
  "Merriweather",
  "Inter",
  "Roboto",
  "Lora",
  "Playfair Display",
  "Source Serif Pro",
  "Crimson Text",
  "Noto Serif",
  "EB Garamond",
  "Libre Baskerville",
]

interface FontSettingsProps {
  currentFont: string
  onFontChange: (font: string) => void
  onClose: () => void
}

function FontSettings({ currentFont, onFontChange, onClose }: FontSettingsProps) {
  const [customFont, setCustomFont] = useState("")

  const handleCustomFontSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customFont.trim()) {
      onFontChange(customFont.trim())
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 z-30 shadow-xl">
        <h2 className="text-2xl font-serif text-deep-navy dark:text-white mb-4">Font Settings</h2>

        <div className="mb-6">
          <h3 className="text-lg font-sans font-medium text-deep-navy/80 dark:text-white/80 mb-2">Choose a Font</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableFonts.map((font) => (
              <button
                key={font}
                onClick={() => onFontChange(font)}
                className={cn(
                  "p-3 rounded-lg text-left transition-colors",
                  currentFont === font
                    ? "bg-sage-green text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-deep-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
                )}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-sans font-medium text-deep-navy/80 dark:text-white/80 mb-2">Custom Font</h3>
          <form onSubmit={handleCustomFontSubmit} className="flex gap-2">
            <input
              type="text"
              value={customFont}
              onChange={(e) => setCustomFont(e.target.value)}
              placeholder="Enter font name"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-deep-navy dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors"
            >
              Apply
            </button>
          </form>
          <p className="text-xs text-deep-navy/60 dark:text-white/60 mt-2">
            Enter a Google Font name (e.g., "Open Sans", "Montserrat")
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => onFontChange("Merriweather")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-deep-navy dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

