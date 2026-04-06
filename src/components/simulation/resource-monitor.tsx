"use client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, Clock } from "lucide-react"

interface ResourceMonitorProps {
  usage: {
    cpu: number
    memory: number
    fastBuildSeconds: number
  }
}

export function ResourceMonitor({ usage }: ResourceMonitorProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-muted-foreground" />
        <Progress value={usage.cpu} className="w-16 h-2" />
        <span className="text-xs text-muted-foreground">{usage.cpu}%</span>
      </div>

      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-muted-foreground" />
        <Progress value={usage.memory} className="w-16 h-2" />
        <span className="text-xs text-muted-foreground">{usage.memory}%</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Badge variant="outline" className="text-xs">
          {Math.floor(usage.fastBuildSeconds / 60)}m {usage.fastBuildSeconds % 60}s
        </Badge>
      </div>
    </div>
  )
}
