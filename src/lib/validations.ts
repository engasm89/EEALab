import { z } from "zod"

// User schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters").optional(),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Lab schemas
export const labFilterSchema = z.object({
  types: z.array(z.enum(["ULTRACONCURRENT", "REALTIME", "SANDBOX"])).optional(),
  categories: z.array(z.enum(["BIOLOGY", "CHEMISTRY", "ELECTRONICS", "ENGINEERING", "PHYSICS", "ROBOTICS"])).optional(),
  educationLevels: z.array(z.string()).optional(),
  standards: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
  search: z.string().optional(),
})

export const createLabSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["BIOLOGY", "CHEMISTRY", "ELECTRONICS", "ENGINEERING", "PHYSICS", "ROBOTICS"]),
  educationLevels: z.array(z.string()).min(1, "Select at least one education level"),
  standards: z.array(z.string()),
  tags: z.array(z.string()),
  type: z.enum(["ULTRACONCURRENT", "REALTIME", "SANDBOX"]),
  visibility: z.enum(["PUBLIC", "ORG", "PRIVATE"]),
})

// Organization schemas
export const createOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
})

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
})

// Feedback schema
export const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  comment: z.string().optional(),
  path: z.string(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type LabFilterInput = z.infer<typeof labFilterSchema>
export type CreateLabInput = z.infer<typeof createLabSchema>
export type CreateOrgInput = z.infer<typeof createOrgSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
