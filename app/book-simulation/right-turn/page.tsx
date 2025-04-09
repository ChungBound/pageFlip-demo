import { AutoRightTurnBook } from "@/components/auto-right-turn-book"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RightTurnPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <h1 className="text-3xl font-bold mb-6">模拟右翻页</h1>
      <p className="text-lg mb-4 text-muted-foreground">自动向右翻页演示 - 无需点击按钮</p>

      <AutoRightTurnBook />

      <div className="mt-8">
        <Link href="/book-simulation">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            返回选择页面
          </Button>
        </Link>
      </div>
    </main>
  )
}

