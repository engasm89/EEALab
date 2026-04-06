"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonacoEditor } from "./monaco-editor"
import { SimulationBoard } from "./simulation-board"
import { SimulationConsole } from "./simulation-console"
import { PinsPanel } from "./pins-panel"
import { ResourceMonitor } from "./resource-monitor"
import { Play, Square, RotateCcw, Save, ArrowLeft, Timer } from "lucide-react"
import Link from "next/link"
import type { Lab, LabRun } from "@prisma/client"
import type { SimulationManifest } from "@/lib/lab-types"

interface SimulationIDEProps {
  lab: Lab & {
    createdBy: { name: string }
    organization?: { name: string } | null
  }
  labRun: LabRun
}

export function SimulationIDE({ lab, labRun }: SimulationIDEProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [sessionTime, setSessionTime] = useState(0)
  const [manifest, setManifest] = useState<SimulationManifest | null>(null)
  const [boardState, setBoardState] = useState<any>({})
  const [resourceUsage, setResourceUsage] = useState({ cpu: 0, memory: 0, fastBuildSeconds: 0 })

  const workerRef = useRef<Worker | null>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load simulation manifest and initial code
  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch(lab.simulationManifestUrl)
        const manifestData: SimulationManifest = await response.json()
        setManifest(manifestData)

        // Load initial code template
        if (lab.codeTemplates && typeof lab.codeTemplates === "object") {
          const templates = lab.codeTemplates as Record<string, string>
          const defaultTemplate = templates[manifestData.language] || templates.default || ""
          setCode(defaultTemplate)
        }
      } catch (error) {
        console.error("Failed to load simulation manifest:", error)
        addConsoleOutput("Error: Failed to load simulation configuration")
      }
    }

    loadManifest()
  }, [lab])

  // Session timer
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [])

  // Initialize Web Worker
  useEffect(() => {
    if (manifest) {
      workerRef.current = new Worker("/workers/simulation-worker.js")

      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data

        switch (type) {
          case "console":
            addConsoleOutput(data.message)
            break
          case "board-state":
            setBoardState(data.state)
            break
          case "resource-usage":
            setResourceUsage(data.usage)
            break
          case "error":
            addConsoleOutput(`Error: ${data.message}`)
            setIsRunning(false)
            break
          case "stopped":
            setIsRunning(false)
            break
        }
      }

      // Initialize simulation
      workerRef.current.postMessage({
        type: "init",
        data: { manifest, labId: lab.id },
      })
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [manifest, lab.id])

  const addConsoleOutput = (message: string) => {
    setConsoleOutput((prev) => [...prev.slice(-99), `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleRun = () => {
    if (!workerRef.current || !manifest) return

    setIsRunning(true)
    setConsoleOutput([])
    addConsoleOutput("Starting simulation...")

    workerRef.current.postMessage({
      type: "run",
      data: { code, language: manifest.language },
    })
  }

  const handleStop = () => {
    if (!workerRef.current) return

    setIsRunning(false)
    workerRef.current.postMessage({ type: "stop" })
    addConsoleOutput("Simulation stopped")
  }

  const handleReset = () => {
    if (!workerRef.current) return

    setIsRunning(false)
    setBoardState({})
    setConsoleOutput([])
    setResourceUsage({ cpu: 0, memory: 0, fastBuildSeconds: 0 })

    workerRef.current.postMessage({ type: "reset" })
    addConsoleOutput("Simulation reset")
  }

  const handleSave = async () => {
    try {
      await fetch(`/api/lab-runs/${labRun.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sessionTime }),
      })
      addConsoleOutput("Progress saved")
    } catch (error) {
      addConsoleOutput("Failed to save progress")
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!manifest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading simulation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/labs/${lab.slug}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold">{lab.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {lab.organization?.name || lab.createdBy.name} • {manifest.board} • {manifest.language}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                {formatTime(sessionTime)}
              </div>
              <ResourceMonitor usage={resourceUsage} />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                {isRunning ? (
                  <Button variant="destructive" size="sm" onClick={handleStop}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleRun}>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main IDE */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-2">
            <Badge variant="secondary">{manifest.language.toUpperCase()}</Badge>
          </div>
          <div className="flex-1">
            <MonacoEditor
              value={code}
              onChange={setCode}
              language={manifest.language}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 border-l bg-card flex flex-col">
          <Tabs defaultValue="board" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="pins">Pins</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="flex-1 p-4">
              <SimulationBoard board={manifest.board} state={boardState} isRunning={isRunning} />
            </TabsContent>

            <TabsContent value="console" className="flex-1 p-0">
              <SimulationConsole output={consoleOutput} />
            </TabsContent>

            <TabsContent value="pins" className="flex-1 p-4">
              <PinsPanel
                pins={manifest.ui.pins || []}
                state={boardState}
                onPinChange={(pin, value) => {
                  if (workerRef.current) {
                    workerRef.current.postMessage({
                      type: "pin-change",
                      data: { pin, value },
                    })
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
