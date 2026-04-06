export type ProjectStatus = "idea" | "building" | "testing" | "live";
export type ProjectCategory = "SaaS" | "Embedded Systems" | "AI Tools" | "Courses" | "Experiments";
export type MonetizationStage = "Free" | "Paid" | "MVP" | "Scaled";
export type DemoType = "iframe" | "screenshots" | "external";
export type FeatureRequestStatus = "submitted" | "planned" | "in_progress" | "shipped" | "rejected";
export type FeedbackVisibility = "pending" | "approved" | "rejected";
export type LeadType = "course_waitlist" | "paid_beta" | "client_inquiry";

export type Project = {
  id: string;
  slug: string;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number; // 0..100
  description: string; // one-line
  problem: string;
  why: string;
  next_step: string;
  monetization_stage: MonetizationStage;
  tech_stack: string[];

  // Preview / try it
  demo_url?: string;
  github_url?: string;
  course_url?: string;
  preview_image_url?: string;
  demo_type?: DemoType;
  demo_embed_url?: string;
  screenshot_urls?: string[];
  repo_url?: string;
  course_waitlist_url?: string;
  beta_url?: string;
  client_inquiry_url?: string;
};

export type BuildLogEntry = {
  id: string;
  project_id: string;
  created_at: string; // ISO
  message: string;
  phase?: string;
};

export type ProjectAsset = {
  id: string;
  project_id: string;
  asset_type: string;
  url: string;
  caption?: string;
  sort_order: number;
  created_at: string;
};

export type FeatureRequest = {
  id: string;
  project_id: string;
  fingerprint: string;
  request_text: string;
  created_at: string;
  status: FeatureRequestStatus;
  public_note?: string;
  target_release?: string;
};

export type FeedbackItem = {
  id: string;
  project_id: string;
  fingerprint?: string;
  comment: string;
  created_at: string;
  visibility_status: FeedbackVisibility;
  is_featured: boolean;
  moderation_note?: string;
};

