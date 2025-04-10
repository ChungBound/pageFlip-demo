import { AutoLeftTurnBook } from "@/components/auto-left-turn-book"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LeftTurnPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <h1 className="text-3xl font-bold mb-6">Left Page Turn</h1>
      <p className="text-lg mb-4 text-muted-foreground">Automatic Left Page Turn Demo - No Button Click Required</p>

      <AutoLeftTurnBook />

      <div className="mt-8">
        <Link href="/book-simulation/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Selection
          </Button>
        </Link>
      </div>
    </main>
  )
}

