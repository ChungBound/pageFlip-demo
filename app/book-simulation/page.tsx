import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Hand } from "lucide-react"

export default function BookSimulation() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-100">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Book Page Turn Simulation</h1>
        <p className="text-lg mb-8 text-muted-foreground">Please select the type of page turning effect you want to view</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/book-simulation/left-turn/" className="w-full">
            <Button variant="outline" className="w-full h-16 text-lg gap-2" size="lg">
              <ArrowLeft className="w-5 h-5" />
              Left Page Turn
            </Button>
          </Link>

          <Link href="/book-simulation/right-turn/" className="w-full">
            <Button variant="outline" className="w-full h-16 text-lg gap-2" size="lg">
              <ArrowRight className="w-5 h-5" />
              Right Page Turn
            </Button>
          </Link>

          <Link href="/book-simulation/manual/" className="w-full">
            <Button variant="outline" className="w-full h-16 text-lg gap-2" size="lg">
              <Hand className="w-5 h-5" />
              Manual Page Turn
            </Button>
          </Link>
        </div>

        <Link href="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
    </main>
  )
}

