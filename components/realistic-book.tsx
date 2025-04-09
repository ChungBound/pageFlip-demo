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

export function RealisticBook() {
  // 当前显示的是哪一页开始（总是显示当前页和下一页）
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0) // -1: 向左, 1: 向右
  const [targetPageIndex, setTargetPageIndex] = useState(0) // 动画结束后要显示的页面索引
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
      setTargetPageIndex(normalizedIndex + 2) // 设置目标页面索引

      // 动画结束后更新当前页面索引
      setTimeout(() => {
        setCurrentPageIndex(targetPageIndex)
        setIsAnimating(false)
      }, 600)
    }
  }

  const goToPreviousPage = () => {
    if (normalizedIndex - 2 >= 0 && !isAnimating) {
      setIsAnimating(true)
      setDirection(-1)
      setTargetPageIndex(normalizedIndex - 2) // 设置目标页面索引

      // 动画结束后更新当前页面索引
      setTimeout(() => {
        setCurrentPageIndex(targetPageIndex)
        setIsAnimating(false)
      }, 600)
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

  // 当目标页面索引变化时，更新当前页面索引
  useEffect(() => {
    if (!isAnimating) {
      setCurrentPageIndex(targetPageIndex)
    }
  }, [targetPageIndex, isAnimating])

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
          <div className="absolute inset-4 bg-stone-100 rounded shadow-inner z-20 overflow-hidden">
            {/* 书脊 - 中间的分隔线 */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-stone-300 z-10"></div>

            {/* 左侧页面 - 静态 */}
            <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-stone-50 p-8 flex flex-col">
              {leftPage ? (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-xs">
                      <p className="text-lg leading-relaxed">{leftPage.content}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-4">页码 {leftPage.pageNumber}</div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400">封面</div>
              )}
            </div>

            {/* 右侧页面 - 静态 */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-stone-50 p-8 flex flex-col">
              {!isAnimating && rightPage ? (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-xs">
                      <p className="text-lg leading-relaxed">{rightPage.content}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-4">页码 {rightPage.pageNumber}</div>
                </>
              ) : !isAnimating ? (
                <div className="flex-1 flex items-center justify-center text-stone-400">封底</div>
              ) : null}
            </div>

            {/* 翻页动画 */}
            <AnimatePresence>
              {isAnimating && direction > 0 && (
                <>
                  {/* 当前右侧页面 - 向左翻转 */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{
                      rotateY: -180,
                      transition: {
                        duration: 0.6,
                        ease: [0.4, 0.0, 0.2, 1],
                      },
                    }}
                    exit={{ rotateY: -180 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: "50%",
                      transformStyle: "preserve-3d",
                      transformOrigin: "left center",
                      zIndex: 30,
                    }}
                  >
                    {/* 正面 - 当前右侧页面 */}
                    <div
                      className="absolute inset-0 bg-stone-50 p-8 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {rightPage && (
                        <>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-xs">
                              <p className="text-lg leading-relaxed">{rightPage.content}</p>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-4">页码 {rightPage.pageNumber}</div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset -5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>

                    {/* 背面 - 下一组左侧页面 */}
                    <div
                      className="absolute inset-0 bg-stone-50 p-8 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {nextLeftPage && (
                        <>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-xs">
                              <p className="text-lg leading-relaxed">{nextLeftPage.content}</p>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-4">页码 {nextLeftPage.pageNumber}</div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset 5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* 下一组右侧页面 - 静态显示 */}
                  <div
                    className="absolute top-0 right-0 bottom-0 w-1/2 bg-stone-50 p-8 flex flex-col"
                    style={{ zIndex: 20 }}
                  >
                    {nextRightPage && (
                      <>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="max-w-xs">
                            <p className="text-lg leading-relaxed">{nextRightPage.content}</p>
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-500 mt-4">页码 {nextRightPage.pageNumber}</div>
                      </>
                    )}
                  </div>
                </>
              )}

              {isAnimating && direction < 0 && (
                <>
                  {/* 上一组右侧页面 - 向右翻转 */}
                  <motion.div
                    initial={{ rotateY: -180 }}
                    animate={{
                      rotateY: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.4, 0.0, 0.2, 1],
                      },
                    }}
                    exit={{ rotateY: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: "50%",
                      transformStyle: "preserve-3d",
                      transformOrigin: "right center",
                      zIndex: 30,
                    }}
                  >
                    {/* 正面 - 上一组右侧页面 */}
                    <div
                      className="absolute inset-0 bg-stone-50 p-8 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {prevRightPage && (
                        <>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-xs">
                              <p className="text-lg leading-relaxed">{prevRightPage.content}</p>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-4">页码 {prevRightPage.pageNumber}</div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset 5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>

                    {/* 背面 - 当前左侧页面 */}
                    <div
                      className="absolute inset-0 bg-stone-50 p-8 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {leftPage && (
                        <>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-xs">
                              <p className="text-lg leading-relaxed">{leftPage.content}</p>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-4">页码 {leftPage.pageNumber}</div>
                        </>
                      )}

                      {/* 页面阴影 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset -5px 0 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* 上一组左侧页面 - 静态显示 */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-1/2 bg-stone-50 p-8 flex flex-col"
                    style={{ zIndex: 20 }}
                  >
                    {prevLeftPage && (
                      <>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="max-w-xs">
                            <p className="text-lg leading-relaxed">{prevLeftPage.content}</p>
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-500 mt-4">页码 {prevLeftPage.pageNumber}</div>
                      </>
                    )}
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* 翻页时的动态阴影效果 */}
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.3 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.3 },
                  }}
                  className="absolute inset-0 pointer-events-none z-40"
                >
                  <div
                    className="absolute"
                    style={{
                      width: "40px",
                      height: "100%",
                      left: direction > 0 ? "calc(50% - 20px)" : "calc(50% - 20px)",
                      background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)",
                      filter: "blur(4px)",
                    }}
                  />
                </motion.div>
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

      {/* 调试信息 */}
      <div className="text-xs text-muted-foreground mt-2">
        当前页: {normalizedIndex + 1}/{normalizedIndex + 2} |
        {isAnimating ? (direction > 0 ? " 正在翻到下一页" : " 正在翻到上一页") : " 静止"}
      </div>
    </div>
  )
}

