import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Play, 
  Shield, 
  Users, 
  Clock, 
  Star,
  Zap,
  Beaker,
  Cpu,
  CircuitBoard,
  FlaskConical,
  Microscope,
  Rocket,
  Circle
} from "lucide-react"
import type { Lab, User, Organization } from "@prisma/client"

interface LabCardProps {
  lab: Lab & {
    createdBy: Pick<User, "name" | "avatarUrl">
    organization?: Pick<Organization, "name" | "logoUrl"> | null
  }
}

export function LabCard({ lab }: LabCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "ULTRACONCURRENT":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600/20"
      case "REALTIME":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-600/20"
      case "SANDBOX":
        return "bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-600/20"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white border-gray-600/20"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ELECTRONICS":
        return "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600/20"
      case "PHYSICS":
        return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-indigo-600/20"
      case "CHEMISTRY":
        return "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-600/20"
      case "BIOLOGY":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600/20"
      case "ENGINEERING":
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-slate-600/20"
      case "ROBOTICS":
        return "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-600/20"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white border-gray-600/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ELECTRONICS":
        return <CircuitBoard className="w-4 h-4" />
      case "PHYSICS":
        return <Circle className="w-4 h-4" />
      case "CHEMISTRY":
        return <FlaskConical className="w-4 h-4" />
      case "BIOLOGY":
        return <Microscope className="w-4 h-4" />
      case "ENGINEERING":
        return <Cpu className="w-4 h-4" />
      case "ROBOTICS":
        return <Rocket className="w-4 h-4" />
      default:
        return <Beaker className="w-4 h-4" />
    }
  }

  return (
    <Card className="lab-card interactive-element group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={lab.thumbnailUrl || "/placeholder.svg?height=200&width=300"}
            alt={lab.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${getTypeColor(lab.type)} shadow-lg border-2`}>
              <Zap className="w-3 h-3 mr-1" />
              {lab.type.toLowerCase()}
            </Badge>
            {lab.verified && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-600/20 shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-2 text-white text-sm">
              <Clock className="w-4 h-4" />
              <span>~15 min</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors duration-200 leading-tight">
              {lab.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
              {lab.description}
            </p>
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${getCategoryColor(lab.category)} shadow-md border-2`}>
              {getCategoryIcon(lab.category)}
              <span className="ml-1">{lab.category.toLowerCase()}</span>
            </Badge>
          </div>

          {/* Education Levels */}
          <div className="flex flex-wrap gap-2">
            {lab.educationLevels.slice(0, 3).map((level) => (
              <Badge key={level} variant="outline" className="text-xs border-primary/20 text-primary hover:bg-primary/10 transition-colors duration-200">
                {level}
              </Badge>
            ))}
            {lab.educationLevels.length > 3 && (
              <Badge variant="outline" className="text-xs border-muted-foreground/20 text-muted-foreground">
                +{lab.educationLevels.length - 3}
              </Badge>
            )}
          </div>

          {/* Author and Organization */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={lab.createdBy.avatarUrl || ""} />
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {lab.createdBy.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-foreground">{lab.createdBy.name}</span>
                {lab.organization && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{lab.organization.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Rating Placeholder */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button asChild className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
          <Link href={`/labs/${lab.slug}`}>
            <Play className="w-4 h-4 mr-2" />
            Launch Lab
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="border-2 hover:bg-primary/10 hover:border-primary transition-all duration-200">
          <Link href={`/labs/${lab.slug}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
