import { db } from "@/lib/db"
import { labFilterSchema } from "@/lib/validations"
import { LabCard } from "./lab-card"
import { LabsPagination } from "./labs-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Beaker } from "lucide-react"
import Link from "next/link"

interface LabsCatalogProps {
  searchParams: {
    search?: string
    types?: string
    categories?: string
    levels?: string
    standards?: string
    tags?: string
    verified?: string
    page?: string
  }
}

const LABS_PER_PAGE = 12

export async function LabsCatalog({ searchParams }: LabsCatalogProps) {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams
  
  const page = Number.parseInt(params.page || "1")
  const skip = (page - 1) * LABS_PER_PAGE

  // Parse filters
  const filters = labFilterSchema.parse({
    search: params.search,
    types: params.types?.split(","),
    categories: params.categories?.split(","),
    educationLevels: params.levels?.split(","),
    standards: params.standards?.split(","),
    tags: params.tags?.split(","),
    verified: params.verified === "true",
  })

  // Build where clause
  const where: any = {
    visibility: "PUBLIC",
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { tags: { hasSome: [filters.search] } },
    ]
  }

  if (filters.types?.length) {
    where.type = { in: filters.types }
  }

  if (filters.categories?.length) {
    where.category = { in: filters.categories }
  }

  if (filters.educationLevels?.length) {
    where.educationLevels = { hasSome: filters.educationLevels }
  }

  if (filters.standards?.length) {
    where.standards = { hasSome: filters.standards }
  }

  if (filters.tags?.length) {
    where.tags = { hasSome: filters.tags }
  }

  if (filters.verified) {
    where.verified = true
  }

  // Fetch labs and total count
  let labs: any[] = []
  let totalCount = 0

  try {
    const [dbLabs, dbTotalCount] = await Promise.all([
      db.lab.findMany({
        where,
        include: {
          createdBy: {
            select: { name: true, avatarUrl: true },
          },
          organization: {
            select: { name: true, logoUrl: true },
          },
        },
        orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
        skip,
        take: LABS_PER_PAGE,
      }),
      db.lab.count({ where }),
    ])
    labs = dbLabs
    totalCount = dbTotalCount
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    
    // Mock data for demonstration
    const mockLabs = [
      {
        id: "resistor-basics-lab-001",
        title: "Resistor Basics - Ohm's Law",
        slug: "resistor-basics",
        category: "ELECTRONICS",
        educationLevels: ["Middle School", "High School", "College"],
        standards: ["NGSS 5-PS1-3", "NGSS MS-PS4-2", "IEEE 9-12.CT.1"],
        type: "SANDBOX",
        description: "Learn the fundamentals of resistors and Ohm's Law through hands-on experiments. Measure voltage, current, and resistance while exploring series and parallel circuits with Arduino.",
        thumbnailUrl: "/placeholder.svg?height=300&width=400",
        tags: ["resistors", "ohms-law", "circuits", "electronics", "arduino", "beginner"],
        visibility: "PUBLIC",
        simulationManifestUrl: "/manifests/resistor-basics.json",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          name: "Dr. Sarah Chen",
          avatarUrl: "/placeholder-user.jpg"
        },
        organization: {
          name: "VirtualLabs Education",
          logoUrl: "/placeholder-logo.png"
        }
      },
      {
        id: "arduino-blink-lab-002",
        title: "Arduino Blink - Introduction to Microcontrollers",
        slug: "arduino-blink",
        category: "ELECTRONICS",
        educationLevels: ["Middle School", "High School"],
        standards: ["NGSS MS-PS4-2", "IEEE 9-12.CT.1"],
        type: "REALTIME",
        description: "Get started with Arduino programming! Learn to control an LED, understand digital output, and write your first microcontroller program.",
        thumbnailUrl: "/placeholder.svg?height=300&width=400",
        tags: ["arduino", "microcontrollers", "led", "programming", "beginner"],
        visibility: "PUBLIC",
        simulationManifestUrl: "/manifests/arduino-blink.json",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          name: "Prof. Michael Rodriguez",
          avatarUrl: "/placeholder-user.jpg"
        },
        organization: {
          name: "VirtualLabs Education",
          logoUrl: "/placeholder-logo.png"
        }
      },
      {
        id: "esp32-sensors-lab-003",
        title: "ESP32 Sensors - IoT Data Collection",
        slug: "esp32-sensors",
        category: "ELECTRONICS",
        educationLevels: ["High School", "College"],
        standards: ["IEEE 9-12.CT.1", "AP Computer Science Principles"],
        type: "ULTRACONCURRENT",
        description: "Explore the ESP32 microcontroller and learn about various sensors. Build an IoT device that collects environmental data and sends it to the cloud.",
        thumbnailUrl: "/placeholder.svg?height=300&width=400",
        tags: ["esp32", "iot", "sensors", "microcontrollers", "intermediate"],
        visibility: "PUBLIC",
        simulationManifestUrl: "/manifests/esp32-sensors.json",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          name: "Dr. Emily Watson",
          avatarUrl: "/placeholder-user.jpg"
        },
        organization: {
          name: "VirtualLabs Education",
          logoUrl: "/placeholder-logo.png"
        }
      }
    ]

    console.log("Mock labs created:", mockLabs.length)
    console.log("Filters applied:", filters)

    // Apply filters to mock data
    let filteredLabs = mockLabs

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredLabs = filteredLabs.filter(lab => 
        lab.title.toLowerCase().includes(searchLower) ||
        lab.description.toLowerCase().includes(searchLower) ||
        lab.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      )
      console.log("After search filter:", filteredLabs.length)
    }

    if (filters.types?.length) {
      const typeSet = new Set(filters.types as string[])
      filteredLabs = filteredLabs.filter((lab) => typeSet.has(lab.type as string))
      console.log("After type filter:", filteredLabs.length)
    }

    if (filters.categories?.length) {
      const catSet = new Set(filters.categories as string[])
      filteredLabs = filteredLabs.filter((lab) => catSet.has(lab.category as string))
      console.log("After category filter:", filteredLabs.length)
    }

    if (filters.educationLevels?.length) {
      filteredLabs = filteredLabs.filter(lab => 
        lab.educationLevels.some((level: string) => filters.educationLevels!.includes(level))
      )
      console.log("After education level filter:", filteredLabs.length)
    }

    if (filters.verified) {
      filteredLabs = filteredLabs.filter(lab => lab.verified)
      console.log("After verified filter:", filteredLabs.length)
    }

    // Apply pagination
    totalCount = filteredLabs.length
    labs = filteredLabs.slice(skip, skip + LABS_PER_PAGE)
    
    console.log("Final labs array:", labs.length)
    console.log("Total count:", totalCount)
    console.log("Skip:", skip, "Take:", LABS_PER_PAGE)
  }

  const totalPages = Math.ceil(totalCount / LABS_PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {filters.search ? `Search results for "${filters.search}"` : "Browse Labs"}
          </h1>
          <Badge variant="secondary">
            {totalCount} {totalCount === 1 ? "lab" : "labs"}
          </Badge>
        </div>

        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="verified">Verified First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(filters.types?.length || filters.categories?.length || filters.educationLevels?.length) && (
        <div className="flex flex-wrap gap-2">
          {filters.types?.map((type) => (
            <Badge key={type} variant="outline">
              {type}
            </Badge>
          ))}
          {filters.categories?.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
          {filters.educationLevels?.map((level) => (
            <Badge key={level} variant="outline">
              {level}
            </Badge>
          ))}
        </div>
      )}

      {/* Labs Grid */}
      {labs.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>

          {totalPages > 1 && <LabsPagination currentPage={page} totalPages={totalPages} />}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No labs found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/virtual-labs/labs">Clear Filters</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
