"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// 示例书本内容
const pages = [
  {
    content:
      "这是书本的第一页内容。欢迎来到这个交互式电子书体验！这个模拟真实书籍的翻页效果可以让您感受到纸质书的阅读体验。",
    pageNumber: 1,
  },
  {
    content:
      "这是第二页的内容，我们继续探索这本数字书籍的模拟效果。现在每一行可以容纳更多的文字，就像真实的书籍一样，阅读体验更加舒适。",
    pageNumber: 2,
  },
  {
    content:
      "第三页展示了我们如何创建一个逼真的翻页效果。通过精心设计的动画和阴影效果，我们可以模拟出纸张翻动时的自然感觉和视觉效果。",
    pageNumber: 3,
  },
  {
    content:
      "第四页展示了如何通过直观的控件在书中导航。您可以使用屏幕底部的按钮或键盘的左右箭头键来翻页，就像在阅读真实的书籍一样简单直观。",
    pageNumber: 4,
  },
  {
    content:
      "这是第五页，展示了更多的内容和交互效果。书页的宽度现在更接近真实书籍的比例，每行可以容纳更多的文字，使阅读体验更加自然舒适。",
    pageNumber: 5,
  },
  {
    content:
      "第六页继续我们的阅读体验，感谢您的阅读！现在的书页宽度已经调整到更合理的尺寸，文字排版更加美观，阅读起来也更加舒适自然。",
    pageNumber: 6,
  },
  {
    content:
      "第七页是额外的内容，用于测试多页翻转效果。我们可以看到，无论是向前翻页还是向后翻页，动画效果都非常流畅自然，就像在翻阅真实的书籍一样。",
    pageNumber: 7,
  },
  {
    content:
      "第八页是我们示例书的最后一页。希望您喜欢这个演示！这个电子书翻页效果可以应用于各种数字阅读场景，为用户提供更加沉浸式的阅读体验。",
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
    if (!page) return <div className="flex-1 flex items-center justify-center text-stone-400">封面/封底</div>

    return (
      <>
        <div className="flex-1 p-6 pb-0 overflow-auto">
          <p className="text-lg leading-relaxed">{page.content}</p>
        </div>
        <div className="text-center text-sm text-gray-500 p-2">页码 {page.pageNumber}</div>
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
            上一页
          </Button>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={normalizedIndex + 2 >= bookPages.length || isAnimating}
            className="flex items-center gap-2"
          >
            下一页
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* 提示信息 */}
      {mode === "manual" && <p className="text-sm text-muted-foreground mt-4">提示: 您可以使用左右箭头键翻页</p>}
      {mode === "auto-left" && (
        <p className="text-sm text-muted-foreground mt-4">自动向左翻页演示 - 每{autoTurnInterval / 1000}秒翻一次页</p>
      )}
      {mode === "auto-right" && (
        <p className="text-sm text-muted-foreground mt-4">自动向右翻页演示 - 每{autoTurnInterval / 1000}秒翻一次页</p>
      )}
    </div>
  )
}

