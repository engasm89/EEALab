import type { Organization, User, Lab, LabRun, Membership } from "@prisma/client"

export type UserWithMemberships = User & {
  memberships: (Membership & {
    organization: Organization
  })[]
}

export type LabWithCreator = Lab & {
  createdBy: User
  organization?: Organization
}

export type LabRunWithDetails = LabRun & {
  lab: Lab
  user: User
  organization: Organization
}

export interface SimulationManifest {
  schemaVersion: number
  board: "arduino-uno" | "esp32" | "stm32" | "custom"
  language: "cpp" | "micropython" | "js"
  assets: string[]
  entry: string
  ui: {
    panels: ("board" | "console" | "pins")[]
    pins?: Array<{
      name: string
      type: "digitalOut" | "digitalIn" | "analogOut" | "analogIn"
    }>
  }
}

export interface FilterOptions {
  types?: string[]
  categories?: string[]
  educationLevels?: string[]
  standards?: string[]
  tags?: string[]
  verified?: boolean
}
