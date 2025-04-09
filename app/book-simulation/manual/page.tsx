import { FinalBook } from "@/components/final-book"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ManualPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <h1 className="text-3xl font-bold mb-6">手动翻页</h1>
      <p className="text-lg mb-4 text-muted-foreground">使用按钮或键盘箭头键手动翻页</p>

      <FinalBook />

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

