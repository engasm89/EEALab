"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal } from "lucide-react"

interface SimulationConsoleProps {
  output: string[]
}

export function SimulationConsole({ output }: SimulationConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Terminal className="h-4 w-4" />
          Console
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="font-mono text-sm space-y-1">
            {output.length === 0 ? (
              <div className="text-muted-foreground italic">Console output will appear here...</div>
            ) : (
              output.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap break-words">
                  {line}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
