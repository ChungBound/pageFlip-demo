import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Book Page Turn Effect Demo System</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          This system demonstrates different types of book page turning effects, including automatic and manual page turning.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/book-simulation/" className="w-full max-w-md">
            <Button className="w-full h-16 text-lg gap-2" size="lg">
              <BookOpen className="w-6 h-6" />
              Enter Book Page Turn Simulation
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

