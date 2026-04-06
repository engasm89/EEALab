"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, ZapOff } from "lucide-react"

interface SimulationBoardProps {
  board: string
  state: any
  isRunning: boolean
}

export function SimulationBoard({ board, state, isRunning }: SimulationBoardProps) {
  const renderArduinoBoard = () => (
    <div className="space-y-4">
      <div className="bg-green-600 rounded-lg p-4 relative">
        <div className="text-white text-center font-mono text-sm mb-2">Arduino Uno</div>

        {/* LED indicator */}
        <div className="absolute top-2 right-2">
          {state.led13 ? (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          ) : (
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          )}
        </div>

        {/* Digital pins */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center text-white font-mono ${
                state[`pin${i}`] ? "bg-yellow-500" : "bg-gray-700"
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Analog pins */}
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center text-white font-mono ${
                state[`A${i}`] ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              A{i}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Built-in LED (Pin 13)</span>
          {state.led13 ? (
            <Badge className="bg-red-500">
              <Zap className="w-3 h-3 mr-1" />
              ON
            </Badge>
          ) : (
            <Badge variant="secondary">
              <ZapOff className="w-3 h-3 mr-1" />
              OFF
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Status</span>
          <Badge variant={isRunning ? "default" : "secondary"}>{isRunning ? "Running" : "Stopped"}</Badge>
        </div>
      </div>
    </div>
  )

  const renderESP32Board = () => (
    <div className="space-y-4">
      <div className="bg-blue-600 rounded-lg p-4 relative">
        <div className="text-white text-center font-mono text-sm mb-2">ESP32</div>

        {/* WiFi indicator */}
        <div className="absolute top-2 right-2">
          {state.wifi ? (
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          ) : (
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          )}
        </div>

        {/* GPIO pins */}
        <div className="grid grid-cols-8 gap-1">
          {[0, 2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33].slice(0, 16).map((pin) => (
            <div
              key={pin}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center text-white font-mono ${
                state[`gpio${pin}`] ? "bg-yellow-500" : "bg-gray-700"
              }`}
            >
              {pin}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>WiFi Connection</span>
          <Badge variant={state.wifi ? "default" : "secondary"}>{state.wifi ? "Connected" : "Disconnected"}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Sensor Reading</span>
          <Badge variant="outline">{state.sensorValue || "0"}</Badge>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          {board.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {board === "arduino-uno" && renderArduinoBoard()}
        {board === "esp32" && renderESP32Board()}
        {!["arduino-uno", "esp32"].includes(board) && (
          <div className="text-center text-muted-foreground">
            <Cpu className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Board visualization not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
