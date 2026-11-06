// All facts here come from the resume (hake_sampat_121.pdf). Do not invent numbers.

export const profile = {
  name: "Sampat Hake",
  role: "Backend & AI Engineer",
  now: "SDE 2, Backend at Kotak Mahindra Bank",
  location: "Bangalore, India",
  email: "hake.sampat.121@gmail.com",
  linkedin: "https://www.linkedin.com/in/sampatraohake121",
  github: "https://github.com/SamieZian",
  instagram: "https://instagram.com/sampat_hake_",
  resume: "/Sampat_Hake_Resume.pdf",
  formspree: "https://formspree.io/f/xjgdnndy",
  roles: ["backend systems", "AI agents", "MCP platforms", "lending rails", "event pipelines"],
};

export const stats = [
  { value: 5, suffix: " yrs", label: "building backend and AI systems" },
  { value: 1000, suffix: "+", label: "organizations on my agent platform" },
  { value: 2000, suffix: "+", label: "agent executions a day" },
  { value: 1, suffix: "M+", label: "users on a serverless pipeline" },
  { value: 95, suffix: "%", prefix: "~", label: "less LLM context per query" },
];

export const companies = [
  "Kotak Mahindra Bank",
  "Clientell AI",
  "WizCommerce",
  "Cogno AI · Exotel",
  "Guavus · Thales",
];

export type Scene = {
  id: "loans" | "mcp" | "router" | "async" | "events" | "lambda";
  company: string;
  title: string;
  body: string;
  metrics: { k: string; v: string }[];
};

// One scene per animated system diagram in the System Map section.
export const scenes: Scene[] = [
  {
    id: "loans",
    company: "Kotak Mahindra Bank · now",
    title: "Loan origination, end to end",
    body: "Gold Loan (GLOS) and Vehicle Loan (VLOS) origination: secure, highly available platforms that carry a retail loan from application and KYC through collateral valuation, underwriting, sanction and disbursement.",
    metrics: [
      { k: "stages", v: "6" },
      { k: "products", v: "Gold · Vehicle" },
    ],
  },
  {
    id: "mcp",
    company: "Clientell AI",
    title: "One MCP layer, nine enterprise tools",
    body: "A multi tenant Model Context Protocol connector platform. Agent queries fan out to Gmail, Outlook, Calendar, Drive, SharePoint, Teams, Dropbox and Jira in parallel and merge back into one answer.",
    metrics: [
      { k: "providers", v: "9" },
      { k: "orgs", v: "1,000+" },
      { k: "runs / day", v: "2,000+" },
    ],
  },
  {
    id: "router",
    company: "Clientell AI",
    title: "An LLM router that killed tool loops",
    body: "Replaced keyword routing with a hierarchical LLM classifier and a lightweight MCP agent that skips a 225KB unified prompt. No more tool call loops, far less context.",
    metrics: [
      { k: "context", v: "−95%" },
      { k: "prompt skipped", v: "225KB" },
    ],
  },
  {
    id: "async",
    company: "Clientell AI",
    title: "Sync to async, 11 workers deep",
    body: "Moved AI workflow execution onto Redis queues with connection pools tuned per worker across 11 Uvicorn workers.",
    metrics: [
      { k: "p95", v: "900 → 250ms" },
      { k: "throughput", v: "+45%" },
    ],
  },
  {
    id: "events",
    company: "WizCommerce",
    title: "ERP sync that never drops a record",
    body: "QuickBooks, NetSuite and SOS Inventory integrations on an event driven layer: GCP Pub/Sub, Cloud Tasks and Change Data Capture.",
    metrics: [
      { k: "accuracy", v: "100%" },
      { k: "files / month", v: "5K+" },
      { k: "data lag", v: "−40%" },
    ],
  },
  {
    id: "lambda",
    company: "Cogno AI",
    title: "A million users on Lambda",
    body: "Campaign processing moved onto serverless AWS Lambda and SQS, plus a service that provisions SQS, S3 and Lambda for every new client.",
    metrics: [
      { k: "runtime", v: "5h → 30m" },
      { k: "setup effort", v: "−90%" },
    ],
  },
];

