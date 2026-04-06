import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/utils/auth"
import { withErrorHandling } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireAuth()
    const formData = await req.formData()

    const manifest = formData.get("manifest") as File
    const assetFiles: File[] = []

    // Collect asset files
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("asset_") && value instanceof File) {
        assetFiles.push(value)
      }
    }

    if (!manifest) {
      throw new Error("Manifest file is required")
    }

    // In a real implementation, you would upload to S3 or similar storage
    // For now, we'll simulate the upload process
    const manifestUrl = `/uploads/manifests/${user.id}/${Date.now()}-${manifest.name}`
    const assetUrls = assetFiles.map((file) => `/uploads/assets/${user.id}/${Date.now()}-${file.name}`)

    // Simulate file validation
    if (manifest.type !== "application/json") {
      throw new Error("Manifest must be a JSON file")
    }

    // Validate manifest content
    const manifestContent = await manifest.text()
    try {
      const parsedManifest = JSON.parse(manifestContent)
      if (!parsedManifest.schemaVersion || !parsedManifest.board || !parsedManifest.language) {
        throw new Error("Invalid manifest format")
      }
    } catch (error) {
      throw new Error("Invalid JSON manifest file")
    }

    return {
      manifestUrl,
      assetUrls,
      message: "Files uploaded successfully",
    }
  })
}
