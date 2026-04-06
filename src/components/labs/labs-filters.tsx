"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  X, 
  Filter, 
  Zap, 
  Beaker, 
  Cpu, 
  CircuitBoard, 
  FlaskConical, 
  Microscope, 
  Rocket,
  Circle,
  Target,
  GraduationCap,
  Shield
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LAB_TYPES = [
  { value: "ULTRACONCURRENT", label: "Ultra-concurrent", icon: Zap, color: "text-green-600" },
  { value: "REALTIME", label: "Real-time", icon: Beaker, color: "text-blue-600" },
  { value: "SANDBOX", label: "Sandbox", icon: Cpu, color: "text-purple-600" },
]

const CATEGORIES = [
  { value: "ELECTRONICS", label: "Electronics", icon: CircuitBoard, color: "text-orange-600" },
  { value: "PHYSICS", label: "Physics", icon: Circle, color: "text-indigo-600" },
  { value: "CHEMISTRY", label: "Chemistry", icon: FlaskConical, color: "text-red-600" },
  { value: "BIOLOGY", label: "Biology", icon: Microscope, color: "text-emerald-600" },
  { value: "ENGINEERING", label: "Engineering", icon: Cpu, color: "text-slate-600" },
  { value: "ROBOTICS", label: "Robotics", icon: Rocket, color: "text-cyan-600" },
]

const EDUCATION_LEVELS = [
  { value: "Elementary School", label: "Elementary School", icon: GraduationCap, color: "text-blue-600" },
  { value: "Middle School", label: "Middle School", icon: GraduationCap, color: "text-green-600" },
  { value: "High School", label: "High School", icon: GraduationCap, color: "text-orange-600" },
  { value: "University", label: "University", icon: GraduationCap, color: "text-purple-600" },
  { value: "Graduate", label: "Graduate", icon: GraduationCap, color: "text-red-600" },
]

const STANDARDS = [
  { value: "NGSS K-12", label: "NGSS K-12", icon: Target, color: "text-emerald-600" },
  { value: "IEEE Standards", label: "IEEE Standards", icon: Target, color: "text-blue-600" },
  { value: "Common Core", label: "Common Core", icon: Target, color: "text-orange-600" },
  { value: "AP Standards", label: "AP Standards", icon: Target, color: "text-purple-600" },
]

export function LabsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const updateFilters = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString())

      if (values.length > 0) {
        params.set(key, values.join(","))
      } else {
        params.delete(key)
      }

      params.delete("page") // Reset to first page when filtering
      router.push(`/labs?${params.toString()}`)
    },
    [router, searchParams],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }

    params.delete("page")
    router.push(`/labs?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    router.push("/virtual-labs/labs")
  }

  const getActiveValues = (key: string) => {
    const value = searchParams.get(key)
    return value ? value.split(",") : []
  }

  const toggleFilter = (key: string, value: string) => {
    const current = getActiveValues(key)
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

    updateFilters(key, updated)
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some((key) => key !== "page" && searchParams.get(key))

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Filters
          </span>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters} 
              className="ml-auto h-7 px-3 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
            >
              Clear all
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium text-foreground">
            Search Labs
          </Label>
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                id="search"
                placeholder="Search by topic, category, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <Separator className="bg-border/50" />

        {/* Lab Types */}
        <FilterSection
          title="Lab Type"
          options={LAB_TYPES}
          activeValues={getActiveValues("types")}
          onToggle={(value) => toggleFilter("types", value)}
        />

        <Separator className="bg-border/50" />

        {/* Categories */}
        <FilterSection
          title="Category"
          options={CATEGORIES}
          activeValues={getActiveValues("categories")}
          onToggle={(value) => toggleFilter("categories", value)}
        />

        <Separator className="bg-border/50" />

        {/* Education Levels */}
        <FilterSection
          title="Education Level"
          options={EDUCATION_LEVELS}
          activeValues={getActiveValues("levels")}
          onToggle={(value) => toggleFilter("levels", value)}
        />

        <Separator className="bg-border/50" />

        {/* Standards */}
        <FilterSection
          title="Standards"
          options={STANDARDS}
          activeValues={getActiveValues("standards")}
          onToggle={(value) => toggleFilter("standards", value)}
        />

        <Separator className="bg-border/50" />

        {/* Verified Only */}
        <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Checkbox
            id="verified"
            checked={searchParams.get("verified") === "true"}
            onCheckedChange={(checked) => {
              const params = new URLSearchParams(searchParams.toString())
              if (checked) {
                params.set("verified", "true")
              } else {
                params.delete("verified")
              }
              params.delete("page")
              router.push(`/labs?${params.toString()}`)
            }}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Label htmlFor="verified" className="text-sm font-medium text-foreground cursor-pointer">
              Verified labs only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FilterSectionProps {
  title: string
  options: { value: string; label: string; icon: any; color: string }[]
  activeValues: string[]
  onToggle: (value: string) => void
}

function FilterSection({ title, options, activeValues, onToggle }: FilterSectionProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground mb-3 block">{title}</Label>
      <div className="space-y-2">
        {options.map((option) => {
          const IconComponent = option.icon
          const isActive = activeValues.includes(option.value)
          
          return (
            <div 
              key={option.value} 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 cursor-pointer group ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50 border border-transparent'
              }`}
              onClick={() => onToggle(option.value)}
            >
              <Checkbox
                id={option.value}
                checked={isActive}
                onCheckedChange={() => onToggle(option.value)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <IconComponent className={`h-4 w-4 ${option.color} group-hover:scale-110 transition-transform duration-200`} />
              <Label 
                htmlFor={option.value} 
                className={`text-sm cursor-pointer transition-colors duration-200 ${
                  isActive ? 'text-primary font-medium' : 'text-foreground'
                }`}
              >
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
