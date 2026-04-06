Section-by-section explanation
Product vision
This section makes the AI define what the product actually is in one sentence. Your page already suggests the positioning: a system that helps engineers regain momentum and trust in themselves through small, practical, continuous progress.

Without this section, many coding agents start building random features without a clear product thesis. The thesis should stay anchored in the Kaizen philosophy and engineering project progress.

SaaS business model
Your page currently mixes a founding lifetime offer with mention of regular monthly pricing at $39/month, which means the product has the ingredients for a recurring SaaS model plus launch offers. This section helps the AI separate launch pricing from long-term monetization and structure paid tiers around mentorship, analytics, community, and career support.

User personas
Your page speaks to people overwhelmed by too many tutorials, guilty about inconsistency, and frustrated by losing momentum. So the AI must define personas around that emotional reality, not only demographics.

This is critical because beginner learners, advanced project-builders, and professionals upgrading skills will use the platform differently even if they all join for engineering growth.

User journey
The page already contains the emotional funnel: excitement, inconsistency, guilt, restart, lost confidence, then a new adaptive system that makes progress sustainable. This section tells the AI to turn that narrative into screens, flows, and habits.

That gives you a product journey, not just a set of pages.

Information architecture
Your current page promises many areas: projects, learning paths, mentors, analytics, community, certifications, and career services. The information architecture section tells the AI to convert those promises into actual product areas, navigation, and app structure.

Without this, the coder may deliver disconnected pages instead of a coherent SaaS.

Feature modules
This section breaks the app into systems the team can implement one by one. It matches the page’s real value pillars such as daily ritual, project labs, structured paths, mentor check-ins, weekly reports, and community support.

It also forces the AI to separate MVP from V2, which is important because your source concept is broad.

Daily ritual system
This is probably your signature differentiator because the page explicitly highlights a 3-step daily engineering ritual: Brain Dump, Daily Highlight, and Micro-Commitment. So this section makes the AI design that feature in operational detail rather than leaving it as marketing copy.

This is the core retention engine.

Learning experience design
The page mentions structured paths across embedded systems, IoT, robotics, and more, with adaptive pacing and real-life flexibility. This section ensures the AI turns that into a progression system with prerequisites, lessons, projects, pacing, and recommendations.

Project system
Your page repeatedly emphasizes hands-on labs, practical assignments, real prototypes, project completion, and estimated vs actual project duration. This means the project engine should be central, not an afterthought.

This section is what makes the app feel like engineering practice rather than passive watching.

Analytics system
The page explicitly promises weekly engineering insights, progress reports, learning analytics, and visibility into whether users are building skills or just staying busy. This section forces the AI to define exactly what the platform should measure and how those metrics appear to users and admins.

Community system
The page mentions interactive forums, peer support, project sharing, and a large engineering community presence. This section tells the AI to design a real community layer with moderation and accountability, instead of simply adding a comment box.

Mentorship system
Mentor support and office hours are directly promised on the page, including weekly accountability and professional guidance. So the AI must treat mentorship as a product workflow with booking, notes, check-ins, escalation, and tracking—not just a vague “contact mentor” button.

Certification and career layer
Your page includes certifications and career services as part of the value proposition. This section makes the AI define how learning converts into visible career proof such as badges, portfolio evidence, and readiness indicators.

Admin and CMS
Since your current product already includes pricing, offers, courses, future updates, and learning assets, you’ll need a back office to manage tracks, users, mentors, campaigns, and community operations at scale. This section ensures the coder doesn’t forget the operator side of the business.

Database schema
Your offer is not simple content access; it includes membership, progress tracking, projects, mentor interactions, analytics, and certifications. That means the database must be designed around user behavior and progression, not just course tables.

This section forces the AI to think in terms of entities and relationships before coding.

Backend architecture
Because the product includes subscriptions, structured learning, mentor workflows, notifications, analytics, and uploaded evidence, you need a backend that handles authentication, payments, storage, event tracking, and roles cleanly. This section makes the AI propose a coherent backend instead of improvised API routes.

Frontend architecture
Since this should behave like a SaaS app rather than a landing page, it needs authenticated layouts, dashboards, widgets, responsive flows, and clear state handling. This section makes the AI define the app shell and the real user interface architecture.

Design direction
Your page’s identity is engineering-focused, practical, momentum-driven, and anti-overwhelm. That means the UI should feel disciplined, technical, clean, and progress-oriented rather than flashy or like a generic LMS template.

This section ensures the AI translates the brand into product design language.

MVP plan
Your page sells a broad promise, but your first launch should focus on the smallest product that proves daily usage and measurable progress. This section tells the AI to cut scope and identify the shortest path to a working SaaS.

Implementation roadmap
Because the promise spans habits, projects, community, mentorship, analytics, and career outcomes, the platform should be phased carefully. This section makes the AI organize delivery by dependencies and business value.

AI features
This section is where you let AI improve guidance, next-step recommendations, project troubleshooting, and recovery after missed days. That aligns with the page’s promise that the platform should adapt to the learner’s pace and energy rather than forcing unrealistic consistency.

Retention engine
Your source page is fundamentally about keeping people from quitting, losing confidence, and restarting endlessly. So retention is not a side metric; it is the core product thesis.

This section forces the AI to design comeback flows, reminder logic, low-energy mode, and weekly rituals.

Metrics
Because the product goal is sustained engineering progress, the most important metrics are not pageviews but activation, daily and weekly usage, project completion, mentor engagement, and recovery after inactivity. This section ensures the product is managed like a SaaS business.

Launch strategy
Your current page already uses a founding-member narrative, discount framing, and invite-style urgency. This section tells the AI to connect that launch model to beta testing, onboarding, early feedback, and the transition from sales page to real product.

Better way to use this prompt
Don’t ask your AI coder to both architect and code everything in one shot. A better sequence is:

Run the master prompt above.

Ask it to refine the MVP only.

Ask it to generate the database schema.

Ask it to generate the full PRD.

Ask it to generate the app routes and page map.

Ask it to scaffold the codebase.

Ask it to build one module at a time.

That staged approach usually gives better output quality for a SaaS this broad.

Recommended follow-up prompts
After the master prompt, use these smaller prompts.

Prompt 2 — generate PRD
text
Using the architecture you just created, now write a startup-quality PRD for the MVP only.

Include:
- problem
- goals
- non-goals
- personas
- user stories
- acceptance criteria
- page list
- feature requirements
- analytics events
- edge cases
- launch scope

Be decisive and product-manager level detailed.
Prompt 3 — database design
text
Now generate the PostgreSQL schema for the MVP.

Include:
- SQL table definitions
- enums where useful
- indexes
- foreign keys
- row-level access notes
- audit fields
- seed data suggestions

Use a Supabase-friendly structure.
Prompt 4 — app scaffolding
text
Now scaffold the full codebase for this SaaS using:
- Next.js
- TypeScript
- Tailwind
- Supabase
- Stripe
- PostHog

Generate:
- folder structure
- route structure
- shared UI components
- database client setup
- auth flow
- dashboard shell
- MVP pages
- dummy seed data
Prompt 5 — build module by module
text
Now build the Daily Ritual module first.

Requirements:
- Brain Dump
- Daily Highlight
- Micro-Commitment
- save state in database
- dashboard widget
- streak logic
- low-energy mode
- weekly summary integration

Generate complete code files and explain where each file goes.
My recommendation
The most important instruction in your prompt is this: “This is not just a course website.” That sentence matters because your current page clearly sells an adaptive engineering momentum system with rituals, projects, mentor support, analytics, and career progression, which is much bigger than content hosting.