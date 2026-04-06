import type { BuildLogEntry, MonetizationStage, Project, ProjectCategory, ProjectStatus } from "@/lib/types";

// Deterministic UUID-ish strings (valid UUID format).
const uuids = {
  esp32: "11111111-1111-1111-1111-111111111111",
  saas: "22222222-2222-2222-2222-222222222222",
  ai: "33333333-3333-3333-3333-333333333333",
  course: "44444444-4444-4444-4444-444444444444",
  exp: "55555555-5555-5555-5555-555555555555",
};

const status = (s: ProjectStatus): ProjectStatus => s;
const category = (c: ProjectCategory): ProjectCategory => c;
const monetization = (m: MonetizationStage): MonetizationStage => m;

export const seedProjects: Project[] = [
  {
    id: uuids.esp32,
    slug: "esp32-mqtt-lab",
    name: "ESP32 + MQTT Control Lab",
    status: status("building"),
    category: category("Embedded Systems"),
    progress: 40,
    description: "A real device dashboard: publish sensors, control actuators, log everything.",
    problem: "Most IoT demos stop at blinking LEDs. Real work needs reliability, telemetry, and iteration speed.",
    why: "Because embedded systems improve through tight feedback loops: measure -> tweak -> ship.",
    next_step: "Integrate device registry + live command queue (with retries).",
    monetization_stage: monetization("MVP"),
    tech_stack: ["ESP32", "Arduino", "MQTT", "MQTT over TLS", "React", "Node.js"],
    demo_type: "external",
    demo_url: "https://example.com/esp32-mqtt-lab",
    screenshot_urls: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    ],
    repo_url: "https://github.com/ashraf-lab/esp32-mqtt-lab",
    course_waitlist_url: "https://example.com/waitlist/embedded-lab",
  },
  {
    id: uuids.saas,
    slug: "saas-productivity-tool",
    name: "SaaS Productivity Tool",
    status: status("testing"),
    category: category("SaaS"),
    progress: 65,
    description: "Turn weekly engineering planning into measurable output with tiny workflows.",
    problem: "Teams plan with vibes, not systems. Execution needs lightweight structure.",
    why: "Shipping software is a pipeline problem. This tool makes the pipeline visible.",
    next_step: "Add activity scoring + exportable build reports for client updates.",
    monetization_stage: monetization("Paid"),
    tech_stack: ["Next.js", "Postgres", "Supabase", "Auth", "Analytics", "Webhooks"],
    demo_type: "iframe",
    demo_url: "https://example.com/saas-productivity",
    demo_embed_url: "https://example.com/saas-productivity/embed",
    screenshot_urls: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80",
    ],
    repo_url: "https://github.com/ashraf-lab/saas-productivity-tool",
    beta_url: "https://example.com/beta/saas-productivity",
  },
  {
    id: uuids.ai,
    slug: "ai-assistant-building-lab",
    name: "AI Assistant for Builders",
    status: status("building"),
    category: category("AI Tools"),
    progress: 30,
    description: "From messy notes to actionable build plans: tasks, checklists, and risk flags.",
    problem: "AI outputs feel good, but builders need plans they can execute tomorrow.",
    why: "We want the assistant to behave like an engineer: clarify, constrain, and propose next steps.",
    next_step: "Add project templates (embedded/SaaS/education) + evaluation prompts.",
    monetization_stage: monetization("Free"),
    tech_stack: ["LLM", "RAG", "TypeScript", "Function calling", "Vector DB", "Next.js"],
    demo_type: "external",
    demo_url: "https://example.com/ai-assistant",
    screenshot_urls: [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80",
    ],
    repo_url: "https://github.com/ashraf-lab/ai-assistant-building-lab",
    beta_url: "https://example.com/beta/ai-assistant",
  },
  {
    id: uuids.course,
    slug: "online-course-foundations",
    name: "Online Course: Engineering Foundations",
    status: status("idea"),
    category: category("Courses"),
    progress: 15,
    description: "A course that trains the builder mindset: ship, test, iterate, and document.",
    problem: "Most courses teach concepts; few teach execution habits that compound.",
    why: "The fastest way to teach is to build in public and turn the lessons into curriculum.",
    next_step: "Outline modules and record 1 pilot lesson using the live projects as case studies.",
    monetization_stage: monetization("Free"),
    tech_stack: ["Curriculum", "Live labs", "Quizzes", "Projects-as-examples"],
    demo_type: "screenshots",
    screenshot_urls: [
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80",
    ],
    course_url: "https://example.com/course-preview/foundations",
    course_waitlist_url: "https://example.com/waitlist/engineering-foundations",
  },
  {
    id: uuids.exp,
    slug: "experimental-edge-tool",
    name: "Experimental Edge Tool",
    status: status("testing"),
    category: category("Experiments"),
    progress: 55,
    description: "A sandbox for turning sensor data into edge alerts with minimal latency.",
    problem: "Edge AI is exciting, but deploying reliable triggers is hard.",
    why: "We test ideas with real constraints: latency, cost, power, and failure modes.",
    next_step: "Benchmark trigger latency and add a safe simulation mode for offline development.",
    monetization_stage: monetization("MVP"),
    tech_stack: ["Edge runtime", "Streaming", "Rules engine", "MQTT", "Dashboards"],
    demo_type: "external",
    demo_url: "https://example.com/experimental-edge-tool",
    screenshot_urls: [
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=80",
    ],
    beta_url: "https://example.com/beta/edge-tool",
  },
];

