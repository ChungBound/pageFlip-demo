import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">书本翻页效果演示系统</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          这个系统展示了不同类型的书本翻页效果，包括自动翻页和手动翻页。
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/book-simulation" className="w-full max-w-md">
            <Button className="w-full h-16 text-lg gap-2" size="lg">
              <BookOpen className="w-6 h-6" />
              进入书本模拟翻页
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

