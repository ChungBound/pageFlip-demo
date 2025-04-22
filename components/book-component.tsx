"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// 示例书本内容
const pages = [
  {
    content:
      "This is the first page of the book. Welcome to this interactive e-book experience! This realistic page-turning effect allows you to feel the reading experience of a physical book.",
    pageNumber: 1,
  },
  {
    content:
      "This is the second page, where we continue to explore the simulation effects of this digital book. Now each line can accommodate more text, just like a real book, making the reading experience more comfortable.",
    pageNumber: 2,
  },
  {
    content:
      "The third page demonstrates how we create a realistic page-turning effect. Through carefully designed animations and shadow effects, we can simulate the natural feel and visual effects of paper turning.",
    pageNumber: 3,
  },
  {
    content:
      "The fourth page shows how to navigate through the book using intuitive controls. You can use the buttons at the bottom of the screen or the left and right arrow keys on your keyboard to turn pages, just as simple and intuitive as reading a real book.",
    pageNumber: 4,
  },
  {
    content:
      "This is the fifth page, showcasing more content and interactive effects. The page width is now closer to the proportions of a real book, with each line accommodating more text, making the reading experience more natural and comfortable.",
    pageNumber: 5,
  },
  {
    content:
      "The sixth page continues our reading experience. Thank you for reading! The page width has been adjusted to a more reasonable size, with more beautiful text layout and a more comfortable, natural reading experience.",
    pageNumber: 6,
  },
  {
    content:
      "The seventh page contains additional content for testing multi-page turning effects. We can see that whether turning pages forward or backward, the animation effects are very smooth and natural, just like flipping through a real book.",
    pageNumber: 7,
  },
  {
    content:
      "The eighth page is the last page of our sample book. We hope you enjoy this demonstration! This e-book page-turning effect can be applied to various digital reading scenarios, providing users with a more immersive reading experience.",
    pageNumber: 8,
  },
]

export type BookMode = "manual" | "auto-left" | "auto-right"

interface BookComponentProps {
  mode: BookMode
  autoTurnInterval?: number // 自动翻页间隔，单位毫秒
  showControls?: boolean // 是否显示控制按钮
  customPages?: Array<{ content: string; pageNumber: number }> // 可选的自定义页面内容
}

