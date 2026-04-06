"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"

interface Pin {
  name: string
  type: "digitalOut" | "digitalIn" | "analogOut" | "analogIn"
}

interface PinsPanelProps {
  pins: Pin[]
  state: any
  onPinChange: (pin: string, value: any) => void
}

export function PinsPanel({ pins, state, onPinChange }: PinsPanelProps) {
  const renderPin = (pin: Pin) => {
    const value = state[pin.name] || 0

    switch (pin.type) {
      case "digitalOut":
        return (
          <div key={pin.name} className="flex items-center justify-between p-2 border rounded">
            <Label className="font-mono text-sm">{pin.name}</Label>
            <div className={`w-3 h-3 rounded-full ${value ? "bg-green-500" : "bg-gray-400"}`} />
          </div>
        )

      case "digitalIn":
        return (
          <div key={pin.name} className="flex items-center justify-between p-2 border rounded">
            <Label className="font-mono text-sm">{pin.name}</Label>
            <Switch checked={value} onCheckedChange={(checked) => onPinChange(pin.name, checked)} />
          </div>
        )

      case "analogOut":
        return (
          <div key={pin.name} className="space-y-2 p-2 border rounded">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-sm">{pin.name}</Label>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
            <div className={`h-2 rounded-full bg-gradient-to-r from-gray-300 to-green-500`}>
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(value / 255) * 100}%` }}
              />
            </div>
          </div>
        )

      case "analogIn":
        return (
          <div key={pin.name} className="space-y-2 p-2 border rounded">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-sm">{pin.name}</Label>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => onPinChange(pin.name, newValue)}
              max={1023}
              step={1}
              className="w-full"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4" />
          Pins
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pins.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm">No interactive pins available</div>
        ) : (
          pins.map(renderPin)
        )}
      </CardContent>
    </Card>
  )
}
