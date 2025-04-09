"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample book content with more realistic page appearance
const pages = [
  {
    content: "This is the first page of our book. Welcome to the interactive book experience!",
    pageNumber: 1,
  },
  {
    content: "On the second page, we continue our journey through this digital book simulation.",
    pageNumber: 2,
  },
  {
    content: "The third page demonstrates how we can create a realistic page turning effect.",
    pageNumber: 3,
  },
  {
    content: "Page four shows how we can navigate through the book with intuitive controls.",
    pageNumber: 4,
  },
  {
    content: "This is the fifth and final page of our sample book. Thanks for reading!",
    pageNumber: 5,
  },
]

export function EnhancedBook() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const bookRef = useRef(null)
  const dragX = useMotionValue(0)
  const rotateY = useTransform(dragX, [-300, 0, 300], [-180, 0, 180])
  const pageOpacity = useTransform(rotateY, [-180, -90, -60, 0, 60, 90, 180], [0, 0.2, 0.6, 1, 0.6, 0.2, 0])

  const goToNextPage = () => {
    if (currentPage < pages.length - 1 && !isAnimating) {
      setIsAnimating(true)
      setCurrentPage(currentPage + 1)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true)
      setCurrentPage(currentPage - 1)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextPage()
      } else if (e.key === "ArrowLeft") {
        goToPreviousPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isAnimating])

  return (
    <div className="flex flex-col items-center">
      <div
        ref={bookRef}
        className="relative w-full max-w-md aspect-[3/4] bg-stone-800 rounded-lg shadow-2xl overflow-hidden book-container"
      >
        {/* Book cover and spine */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 z-0"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 shadow-inner z-10"></div>

        {/* Book pages */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-4 bg-stone-100 rounded shadow-inner z-20 overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentPage}
                initial={{
                  rotateY: currentPage > 0 ? 90 : -90,
                  x: currentPage > 0 ? 100 : -100,
                  opacity: 0,
                  zIndex: 30,
                }}
                animate={{
                  rotateY: 0,
                  x: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.6,
                  },
                }}
                exit={{
                  rotateY: currentPage > 0 ? -90 : 90,
                  x: currentPage > 0 ? -100 : 100,
                  opacity: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.6,
                  },
                }}
                drag="x"
                dragConstraints={bookRef}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100 && currentPage > 0) {
                    goToPreviousPage()
                  } else if (info.offset.x < -100 && currentPage < pages.length - 1) {
                    goToNextPage()
                  }
                }}
                style={{
                  x: dragX,
                  rotateY,
                  opacity: pageOpacity,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                }}
                className="absolute inset-0 bg-stone-50 p-8 flex flex-col"
              >
                {/* Page content */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="max-w-xs">
                    <p className="text-lg leading-relaxed">{pages[currentPage].content}</p>
                  </div>
                </div>

                {/* Page number */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Page {pages[currentPage].pageNumber} of {pages.length}
                </div>

                {/* Page fold effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 bottom-0 w-4 left-0 bg-gradient-to-r from-stone-200/50 to-transparent"></div>
                  <div className="absolute top-0 bottom-0 w-1 right-0 bg-gradient-to-l from-stone-300/30 to-transparent"></div>
                  <div className="absolute left-0 right-0 h-4 top-0 bg-gradient-to-b from-stone-200/50 to-transparent"></div>
                  <div className="absolute left-0 right-0 h-4 bottom-0 bg-gradient-to-t from-stone-200/50 to-transparent"></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 0 || isAnimating}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1 || isAnimating}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-4">Tip: You can also swipe or use arrow keys to turn pages</p>
    </div>
  )
}

