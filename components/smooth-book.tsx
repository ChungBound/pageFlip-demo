"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// 示例书本内容
const pages = [
  {
    content: "这是书本的第一页内容。欢迎来到这个交互式电子书体验！",
    pageNumber: 1,
  },
  {
    content: "这是第二页的内容，我们继续探索这本数字书籍的模拟效果。",
    pageNumber: 2,
  },
  {
    content: "第三页展示了我们如何创建一个逼真的翻页效果。",
    pageNumber: 3,
  },
  {
    content: "第四页展示了如何通过直观的控件在书中导航。",
    pageNumber: 4,
  },
  {
    content: "这是第五页，展示了更多的内容和交互效果。",
    pageNumber: 5,
  },
  {
    content: "第六页继续我们的阅读体验，感谢您的阅读！",
    pageNumber: 6,
  },
  {
    content: "第七页是额外的内容，用于测试多页翻转效果。",
    pageNumber: 7,
  },
  {
    content: "第八页是我们示例书的最后一页。希望您喜欢这个演示！",
    pageNumber: 8,
  },
]

export function SmoothBook() {
  // 当前显示的是哪一页开始（总是显示当前页和下一页）
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0) // -1: 向左, 1: 向右
  const bookRef = useRef(null)

  // 确保我们总是显示偶数页和奇数页的组合
  const normalizedIndex = currentPageIndex % 2 === 0 ? currentPageIndex : currentPageIndex - 1

  // 获取当前显示的两页
  const leftPage = pages[normalizedIndex] || null
  const rightPage = pages[normalizedIndex + 1] || null

  // 获取下一组页面（用于翻页动画）
  const nextLeftPage = pages[normalizedIndex + 2] || null
  const nextRightPage = pages[normalizedIndex + 3] || null

  // 获取上一组页面（用于翻页动画）
  const prevLeftPage = pages[normalizedIndex - 2] || null
  const prevRightPage = pages[normalizedIndex - 1] || null

  const goToNextPage = () => {
    if (normalizedIndex + 2 < pages.length && !isAnimating) {
      setIsAnimating(true)
      setDirection(1)
      setCurrentPageIndex(normalizedIndex + 2)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const goToPreviousPage = () => {
    if (normalizedIndex - 2 >= 0 && !isAnimating) {
      setIsAnimating(true)
      setDirection(-1)
      setCurrentPageIndex(normalizedIndex - 2)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  // 键盘导航
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
  }, [normalizedIndex, isAnimating])

  return (
    <div className="flex flex-col items-center">
      <div
        ref={bookRef}
        className="relative w-full max-w-4xl h-[600px] bg-stone-800 rounded-lg shadow-2xl overflow-hidden book-container"
      >
        {/* 书本封面背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 z-0"></div>

        {/* 书页区域 */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-4 bg-stone-100 rounded shadow-inner z-20 overflow-hidden flex">
            {/* 静态页面 - 当前显示的页面 */}
            <div className="w-full h-full flex">
              {/* 左侧页面 */}
              <div className="w-1/2 h-full bg-stone-50 p-8 flex flex-col border-r border-stone-200 relative">
                {leftPage ? (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="max-w-xs">
                        <p className="text-lg leading-relaxed">{leftPage.content}</p>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">页码 {leftPage.pageNumber}</div>

                    {/* 页面折痕效果 */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-l from-stone-200/50 to-transparent"></div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-stone-400">封面</div>
                )}
              </div>

              {/* 右侧页面 */}
              <div className="w-1/2 h-full bg-stone-50 p-8 flex flex-col border-l border-stone-200 relative">
                {rightPage ? (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="max-w-xs">
                        <p className="text-lg leading-relaxed">{rightPage.content}</p>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">页码 {rightPage.pageNumber}</div>

                    {/* 页面折痕效果 */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-200/50 to-transparent"></div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-stone-400">封底</div>
                )}
              </div>
            </div>

            {/* 动画翻页层 */}
            <AnimatePresence>
              {isAnimating && (
                <>
                  {/* 翻页时的遮罩层 - 确保原始内容在翻页时不可见 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-stone-50 z-10"
                  />

                  {/* 翻页动画 */}
                  <motion.div
                    initial={{
                      rotateY: direction > 0 ? 0 : 180,
                      x: direction > 0 ? "25%" : "75%",
                      zIndex: 20,
                    }}
                    animate={{
                      rotateY: direction > 0 ? -180 : 0,
                      x: direction > 0 ? "75%" : "25%",
                      transition: {
                        duration: 0.6,
                        ease: [0.3, 0.0, 0.2, 1], // 更平滑的缓动函数
                      },
                    }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transformOrigin: direction > 0 ? "left center" : "right center",
                    }}
                    className="book-page"
                  >
                    {/* 正面 */}
                    <div
                      className="absolute inset-0 flex bg-stone-50"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {direction > 0 ? (
                        // 向前翻页时
                        <>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {rightPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{rightPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {rightPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {nextLeftPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{nextLeftPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {nextLeftPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        // 向后翻页时
                        <>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {prevRightPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{prevRightPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {prevRightPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {leftPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{leftPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">页码 {leftPage.pageNumber}</div>
                              </>
                            )}
                          </div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow:
                            direction > 0 ? "inset -5px 0 10px rgba(0,0,0,0.1)" : "inset 5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>

                    {/* 背面 */}
                    <div
                      className="absolute inset-0 flex bg-stone-50"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {direction > 0 ? (
                        // 向前翻页时
                        <>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {nextLeftPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{nextLeftPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {nextLeftPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {nextRightPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{nextRightPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {nextRightPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        // 向后翻页时
                        <>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {prevLeftPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{prevLeftPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {prevLeftPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="w-1/2 h-full p-8 flex flex-col justify-center items-center">
                            {prevRightPage && (
                              <>
                                <div className="max-w-xs">
                                  <p className="text-lg leading-relaxed">{prevRightPage.content}</p>
                                </div>
                                <div className="text-center text-sm text-gray-500 mt-4">
                                  页码 {prevRightPage.pageNumber}
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow:
                            direction > 0 ? "inset 5px 0 10px rgba(0,0,0,0.1)" : "inset -5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 导航控件 */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={normalizedIndex === 0 || isAnimating}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          上一页
        </Button>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={normalizedIndex + 2 >= pages.length || isAnimating}
          className="flex items-center gap-2"
        >
          下一页
          <ChevronRight size={16} />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-4">提示: 您可以使用左右箭头键翻页</p>
    </div>
  )
}

