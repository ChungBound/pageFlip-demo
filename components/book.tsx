"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample book content - you can replace with your own
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

export function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setDirection(1)
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setDirection(-1)
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-lg shadow-2xl overflow-hidden book-container">
        {/* Book spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 bg-stone-200 shadow-inner z-10"></div>

        {/* Book pages */}
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{
                x: direction > 0 ? "100%" : "-100%",
                rotateY: direction > 0 ? 90 : -90,
                opacity: 0,
              }}
              animate={{
                x: 0,
                rotateY: 0,
                opacity: 1,
                transition: {
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                },
              }}
              exit={{
                x: direction > 0 ? "-100%" : "100%",
                rotateY: direction > 0 ? -90 : 90,
                opacity: 0,
                transition: {
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                },
              }}
              className="absolute inset-0 bg-white p-8 flex flex-col"
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                transformOrigin: direction > 0 ? "left center" : "right center",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg">{pages[currentPage].content}</p>
              </div>
              <div className="text-center text-sm text-gray-500 mt-4">
                Page {pages[currentPage].pageNumber} of {pages.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