export function BookComponent({
  mode = "manual",
  autoTurnInterval = 2000,
  showControls = true,
  customPages,
}: BookComponentProps) {
  // 使用自定义页面内容或默认页面内容
  const bookPages = customPages || pages

  // 状态管理
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0) // -1: 向左, 1: 向右
  const bookRef = useRef(null)

  // 确保我们总是显示偶数页和奇数页的组合
  const normalizedIndex = currentPageIndex % 2 === 0 ? currentPageIndex : currentPageIndex - 1

  // 获取当前显示的两页
  const leftPage = bookPages[normalizedIndex] || null
  const rightPage = bookPages[normalizedIndex + 1] || null

  // 获取下一组页面（用于翻页动画）
  const nextLeftPage = bookPages[normalizedIndex + 2] || null
  const nextRightPage = bookPages[normalizedIndex + 3] || null

  // 获取上一组页面（用于翻页动画）
  const prevLeftPage = bookPages[normalizedIndex - 2] || null
  const prevRightPage = bookPages[normalizedIndex - 1] || null

  // 向前翻页
  const goToNextPage = () => {
    if (normalizedIndex + 2 < bookPages.length && !isAnimating) {
      setIsAnimating(true)
      setDirection(1)

      // 动画结束后更新当前页面索引
      setTimeout(() => {
        setCurrentPageIndex(normalizedIndex + 2)
        setIsAnimating(false)
      }, 700)
    }
  }

  // 向后翻页
  const goToPreviousPage = () => {
    if (normalizedIndex - 2 >= 0 && !isAnimating) {
      setIsAnimating(true)
      setDirection(-1)

      // 动画结束后更新当前页面索引
      setTimeout(() => {
        setCurrentPageIndex(normalizedIndex - 2)
        setIsAnimating(false)
      }, 700)
    }
  }

  // 自动翻页
  useEffect(() => {
    // 只在自动模式下启用
    if (mode === "manual") return

    const interval = setInterval(() => {
      if (isAnimating) return

      if (mode === "auto-right") {
        // 向右翻页
        if (normalizedIndex + 2 < bookPages.length) {
          goToNextPage()
        } else {
          // 如果已经到最后一页，重置到第一页
          setCurrentPageIndex(0)
        }
      } else if (mode === "auto-left") {
        // 向左翻页
        if (normalizedIndex - 2 >= 0) {
          goToPreviousPage()
        } else {
          // 如果已经到第一页，重置到最后一页
          setCurrentPageIndex(Math.floor((bookPages.length - 1) / 2) * 2)
        }
      }
    }, autoTurnInterval)

    return () => clearInterval(interval)
  }, [normalizedIndex, isAnimating, mode, autoTurnInterval, bookPages.length])

  // 键盘导航 - 仅在手动模式下启用
  useEffect(() => {
    if (mode !== "manual") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextPage()
      } else if (e.key === "ArrowLeft") {
        goToPreviousPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [normalizedIndex, isAnimating, mode])

  // 页面内容渲染函数
  const renderPageContent = (page: (typeof bookPages)[0] | null) => {
    if (!page) return <div className="flex-1 flex items-center justify-center text-stone-400">Cover/Back Cover</div>

    return (
      <>
        <div className="flex-1 p-6 pb-0 overflow-auto">
          <p className="text-lg leading-relaxed">{page.content}</p>
        </div>
        <div className="text-center text-sm text-gray-500 p-2">Page {page.pageNumber}</div>
      </>
    )
  }

  return (
    <div className="flex w-[80%] h-[80%] flex-col items-center">
      <div
        ref={bookRef}
        className="relative w-[100%] h-[60vh] max-h-[36rem] min-h-[18rem] max-w-4xl min-w-[18rem] bg-stone-800 rounded-lg shadow-2xl overflow-hidden book-container"
      >
        {/* 书本封面背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 z-0"></div>

        {/* 书页区域 */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 m-4 bg-stone-100 rounded shadow-inner z-20 overflow-hidden">
            {/* 书脊 - 中间的分隔线 - 始终保持在最上层 */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-stone-300 z-50"></div>

            {/* 静态页面 - 当前显示的页面 */}
            {!isAnimating && (
              <div className="absolute inset-0 flex">
                {/* 左侧页面 */}
                <div className="w-1/2 h-full bg-stone-50 flex flex-col">{renderPageContent(leftPage)}</div>

                {/* 右侧页面 */}
                <div className="w-1/2 h-full bg-stone-50 flex flex-col">{renderPageContent(rightPage)}</div>
              </div>
            )}

            {/* 向前翻页动画 */}
            {isAnimating && direction > 0 && (
              <>
                {/* 当前左侧页面 - 静态 */}
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-stone-50 flex flex-col z-20">
                  {renderPageContent(leftPage)}
                </div>

                {/* 下一组右侧页面 - 静态 */}
                <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-stone-50 flex flex-col z-20">
                  {renderPageContent(nextRightPage)}
                </div>

                {/* 当前右侧页面翻转 - 动画 */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{
                    rotateY: -180,
                    transition: {
                      duration: 0.7,
                      ease: [0.3, 0.1, 0.3, 1],
                    },
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "50%",
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    zIndex: 30,
                    perspective: 1500,
                  }}
                >
                  {/* 正面 - 当前右侧页面 */}
                  <div
                    className="absolute inset-0 bg-stone-50 flex flex-col"
                    style={{
                      backfaceVisibility: "hidden",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    {renderPageContent(rightPage)}

                    {/* 页面阴影和光效 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to left, rgba(0,0,0,0.05), transparent 20%, transparent 80%, rgba(0,0,0,0.05))",
                      }}
                    />
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[20px] pointer-events-none"
                      style={{
                        boxShadow: "inset 10px 0 10px -10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>

                  {/* 背面 - 下一组左侧页面 */}
                  <div
                    className="absolute inset-0 bg-stone-50 flex flex-col"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    {renderPageContent(nextLeftPage)}

                    {/* 页面阴影和光效 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.05), transparent 20%, transparent 80%, rgba(0,0,0,0.05))",
                      }}
                    />
                    <div
                      className="absolute right-0 top-0 bottom-0 w-[20px] pointer-events-none"
                      style={{
                        boxShadow: "inset -10px 0 10px -10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </motion.div>
              </>
            )}

            {/* 向后翻页动画 - 左侧页面从左向右翻转 */}
            {isAnimating && direction < 0 && (
              <>
                {/* 上一组左侧页面 - 静态 */}
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-stone-50 flex flex-col z-20">
                  {renderPageContent(prevLeftPage)}
                </div>

                {/* 当前右侧页面 - 静态 */}
                <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-stone-50 flex flex-col z-20">
                  {renderPageContent(rightPage)}
                </div>

                {/* 当前左侧页面翻转 - 动画 */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{
                    rotateY: 180,
                    transition: {
                      duration: 0.7,
                      ease: [0.3, 0.1, 0.3, 1],
                    },
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "50%",
                    transformStyle: "preserve-3d",
                    transformOrigin: "right center",
                    zIndex: 30,
                    perspective: 1500,
                  }}
                >
                  {/* 正面 - 当前左侧页面 */}
                  <div
                    className="absolute inset-0 bg-stone-50 flex flex-col"
                    style={{
                      backfaceVisibility: "hidden",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    {renderPageContent(leftPage)}

                    {/* 页面阴影和光效 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.05), transparent 20%, transparent 80%, rgba(0,0,0,0.05))",
                      }}
                    />
                    <div
                      className="absolute right-0 top-0 bottom-0 w-[20px] pointer-events-none"
                      style={{
                        boxShadow: "inset -10px 0 10px -10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>

                  {/* 背面 - 上一组右侧页面 */}
                  <div
                    className="absolute inset-0 bg-stone-50 flex flex-col"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    {renderPageContent(prevRightPage)}

                    {/* 页面阴影和光效 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to left, rgba(0,0,0,0.05), transparent 20%, transparent 80%, rgba(0,0,0,0.05))",
                      }}
                    />
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[20px] pointer-events-none"
                      style={{
                        boxShadow: "inset 10px 0 10px -10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </motion.div>
              </>
            )}

            {/* 翻页时的动态阴影效果 */}
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                className="absolute"
                style={{
                  width: "40px",
                  height: "100%",
                  left: "calc(50% - 20px)",
                  background: "linear-gradient(to right, rgba(0,0,0,0.05), transparent)",
                  filter: "blur(4px)",
                  zIndex: 40,
                }}
              />
            )}
          </div>
        </div>

        {/* 书本边缘阴影 */}
        <div
          className="absolute inset-0 m-4 pointer-events-none z-30"
          style={{
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      {/* 导航控件 - 仅在手动模式或显示控制按钮时显示 */}
      {(mode === "manual" || showControls) && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={normalizedIndex === 0 || isAnimating}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={normalizedIndex + 2 >= bookPages.length || isAnimating}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* 提示信息 */}
      {mode === "manual" && <p className="text-sm text-muted-foreground mt-4">Tip: You can use left and right arrow keys to turn pages</p>}
      {mode === "auto-left" && (
        <p className="text-sm text-muted-foreground mt-4">Automatic Left Page Turn Demo - Turning page every {autoTurnInterval / 1000} seconds</p>
      )}
      {mode === "auto-right" && (
        <p className="text-sm text-muted-foreground mt-4">Automatic Right Page Turn Demo - Turning page every {autoTurnInterval / 1000} seconds</p>
      )}
    </div>
  )
}