export type Role = {
  company: string;
  note?: string;
  title: string;
  place: string;
  dates: string;
  current?: boolean;
  points: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Kotak Mahindra Bank",
    title: "Software Development Engineer 2, Backend",
    place: "Bangalore",
    dates: "Sep 2026 – Present",
    current: true,
    points: [
      "Building the Gold Loan Origination System (GLOS) and Vehicle Loan Origination System (VLOS).",
      "Secure, high availability digital lending: application, KYC, collateral valuation, underwriting, sanction and disbursement.",
    ],
    stack: ["Backend", "Lending", "KYC", "High availability"],
  },
  {
    company: "Clientell AI",
    title: "Senior Software Engineer, Founding Engineer",
    place: "Bangalore",
    dates: "Oct 2025 – Aug 2026",
    points: [
      "Architected a multi tenant MCP connector platform across 9 enterprise providers, powering AI agents for 1,000+ organizations and 2,000+ daily executions.",
      "Hierarchical LLM classifier + lightweight MCP agent: no tool call loops, ~95% less connector context.",
      "Async rewrite on Redis queues across 11 Uvicorn workers: +45% throughput, p95 900ms → 250ms.",
      "Two phase code generation agent on GitHub MCP for Salesforce Apex/LWC (−20% manual effort) and a Slack AI assistant (+23% adoption).",
      "Langfuse tracing, Slack incident alerts (30% faster response), 4 services through Salesforce CASA certification.",
    ],
    stack: ["Python", "FastAPI", "MCP", "Redis", "Langfuse", "Nginx", "SSE"],
  },
  {
    company: "WizCommerce",
    title: "Software Development Engineer 1, Backend",
    place: "Bangalore",
    dates: "Jan 2024 – Sep 2025",
    points: [
      "Led QuickBooks, NetSuite and SOS Inventory integrations at 100% data accuracy; secure FTP pipeline for 5K+ files a month at 99.9% uptime.",
      "Event driven pipelines on GCP Pub/Sub, Cloud Tasks and CDC: 98% sync accuracy, 40% less data lag.",
      "Image transformation service cut from 10s to 2s; designed a PIM platform and RBAC system.",
    ],
    stack: ["Python", "GCP Pub/Sub", "Cloud Tasks", "CDC", "PostgreSQL"],
  },
  {
    company: "Cogno AI",
    note: "acquired by Exotel",
    title: "Software Development Engineer 1, Backend",
    place: "Mumbai (Remote)",
    dates: "Oct 2022 – Jan 2024",
    points: [
      "Scaled campaign processing to 1M+ users on AWS Lambda + SQS: runtime 5 hours → 30 minutes.",
      "AWS provisioning microservice (SQS, S3, Lambda): −90% setup per client.",
      "Django crons → Apache Airflow DAGs (+30% reliability); shipped Cogno Drive for 1K+ daily uploads.",
    ],
    stack: ["Python", "AWS Lambda", "SQS", "S3", "Airflow", "Django"],
  },
  {
    company: "Guavus",
    note: "Thales Group",
    title: "Software Development Engineer Intern, Full Stack",
    place: "Gurugram",
    dates: "Oct 2021 – Jun 2022",
    points: [
      "Re-architected SQLstream and NWDAF components: +40% execution performance, −30% deployment time.",
      "REST APIs and end to end test infrastructure at 98% coverage on critical components.",
    ],
    stack: ["Python", "SQLstream", "NWDAF", "REST"],
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Python", "Go", "TypeScript", "JavaScript", "SQL"],
  "AI / LLM": ["AI Agents", "MCP", "LLM Routing", "RAG", "Prompt Engineering", "Claude & OpenAI APIs", "Langfuse Evals", "Guardrails"],
  Backend: ["FastAPI", "Django", "Node.js", "REST", "Microservices", "Event Driven", "SSE", "WebSockets"],
  "Data & Cloud": ["PostgreSQL", "Redis", "Kafka", "Elasticsearch", "GCP Pub/Sub", "AWS Lambda", "SQS", "S3", "Docker", "Nginx", "Airflow", "GitHub Actions"],
};

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Dr. Babasaheb Ambedkar Technological University, Lonere",
  years: "2018 – 2022",
  cgpa: "8.81 / 10",
  certs: ["Building with the Claude API", "Introduction to Model Context Protocol", "Claude Code in Action"],
};
