import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Badge variant="secondary">Next.js + Shadcn UI</Badge>
      <h1 className="text-4xl font-bold tracking-tight">Ready to build.</h1>
      <p className="text-muted-foreground text-center max-w-sm">
        Your Next.js app with Shadcn UI is set up. Start editing{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
          src/app/page.tsx
        </code>
      </p>
      <Button>Get started</Button>
    </main>
  )
}