export const seedBuildLogs: BuildLogEntry[] = [
  // ESP32 + MQTT
  {
    id: "a1111111-1111-1111-1111-111111111111",
    project_id: uuids.esp32,
    created_at: "2026-03-01T09:00:00Z",
    phase: "Firmware",
    message: "Booted v0.1: sensor sampling + MQTT publish loop with timestamps.",
  },
  {
    id: "a1111111-1111-1111-1111-111111111112",
    project_id: uuids.esp32,
    created_at: "2026-03-05T16:30:00Z",
    phase: "Networking",
    message: "Added reconnect strategy + offline queue for commands during WiFi drops.",
  },
  {
    id: "a1111111-1111-1111-1111-111111111113",
    project_id: uuids.esp32,
    created_at: "2026-03-12T12:10:00Z",
    phase: "Dashboard",
    message: "Built initial device dashboard UI (subscribe + toggle actuators).",
  },

  // SaaS Productivity Tool
  {
    id: "b2222222-2222-2222-2222-222222222222",
    project_id: uuids.saas,
    created_at: "2026-02-25T11:20:00Z",
    phase: "Core",
    message: "Designed workflow model: tasks -> check-ins -> weekly build report.",
  },
  {
    id: "b2222222-2222-2222-2222-222222222223",
    project_id: uuids.saas,
    created_at: "2026-03-07T08:45:00Z",
    phase: "Testing",
    message: "Tested analytics events and built export format (client-ready updates).",
  },
  {
    id: "b2222222-2222-2222-2222-222222222224",
    project_id: uuids.saas,
    created_at: "2026-03-14T18:05:00Z",
    phase: "Iteration",
    message: "Added activity scoring prototype to highlight execution bottlenecks.",
  },

  // AI Assistant
  {
    id: "c3333333-3333-3333-3333-333333333333",
    project_id: uuids.ai,
    created_at: "2026-03-02T13:00:00Z",
    phase: "Prompting",
    message: "Created builder prompt template with constraints and next-step output.",
  },
  {
    id: "c3333333-3333-3333-3333-333333333334",
    project_id: uuids.ai,
    created_at: "2026-03-06T20:30:00Z",
    phase: "RAG",
    message: "Wired a small knowledge base (docs + examples) for project template retrieval.",
  },
  {
    id: "c3333333-3333-3333-3333-333333333335",
    project_id: uuids.ai,
    created_at: "2026-03-10T09:40:00Z",
    phase: "Evaluation",
    message: "Added evaluation prompts to measure whether outputs are actionable.",
  },

  // Course Idea
  {
    id: "d4444444-4444-4444-4444-444444444444",
    project_id: uuids.course,
    created_at: "2026-03-03T10:00:00Z",
    phase: "Outline",
    message: "Mapped curriculum modules to real build logs (case studies first).",
  },
  {
    id: "d4444444-4444-4444-4444-444444444445",
    project_id: uuids.course,
    created_at: "2026-03-08T15:15:00Z",
    phase: "Pilot",
    message: "Recorded pilot lesson storyboard: problem -> experiment -> reflection.",
  },
  {
    id: "d4444444-4444-4444-4444-444444444446",
    project_id: uuids.course,
    created_at: "2026-03-13T17:25:00Z",
    phase: "Curriculum",
    message: "Drafted quizzes and lab instructions for execution-focused learning.",
  },

  // Experimental Edge Tool
  {
    id: "e5555555-5555-5555-5555-555555555555",
    project_id: uuids.exp,
    created_at: "2026-03-01T08:00:00Z",
    phase: "Simulation",
    message: "Built offline simulation for sensor streams so we can test alerts without hardware.",
  },
  {
    id: "e5555555-5555-5555-5555-555555555556",
    project_id: uuids.exp,
    created_at: "2026-03-09T14:30:00Z",
    phase: "Edge",
    message: "Implemented rules engine to trigger edge alerts with predictable latency.",
  },
  {
    id: "e5555555-5555-5555-5555-555555555557",
    project_id: uuids.exp,
    created_at: "2026-03-15T10:10:00Z",
    phase: "Benchmark",
    message: "Benchmarked trigger latency under different message loads (latency/cost trade-offs).",
  },
];

