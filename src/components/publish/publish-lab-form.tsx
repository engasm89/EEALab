"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "./file-upload"
import { useToast } from "@/hooks/use-toast"
import { createLabSchema, type CreateLabInput } from "@/lib/validations"
import { Loader2, X } from "lucide-react"

const CATEGORIES = [
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "ENGINEERING", label: "Engineering" },
  { value: "ROBOTICS", label: "Robotics" },
]

const LAB_TYPES = [
  { value: "ULTRACONCURRENT", label: "Ultra-concurrent", description: "Multiple users can run simultaneously" },
  { value: "REALTIME", label: "Real-time", description: "Limited concurrent sessions with real-time features" },
  { value: "SANDBOX", label: "Sandbox", description: "Isolated environment for experimentation" },
]

const EDUCATION_LEVELS = ["Elementary School", "Middle School", "High School", "University", "Graduate"]

const STANDARDS = ["NGSS K-12", "IEEE Standards", "Common Core", "AP Standards", "IB Standards"]

export function PublishLabForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedStandards, setSelectedStandards] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [manifestFile, setManifestFile] = useState<File | null>(null)
  const [assetFiles, setAssetFiles] = useState<File[]>([])

  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLabInput>({
    resolver: zodResolver(createLabSchema),
  })

  const watchedType = watch("type")
  const watchedVisibility = watch("visibility")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()]
      setTags(newTags)
      setValue("tags", newTags)
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    setValue("tags", newTags)
  }

  const toggleLevel = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level]
    setSelectedLevels(newLevels)
    setValue("educationLevels", newLevels)
  }

  const toggleStandard = (standard: string) => {
    const newStandards = selectedStandards.includes(standard)
      ? selectedStandards.filter((s) => s !== standard)
      : [...selectedStandards, standard]
    setSelectedStandards(newStandards)
    setValue("standards", newStandards)
  }

  const onSubmit = async (data: CreateLabInput) => {
    if (!manifestFile) {
      toast({
        title: "Error",
        description: "Please upload a simulation manifest file",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Upload files first
      const formData = new FormData()
      formData.append("manifest", manifestFile)
      assetFiles.forEach((file, index) => {
        formData.append(`asset_${index}`, file)
      })

      const uploadResponse = await fetch("/api/publish/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload files")
      }

      const { manifestUrl, assetUrls } = await uploadResponse.json()

      // Submit publish request
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          manifestUploadUrl: manifestUrl,
          assetUrls,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || "Failed to submit lab")
      }

      toast({
        title: "Success",
        description: "Lab submitted for review! You'll receive an email when it's processed.",
      })

      router.push("/virtual-labs/publish/success")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lab Title *</Label>
            <Input id="title" placeholder="Enter lab title" {...register("title")} disabled={isLoading} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => setValue("category", value as any)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what students will learn and do in this lab"
            rows={4}
            {...register("description")}
            disabled={isLoading}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </div>

      {/* Lab Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lab Configuration</h3>

        <div className="space-y-2">
          <Label>Lab Type *</Label>
          <div className="grid gap-3">
            {LAB_TYPES.map((type) => (
              <div key={type.value} className="flex items-start space-x-3">
                <Checkbox
                  id={type.value}
                  checked={watchedType === type.value}
                  onCheckedChange={(checked) => {
                    if (checked) setValue("type", type.value as any)
                  }}
                />
                <div className="space-y-1">
                  <Label htmlFor={type.value} className="font-medium">
                    {type.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Visibility *</Label>
          <Select onValueChange={(value) => setValue("visibility", value as any)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public - Available to everyone</SelectItem>
              <SelectItem value="ORG">Organization - Only your organization</SelectItem>
              <SelectItem value="PRIVATE">Private - Only you</SelectItem>
            </SelectContent>
          </Select>
          {errors.visibility && <p className="text-sm text-destructive">{errors.visibility.message}</p>}
        </div>
      </div>

      {/* Education Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Education Details</h3>

        <div className="space-y-2">
          <Label>Education Levels *</Label>
          <div className="flex flex-wrap gap-2">
            {EDUCATION_LEVELS.map((level) => (
              <Badge
                key={level}
                variant={selectedLevels.includes(level) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
          {errors.educationLevels && <p className="text-sm text-destructive">{errors.educationLevels.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Standards</Label>
          <div className="flex flex-wrap gap-2">
            {STANDARDS.map((standard) => (
              <Badge
                key={standard}
                variant={selectedStandards.includes(standard) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleStandard(standard)}
              >
                {standard}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              disabled={isLoading}
            />
            <Button type="button" variant="outline" onClick={addTag} disabled={isLoading}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lab Files</h3>

        <div className="space-y-2">
          <Label>Simulation Manifest *</Label>
          <FileUpload
            accept=".json"
            multiple={false}
            onFilesChange={(files) => setManifestFile(files[0] || null)}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Upload the JSON manifest file that defines your simulation configuration
          </p>
        </div>

        <div className="space-y-2">
          <Label>Asset Files</Label>
          <FileUpload
            accept="image/*,.js,.wasm,.bin"
            multiple={true}
            onFilesChange={setAssetFiles}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Upload any additional files needed for your simulation (images, scripts, etc.)
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit for Review
        </Button>
      </div>
    </form>
  )
}
