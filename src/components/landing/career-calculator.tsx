"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    Sparkles, 
    TrendingUp, 
    Briefcase, 
    ArrowRight, 
    CheckCircle2, 
    Building2, 
    Zap, 
    Layers, 
    Code, 
    BrainCircuit, 
    Server, 
    Smartphone, 
    Clock, 
    Flame, 
    Search, 
    X, 
    BookOpen, 
    Shield, 
    Terminal, 
    Cpu, 
    ExternalLink, 
    GraduationCap, 
    Check, 
    Palette, 
    BarChart3, 
    Gamepad2, 
    Cloud, 
    FolderKanban, 
    TestTube2,
    Database,
    Wrench,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SyllabusPhase {
    phase: string;
    weeks: string;
    title: string;
    description: string;
    languages: string[];
    frameworksTools: string[];
    fundamentalConcepts: string[];
    advancedSystemTopics: string[];
    capstoneProject: {
        title: string;
        deliverable: string;
        features: string[];
    };
    interviewDsaPrep: string;
}

interface CareerTrack {
    id: string;
    title: string;
    shortTitle: string;
    icon: React.ElementType;
    badge: string;
    demandPercent: number;
    timelineWeeks: number;
    level: string;
    prerequisites: string;
    primaryLanguages: string[];
    primaryFrameworks: string[];
    keywords: string[];
    isCustom?: boolean;
    tiers: {
        label: string;
        subLabel: string;
        ctc: string;
        monthlyInHand: string;
        multiplier: string;
    }[];
    skills: { name: string; tag: string }[];
    topCompanies: string[];
    syllabus: SyllabusPhase[];
    coursesSlug: string;
}

const STATIC_CAREER_TRACKS: CareerTrack[] = [
    {
        id: "fullstack-ai",
        title: "Fullstack AI Engineer",
        shortTitle: "Fullstack AI",
        icon: BrainCircuit,
        badge: "Highest Demand",
        demandPercent: 98,
        timelineWeeks: 16,
        level: "Beginner to Enterprise Architect",
        prerequisites: "Zero prior coding required (Starts from Absolute Scratch)",
        primaryLanguages: ["TypeScript 5.4", "JavaScript ES2024", "Python 3.12", "SQL", "Bash"],
        primaryFrameworks: ["Next.js 15", "React 19", "LangChain", "Node.js", "PostgreSQL", "Docker", "AWS"],
        keywords: ["fullstack", "ai", "react", "nextjs", "python", "langchain", "node", "javascript", "developer", "software", "web developer", "mern", "mean"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Graduate Entry", ctc: "₹6.5 - 11 LPA", monthlyInHand: "₹48k - ₹78k / mo", multiplier: "3.2x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Full Product Dev", ctc: "₹14.0 - 24 LPA", monthlyInHand: "₹95k - ₹1.6L / mo", multiplier: "4.5x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "AI Systems Architect", ctc: "₹28.0 - 45+ LPA", monthlyInHand: "₹1.9L - ₹3.1L / mo", multiplier: "6.2x" },
        ],
        skills: [
            { name: "Next.js 15 & React 19", tag: "Frontend" },
            { name: "Python & LangChain", tag: "AI / LLM" },
            { name: "Node.js & PostgreSQL", tag: "Backend" },
            { name: "Vector DBs (Pinecone)", tag: "RAG" },
            { name: "Docker & Cloud Deploy", tag: "DevOps" },
        ],
        topCompanies: ["Microsoft", "Google", "Swiggy", "Razorpay", "Uber"],
        syllabus: [
            {
                phase: "Phase 1: Absolute Foundations to Modern Frontend Architecture",
                weeks: "Weeks 1 - 4",
                title: "Frontend Foundations, React 19 & Next.js 15 App Router",
                description: "Starts from basic HTML5 semantics, CSS flexbox/grid, and JavaScript internals up to enterprise Next.js 15 server components.",
                languages: ["HTML5", "CSS3 / Tailwind v4", "JavaScript (ES6+ to ES2024)", "TypeScript 5.4"],
                frameworksTools: ["React 19", "Next.js 15 (App Router)", "Zod Schema Validator", "Framer Motion", "Git / GitHub"],
                fundamentalConcepts: [
                    "Variables (let, const, var), Scope, Hoisting & Memory Lifecycle",
                    "Data Types, Deep Cloning, Closures & First-Class Functions",
                    "Event Loop, Microtasks, Macrotasks, Promises & Async/Await",
                    "DOM Tree Manipulation, Event Delegation & Browser Rendering Pipeline",
                    "TypeScript Strict Typing, Generics, Enums, Type Narrowing & Interfaces"
                ],
                advancedSystemTopics: [
                    "React 19 Compiler, Server Components (RSC) vs Client Components",
                    "Next.js Server Actions, Streaming SSR, Parallel & Intercepting Routes",
                    "State Machines, Zustand Atomic State vs Context API performance",
                    "Optimistic UI updates, caching strategies, and Core Web Vitals optimization"
                ],
                capstoneProject: {
                    title: "Modern SaaS Analytics & Billing Dashboard",
                    deliverable: "Live deployed Next.js 15 App with custom design system and dark mode",
                    features: ["Dynamic real-time charting", "Role-based auth with OAuth", "Stripe Checkout billing webhooks", "Zod-validated reactive forms"]
                },
                interviewDsaPrep: "Array manipulation, HashMaps, Two-Pointers, DOM tree traversal & React Machine Coding rounds"
            },
            {
                phase: "Phase 2: Scalable Backend, Microservices & Database Engineering",
                weeks: "Weeks 5 - 8",
                title: "Node.js Concurrency, Relational Databases & Distributed Caching",
                description: "Build robust REST & WebSocket microservices with ACID transactional guarantees and sub-millisecond Redis caching.",
                languages: ["Node.js Runtime", "TypeScript", "SQL (PostgreSQL syntax)", "Bash Scripting"],
                frameworksTools: ["Express.js", "Fastify", "PostgreSQL", "Prisma ORM", "Redis", "Socket.io", "Postman"],
                fundamentalConcepts: [
                    "Node.js Event-driven Architecture, Libuv threadpool & Streams/Buffers",
                    "Relational schema modeling: Normalization (1NF to 3NF) & Foreign Keys",
                    "CRUD operations, complex SQL JOINs (Inner, Left, Cross, Self)",
                    "HTTP Status Codes, Headers, CORS, Cookies & JWT Token signing",
                    "RESTful architectural constraints & API versioning standards"
                ],
                advancedSystemTopics: [
                    "PostgreSQL Indexing (B-Tree, GIN, Hash) & EXPLAIN query execution plan optimization",
                    "ACID transactions, Database Connection Pooling (PgBouncer) & row locking",
                    "Redis In-Memory Caching patterns (Cache-Aside, Write-Through) & Rate Limiting",
                    "Real-time bidirectional communication via WebSockets & pub/sub messaging",
                    "Role-Based Access Control (RBAC) and CSRF/XSS protection headers"
                ],
                capstoneProject: {
                    title: "High-Concurrency Real-time Collaborative Workspace",
                    deliverable: "Production microservice backend supporting 1,000+ live WebSocket connections",
                    features: ["Live document editing with cursor presence", "Redis distributed session store", "Prisma multi-tenant schema", "Automated rate limiting middleware"]
                },
                interviewDsaPrep: "LinkedLists, Stacks, Queues, Sliding Window, API Design & Database Schema Normalization interviews"
            },
            {
                phase: "Phase 3: Generative AI, LLM Orchestration & Vector Search (RAG)",
                weeks: "Weeks 9 - 12",
                title: "Autonomous AI Agents, Vector Databases & Enterprise RAG",
                description: "Integrate Large Language Models into software systems with retrieval-augmented generation and autonomous agentic workflows.",
                languages: ["Python 3.12", "TypeScript", "SQL (pgvector)"],
                frameworksTools: ["LangChain", "LlamaIndex", "OpenAI / Gemini API", "Pinecone Vector DB", "pgvector", "FastAPI"],
                fundamentalConcepts: [
                    "Python OOP, Type Hints, Virtual Environments & AsyncIO",
                    "Prompt Engineering (Few-shot, Chain-of-Thought, ReAct prompting)",
                    "Tokens, Context Windows, Temperature, Top-P, and LLM Hyperparameters",
                    "Vector Embeddings (text-embedding-3-small) & Cosine Similarity math",
                    "Document parsing (PDF, Markdown, HTML) & Text Chunking strategies"
                ],
                advancedSystemTopics: [
                    "Retrieval-Augmented Generation (RAG) Architecture with hybrid semantic search",
                    "Vector Indexing (HNSW, IVFFlat) & metadata filtering in Pinecone and pgvector",
                    "Autonomous AI Agents with Tool Calling, Function Execution & Reflection Loops",
                    "LLM Evaluation, Hallucination mitigation, Guardrails & Cost/Token optimizations",
                    "Streaming LLM token responses over Server-Sent Events (SSE) to frontend"
                ],
                capstoneProject: {
                    title: "Enterprise Multi-Source Knowledge Base & Autonomous Copilot",
                    deliverable: "Production RAG engine indexing 10,000+ pages with verified source citations",
                    features: ["Automated PDF/Doc ingestion pipeline", "Semantic vector retrieval with hybrid search", "Interactive chat with streaming SSE responses", "Tool-calling agent that queries PostgreSQL"]
                },
                interviewDsaPrep: "Binary Search, Trees, Graphs (BFS/DFS), Vector search complexity & AI System Architecture questions"
            },
            {
                phase: "Phase 4: Cloud DevOps, System Design & FAANG Placement Readiness",
                weeks: "Weeks 13 - 16",
                title: "Docker, Kubernetes, AWS Cloud & High/Low Level System Design",
                description: "Containerize, deploy on global cloud infrastructure with automated CI/CD, and master technical interview rounds.",
                languages: ["YAML", "Dockerfile syntax", "Terraform HCL", "Bash"],
                frameworksTools: ["Docker", "Kubernetes", "AWS (EC2, S3, RDS, ECS)", "GitHub Actions", "Vercel Enterprise", "NGINX"],
                fundamentalConcepts: [
                    "Linux Permissions, Processes, Systemctl & Environment Variables",
                    "Containerization basics: Images vs Containers, Layer Caching, Volumes",
                    "Git branching workflows (GitFlow, Trunk-based) & Pull Request etiquette",
                    "DNS configuration (A, CNAME, TXT records) & SSL/TLS Certificate generation",
                    "Horizontal vs Vertical Scaling, Load Balancing (Round-Robin, Least Connections)"
                ],
                advancedSystemTopics: [
                    "Multi-stage Docker builds reducing image sizes from 1.2GB to 85MB",
                    "Kubernetes Pods, Services, Ingress, Deployments & Horizontal Pod Autoscaler (HPA)",
                    "GitHub Actions CI/CD pipelines: Lint, Test, Build, Security Scan & Auto-Deploy",
                    "High-Level System Design (HLD): Designing TinyURL, Uber Backend, Netflix CDN",
                    "Low-Level System Design (LLD): SOLID Principles, Factory, Singleton, Strategy patterns"
                ],
                capstoneProject: {
                    title: "End-to-End Enterprise Fullstack Cloud Deployment",
                    deliverable: "Full production system running on AWS ECS with custom domain, SSL, and monitoring",
                    features: ["Zero-downtime CI/CD automated pipeline", "Prometheus & Grafana telemetry dashboards", "Multi-region S3 CDN storage", "Automated database backup replication"]
                },
                interviewDsaPrep: "Dynamic Programming, Graph algorithms, Blind 75 completion, Mock System Design & Behavioral STAR rounds"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "frontend-architect",
        title: "Frontend & UI Architect",
        shortTitle: "Frontend",
        icon: Code,
        badge: "Rapid Hiring",
        demandPercent: 92,
        timelineWeeks: 12,
        level: "Beginner to Staff Frontend Engineer",
        prerequisites: "Zero coding background required",
        primaryLanguages: ["TypeScript 5.4", "JavaScript ES2024", "HTML5", "CSS3 / Sass"],
        primaryFrameworks: ["React 19", "Next.js 15", "Tailwind CSS", "Framer Motion", "Three.js", "TanStack Query", "Zustand"],
        keywords: ["frontend", "ui", "ux", "react", "nextjs", "javascript", "typescript", "tailwind", "web", "design", "css", "html"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "UI Developer", ctc: "₹5.5 - 9.5 LPA", monthlyInHand: "₹42k - ₹68k / mo", multiplier: "2.8x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Core Web Engineer", ctc: "₹12.0 - 20 LPA", monthlyInHand: "₹82k - ₹1.35L / mo", multiplier: "4.0x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Design System Lead", ctc: "₹24.0 - 38 LPA", monthlyInHand: "₹1.65L - ₹2.5L / mo", multiplier: "5.4x" },
        ],
        skills: [
            { name: "Modern TypeScript", tag: "Core" },
            { name: "Tailwind & Framer Motion", tag: "Design" },
            { name: "Web Performance (Core Vitals)", tag: "Opt." },
            { name: "State (Zustand & TanStack)", tag: "Architecture" },
            { name: "Micro-frontends", tag: "Scale" },
        ],
        topCompanies: ["CRED", "Flipkart", "Meesho", "Zomato", "Vercel"],
        syllabus: [
            {
                phase: "Phase 1: Deep JavaScript Mechanics & TypeScript 5 Strict",
                weeks: "Weeks 1 - 3",
                title: "V8 Engine Internals, Prototypes & Strict TypeScript",
                description: "Understand exactly how JavaScript executes under the hood, avoid memory leaks, and master type systems.",
                languages: ["JavaScript ES2024", "TypeScript 5.4 Strict", "HTML5 Canvas API"],
                frameworksTools: ["Vite", "ESLint", "Prettier", "Vitest", "TypeScript Compiler (tsc)"],
                fundamentalConcepts: [
                    "V8 Engine: Call Stack, Memory Heap, Garbage Collector (Mark & Sweep)",
                    "Execution Contexts, Callbacks, Promise Chaining & Polyfilling JS methods",
                    "Prototypes, Prototypal Inheritance & ES6 Class syntactic sugar",
                    "TypeScript Type Gymnastics: Conditional Types, Mapped Types, Infer keyword",
                    "DOM Events: Capturing vs Bubbling phases & Custom Event Dispatching"
                ],
                advancedSystemTopics: [
                    "Web Workers & Service Workers for multi-threaded background processing",
                    "IndexedDB & Cache API for offline persistence",
                    "Intersection Observer, Resize Observer, and Mutation Observer APIs",
                    "Clean code patterns: Functional programming (Currying, Pure Functions, Monads)"
                ],
                capstoneProject: {
                    title: "Headless Reusable Component Library",
                    deliverable: "Published NPM package with 100% test coverage and automated Storybook docs",
                    features: ["Fully keyboard accessible (WAI-ARIA)", "Zero runtime CSS dependencies", "Strict TypeScript typings", "Automated semantic versioning CI/CD"]
                },
                interviewDsaPrep: "Polyfills (bind, map, filter, reduce, promise.all), Debounce/Throttle implementation & TypeScript types"
            },
            {
                phase: "Phase 2: React 19 Internal Architecture & High-Performance State",
                weeks: "Weeks 4 - 6",
                title: "React Fiber Reconciler, Custom Hooks & State Orchestration",
                description: "Master React internals, concurrent rendering, and eliminate unnecessary re-renders completely.",
                languages: ["TypeScript", "JSX / TSX"],
                frameworksTools: ["React 19", "Zustand", "TanStack Query v5", "Jotai", "React Hook Form", "Zod"],
                fundamentalConcepts: [
                    "Virtual DOM vs Real DOM & The React Fiber Reconciler algorithm",
                    "Custom Hooks composition rules & ref forwarding with forwardRef",
                    "Controlled vs Uncontrolled components & Synthetic Event bubbling",
                    "Forms architecture with React Hook Form & Zod schema validation",
                    "React 19 Hooks: use(), useActionState(), useOptimistic(), useFormStatus()"
                ],
                advancedSystemTopics: [
                    "Atomic State Management (Zustand & Jotai) avoiding context provider re-render cascade",
                    "TanStack Query v5 Server State: Cache invalidation, query prefetching, optimistic mutations",
                    "Virtualization: Rendering 100,000 items at 60 FPS using TanStack Virtual",
                    "Code Splitting, Lazy Loading & Dynamic Imports with React.Suspense"
                ],
                capstoneProject: {
                    title: "Linear-style Project & Task Collaboration Board",
                    deliverable: "Ultra-fast offline-first interactive application matching Linear.app UX",
                    features: ["Drag and drop task board with haptics", "Optimistic mutations with instant offline sync", "Infinite canvas virtualization", "Keyboard shortcuts command menu (Cmd+K)"]
                },
                interviewDsaPrep: "React Machine Coding: Autocomplete search bar, Infinite scroll, Nested comments tree & Star rating"
            },
            {
                phase: "Phase 3: Design Systems, Motion Choreography & 3D WebGL",
                weeks: "Weeks 7 - 9",
                title: "Framer Motion, 3D WebGL (Three.js) & Enterprise Design Systems",
                description: "Build interfaces that look like Apple, Stripe, and Linear with fluid micro-interactions and 3D graphics.",
                languages: ["CSS3 Custom Properties", "GLSL Shaders", "TypeScript"],
                frameworksTools: ["Tailwind CSS v4", "Framer Motion 11", "Three.js", "React Three Fiber (R3F)", "Lucide Icons"],
                fundamentalConcepts: [
                    "CSS Specificity, BEM methodology, and Design Token hierarchical variables",
                    "Framer Motion layout animations, gesture handlers, and drag constraints",
                    "Physics springs, damping, stiffness, and layoutId shared element transitions",
                    "3D Coordinates, Meshes, Geometries, Materials, Lights & Cameras in Three.js",
                    "Responsive typography scaling with clamp() and fluid viewport calculations"
                ],
                advancedSystemTopics: [
                    "React Three Fiber (R3F) Canvas integration inside React component trees",
                    "Custom GLSL fragment & vertex shaders for interactive gradient liquid effects",
                    "Micro-interactions: Button ripple, card tilt hover, magnetic cursor physics",
                    "Dark/Light/System theme engine with zero flicker on page load"
                ],
                capstoneProject: {
                    title: "Interactive 3D Apple-Grade Product Showcase Experience",
                    deliverable: "Award-winning 3D showcase site running at continuous 60fps",
                    features: ["Interactive 3D model rotation on scroll", "Dynamic shader lighting that follows mouse", "Choreographed page transition animations", "Responsive mobile touch controls"]
                },
                interviewDsaPrep: "CSS specificity challenges, Flexbox/Grid puzzle challenges, Layout animation mechanics"
            },
            {
                phase: "Phase 4: Web Performance Tuning, Testing & Frontend System Design",
                weeks: "Weeks 10 - 12",
                title: "Google Core Web Vitals, E2E Testing & Machine Coding Interviews",
                description: "Score 100/100 on Google PageSpeed, automate testing with Playwright, and clear Staff Frontend interviews.",
                languages: ["TypeScript", "JSON-LD for SEO"],
                frameworksTools: ["Lighthouse", "Playwright", "Vitest", "Testing Library", "Web Vitals API"],
                fundamentalConcepts: [
                    "Core Web Vitals deep dive: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)",
                    "Resource Hints: preload, prefetch, preconnect, dns-prefetch",
                    "Image optimization: WebP, AVIF formats, responsive srcset and lazy loading",
                    "Unit Testing component behaviors with Vitest & React Testing Library",
                    "End-to-End (E2E) automated browser testing using Playwright"
                ],
                advancedSystemTopics: [
                    "Frontend System Design: Designing Spotify Web Player, Google Docs, Figma Canvas",
                    "Micro-Frontend Architecture using Module Federation",
                    "Client-side caching layers, Service Worker caching strategies (Stale-While-Revalidate)",
                    "Security: Content Security Policy (CSP), Clickjacking, XSS sanitization (DOMPurify)"
                ],
                capstoneProject: {
                    title: "High-Traffic E-Commerce Platform with 100/100 Core Web Vitals",
                    deliverable: "Blazing fast production web store with automated test pipeline",
                    features: ["Under 500ms initial page load speed", "Zero Cumulative Layout Shift (CLS: 0)", "Full automated Playwright checkout test suite", "Structured JSON-LD schema for Google rich snippets"]
                },
                interviewDsaPrep: "Frontend System Design rounds, Live Coding challenges, Web performance audit case studies"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "backend-cloud",
        title: "Backend & Cloud Engineer",
        shortTitle: "Backend / Cloud",
        icon: Server,
        badge: "High Stability",
        demandPercent: 95,
        timelineWeeks: 18,
        level: "Beginner to Principal Systems Architect",
        prerequisites: "Zero coding background required",
        primaryLanguages: ["Go 1.22", "Node.js / TypeScript", "SQL (PostgreSQL)", "Bash"],
        primaryFrameworks: ["Gin (Go)", "Fastify", "PostgreSQL", "Apache Kafka", "Redis", "Docker", "Kubernetes", "AWS"],
        keywords: ["backend", "cloud", "golang", "go", "node", "postgresql", "sql", "api", "database", "redis", "microservices", "java", "spring boot"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Backend", ctc: "₹6.0 - 10.5 LPA", monthlyInHand: "₹45k - ₹74k / mo", multiplier: "3.0x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Distributed Systems", ctc: "₹15.0 - 26 LPA", monthlyInHand: "₹1.05L - ₹1.75L / mo", multiplier: "4.8x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Architect", ctc: "₹30.0 - 52+ LPA", monthlyInHand: "₹2.0L - ₹3.6L / mo", multiplier: "6.8x" },
        ],
        skills: [
            { name: "Go / Node.js High-Perf", tag: "Language" },
            { name: "PostgreSQL & Redis Caching", tag: "Database" },
            { name: "Docker & Kubernetes", tag: "Containers" },
            { name: "Kafka & Event Streams", tag: "Async" },
            { name: "AWS Cloud Infrastructure", tag: "Cloud" },
        ],
        topCompanies: ["Amazon", "Atlassian", "Adobe", "PhonePe", "Groww"],
        syllabus: [
            {
                phase: "Phase 1: High-Performance Go, Node.js & Advanced SQL",
                weeks: "Weeks 1 - 4",
                title: "Concurrency with Go, Goroutines & PostgreSQL Internals",
                description: "Master concurrent programming with Go, low-level memory allocation, and advanced relational SQL queries.",
                languages: ["Go 1.22", "TypeScript", "PostgreSQL SQL"],
                frameworksTools: ["Go Gin", "GORM", "PostgreSQL", "pgAdmin", "Docker"],
                fundamentalConcepts: [
                    "Go Structs, Interfaces, Pointers, Memory Allocation (Stack vs Heap)",
                    "Goroutines, Channels, Select statements & WaitGroups for concurrency",
                    "Race conditions, Mutexes (sync.Mutex, RWMutex) & Atomic operations",
                    "PostgreSQL Schema Design, Foreign Keys, Unique Constraints & Check Constraints",
                    "Complex SQL: Window Functions, Subqueries, Common Table Expressions (CTEs)"
                ],
                advancedSystemTopics: [
                    "PostgreSQL Index mechanics (B-Tree, GIN, BRIN) & Vacuuming internals",
                    "Database Transaction Isolation levels (Read Committed, Repeatable Read, Serializable)",
                    "Connection Pooling with PgBouncer preventing thread exhaustion",
                    "gRPC & Protocol Buffers (Protobuf) for high-speed microservice binary RPCs"
                ],
                capstoneProject: {
                    title: "Ultra-Low Latency Financial Ledger Service",
                    deliverable: "Go microservice capable of executing 20,000 double-entry transactions/sec",
                    features: ["Zero race conditions with distributed database locks", "Full audit trail with immutable ledger rows", "High-speed gRPC endpoints", "Automated SQL migration pipeline"]
                },
                interviewDsaPrep: "Concurreny puzzles in Go, Mutex deadlock detection, SQL query tuning & DB Schema design"
            },
            {
                phase: "Phase 2: Distributed Caching & Asynchronous Event Streaming",
                weeks: "Weeks 5 - 9",
                title: "Redis Distributed Systems & Apache Kafka Streaming",
                description: "Handle millions of events per second with message queues and in-memory caching.",
                languages: ["Go", "Node.js", "Bash"],
                frameworksTools: ["Redis", "Apache Kafka", "BullMQ", "Zookeeper / KRaft", "Docker Compose"],
                fundamentalConcepts: [
                    "Redis Data Structures: Strings, Hashes, Lists, Sets, Sorted Sets (ZSET), HyperLogLog",
                    "Cache Eviction policies (LRU, LFU, TTL expiration strategies)",
                    "Message Queues vs Pub/Sub vs Log-based Event Streaming architectures",
                    "Kafka Architecture: Brokers, Topics, Partitions, Consumer Groups, Offsets",
                    "Producer Acknowledgments (acks=0, 1, all) & Delivery semantics (At-least-once, Exactly-once)"
                ],
                advancedSystemTopics: [
                    "Redis Distributed Locks using the Redlock algorithm",
                    "Kafka Partition rebalancing & consumer lag monitoring with Prometheus",
                    "Dead Letter Queues (DLQ) & Exponential Backoff retry mechanics",
                    "Distributed Cache Stampede prevention with probabilistic early expiration"
                ],
                capstoneProject: {
                    title: "Distributed Flash-Sale Ticket Booking Engine",
                    deliverable: "Event-driven system handling 50,000 simultaneous seat reservation requests",
                    features: ["Zero overbooking guaranteed with Redis atomic Lua scripts", "Async checkout processing via Kafka consumers", "Payment timeout rollback worker", "Real-time inventory metrics"]
                },
                interviewDsaPrep: "Queues, Heaps (Priority Queues), Event-driven System Design (Designing WhatsApp, Twitter Feed)"
            },
            {
                phase: "Phase 3: Microservices Architecture, Docker & Kubernetes",
                weeks: "Weeks 10 - 14",
                title: "Containerization, Service Mesh & Kubernetes Cluster Orchestration",
                description: "Decompose monoliths into resilient, autoscaling microservices running on cloud containers.",
                languages: ["YAML", "Dockerfile", "Bash", "Go"],
                frameworksTools: ["Docker", "Kubernetes", "AWS EKS", "NGINX Ingress", "Helm", "Istio"],
                fundamentalConcepts: [
                    "Microservices vs Monolithic tradeoffs & Domain-Driven Design (DDD) bounded contexts",
                    "Docker container networking (bridge, host, overlay) & multi-stage builds",
                    "Kubernetes architecture: API Server, etcd, Controller Manager, Kube-Proxy",
                    "Kubernetes Workloads: Deployments, StatefulSets, DaemonSets, ConfigMaps & Secrets",
                    "Service Discovery, ClusterIP, NodePort, and Ingress routing rules"
                ],
                advancedSystemTopics: [
                    "Horizontal Pod Autoscaler (HPA) scaling on custom CPU/Memory metrics",
                    "Circuit Breaker Pattern (Netflix Hystrix / Resilience4j) preventing cascading failures",
                    "API Gateway patterns: Rate limiting, Auth validation, Request transformation",
                    "Canary deployments & Blue-Green zero-downtime release strategies"
                ],
                capstoneProject: {
                    title: "Production Microservices Banking Platform",
                    deliverable: "5 interconnected microservices running on a multi-node Kubernetes cluster",
                    features: ["Automated circuit breakers on payment failures", "Service mesh traffic shaping with Istio", "Helm-packaged deployment manifests", "Autoscaling on traffic surges"]
                },
                interviewDsaPrep: "Microservices failure scenarios, CAP Theorem, Eventual Consistency & Distributed Transactions (Saga Pattern)"
            },
            {
                phase: "Phase 4: Observability, Security & High-Level System Design (HLD)",
                weeks: "Weeks 15 - 18",
                title: "Distributed Tracing, Security Hardening & Principal FAANG Interviews",
                description: "Implement distributed tracing, prevent DDoS attacks, and master enterprise system design.",
                languages: ["Go", "SQL", "PromQL"],
                frameworksTools: ["Prometheus", "Grafana", "Jaeger Tracing", "OpenTelemetry", "AWS (EC2, S3, RDS, CloudWatch)"],
                fundamentalConcepts: [
                    "The 3 Pillars of Observability: Metrics, Distributed Logs, and Distributed Tracing",
                    "OpenTelemetry instrumentation for end-to-end request tracking across microservices",
                    "OWASP Top 10 Backend Vulnerabilities: SQLi, Broken Object Authorization, SSRF",
                    "Data Encryption: TLS 1.3 in-transit & AES-256 at-rest",
                    "Rate limiting algorithms: Token Bucket, Leaky Bucket, Sliding Window Log"
                ],
                advancedSystemTopics: [
                    "High-Level System Design (HLD): URL Shortener, Uber Geo-dispatch, YouTube Video Upload",
                    "Database Sharding, Consistent Hashing & Read Replicas replication lag",
                    "Prometheus alert rules & PagerDuty incident integration",
                    "Disaster Recovery (RTO / RPO) & multi-region database failover"
                ],
                capstoneProject: {
                    title: "Global Scalable Video Upload & Streaming Infrastructure",
                    deliverable: "Distributed system processing and streaming video chunks worldwide",
                    features: ["Asynchronous video transcoding worker queue", "Distributed tracing across all services with Jaeger", "S3 multi-region chunk upload", "Prometheus performance dashboards"]
                },
                interviewDsaPrep: "Complete System Design Roadmap: Consistent Hashing, Distributed ID Generation, Mock Staff Interviews"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "ai-data-science",
        title: "AI, ML & Data Scientist",
        shortTitle: "AI & Data Science",
        icon: Cpu,
        badge: "Trending 2026",
        demandPercent: 99,
        timelineWeeks: 20,
        level: "Beginner to Senior AI Research Engineer",
        prerequisites: "No previous AI or advanced math experience needed",
        primaryLanguages: ["Python 3.12", "SQL", "C++ (Inference basics)", "Bash"],
        primaryFrameworks: ["PyTorch 2.0", "HuggingFace Transformers", "Scikit-Learn", "Pandas", "NumPy", "MLflow", "FastAPI"],
        keywords: ["ai", "machine learning", "ml", "data science", "python", "pytorch", "llm", "deep learning", "nlp", "pandas", "data engineer"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Associate ML Eng", ctc: "₹7.0 - 12.5 LPA", monthlyInHand: "₹52k - ₹88k / mo", multiplier: "3.4x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "AI / Data Scientist", ctc: "₹18.0 - 30 LPA", monthlyInHand: "₹1.25L - ₹2.1L / mo", multiplier: "5.2x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Staff AI Researcher", ctc: "₹35.0 - 60+ LPA", monthlyInHand: "₹2.4L - ₹4.2L / mo", multiplier: "7.5x" },
        ],
        skills: [
            { name: "Python, NumPy & Pandas", tag: "Math/Data" },
            { name: "PyTorch & Deep Learning", tag: "Neural Nets" },
            { name: "LLM Fine-tuning (LoRA)", tag: "GenAI" },
            { name: "MLOps (MLflow, BentoML)", tag: "Production" },
            { name: "Vector Search & Agents", tag: "RAG" },
        ],
        topCompanies: ["Nvidia", "OpenAI", "Microsoft", "Fractal", "Google DeepMind"],
        syllabus: [
            {
                phase: "Phase 1: Applied Mathematics, Python & Data Wrangling",
                weeks: "Weeks 1 - 5",
                title: "Linear Algebra, Calculus, Statistics & Exploratory Data Analysis",
                description: "Master the foundational math powering machine learning alongside NumPy and Pandas data pipelines.",
                languages: ["Python 3.12", "SQL"],
                frameworksTools: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "JupyterLab"],
                fundamentalConcepts: [
                    "Vectors, Matrices, Dot Products, Eigenvalues & Eigenvectors",
                    "Calculus: Derivatives, Partial Derivatives & Gradient Descent mechanics",
                    "Probability: Bayes Theorem, Normal Distributions, Central Limit Theorem",
                    "NumPy vectorized operations, broadcasting & array slicing",
                    "Pandas DataFrames, GroupBy aggregations, merging datasets & handling missing values"
                ],
                advancedSystemTopics: [
                    "Exploratory Data Analysis (EDA) uncovering non-obvious correlations",
                    "Feature Engineering: One-Hot Encoding, Target Encoding, Log Transforms",
                    "Outlier detection using Interquartile Range (IQR) & Z-score techniques",
                    "Hypothesis Testing: T-tests, Chi-Square tests, and A/B test sample size calculation"
                ],
                capstoneProject: {
                    title: "Automated Enterprise Data Intelligence & Insights Engine",
                    deliverable: "End-to-end automated analytics pipeline generating interactive statistical reports",
                    features: ["Automated missing data imputation", "Interactive correlation heatmap generation", "Outlier cleaning pipeline", "SQL data export connector"]
                },
                interviewDsaPrep: "Matrix operations, probability math puzzles, SQL analytics interview questions"
            },
            {
                phase: "Phase 2: Classical Machine Learning & Statistical Modeling",
                weeks: "Weeks 6 - 10",
                title: "Supervised & Unsupervised ML Algorithms with Scikit-Learn",
                description: "Train, evaluate, and tune production machine learning models for classification and regression.",
                languages: ["Python"],
                frameworksTools: ["Scikit-Learn", "XGBoost", "LightGBM", "Optuna", "Joblib"],
                fundamentalConcepts: [
                    "Supervised Learning: Linear Regression, Logistic Regression, Decision Trees",
                    "Ensemble Methods: Random Forests, Gradient Boosted Trees (XGBoost, LightGBM)",
                    "Unsupervised Learning: K-Means Clustering, DBSCAN, PCA Dimensionality Reduction",
                    "Bias-Variance Tradeoff, Overfitting, Underfitting & Regularization (L1 Lasso, L2 Ridge)",
                    "Evaluation Metrics: Precision, Recall, F1-Score, ROC-AUC, Mean Squared Error"
                ],
                advancedSystemTopics: [
                    "K-Fold Cross-Validation & Stratified sampling on imbalanced datasets",
                    "Automated Hyperparameter Optimization with Optuna Bayesian Search",
                    "Feature Importance analysis using SHAP (SHapley Additive exPlanations) values",
                    "Packaging models with Joblib and serving predictions via FastAPI microservices"
                ],
                capstoneProject: {
                    title: "Financial Credit Default & Fraud Detection AI",
                    deliverable: "Production ML service scoring 10,000 transactions/second with 96% ROC-AUC",
                    features: ["XGBoost tuned model with Optuna", "SMOTE oversampling for fraud class imbalance", "SHAP explainability dashboard for loan approval transparency", "FastAPI inference endpoint"]
                },
                interviewDsaPrep: "Math behind Logistic Regression & SVM, Decision tree split math (Gini vs Entropy), ML Coding"
            },
            {
                phase: "Phase 3: Deep Learning, Neural Networks & Computer Vision / NLP",
                weeks: "Weeks 11 - 15",
                title: "PyTorch Deep Learning & Transformer Architectures",
                description: "Build neural networks from scratch, train Convolutional Networks and Transformer models in PyTorch.",
                languages: ["Python", "PyTorch Tensors"],
                frameworksTools: ["PyTorch 2.0", "Torchvision", "HuggingFace Transformers", "Weights & Biases (W&B)"],
                fundamentalConcepts: [
                    "Perceptrons, Multilayer Perceptrons (MLPs), Activation functions (ReLU, Sigmoid, GELU)",
                    "Backpropagation & Automatic Differentiation (PyTorch autograd)",
                    "Optimizers: SGD, Adam, AdamW, Learning Rate Schedulers (Cosine Annealing)",
                    "Convolutional Neural Networks (CNNs): Kernels, Pooling, ResNet architectures",
                    "Recurrent Neural Networks (RNNs), LSTMs & Sequence Modeling"
                ],
                advancedSystemTopics: [
                    "Transformer Self-Attention mechanism: Query, Key, Value calculations",
                    "Multi-Head Attention, Positional Encodings & Layer Normalization",
                    "HuggingFace Transformers library for BERT, RoBERTa, and T5 fine-tuning",
                    "GPU Acceleration, CUDA memory management, and Mixed Precision (FP16/BF16) training"
                ],
                capstoneProject: {
                    title: "Medical Diagnostic Imaging & Multi-Modal Text Classifier",
                    deliverable: "Trained PyTorch model classifying medical anomalies with integrated attention maps",
                    features: ["Transfer learning on ResNet-50", "Grad-CAM visual heatmaps explaining predictions", "Experiment tracking with Weights & Biases", "Model checkpointing & early stopping"]
                },
                interviewDsaPrep: "Mathematical derivation of Backpropagation, Attention mechanism equations, PyTorch custom layers"
            },
            {
                phase: "Phase 4: LLMs, LoRA Fine-Tuning & MLOps Production Engineering",
                weeks: "Weeks 16 - 20",
                title: "LLM Fine-Tuning, Quantization, RAG & MLOps Pipelines",
                description: "Fine-tune open-source LLMs (Llama 3, Mistral), deploy quantized models, and build MLOps pipelines.",
                languages: ["Python", "Bash", "Docker"],
                frameworksTools: ["LoRA / QLoRA", "vLLM", "MLflow", "FastAPI", "Docker", "Triton Inference Server"],
                fundamentalConcepts: [
                    "Instruction Tuning vs Pre-training vs Reinforcement Learning from Human Feedback (RLHF)",
                    "Parameter-Efficient Fine-Tuning (PEFT) using Low-Rank Adaptation (LoRA / QLoRA)",
                    "Quantization techniques: 4-bit, 8-bit (bitsandbytes, AWQ, GGUF)",
                    "High-Throughput Serving with vLLM PagedAttention engine",
                    "MLOps lifecycle: Model Versioning, Drift Detection, and A/B Model Deployments"
                ],
                advancedSystemTopics: [
                    "Fine-tuning Llama 3 on custom proprietary enterprise datasets",
                    "MLflow Model Registry for continuous model tracking and deployment rollback",
                    "Continuous Model Monitoring: Data drift, Concept drift with Evidently AI",
                    "System Design for AI: Designing ChatGPT, Recommendation Systems (YouTube / TikTok)"
                ],
                capstoneProject: {
                    title: "Enterprise Domain-Specific Fine-Tuned LLM & Serving Engine",
                    deliverable: "Fine-tuned 8B parameter model deployed on cloud with vLLM serving 50 tokens/sec",
                    features: ["QLoRA fine-tuned on custom legal/tech dataset", "vLLM server containerized with Docker", "MLflow tracking dashboard", "Automated model evaluation benchmark suite"]
                },
                interviewDsaPrep: "Complete AI System Design, LLM scaling laws, Coding algorithms for ML Engineers"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "devops-cloud",
        title: "DevOps & Cloud Platform Architect",
        shortTitle: "DevOps & Cloud",
        icon: Cloud,
        badge: "Highest Hike",
        demandPercent: 96,
        timelineWeeks: 14,
        level: "Beginner to Cloud Infra Lead",
        prerequisites: "Basic computer fundamentals (Linux & Networking taught from scratch)",
        primaryLanguages: ["Bash / Shell", "Python 3.12", "HCL (Terraform)", "YAML", "Go"],
        primaryFrameworks: ["Docker", "Kubernetes (K8s)", "AWS / GCP", "Terraform", "Prometheus & Grafana", "GitHub Actions", "ArgoCD"],
        keywords: ["devops", "cloud", "aws", "docker", "kubernetes", "k8s", "terraform", "ci/cd", "linux", "infra", "sre", "platform engineer", "gcp", "azure"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Cloud Associate", ctc: "₹6.0 - 11.5 LPA", monthlyInHand: "₹45k - ₹80k / mo", multiplier: "3.0x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "DevOps Platform Engineer", ctc: "₹15.0 - 26 LPA", monthlyInHand: "₹1.0L - ₹1.7L / mo", multiplier: "4.8x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Cloud Architect", ctc: "₹30.0 - 55+ LPA", monthlyInHand: "₹2.1L - ₹3.8L / mo", multiplier: "6.8x" },
        ],
        skills: [
            { name: "Docker & Container Runtime", tag: "Containers" },
            { name: "Kubernetes Cluster Orchestration", tag: "K8s" },
            { name: "Terraform Infrastructure as Code", tag: "IaC" },
            { name: "CI/CD & GitOps (GitHub Actions / ArgoCD)", tag: "Automation" },
            { name: "Prometheus, Grafana & Datadog", tag: "Observability" },
        ],
        topCompanies: ["Amazon AWS", "Microsoft Azure", "Flipkart", "Jio", "CRED"],
        syllabus: [
            {
                phase: "Phase 1: Linux Internals, Shell Scripting, Git & Networking Fundamentals",
                weeks: "Weeks 1 - 3",
                title: "Linux CLI, Networking Protocols & Automated Bash Scripting",
                description: "Master Linux file hierarchies, user permissions, networking layers (TCP/UDP, DNS, SSH, SSL), process control, and automated server configuration scripts.",
                languages: ["Bash", "Linux Shell", "YAML"],
                frameworksTools: ["Ubuntu Server", "Git", "SSH", "systemd", "iptables", "curl / jq"],
                fundamentalConcepts: [
                    "Linux directory FHS, file permissions (chmod, chown), and sudoers governance",
                    "Process lifecycles, daemon management with systemd, signals, and background jobs",
                    "Networking mechanics: TCP/UDP three-way handshakes, subnetting, NAT, and reverse proxies",
                    "Writing robust Bash scripts with error traps, CLI arguments, and environment variables"
                ],
                advancedSystemTopics: [
                    "Kernel namespace virtualization and cgroups resource limits",
                    "Automated backup rotation and Cron cronjob scheduling across remote servers",
                    "SSH key-pair authentication, hardening bastion hosts, and zero-trust firewalls"
                ],
                capstoneProject: {
                    title: "Automated Linux Server Provisioning & Security Hardening Engine",
                    deliverable: "Automated multi-server Bash provisioning script that sets up secure Nginx reverse proxy with SSL",
                    features: ["Zero-touch server initialization", "Automated Fail2Ban & UFW firewall setup", "Automated SSL certificate renewal daemon"]
                },
                interviewDsaPrep: "Linux troubleshooting commands, networking OSI model scenarios & Bash scripting interview tests"
            },
            {
                phase: "Phase 2: Containerization with Docker & Automated CI/CD Pipelines",
                weeks: "Weeks 4 - 6",
                title: "Production Docker Engine & GitHub Actions Automated Delivery",
                description: "Build ultra-lean multi-stage Docker images, isolate microservices networks, and design automated CI/CD pipelines that test, build, and push to production registries.",
                languages: ["Dockerfile syntax", "YAML", "Python"],
                frameworksTools: ["Docker Engine", "Docker Compose", "GitHub Actions", "Docker Hub / AWS ECR", "SonarQube"],
                fundamentalConcepts: [
                    "Docker image layers, union filesystems, and multi-stage build optimization",
                    "Container networking: bridge, host, overlay networks, and port forwarding",
                    "Persistent volume mounts vs bind mounts vs tmpfs data lifecycles",
                    "GitHub Actions workflow syntax: triggers, runners, matrix builds, secrets, and caches"
                ],
                advancedSystemTopics: [
                    "Reducing production Docker image footprint by 85% with distroless & Alpine bases",
                    "Non-root container user security and vulnerability image scanning with Trivy",
                    "Designing zero-downtime deployment pipelines with rollback triggers"
                ],
                capstoneProject: {
                    title: "Full-Stack Microservices CI/CD Deployment Pipeline",
                    deliverable: "Production GitHub Actions workflow running tests, building multi-arch containers, and scanning security vulnerabilities",
                    features: ["Automated unit test execution", "Trivy CVE vulnerability scanner", "Parallel multi-stage container push to registry"]
                },
                interviewDsaPrep: "Container optimization questions, Docker networking edge-cases & CI/CD pipeline architectural design"
            },
            {
                phase: "Phase 3: Kubernetes Orchestration, Helm & GitOps with ArgoCD",
                weeks: "Weeks 7 - 10",
                title: "Kubernetes Production Clusters, Ingress & GitOps Automation",
                description: "Deploy and manage resilient distributed clusters using Pods, Deployments, StatefulSets, Services, Ingress Controllers, Helm charts, and declarative GitOps.",
                languages: ["YAML", "Helm Templating", "Go basics"],
                frameworksTools: ["Kubernetes (kubectl, kubeadm)", "Helm 3", "ArgoCD", "Nginx Ingress Controller", "Cert-Manager"],
                fundamentalConcepts: [
                    "Kubernetes control plane architecture: API Server, etcd, Scheduler, Kubelet",
                    "Workload resources: Pods, ReplicaSets, Deployments, and DaemonSets",
                    "Cluster networking: Service types (ClusterIP, NodePort, LoadBalancer), CoreDNS, and Ingress",
                    "ConfigMaps, Secrets management, and downward API configuration injection"
                ],
                advancedSystemTopics: [
                    "Horizontal Pod Autoscaling (HPA) based on CPU/Memory and custom Prometheus metrics",
                    "Rolling updates, Canary deployments, and Blue/Green zero-downtime traffic switching",
                    "Helm chart packaging with dynamic values and GitOps sync loops with ArgoCD"
                ],
                capstoneProject: {
                    title: "Enterprise Multi-Node Kubernetes Production Cluster with GitOps",
                    deliverable: "Live Kubernetes cluster orchestrated with ArgoCD, auto-scaling microservices, and automatic SSL Ingress",
                    features: ["Automated ArgoCD repository synchronization", "Canary deployment strategy with automated rollback", "Cert-Manager automated Let's Encrypt certificates"]
                },
                interviewDsaPrep: "Kubernetes failure recovery scenarios, pod scheduling constraints & production cluster outage drills"
            },
            {
                phase: "Phase 4: Terraform Infrastructure as Code, Cloud Security & SRE",
                weeks: "Weeks 11 - 14",
                title: "Terraform Cloud Provisioning, Observability & SRE Practice",
                description: "Automate entire cloud environments on AWS with Terraform, configure full-stack observability with Prometheus/Grafana, and master SRE incident management.",
                languages: ["HCL (Terraform)", "PromQL", "Python"],
                frameworksTools: ["Terraform", "AWS (EC2, VPC, EKS, S3, IAM)", "Prometheus", "Grafana", "Alertmanager"],
                fundamentalConcepts: [
                    "Terraform state files, remote backends (S3 + DynamoDB locking), and providers",
                    "Modular Terraform architecture: reusable modules for VPCs, EKS clusters, and databases",
                    "Prometheus metrics scraping, exporters (Node Exporter, cAdvisor), and PromQL queries",
                    "Grafana dashboard design, alert rule thresholds, and Slack/PagerDuty routing"
                ],
                advancedSystemTopics: [
                    "Terraform drift detection, plan approvals, and policy-as-code with OPA/Sentinel",
                    "SRE principles: SLA, SLO, SLI definition, error budgets, and post-mortem analysis",
                    "Disaster recovery planning, multi-region database failover, and chaos engineering"
                ],
                capstoneProject: {
                    title: "Self-Healing Multi-Region Cloud Infrastructure with Full Observability",
                    deliverable: "Complete Terraform codebase provisioning an AWS EKS cluster with Prometheus/Grafana monitoring dashboards",
                    features: ["100% Infrastructure as Code with remote state locking", "Automated Slack alert routing on high latency", "Live Grafana dashboard visualizing cluster health"]
                },
                interviewDsaPrep: "Live cloud architectural whiteboarding, Terraform state resolution interviews & SRE incident drills"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "mobile-apps",
        title: "Mobile App Engineer (iOS & Android)",
        shortTitle: "Mobile Apps",
        icon: Smartphone,
        badge: "Cross-Platform",
        demandPercent: 91,
        timelineWeeks: 14,
        level: "Beginner to Mobile Lead",
        prerequisites: "Zero prerequisites (JavaScript / TypeScript fundamentals taught from scratch)",
        primaryLanguages: ["TypeScript", "JavaScript", "Dart", "Swift", "Kotlin"],
        primaryFrameworks: ["React Native", "Expo", "Flutter", "Redux Toolkit", "Zustand", "SQLite", "Firebase"],
        keywords: ["mobile", "android", "ios", "react native", "flutter", "app developer", "kotlin", "swift", "dart", "expo", "native"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Mobile Developer", ctc: "₹5.5 - 10.5 LPA", monthlyInHand: "₹42k - ₹75k / mo", multiplier: "2.9x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Full Mobile Product Dev", ctc: "₹13.0 - 22 LPA", monthlyInHand: "₹90k - ₹1.5L / mo", multiplier: "4.4x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Lead Mobile Architect", ctc: "₹26.0 - 45+ LPA", monthlyInHand: "₹1.8L - ₹3.1L / mo", multiplier: "6.0x" },
        ],
        skills: [
            { name: "React Native & Flutter Engine", tag: "Core" },
            { name: "Offline-First Sync & SQLite/WatermelonDB", tag: "Storage" },
            { name: "Native Device APIs (Camera, GPS, Biometrics)", tag: "Hardware" },
            { name: "State Management (Zustand & Redux Toolkit)", tag: "State" },
            { name: "App Store & Play Store Production CI/CD", tag: "Release" },
        ],
        topCompanies: ["Zomato", "Swiggy", "Paytm", "PhonePe", "Uber"],
        syllabus: [
            {
                phase: "Phase 1: Mobile UI Design, Flexbox, React Native & Flutter Foundations",
                weeks: "Weeks 1 - 3",
                title: "Cross-Platform Layouts, Touch Interactions & Component Architecture",
                description: "Master mobile-first screen layouts, responsive touch interactions, navigation stacks, and custom atomic component design.",
                languages: ["TypeScript 5.4", "JavaScript ES2024", "JSX"],
                frameworksTools: ["React Native (Expo SDK 51)", "React Navigation v6", "Tailwind (NativeWind)", "Figma to Code"],
                fundamentalConcepts: [
                    "Flexbox layout on mobile screens: flexDirection, justifyContent, alignItems, safe area insets",
                    "Core components: View, Text, Image, FlatList, ScrollView, and TextInput",
                    "Touch handling: Pressable, TouchableOpacity, and PanGestureHandler",
                    "React Navigation: Native Stack, Bottom Tabs, and Drawer navigation hierarchies"
                ],
                advancedSystemTopics: [
                    "FlatList performance tuning: getItemLayout, windowSize, removeClippedSubviews for 60fps scrolling",
                    "Dynamic theme switching (Dark/Light mode) synced with device OS preferences",
                    "Custom vector iconography, typography scaling, and tablet layout adaptability"
                ],
                capstoneProject: {
                    title: "Fluid High-Performance Consumer E-Commerce Mobile App",
                    deliverable: "Complete mobile app with buttery-smooth 60fps product lists, bottom tabs, cart drawer, and search filters",
                    features: ["Optimized 10,000-item FlatList with virtual windowing", "Native bottom sheet dialogs", "Dynamic light/dark theme toggle"]
                },
                interviewDsaPrep: "Mobile UI performance bottlenecks, React component lifecycles & DSA arrays/strings algorithms"
            },
            {
                phase: "Phase 2: Native Device Integrations, Animations & Offline SQLite",
                weeks: "Weeks 4 - 7",
                title: "Device APIs, Hardware Access & Offline-First Database Architecture",
                description: "Integrate native device sensors (Camera, Location, Biometrics) and build robust offline-first synchronization with local SQLite databases.",
                languages: ["TypeScript", "SQL"],
                frameworksTools: ["Expo Camera", "Expo Location", "Expo LocalAuthentication", "SQLite / WatermelonDB", "Reanimated 3"],
                fundamentalConcepts: [
                    "Requesting and handling runtime device permissions for Camera and Location",
                    "Capturing photos, image compression, and uploading to cloud object storage",
                    "Local database architecture: SQLite schemas, migrations, and indexing",
                    "Reanimated 3 gesture animations, interpolations, and physics-based spring transitions"
                ],
                advancedSystemTopics: [
                    "Offline-first synchronization conflict resolution strategies (Last-Write-Wins vs Vector Clocks)",
                    "Background location tracking with minimal battery consumption",
                    "Biometric FaceID / Fingerprint security gate for sensitive screens"
                ],
                capstoneProject: {
                    title: "Offline-First Field Inspection & Geolocation Tracker App",
                    deliverable: "Production app that logs inspection reports and photos offline, syncs automatically when internet reconnects",
                    features: ["Local SQLite persistence with background queue", "Camera photo capture with geo-tagging", "Biometric authentication unlock"]
                },
                interviewDsaPrep: "Offline synchronization algorithms, async storage trade-offs & queue data structures"
            },
            {
                phase: "Phase 3: Push Notifications, Payments, Background Tasks & Security",
                weeks: "Weeks 8 - 11",
                title: "Push Messaging, In-App Payments & Enterprise Mobile Security",
                description: "Connect cloud push notification services, integrate Razorpay/Stripe payments, handle deep linking, and secure client-side tokens.",
                languages: ["TypeScript", "JSON"],
                frameworksTools: ["Firebase Cloud Messaging (FCM)", "Expo Notifications", "Razorpay Mobile SDK", "SecureStore", "Sentry"],
                fundamentalConcepts: [
                    "APNs (Apple) & FCM (Google) push notification lifecycle: foreground, background, killed states",
                    "Deep linking schemes (myapp://) and universal links for seamless marketing re-engagement",
                    "Mobile payment gateway checkout flows with webhooks and signature validation",
                    "Encrypted keystore / keychain storage for JWT auth tokens using Expo SecureStore"
                ],
                advancedSystemTopics: [
                    "App shielding: SSL pinning, root/jailbreak detection, and code obfuscation",
                    "Real-time crash reporting and ANR (Application Not Responding) profiling with Sentry",
                    "Automated background fetch tasks and silent push wakeups"
                ],
                capstoneProject: {
                    title: "FinTech Mobile Banking & Payment Application",
                    deliverable: "Secure financial app with biometrics, instant Razorpay money transfers, transaction push alerts, and SSL pinning",
                    features: ["Encrypted credentials in OS Keychain", "Interactive push notifications for transaction alerts", "Full Sentry crash analytics integration"]
                },
                interviewDsaPrep: "Mobile security vulnerability assessments, payment flow architecture & linked list / tree algorithms"
            },
            {
                phase: "Phase 4: App Store Release Pipeline, OTA Updates & Mobile System Design",
                weeks: "Weeks 12 - 14",
                title: "App Store & Play Store Deployment, Fastlane & System Design",
                description: "Master production signing keys, TestFlight beta distribution, automated Fastlane CI/CD releases, and mobile system design interviews.",
                languages: ["Ruby (Fastlane)", "TypeScript"],
                frameworksTools: ["EAS Build", "Fastlane", "Apple App Store Connect", "Google Play Console", "EAS Update (OTA)"],
                fundamentalConcepts: [
                    "iOS provisioning profiles, certificates, and Android Keystore signing management",
                    "Building production AAB (Android App Bundle) and iOS IPA bundles with EAS",
                    "Over-The-Air (OTA) instantaneous bug fixes without app store re-review delays",
                    "Mobile system design: Designing Instagram Feed, Uber Driver App, WhatsApp Chat Architecture"
                ],
                advancedSystemTopics: [
                    "Fastlane automated screenshot capture, version bumping, and store metadata deployment",
                    "A/B feature flags on mobile using LaunchDarkly / Firebase Remote Config",
                    "Memory leak profiling with Android Studio Profiler and Xcode Instruments"
                ],
                capstoneProject: {
                    title: "Live Production App Published to App Store & Google Play Store",
                    deliverable: "Fully signed production mobile application distributed via TestFlight and Google Play Internal Track",
                    features: ["Complete automated EAS build & release pipeline", "Instantaneous OTA update delivery setup", "Comprehensive architectural case study for portfolios"]
                },
                interviewDsaPrep: "Comprehensive Mobile System Design boards, Mock technical rounds with senior mobile leads"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "cybersecurity",
        title: "Cybersecurity & Ethical Hacking Specialist",
        shortTitle: "Cybersecurity",
        icon: Shield,
        badge: "Critical Security",
        demandPercent: 95,
        timelineWeeks: 14,
        level: "Beginner to Certified Security Engineer",
        prerequisites: "Basic computer familiarity (Networking & Protocols taught from scratch)",
        primaryLanguages: ["Python 3.12", "Bash", "C / C++", "PowerShell", "SQL"],
        primaryFrameworks: ["Kali Linux", "Wireshark", "Burp Suite Pro", "Metasploit", "Nmap", "OWASP ZAP", "Splunk SIEM"],
        keywords: ["cybersecurity", "security", "ethical hacking", "penetration testing", "pen tester", "infosec", "soc", "burp suite", "wireshark", "network security", "ceh"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Security Analyst", ctc: "₹6.0 - 11 LPA", monthlyInHand: "₹45k - ₹78k / mo", multiplier: "3.1x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Penetration Tester / SOC Analyst", ctc: "₹14.5 - 25 LPA", monthlyInHand: "₹1.0L - ₹1.7L / mo", multiplier: "4.7x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Security Architect", ctc: "₹29.0 - 52+ LPA", monthlyInHand: "₹2.0L - ₹3.6L / mo", multiplier: "6.5x" },
        ],
        skills: [
            { name: "Web Application Pen-Testing (OWASP Top 10)", tag: "AppSec" },
            { name: "Network Protocol Analysis & Packet Sniffing", tag: "Network" },
            { name: "SOC Operations & SIEM Telemetry (Splunk)", tag: "Defensive" },
            { name: "Cryptography, SSL/TLS, & Public Key Infrastructure", tag: "Crypto" },
            { name: "Cloud Security & Identity Governance (IAM)", tag: "CloudSec" },
        ],
        topCompanies: ["Palo Alto Networks", "CrowdStrike", "Cisco", "Deloitte Cyber", "EY Cyber"],
        syllabus: [
            {
                phase: "Phase 1: Linux Command Line, TCP/IP Networking, Wireshark & Threat Models",
                weeks: "Weeks 1 - 3",
                title: "Network Fundamentals, Reconnaissance & Traffic Packet Analysis",
                description: "Master TCP/IP subnetting, packet inspection with Wireshark, port scanning with Nmap, and threat modeling frameworks.",
                languages: ["Bash", "Python", "Networking CLI"],
                frameworksTools: ["Kali Linux", "Wireshark", "Nmap", "tcpdump", "Netcat"],
                fundamentalConcepts: [
                    "OSI model 7 layers, TCP 3-way handshake, ARP spoofing, and DNS resolution flaws",
                    "Wireshark packet filtering: isolating HTTP credentials, analyzing TLS handshakes, sniffing unencrypted traffic",
                    "Nmap port scanning techniques: SYN stealth scans, OS detection, service versioning, and NSE scripts",
                    "Reconnaissance methodology: passive OSINT (Shodan, WHOIS) vs active scanning"
                ],
                advancedSystemTopics: [
                    "Firewall evasion, fragmentation scans, and spoofed decoy traffic generation",
                    "Analyzing malicious PCAP packet captures to detect botnet beaconing",
                    "Configuring custom iptables rules and Snort IDS intrusion detection rules"
                ],
                capstoneProject: {
                    title: "Automated Network Vulnerability Reconnaissance Scanner",
                    deliverable: "Python script that automatically scans subnets, identifies open ports, fingerprint services, and generates risk reports",
                    features: ["Automated Nmap engine integration", "Vulnerability CVE correlation table", "Automated HTML executive summary report"]
                },
                interviewDsaPrep: "Network packet flow walkthroughs, TCP/UDP security trade-offs & networking algorithm drills"
            },
            {
                phase: "Phase 2: Web Application Penetration Testing (OWASP Top 10 & Burp Suite)",
                weeks: "Weeks 4 - 7",
                title: "Web Security Flaws, Burp Suite Mastery & Bug Bounty Methodology",
                description: "Deep-dive into discovering and exploiting SQL Injections, Cross-Site Scripting (XSS), CSRF, IDOR, SSRF, and broken access controls.",
                languages: ["JavaScript", "SQL", "Python", "HTML"],
                frameworksTools: ["Burp Suite Professional", "OWASP ZAP", "sqlmap", "Postman", "PortSwigger Web Security Academy"],
                fundamentalConcepts: [
                    "Burp Suite Proxy, Repeater, Intruder, and Decoder workflow mastery",
                    "SQL Injection (SQLi): in-band, blind boolean, and time-based exploitation",
                    "Cross-Site Scripting (XSS): Reflected, Stored, and DOM-based injection mechanics",
                    "Broken Object Level Authorization (BOLA / IDOR) and privilege escalation"
                ],
                advancedSystemTopics: [
                    "Server-Side Request Forgery (SSRF) targeting cloud metadata endpoints (169.254.169.254)",
                    "JWT token vulnerabilities: none-algorithm bypass, secret brute-forcing, and signature forgery",
                    "Writing formal vulnerability assessment and penetration testing (VAPT) reports with CVSS 3.1 scores"
                ],
                capstoneProject: {
                    title: "End-to-End Penetration Test & Audit of Enterprise Web Platform",
                    deliverable: "Comprehensive VAPT audit report of a vulnerable web application with proof-of-concept exploits and remediation code",
                    features: ["Exploitation of 5+ OWASP Top 10 vulnerabilities", "Exact code-level remediation patches", "Executive risk assessment scorecard"]
                },
                interviewDsaPrep: "OWASP Top 10 exploitation walkthroughs, secure coding review drills & algorithm problem solving"
            },
            {
                phase: "Phase 3: Network Exploitation, Privilege Escalation, Metasploit & Cryptography",
                weeks: "Weeks 8 - 11",
                title: "System Exploitation, Buffer Overflows & Cryptographic Primitives",
                description: "Learn payload generation, Metasploit exploitation, Linux & Windows privilege escalation, and modern cryptographic implementations.",
                languages: ["Python", "C", "PowerShell", "Bash"],
                frameworksTools: ["Metasploit Framework", "LinPEAS", "WinPEAS", "John the Ripper", "Hashcat", "Ghidra"],
                fundamentalConcepts: [
                    "Vulnerability exploitation lifecycle: vulnerability identification, payload craft, shell acquisition",
                    "Linux privilege escalation: SUID binaries, sudo misconfigurations, kernel exploits, cron vulnerabilities",
                    "Windows privilege escalation: unquoted service paths, token impersonation, always-install-elevated",
                    "Symmetric (AES) vs Asymmetric (RSA, ECC) encryption, hashing (SHA-256), and salting"
                ],
                advancedSystemTopics: [
                    "Buffer overflow basics: stack memory structure, EIP control, NOP sleds, and shellcode execution",
                    "Cracking password hashes with Hashcat on GPU and rainbow table attacks",
                    "Active Directory attacks: Kerberoasting, AS-REP roasting, and BloodHound domain mapping"
                ],
                capstoneProject: {
                    title: "Root Privilege Escalation & Active Directory Penetration Lab",
                    deliverable: "Complete technical write-up detailing initial foothold, lateral network movement, and domain privilege escalation",
                    features: ["Custom Python exploit script", "Privilege escalation path visualization", "Hardening guidelines to secure domain controllers"]
                },
                interviewDsaPrep: "Privilege escalation methodologies, Cryptographic attack scenarios & low-level memory architectures"
            },
            {
                phase: "Phase 4: SOC Monitoring, SIEM Log Analysis, Incident Response & Certifications",
                weeks: "Weeks 12 - 14",
                title: "Security Operations (SOC), SIEM Telemetry & CEH / eJPT Preparation",
                description: "Master defensive cyber operations, ingest security telemetry into Splunk, build threat hunting detection rules, and prepare for industry certifications.",
                languages: ["SPL (Search Processing Language)", "Python", "KQL"],
                frameworksTools: ["Splunk SIEM", "Elastic Security", "MITRE ATT&CK Framework", "Wazuh EDR", "Wireshark"],
                fundamentalConcepts: [
                    "Security Operations Center (SOC) Tier 1 & Tier 2 analyst workflows and alert triaging",
                    "SIEM architecture: log forwarding, parsing, indexers, and correlation searches",
                    "Mapping adversary tactics, techniques, and procedures (TTPs) using MITRE ATT&CK",
                    "Digital forensics: memory dump analysis (Volatility) and disk image timeline investigation"
                ],
                advancedSystemTopics: [
                    "Building automated detection alerts in Splunk for brute force and ransomware behavior",
                    "Incident response lifecycle: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned",
                    "Mock examination drills for eJPT (Junior Penetration Tester) and CEH (Certified Ethical Hacker)"
                ],
                capstoneProject: {
                    title: "Full-Scale SOC Detection Lab with Splunk SIEM & Wazuh EDR",
                    deliverable: "Live SOC environment ingesting endpoint logs, detecting simulated cyberattacks, and triggering automated alert workflows",
                    features: ["Splunk correlation search dashboard", "Automated MITRE ATT&CK tactic tagging", "Incident response playbook documentation"]
                },
                interviewDsaPrep: "Live SOC triage scenarios, incident response drills & technical interview whiteboarding"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "data-analytics",
        title: "Data Analyst & Business Intelligence Specialist",
        shortTitle: "Data Analytics",
        icon: BarChart3,
        badge: "Top Entry Track",
        demandPercent: 94,
        timelineWeeks: 12,
        level: "Beginner to Senior BI Consultant",
        prerequisites: "Zero prerequisites (High-school math, Excel & SQL taught from scratch)",
        primaryLanguages: ["Advanced SQL", "Python 3.12 (Pandas / NumPy)", "DAX", "R"],
        primaryFrameworks: ["Power BI", "Tableau", "Excel (Macros & PowerQuery)", "Snowflake", "Jupyter", "PostgreSQL"],
        keywords: ["data analyst", "data analytics", "business analyst", "bi", "power bi", "tableau", "sql", "excel", "analytics", "dashboard", "reporting"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Data Analyst", ctc: "₹5.0 - 9.5 LPA", monthlyInHand: "₹38k - ₹68k / mo", multiplier: "2.7x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Senior BI & Analytics Consultant", ctc: "₹12.0 - 20 LPA", monthlyInHand: "₹84k - ₹1.4L / mo", multiplier: "4.2x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Analytics Lead", ctc: "₹24.0 - 40+ LPA", monthlyInHand: "₹1.7L - ₹2.8L / mo", multiplier: "5.8x" },
        ],
        skills: [
            { name: "Complex SQL (Window Functions, CTEs, Pivoting)", tag: "SQL" },
            { name: "Python Exploratory Data Analysis (Pandas, Seaborn)", tag: "Python" },
            { name: "Power BI & Tableau Interactive Storyboards", tag: "BI" },
            { name: "Statistical Inference & Hypothesis Testing (A/B Testing)", tag: "Stats" },
            { name: "Data Modeling (Star & Snowflake Schemas)", tag: "Architecture" },
        ],
        topCompanies: ["McKinsey", "Deloitte", "Mu Sigma", "Amazon", "Fractal Analytics"],
        syllabus: [
            {
                phase: "Phase 1: Advanced Excel Modeling, Business Case Studies & SQL Fundamentals",
                weeks: "Weeks 1 - 3",
                title: "Excel Data Cleaning, Power Query & SQL Query Foundations",
                description: "Master advanced spreadsheet formulas, data cleaning with Power Query, business KPI calculations, and relational SQL queries.",
                languages: ["SQL", "Excel Formulas", "M Code"],
                frameworksTools: ["Microsoft Excel", "Power Query", "PostgreSQL", "pgAdmin"],
                fundamentalConcepts: [
                    "Excel lookup formulas: XLOOKUP, INDEX/MATCH, dynamic arrays, and nested IF/AND conditions",
                    "Pivot Tables, Slicers, and Power Query automated data transformation pipelines",
                    "SQL fundamentals: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, and aggregate calculations",
                    "Entity-Relationship Diagrams (ERDs) and primary/foreign key relational database constraints"
                ],
                advancedSystemTopics: [
                    "Automating recurring business report ingest with Power Query data models",
                    "Designing executive financial models and cohort retention tables in Excel",
                    "Multi-table INNER, LEFT, RIGHT, and FULL OUTER joins with NULL value handling"
                ],
                capstoneProject: {
                    title: "Executive Revenue & Customer Retention Business Model",
                    deliverable: "Dynamic Excel workbook with automated Power Query ingestion and executive KPI dashboard",
                    features: ["Automated monthly data import", "Interactive slicer-driven P&L statement", "Customer cohort retention analysis matrix"]
                },
                interviewDsaPrep: "SQL join logic scenarios, business KPI problem-solving & Excel formula interviews"
            },
            {
                phase: "Phase 2: Advanced SQL Window Functions, Multi-Table Joins & Schema Design",
                weeks: "Weeks 4 - 6",
                title: "Advanced SQL Mastery, Analytical Functions & Star Schema Modeling",
                description: "Write high-performance complex SQL scripts using Window Functions, Common Table Expressions (CTEs), Subqueries, and Star Schema modeling.",
                languages: ["Advanced SQL (PostgreSQL / Snowflake)"],
                frameworksTools: ["PostgreSQL", "Snowflake", "DBeaver"],
                fundamentalConcepts: [
                    "Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), and running totals with OVER()",
                    "Lead & Lag time-series comparative calculations (MoM, YoY revenue growth)",
                    "Common Table Expressions (CTEs), recursive queries, and temporary tables",
                    "Dimensional modeling: Fact tables, Dimension tables, and Star vs Snowflake schemas"
                ],
                advancedSystemTopics: [
                    "Query optimization: EXPLAIN ANALYZE, index selection (B-Tree, Hash), and query plan cost reduction",
                    "Handling slowly changing dimensions (SCD Type 1 vs Type 2) in relational databases",
                    "Pivoting rows into columns using CASE WHEN expressions and conditional aggregation"
                ],
                capstoneProject: {
                    title: "Enterprise Multi-Million Row E-Commerce SQL Analytics Engine",
                    deliverable: "Production SQL script suite performing customer lifetime value (CLV), churn prediction, and basket analysis",
                    features: ["Optimized queries running on 5M+ row datasets", "Automated SQL CTE pipeline for customer segmentation", "Running revenue and 30-day moving average metrics"]
                },
                interviewDsaPrep: "Complex SQL interview queries (Leapcode Hard SQL), schema design whiteboarding & case studies"
            },
            {
                phase: "Phase 3: Python for Data Analysis (NumPy, Pandas, Matplotlib & Statistics)",
                weeks: "Weeks 7 - 9",
                title: "Exploratory Data Analysis (EDA), Statistical Inference & Data Wrangling",
                description: "Leverage Python's scientific ecosystem to clean messy datasets, compute statistical hypothesis tests, and visualize actionable correlations.",
                languages: ["Python 3.12"],
                frameworksTools: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter Notebooks", "SciPy"],
                fundamentalConcepts: [
                    "Pandas DataFrames: indexing, filtering, merging, group operations, and handling missing values",
                    "NumPy vectorized operations, multi-dimensional array slicing, and mathematical broadcasting",
                    "Statistical foundations: mean, median, standard deviation, variance, skewness, and IQR outliers",
                    "Hypothesis testing: T-tests, Chi-square tests, and P-value interpretation for A/B experiment evaluation"
                ],
                advancedSystemTopics: [
                    "Automated data cleaning pipelines for detecting anomalies and imputed missing records",
                    "Correlation matrices, heatmaps, and feature importance identification",
                    "Statistical power analysis and minimum sample size calculations for digital product experiments"
                ],
                capstoneProject: {
                    title: "End-to-End A/B Testing & Product Feature Analytics Study",
                    deliverable: "Jupyter Notebook presenting statistical hypothesis validation, conversion lift analysis, and visual storytelling",
                    features: ["Two-sample T-test statistical significance proof", "Interactive Seaborn violin and correlation plots", "Actionable executive product recommendation slide deck"]
                },
                interviewDsaPrep: "Statistical distributions and probability questions, Python Pandas data manipulation challenges"
            },
            {
                phase: "Phase 4: Interactive Power BI / Tableau Dashboards & Storytelling",
                weeks: "Weeks 10 - 12",
                title: "Business Intelligence Dashboards, DAX Formulas & Executive Storytelling",
                description: "Design publication-grade interactive dashboards in Power BI and Tableau with custom DAX calculations, drill-throughs, and storytelling.",
                languages: ["DAX", "SQL"],
                frameworksTools: ["Power BI Desktop", "Tableau Desktop", "Power BI Service", "Figma for Dashboard Wireframing"],
                fundamentalConcepts: [
                    "Power BI data modeling: building relationships, cardinality (1:*, *:*), and bidirectional cross-filtering",
                    "DAX formula mastery: CALCULATE(), FILTER(), ALL(), RELATED(), and Time Intelligence (YTD, QTD)",
                    "Visual design hierarchy: choosing appropriate charts (treemaps, waterfalls, scatter plots, KPI cards)",
                    "Interactive features: drill-through filters, bookmarks, tooltip pages, and cross-highlighting"
                ],
                advancedSystemTopics: [
                    "Power BI performance analyzer: optimizing DAX query speeds and reducing memory consumption",
                    "Row-Level Security (RLS) implementation for multi-tenant department access control",
                    "Executive data storytelling: structuring boardroom presentations that drive business decisions"
                ],
                capstoneProject: {
                    title: "Live Enterprise Executive Power BI & Tableau Analytics Portfolio",
                    deliverable: "Interactive multi-page Power BI dashboard published online with dynamic DAX metrics and executive navigation",
                    features: ["Dynamic scenario what-if parameters", "Mobile-optimized dashboard layout", "Automated scheduled refresh integration"]
                },
                interviewDsaPrep: "Live dashboard design walkthroughs, DAX calculation live coding & stakeholder interview rounds"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "data-engineer",
        title: "Big Data & Pipeline Engineer",
        shortTitle: "Data Engineering",
        icon: Database,
        badge: "Enterprise Scale",
        demandPercent: 95,
        timelineWeeks: 14,
        level: "Intermediate to Lead Data Architect",
        prerequisites: "Basic programming & SQL background",
        primaryLanguages: ["Python 3.12", "SQL", "Scala", "Bash"],
        primaryFrameworks: ["Apache Spark (PySpark)", "Apache Kafka", "Apache Airflow", "Snowflake", "dbt", "Docker", "AWS S3"],
        keywords: ["data engineer", "data engineering", "big data", "spark", "kafka", "airflow", "snowflake", "etl", "pyspark", "pipeline", "lakehouse"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Associate Data Engineer", ctc: "₹6.5 - 12 LPA", monthlyInHand: "₹48k - ₹84k / mo", multiplier: "3.2x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Senior Pipeline Engineer", ctc: "₹15.0 - 26 LPA", monthlyInHand: "₹1.0L - ₹1.8L / mo", multiplier: "4.8x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Data Architect", ctc: "₹30.0 - 52+ LPA", monthlyInHand: "₹2.1L - ₹3.6L / mo", multiplier: "6.6x" },
        ],
        skills: [
            { name: "Distributed Processing with Apache Spark & PySpark", tag: "BigData" },
            { name: "Event Streaming Pipelines with Apache Kafka", tag: "Streaming" },
            { name: "Data Orchestration & DAGs with Apache Airflow", tag: "Orchestration" },
            { name: "Data Warehousing in Snowflake & BigQuery", tag: "DataWarehouse" },
            { name: "Analytics Engineering & Transform with dbt", tag: "Transform" },
        ],
        topCompanies: ["Walmart Global Tech", "Uber", "Target", "LinkedIn", "JPMorgan Chase"],
        syllabus: [
            {
                phase: "Phase 1: Advanced Python, SQL Internals & Data Warehouse Architecture",
                weeks: "Weeks 1 - 3",
                title: "Data Modeling, Parquet Files & Cloud Lakehouse Fundamentals",
                description: "Master columnar storage formats (Parquet, ORC), lakehouse architecture, advanced SQL performance, and Python ETL scripts.",
                languages: ["Python 3.12", "SQL", "Bash"],
                frameworksTools: ["PostgreSQL", "Snowflake", "Apache Parquet", "Docker", "AWS S3"],
                fundamentalConcepts: [
                    "Columnar vs row-oriented storage engines: compression ratios, I/O efficiency, and memory access",
                    "Designing dimensional models: Fact tables, Conformed dimensions, Star and Snowflake schemas",
                    "Python ETL pipelines: extracting data from REST APIs, validating schemas with Pydantic, batch uploading to S3",
                    "ACID transactions in modern data systems and distributed storage consistency models"
                ],
                advancedSystemTopics: [
                    "Partitioning and clustering strategies in cloud warehouses (Snowflake / BigQuery)",
                    "Data Lakehouse architecture (Delta Lake / Apache Iceberg) with time-travel query support",
                    "Schema evolution and backward/forward compatibility strategies"
                ],
                capstoneProject: {
                    title: "Automated Cloud Lakehouse Ingestion & Partitioning Pipeline",
                    deliverable: "Python ETL pipeline extracting multi-source enterprise data, writing partitioned Parquet files to AWS S3",
                    features: ["Automated Parquet Snappy compression", "Date-partitioned folder structure on S3", "Automated data validation quality checks"]
                },
                interviewDsaPrep: "Data warehousing architectural trade-offs, SQL optimization scenarios & Python data engineering algorithms"
            },
            {
                phase: "Phase 2: Distributed Computing with Apache Spark & PySpark",
                weeks: "Weeks 4 - 7",
                title: "Massive Scale Distributed Data Processing with PySpark",
                description: "Process terabytes of structured and semi-structured data across distributed clusters using Spark DataFrames, Catalyst Optimizer, and PySpark.",
                languages: ["PySpark (Python)", "SQL", "Scala basics"],
                frameworksTools: ["Apache Spark", "PySpark", "Databricks", "Hadoop HDFS", "Jupyter"],
                fundamentalConcepts: [
                    "Spark cluster architecture: Driver, Executors, Cluster Manager, and Worker Nodes",
                    "Spark core internals: RDDs, DataFrames, Transformations (lazy evaluation) vs Actions",
                    "Catalyst Query Optimizer and Tungsten execution engine mechanics",
                    "Shuffling, Partitioning (repartition vs coalesce), and data skew mitigation"
                ],
                advancedSystemTopics: [
                    "Broadcast joins vs Shuffle Hash joins for optimizing large-table joins",
                    "Caching and persistence levels (MEMORY_AND_DISK, SER) for iterative workloads",
                    "Writing production Delta Lake tables with ACID transactions, merge upserts, and time travel"
                ],
                capstoneProject: {
                    title: "Terabyte-Scale PySpark Distributed Processing Engine",
                    deliverable: "Distributed PySpark pipeline running on cloud cluster aggregating millions of raw transactions into analytical data marts",
                    features: ["Broadcast join optimization for dimension lookups", "Skewed partition resolution with salting techniques", "Delta Lake ACID merge upsert integration"]
                },
                interviewDsaPrep: "Spark memory management architecture, DAG resolution & distributed sorting algorithms"
            },
            {
                phase: "Phase 3: Real-Time Event Streaming with Apache Kafka & Schema Registry",
                weeks: "Weeks 8 - 10",
                title: "Event Streaming Architectures, Producers, Consumers & Spark Streaming",
                description: "Design high-throughput, low-latency streaming pipelines with Apache Kafka, Confluent Schema Registry, and Spark Structured Streaming.",
                languages: ["Python", "JSON / Avro"],
                frameworksTools: ["Apache Kafka", "Zookeeper / KRaft", "Schema Registry", "Spark Structured Streaming", "Docker Compose"],
                fundamentalConcepts: [
                    "Kafka architecture: Topics, Partitions, Brokers, Producer acks, and Consumer Groups",
                    "Message offsets, rebalancing protocols, and exactly-once processing (EOSP) semantics",
                    "Schema evolution with Apache Avro and Confluent Schema Registry",
                    "Spark Structured Streaming: micro-batch processing, watermarking, and windowed aggregations"
                ],
                advancedSystemTopics: [
                    "Handling late-arriving event data using tumbling, sliding, and session windows with watermarks",
                    "Dead Letter Queues (DLQ) for poisoned messages and automated replay mechanisms",
                    "Kafka partition replication, min.insync.replicas, and leader election fault tolerance"
                ],
                capstoneProject: {
                    title: "Real-Time Fraud Detection Event Streaming Pipeline",
                    deliverable: "End-to-end streaming system ingesting 10,000 events/sec via Kafka and calculating live fraud scores with Spark Streaming",
                    features: ["Multi-partition Kafka cluster running in Docker", "Avro schema validation with Schema Registry", "Live sliding-window aggregation with watermarking"]
                },
                interviewDsaPrep: "Kafka partition sizing calculations, streaming window mechanics & queue/buffer algorithms"
            },
            {
                phase: "Phase 4: Workflow Orchestration with Airflow, dbt & Production Lakehouse",
                weeks: "Weeks 11 - 14",
                title: "Orchestration with Airflow DAGs, Analytics Engineering with dbt & CI/CD",
                description: "Schedule mission-critical data pipelines with Apache Airflow DAGs, build modular SQL data models with dbt, and implement data governance.",
                languages: ["Python", "SQL", "YAML"],
                frameworksTools: ["Apache Airflow", "dbt (data build tool)", "Snowflake", "Great Expectations", "GitHub Actions"],
                fundamentalConcepts: [
                    "Airflow architecture: Webserver, Scheduler, Metadata Database, and Celery / Kubernetes Executors",
                    "Designing Directed Acyclic Graphs (DAGs): Tasks, Operators, Sensors, and XComs",
                    "Analytics Engineering with dbt: models, sources, seeds, ref() functions, and lineage graphs",
                    "Automated data quality testing: schema tests, uniqueness checks, and Great Expectations assertions"
                ],
                advancedSystemTopics: [
                    "dbt incremental models (merge / delete+insert) to optimize cloud warehouse computing costs",
                    "Dynamic DAG generation in Airflow and custom plugin development",
                    "Data CI/CD pipelines with automated dbt docs generation and data observability alerts"
                ],
                capstoneProject: {
                    title: "Enterprise Production Data Platform Orchestrated with Airflow & dbt",
                    deliverable: "Production-grade data pipeline automatically triggered daily, transforming raw data into business data marts with automated quality tests",
                    features: ["Airflow DAG orchestrating Spark, S3, and Snowflake", "Modular dbt models with automated schema documentation", "Slack alerts on data test failures"]
                },
                interviewDsaPrep: "End-to-end Data Engineering System Design (Designing Uber Ride Pricing / Netflix Recommendation Pipeline)"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "qa-automation",
        title: "QA & Test Automation Architect",
        shortTitle: "QA & Automation",
        icon: TestTube2,
        badge: "Essential Stability",
        demandPercent: 90,
        timelineWeeks: 12,
        level: "Beginner to Automation Architect",
        prerequisites: "Zero prerequisites (Manual testing concepts & coding taught from scratch)",
        primaryLanguages: ["JavaScript / TypeScript", "Python 3.12", "Java", "SQL"],
        primaryFrameworks: ["Playwright", "Cypress", "Selenium WebDriver", "Postman", "Jest", "JMeter", "GitHub Actions"],
        keywords: ["qa", "testing", "automation", "test engineer", "selenium", "cypress", "playwright", "sdet", "quality assurance", "api testing"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior QA / SDET", ctc: "₹5.0 - 9.0 LPA", monthlyInHand: "₹38k - ₹65k / mo", multiplier: "2.6x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "SDET Automation Specialist", ctc: "₹11.5 - 19 LPA", monthlyInHand: "₹80k - ₹1.3L / mo", multiplier: "4.0x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal QA Architect", ctc: "₹22.0 - 38+ LPA", monthlyInHand: "₹1.5L - ₹2.6L / mo", multiplier: "5.5x" },
        ],
        skills: [
            { name: "Modern E2E Web Automation (Playwright & Cypress)", tag: "E2E" },
            { name: "API Test Automation (Postman & RestAssured)", tag: "API" },
            { name: "Performance & Load Testing (Apache JMeter / k6)", tag: "Load" },
            { name: "CI/CD Pipeline Integration & Parallel Test Execution", tag: "DevOps" },
            { name: "Test-Driven Development (TDD) & BDD (Cucumber)", tag: "Frameworks" },
        ],
        topCompanies: ["Adobe", "Intuit", "Qualcomm", "Wipro Digital", "Infosys"],
        syllabus: [
            {
                phase: "Phase 1: Software Testing Fundamentals, Test Plans, JIRA & Git",
                weeks: "Weeks 1 - 3",
                title: "Quality Assurance Foundations, Test Cases & Agile Workflows",
                description: "Master functional, regression, smoke, sanity, and exploratory testing methodologies alongside JIRA bug tracking and test case management.",
                languages: ["Markdown", "SQL basics"],
                frameworksTools: ["JIRA", "TestRail", "Git / GitHub", "Chrome DevTools", "Postman basics"],
                fundamentalConcepts: [
                    "Software Testing Life Cycle (STLC) vs Software Development Life Cycle (SDLC)",
                    "Writing comprehensive Test Cases, Acceptance Criteria, and Test Scenarios",
                    "Defect life cycle: bug reporting with reproducible steps, severity, and priority",
                    "Black-box testing techniques: Boundary Value Analysis (BVA) and Equivalence Partitioning"
                ],
                advancedSystemTopics: [
                    "Traceability matrices linking product requirements to automated test suites",
                    "Database verification with SQL queries verifying data integrity after user actions",
                    "Risk-based testing prioritization for rapid agile sprint release cycles"
                ],
                capstoneProject: {
                    title: "Comprehensive Enterprise Test Plan & JIRA Defect Suite",
                    deliverable: "Full test documentation suite covering 50+ test cases, boundary edge tests, and bug life-cycle tracking in JIRA",
                    features: ["Complete RTM (Requirements Traceability Matrix)", "Detailed bug reports with network HAR logs and reproduction steps", "SQL validation script suite"]
                },
                interviewDsaPrep: "Test case writing exercises for real-world products (e.g. Test ATM / Search Bar) & core testing principles"
            },
            {
                phase: "Phase 2: Modern E2E Automation with Playwright & Cypress in TypeScript",
                weeks: "Weeks 4 - 6",
                title: "Browser Automation, Page Object Model (POM) & Playwright",
                description: "Build robust, flake-resistant end-to-end browser test automation frameworks using Playwright and TypeScript with Page Object Models.",
                languages: ["TypeScript 5.4", "JavaScript"],
                frameworksTools: ["Playwright", "Cypress", "Node.js", "Page Object Model (POM)", "Allure Reports"],
                fundamentalConcepts: [
                    "Playwright architecture: browser contexts, multi-tab isolation, and WebSocket control",
                    "Robust element locators: getByRole, getByTestId, getByText, and avoiding fragile XPath",
                    "Auto-waiting mechanics vs explicit assertions (expect.toBeVisible, expect.toHaveText)",
                    "Implementing the Page Object Model (POM) pattern for scalable test maintainability"
                ],
                advancedSystemTopics: [
                    "Parallel test execution across Chromium, Firefox, and WebKit rendering engines",
                    "Network interception and mocking API responses (page.route) to simulate failure states",
                    "Visual regression testing with pixel-by-pixel snapshot comparison"
                ],
                capstoneProject: {
                    title: "Production Playwright E2E Automation Framework in TypeScript",
                    deliverable: "Scalable automated test repository running parallel cross-browser tests with rich HTML reports and video capture",
                    features: ["Complete Page Object Model design structure", "Mock network route tests for 500 server error handling", "Allure test execution report with screenshots"]
                },
                interviewDsaPrep: "Browser automation edge cases, locator strategies & coding challenges in JavaScript/TypeScript"
            },
            {
                phase: "Phase 3: REST API Automation, Mock Servers & CI/CD GitHub Actions",
                weeks: "Weeks 7 - 9",
                title: "API Automation Frameworks, Contract Testing & CI Integration",
                description: "Automate backend RESTful APIs, validate JSON schemas, build automated Newman test suites, and run tests on every GitHub commit.",
                languages: ["JavaScript", "Python"],
                frameworksTools: ["Postman / Newman", "Playwright APIRequestContext", "Jest / Supertest", "GitHub Actions"],
                fundamentalConcepts: [
                    "HTTP request methods (GET, POST, PUT, DELETE, PATCH) and HTTP response status codes",
                    "JSON schema validation (Ajv) and asserting response payload structures",
                    "Chaining API requests: dynamic authentication tokens, environment variables, and pre-request scripts",
                    "Running headless API test suites via CLI with Newman and generating JUnit reports"
                ],
                advancedSystemTopics: [
                    "Contract testing to guarantee frontend and backend API payload synchronization",
                    "Integrating automated test runs into GitHub Actions CI/CD with test failure gates",
                    "Database cleanup and data seeding fixtures before and after automated test runs"
                ],
                capstoneProject: {
                    title: "Automated REST API Test Suite Running on GitHub Actions CI/CD",
                    deliverable: "Headless API automation suite verifying 40+ endpoints with dynamic token authentication and automated test reports",
                    features: ["Automated JSON schema validator", "GitHub Actions pipeline failing PRs on test errors", "Parallel execution completing in under 45 seconds"]
                },
                interviewDsaPrep: "API testing status code scenarios, payload validation challenges & basic data structures"
            },
            {
                phase: "Phase 4: Performance Testing with JMeter/k6, Security Scans & SDET Interviews",
                weeks: "Weeks 10 - 12",
                title: "Load Testing with k6, Stress Analysis & Technical SDET Drills",
                description: "Stress test web applications under high concurrency using k6 and Apache JMeter, identify backend bottlenecks, and master SDET technical interviews.",
                languages: ["JavaScript (k6)", "XML"],
                frameworksTools: ["Grafana k6", "Apache JMeter", "OWASP ZAP", "GitHub Actions", "Docker"],
                fundamentalConcepts: [
                    "Performance testing metrics: Throughput (RPS), Latency (p90, p95, p99), Error Rate, and Virtual Users",
                    "Load testing vs Stress testing vs Spike testing vs Soak testing methodologies",
                    "Scripting virtual user scenarios in JavaScript using Grafana k6",
                    "Analyzing server bottlenecks: CPU saturation, memory leaks, and database connection pools"
                ],
                advancedSystemTopics: [
                    "Automated performance baseline thresholds in CI/CD (failing builds if p95 exceeds 200ms)",
                    "Basic DAST security scanning integration in automated regression suites",
                    "Designing test automation architecture and frameworks from scratch in whiteboard interviews"
                ],
                capstoneProject: {
                    title: "Enterprise k6 Concurrency Performance Benchmark Framework",
                    deliverable: "Automated load testing framework simulating 5,000 concurrent users against microservices with live Grafana dashboards",
                    features: ["Threshold validation for 99th percentile latency", "Automated HTML performance report generation", "Complete architectural portfolio presentation"]
                },
                interviewDsaPrep: "SDET coding interviews (Strings, Arrays, HashMaps), framework design questions & mock placement rounds"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "uiux-design",
        title: "UI/UX & Design Systems Engineer",
        shortTitle: "UI/UX & Design",
        icon: Palette,
        badge: "Creative Tech",
        demandPercent: 91,
        timelineWeeks: 12,
        level: "Beginner to Product Design Lead",
        prerequisites: "Zero prerequisites (Visual design & Figma taught from scratch)",
        primaryLanguages: ["HTML5 / CSS3", "Tailwind CSS", "TypeScript", "JavaScript"],
        primaryFrameworks: ["Figma", "Design Tokens", "Storybook", "Framer Motion", "Whimsical", "Notion", "Zeroheight"],
        keywords: ["ui/ux", "ui", "ux", "design", "figma", "product designer", "design system", "wireframe", "prototype", "user experience", "designer"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Associate Product Designer", ctc: "₹5.0 - 9.5 LPA", monthlyInHand: "₹38k - ₹68k / mo", multiplier: "2.7x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Product Designer / Design Technologist", ctc: "₹12.5 - 21 LPA", monthlyInHand: "₹88k - ₹1.5L / mo", multiplier: "4.3x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Design Lead", ctc: "₹25.0 - 42+ LPA", monthlyInHand: "₹1.7L - ₹2.9L / mo", multiplier: "5.9x" },
        ],
        skills: [
            { name: "Figma Masterclass (Components, Auto-Layout, Variables)", tag: "Tooling" },
            { name: "Design System Architecture & Multi-Brand Tokens", tag: "System" },
            { name: "User Research, Journey Mapping & Heuristic Evaluation", tag: "UX" },
            { name: "Interactive Prototyping & Micro-interactions (Framer)", tag: "Prototyping" },
            { name: "Frontend Code Handoff & Accessibility Standards (WCAG)", tag: "Engineering" },
        ],
        topCompanies: ["CRED", "Razorpay", "Swiggy", "Google", "Atlassian"],
        syllabus: [
            {
                phase: "Phase 1: Visual Design Theory, Typography, Color Psychology & Figma Mastery",
                weeks: "Weeks 1 - 3",
                title: "Visual Foundations, UI Grids & Advanced Figma Mechanics",
                description: "Master layout grids, typography hierarchies, harmonious color palettes, Auto-Layout 5.0, and atomic component architecture in Figma.",
                languages: ["CSS Typography", "Hex / HSL Colors"],
                frameworksTools: ["Figma", "Google Fonts", "Coolors", "Unsplash"],
                fundamentalConcepts: [
                    "Design principles: Contrast, Alignment, Hierarchy, Proximity, Balance, and Whitespace",
                    "8pt grid systems, baseline grids, and responsive desktop/tablet/mobile layout grids",
                    "Typography scales: calculating body, headings, line-heights, and font pairings",
                    "Figma Auto-Layout 5.0: constraints, padding, gap, wrap, min/max dimensions"
                ],
                advancedSystemTopics: [
                    "Component variants, component properties (boolean, text, instance swap)",
                    "Color psychology, dark mode contrast math (WCAG 2.1 AA/AAA compliance)",
                    "Custom vector iconography design and SVG export optimization"
                ],
                capstoneProject: {
                    title: "Modern FinTech Web & Mobile UI Kit in Figma",
                    deliverable: "Publication-grade Figma UI Kit featuring 30+ reusable atomic components with responsive auto-layout",
                    features: ["100% Auto-Layout responsive components", "Light & Dark theme variants", "Comprehensive typography and color style library"]
                },
                interviewDsaPrep: "Visual design critique sessions, Figma speed challenges & design portfolio presentation"
            },
            {
                phase: "Phase 2: UX Research, Information Architecture, Wireframing & Usability",
                weeks: "Weeks 4 - 6",
                title: "User Empathy, Problem Discovery, Personas & User Journey Mapping",
                description: "Conduct user interviews, synthesize research into empathy maps, build information architecture, and test low-fidelity prototypes.",
                languages: ["UX Documentation"],
                frameworksTools: ["Whimsical", "Miro", "Figma Jam", "Maze Usability Testing"],
                fundamentalConcepts: [
                    "Qualitative user interviews vs Quantitative surveys: asking unbiased open-ended questions",
                    "Synthesizing user research: Empathy Maps, User Personas, and Affinity Diagrams",
                    "Information Architecture (IA): Card Sorting, Site Maps, and User Flow Diagrams",
                    "Low-fidelity paper and digital wireframing to validate product core loops rapidly"
                ],
                advancedSystemTopics: [
                    "Heuristic Evaluation using Jakob Nielsen's 10 Usability Principles",
                    "Usability testing protocol design, task completion tracking, and SUS (System Usability Scale) scoring",
                    "Designing friction-free onboarding funnels and checkout conversion optimization"
                ],
                capstoneProject: {
                    title: "End-to-End UX Case Study for a B2B SaaS Application",
                    deliverable: "Comprehensive UX case study detailing problem discovery, user research synthesis, wireframes, and usability test results",
                    features: ["Complete user persona and journey map", "Low-fi wireframe iterations", "Maze usability test metric synthesis report"]
                },
                interviewDsaPrep: "UX Case study presentations, Nielsen Heuristic review drills & product thinking interviews"
            },
            {
                phase: "Phase 3: Scalable Design Systems, Auto-Layout 5.0, Variables & Tokens",
                weeks: "Weeks 7 - 9",
                title: "Design Tokens, Figma Variables, Component Sets & Documentation",
                description: "Build production enterprise design systems utilizing Figma Variables for multi-brand theming, design tokens, and Zeroheight documentation.",
                languages: ["JSON (Design Tokens)", "CSS Custom Properties"],
                frameworksTools: ["Figma Variables", "Tokens Studio", "Zeroheight", "Storybook basics"],
                fundamentalConcepts: [
                    "Design token taxonomy: Global tokens, Alias/Semantic tokens, and Component-specific tokens",
                    "Figma Variables: String, Number, Color, and Boolean modes for dynamic themes and languages",
                    "Component Set architecture: Buttons, Inputs, Modals, Badges, Tabs, and Table data grids",
                    "Documenting component states: default, hover, active, focus, disabled, and error states"
                ],
                advancedSystemTopics: [
                    "Multi-brand theming architecture allowing one design system to power multiple sub-brands",
                    "Exporting design tokens as JSON directly into codebases using Tokens Studio and GitHub sync",
                    "Design system governance, contribution models, and versioning roadmaps"
                ],
                capstoneProject: {
                    title: "Enterprise Multi-Brand Design System with Figma Variables",
                    deliverable: "Enterprise-grade Figma design system with 50+ component sets powered by multi-mode Variables",
                    features: ["Light, Dark, and High-Contrast variable modes", "Automated JSON token export structure", "Interactive Zeroheight style documentation"]
                },
                interviewDsaPrep: "Design System architectural defense, token taxonomy questions & component state edge cases"
            },
            {
                phase: "Phase 4: High-Fidelity Micro-interactions, Code Handoff & Portfolio",
                weeks: "Weeks 10 - 12",
                title: "Framer Prototyping, Tailwind Code Handoff & Senior Portfolio Review",
                description: "Build high-fidelity interactive prototypes with micro-interactions in Framer, master engineer-ready code handoffs, and assemble a world-class portfolio.",
                languages: ["HTML5", "Tailwind CSS", "JavaScript"],
                frameworksTools: ["Framer", "Storybook", "Figma Dev Mode", "GitHub", "Notion Portfolio"],
                fundamentalConcepts: [
                    "Smart Animate transitions in Figma: spring physics, easing curves, and delay choreographies",
                    "Advanced high-fidelity prototyping with input fields, scroll interactions, and logic conditions in Framer",
                    "Figma Dev Mode: inspecting CSS properties, assets export, and redlining specifications",
                    "Bridging design and engineering: understanding flexbox, box models, and responsive media queries"
                ],
                advancedSystemTopics: [
                    "Translating design tokens into Tailwind CSS configuration files and CSS variables",
                    "Conducting design QA on live frontend builds to catch spacing and layout discrepancies",
                    "Structuring a high-converting Product Design portfolio website that lands interviews"
                ],
                capstoneProject: {
                    title: "Live Interactive Framer Product Showcase & Portfolio Website",
                    deliverable: "Live portfolio website showcasing 3 in-depth UX/UI case studies with interactive Framer micro-interactions",
                    features: ["Live interactive product prototype", "Figma Dev Mode handoff documentation package", "Case study storytelling optimized for hiring managers"]
                },
                interviewDsaPrep: "Portfolio walkthrough defense, live app whiteboard challenge & stakeholder design critique rounds"
            }
        ],
        coursesSlug: "/courses"
    },
    {
        id: "game-dev",
        title: "Game Developer & Interactive Graphics Engine",
        shortTitle: "Game Development",
        icon: Gamepad2,
        badge: "Creative 3D",
        demandPercent: 89,
        timelineWeeks: 14,
        level: "Beginner to 3D Game Developer",
        prerequisites: "Basic math & problem-solving curiosity (C# & 3D Math taught from scratch)",
        primaryLanguages: ["C#", "C++", "HLSL / GLSL Shaders", "Python"],
        primaryFrameworks: ["Unity 6 Engine", "Unreal Engine 5", "Blender basics", "PhysX", "Git LFS", "Steamworks SDK"],
        keywords: ["game", "game developer", "game dev", "unity", "unreal", "c#", "c++", "3d", "graphics", "vr", "ar", "gameplay"],
        tiers: [
            { label: "Fresher (0-1 yrs)", subLabel: "Junior Gameplay Programmer", ctc: "₹5.0 - 9.5 LPA", monthlyInHand: "₹38k - ₹68k / mo", multiplier: "2.7x" },
            { label: "Mid-Level (1-3 yrs)", subLabel: "Core Unity/Unreal Developer", ctc: "₹12.0 - 20 LPA", monthlyInHand: "₹85k - ₹1.4L / mo", multiplier: "4.2x" },
            { label: "Senior/Lead (3+ yrs)", subLabel: "Lead Engine & Graphics Architect", ctc: "₹24.0 - 42+ LPA", monthlyInHand: "₹1.7L - ₹2.9L / mo", multiplier: "5.8x" },
        ],
        skills: [
            { name: "Unity 6 & Unreal Engine 5 Architecture", tag: "Engine" },
            { name: "3D Math (Vectors, Matrices, Quaternions, Dot/Cross Product)", tag: "Math" },
            { name: "Physics Simulation, Collision Detection & Game Loops", tag: "Physics" },
            { name: "Custom Shader Programming & Lighting (URP/HDRP)", tag: "Graphics" },
            { name: "Multiplayer Networking & Steam Integration", tag: "Multiplayer" },
        ],
        topCompanies: ["Ubisoft", "EA Games", "Rockstar Games India", "Dream11", "Nazara Technologies"],
        syllabus: [
            {
                phase: "Phase 1: C# Programming, 3D Vector Math & Unity Engine Foundations",
                weeks: "Weeks 1 - 3",
                title: "Game Loops, Vector Math & Component-Based C# Architecture",
                description: "Master C# object-oriented programming, 3D trigonometry, vector operations, and Unity's GameObject component lifecycle.",
                languages: ["C#", "HLSL basics"],
                frameworksTools: ["Unity 6", "Visual Studio", "Unity Profiler", "Git LFS"],
                fundamentalConcepts: [
                    "C# fundamentals for games: Classes, Interfaces, Inheritance, Delegates, Events, and Generics",
                    "Unity game loop lifecycle: Awake, Start, FixedUpdate, Update, LateUpdate, and OnDestroy",
                    "3D vector mathematics: Vector3 math, magnitude, normalization, Dot Product (field-of-view), Cross Product",
                    "Transform hierarchy, local vs world coordinates, and GameObject component referencing"
                ],
                advancedSystemTopics: [
                    "Quaternion rotations vs Euler angles to prevent Gimbal Lock",
                    "Object Pooling design patterns to eliminate garbage collection runtime frame drops",
                    "Custom ScriptableObjects for modular game data, inventory systems, and character stats"
                ],
                capstoneProject: {
                    title: "Action Arcade 3D Arena Shooter Game",
                    deliverable: "Playable 3D action game with player movement, enemy AI waves, shooting mechanics, and particle feedback",
                    features: ["Smooth 3D character controller with vector math", "Object pooling engine for projectiles and particles", "ScriptableObject-driven enemy stat system"]
                },
                interviewDsaPrep: "3D vector mathematics challenges, C# memory allocation drills & game loop questions"
            },
            {
                phase: "Phase 2: Physics Engines, Character Controllers, Animation State Machines",
                weeks: "Weeks 4 - 7",
                title: "Rigidbody Physics, Inverse Kinematics & Mecanim Animation",
                description: "Implement realistic physical interactions, character controllers, root motion animation state machines, and dynamic soundscapes.",
                languages: ["C#"],
                frameworksTools: ["Unity PhysX", "Mecanim Animator", "Unity Audio Mixer", "Cinemachine"],
                fundamentalConcepts: [
                    "Physics simulation: Rigidbody velocity, forces (AddForce), torque, physics materials (friction, bounciness)",
                    "Collision detection: OnCollisionEnter vs OnTriggerEnter, Layer Collision Matrix, and Raycasting",
                    "Mecanim Animation Controller: Blend Trees for 8-directional movement, transitions, and parameters",
                    "Cinemachine dynamic cameras: targeting, procedural screen shake, and third-person follow"
                ],
                advancedSystemTopics: [
                    "Ragdoll physics integration blended smoothly with character animations",
                    "Raycast-driven ground detection, slope climbing adjustments, and ledge grabbing mechanics",
                    "Spatial 3D audio listener positioning and dynamic audio ducking"
                ],
                capstoneProject: {
                    title: "Third-Person Action Adventure Platformer Game",
                    deliverable: "Full third-person playable game featuring fluid animations, climbing mechanics, combat collisions, and Cinemachine camera",
                    features: ["Blend tree 8-way locomotion controller", "Raycast physics interaction system", "Cinemachine camera with dynamic combat zoom"]
                },
                interviewDsaPrep: "Physics engine collision detection mechanics, Raycast mathematical formulas & tree data structures"
            },
            {
                phase: "Phase 3: Shaders, Particle Systems, Post-Processing & Profiling",
                weeks: "Weeks 8 - 10",
                title: "Shader Graph, Visual Effects (VFX Graph) & GPU Performance Profiling",
                description: "Create stunning custom visual effects using Unity Shader Graph, VFX Graph particle systems, and optimize frame rates with Unity Profiler.",
                languages: ["HLSL", "Shader Graph", "C#"],
                frameworksTools: ["Unity Shader Graph", "VFX Graph", "Universal Render Pipeline (URP)", "Unity Profiler", "Frame Debugger"],
                fundamentalConcepts: [
                    "Render pipelines: URP vs HDRP lighting, materials, and PBR (Physically Based Rendering) workflows",
                    "Shader Graph visual programming: vertex displacements, noise maps, Fresnel rim lighting, and dissolutions",
                    "VFX Graph GPU particle systems simulating fire, magic spells, smoke, and explosions",
                    "Lighting architecture: Real-time point/spot lights vs Baked Lightmaps and reflection probes"
                ],
                advancedSystemTopics: [
                    "Draw call reduction: Static batching, Dynamic batching, and GPU instancing",
                    "Memory and CPU profiling with Unity Profiler and Frame Debugger to lock 60fps on low-end hardware",
                    "Post-processing volumes: Bloom, Color Grading, Ambient Occlusion, and Depth of Field"
                ],
                capstoneProject: {
                    title: "Visually Stunning 3D Dungeon Environment with Custom Shaders",
                    deliverable: "Optimized 3D playable level with custom water shaders, magical VFX spells, baked lighting, and 60fps locked performance",
                    features: ["Custom interactive water and dissolve Shader Graph", "GPU VFX Graph particle magic system", "Zero frame drop execution profiled via Frame Debugger"]
                },
                interviewDsaPrep: "GPU graphics rendering pipeline steps, Shader math (dot product, noise) & memory optimization"
            },
            {
                phase: "Phase 4: Multiplayer Networking, Game Architecture Patterns & Release",
                weeks: "Weeks 11 - 14",
                title: "Networked Multiplayer (Netcode for GameObjects), Steam Integration & Publishing",
                description: "Build real-time multiplayer games with client-server prediction, implement Steamworks achievements, and export production game builds.",
                languages: ["C#"],
                frameworksTools: ["Netcode for GameObjects (NGO)", "Unity Transport (UTP)", "Steamworks SDK", "Inno Setup", "itch.io"],
                fundamentalConcepts: [
                    "Multiplayer network architecture: Peer-to-Peer vs Dedicated Authoritative Server vs Host/Client",
                    "NetworkVariables, ServerRPCs, and ClientRPCs synchronization patterns",
                    "Client-side prediction, interpolation, and server reconciliation to handle network latency and packet loss",
                    "Steamworks SDK integration: user authentication, leaderboards, and achievement unlocks"
                ],
                advancedSystemTopics: [
                    "State synchronization bandwidth optimization: delta compression and interest management",
                    "Anti-cheat fundamentals and validating player actions exclusively on authoritative servers",
                    "Building multi-platform binaries (Windows, macOS, Linux) with automated CI/CD build scripts"
                ],
                capstoneProject: {
                    title: "Live Multiplayer 3D Game with Steam Leaderboards & Matchmaking",
                    deliverable: "Complete multiplayer game published on itch.io / Steam with real-time lobbies, player sync, and networked combat",
                    features: ["Netcode for GameObjects server-authoritative multiplayer", "Real-time room creation and matchmaking", "Published game installer with complete portfolio gameplay trailer"]
                },
                interviewDsaPrep: "Multiplayer network latency compensation scenarios, Game Architecture patterns (State, Observer, Command) & mock technical rounds"
            }
        ],
        coursesSlug: "/courses"
    }
];

export function TechCareerCalculator() {
    const [selectedTrackId, setSelectedTrackId] = useState<string>("fullstack-ai");
    const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSyllabusOpen, setIsSyllabusOpen] = useState<boolean>(false);
    const [activePhaseIndex, setActivePhaseIndex] = useState<number | "all">("all");

    // Filter static tracks based on search query
    const staticFiltered = useMemo(() => {
        if (!searchQuery.trim()) return STATIC_CAREER_TRACKS;
        const q = searchQuery.toLowerCase().trim();
        return STATIC_CAREER_TRACKS.filter(track => 
            track.title.toLowerCase().includes(q) ||
            track.shortTitle.toLowerCase().includes(q) ||
            track.keywords.some(k => k.toLowerCase().includes(q)) ||
            track.skills.some(s => s.name.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    // Dynamic on-the-fly custom role generator for ANY search query
    const customDynamicTrack = useMemo<CareerTrack | null>(() => {
        if (staticFiltered.length > 0 || !searchQuery.trim() || searchQuery.trim().length < 2) return null;
        
        const cleanName = searchQuery.trim().split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

        return {
            id: `custom-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
            title: `${cleanName} Specialist`,
            shortTitle: cleanName,
            icon: Terminal,
            badge: "Custom Role Search",
            demandPercent: 93,
            timelineWeeks: 14,
            isCustom: true,
            level: "Beginner to Enterprise Specialist",
            prerequisites: "Starts from fundamental concepts with zero prerequisites",
            primaryLanguages: [`${cleanName} Primary Language`, "SQL", "TypeScript / Python", "Bash"],
            primaryFrameworks: [`${cleanName} Core Frameworks`, "Git", "Docker", "Cloud Deploy", "CI/CD"],
            keywords: [cleanName.toLowerCase()],
            tiers: [
                { label: "Fresher (0-1 yrs)", subLabel: "Entry Level", ctc: "₹5.5 - 10.0 LPA", monthlyInHand: "₹42k - ₹74k / mo", multiplier: "2.8x" },
                { label: "Mid-Level (1-3 yrs)", subLabel: "Core Specialist", ctc: "₹13.5 - 24 LPA", monthlyInHand: "₹92k - ₹1.6L / mo", multiplier: "4.5x" },
                { label: "Senior/Lead (3+ yrs)", subLabel: "Principal Lead", ctc: "₹28.0 - 48+ LPA", monthlyInHand: "₹1.9L - ₹3.3L / mo", multiplier: "6.4x" },
            ],
            skills: [
                { name: `${cleanName} Core Architecture`, tag: "Core" },
                { name: "Industry Standard Toolchain", tag: "Tools" },
                { name: "Production System Design", tag: "System" },
                { name: "Automation & CI/CD Pipelines", tag: "DevOps" },
                { name: "Security & Performance Audit", tag: "Optimization" }
            ],
            topCompanies: ["Microsoft", "Google", "Amazon", "Accenture", "TCS Digital"],
            syllabus: [
                {
                    phase: `Phase 1: ${cleanName} Fundamentals & Modern Tooling`,
                    weeks: "Weeks 1 - 3",
                    title: `Foundations of ${cleanName}`,
                    description: `Master fundamental syntax, memory management, toolchain setup, and core design principles of ${cleanName}.`,
                    languages: [`${cleanName} Core Syntax`, "Bash", "Git"],
                    frameworksTools: ["Core Development SDK", "Linter", "Package Manager", "GitHub"],
                    fundamentalConcepts: [
                        "Environment setup, CLI commands, package managers and dependencies",
                        "Variables, Scope, Memory lifecycles, Data Structures & Control Flow",
                        "Functions, Object-Oriented principles, Interfaces and Type Checking",
                        "Debugging tools, Stack Traces, and Unit Testing foundations"
                    ],
                    advancedSystemTopics: [
                        "Design Patterns (Factory, Observer, Singleton) tailored for this domain",
                        "Clean Code architecture and SOLID principles adherence",
                        "Modular architecture and code splitting techniques"
                    ],
                    capstoneProject: {
                        title: `${cleanName} Baseline Production Architecture System`,
                        deliverable: "Fully functional modular system with clean architecture and automated tests",
                        features: ["Modular architecture", "100% test coverage for core business logic", "CI/CD linting check"]
                    },
                    interviewDsaPrep: "Core language syntax challenges, Object-Oriented Design & Code Refactoring interviews"
                },
                {
                    phase: `Phase 2: Scalable Real-World Implementations & APIs`,
                    weeks: "Weeks 4 - 7",
                    title: `Enterprise ${cleanName} Workflows`,
                    description: "Build robust, scalable implementations handling real enterprise workflows, database integrations, and high-throughput data.",
                    languages: [`${cleanName}`, "SQL", "JSON/YAML"],
                    frameworksTools: ["Database ORM", "Redis Caching", "API Gateway", "Postman"],
                    fundamentalConcepts: [
                        "Database schema modeling, indexing, and transactional integrity",
                        "REST / gRPC API integration standards and data serialization",
                        "Error boundaries, structured logging, and graceful degradation",
                        "State management and asynchronous background task processing"
                    ],
                    advancedSystemTopics: [
                        "High-concurrency data pipelines and in-memory caching",
                        "Secure authentication, authorization and role access control (RBAC)",
                        "Automated integration testing and mock services"
                    ],
                    capstoneProject: {
                        title: `Enterprise-Grade ${cleanName} Production Application`,
                        deliverable: "Production service with multi-tenant database access and caching",
                        features: ["Sub-50ms query response times", "Automated error recovery", "Role-based security"]
                    },
                    interviewDsaPrep: "Data structures (HashMaps, Queues), API design questions & Database normalization"
                },
                {
                    phase: "Phase 3: Real-World Integrations & AI Copilot Acceleration",
                    weeks: "Weeks 8 - 11",
                    title: "AI Workflows & Cloud Integration",
                    description: "Leverage AI-driven accelerators, cloud containerization, and modern telemetry observability.",
                    languages: ["Python / TypeScript", "Docker syntax"],
                    frameworksTools: ["Docker", "LangChain / AI SDKs", "Prometheus", "GitHub Actions"],
                    fundamentalConcepts: [
                        "Containerizing applications with multi-stage Docker builds",
                        "AI API integrations for automated data analysis and code generation",
                        "Application metrics instrumentation, telemetry, and health check endpoints",
                        "Cloud object storage and distributed file management"
                    ],
                    advancedSystemTopics: [
                        "Automated CI/CD deployment pipelines with zero downtime",
                        "Rate limiting, DDoS prevention, and security vulnerability audits",
                        "Horizontal scaling and autoscaling triggers"
                    ],
                    capstoneProject: {
                        title: `Full-Scale Multi-Tenant ${cleanName} Cloud Solution`,
                        deliverable: "Containerized cloud application running with live telemetry dashboards",
                        features: ["Automated Docker build pipeline", "Live Prometheus performance metrics", "Integrated AI copilot"]
                    },
                    interviewDsaPrep: "System architecture trade-offs, scalability scenarios & AI automation workflows"
                },
                {
                    phase: "Phase 4: System Design & Technical Placement Readiness",
                    weeks: "Weeks 12 - 14",
                    title: "System Design, Portfolio & Mock Technical Interviews",
                    description: "Master domain-specific system design case studies, live coding challenges, and mock technical interview rounds.",
                    languages: [`${cleanName}`],
                    frameworksTools: ["System Design Boards", "LeetCode / HackerRank", "GitHub Showcase"],
                    fundamentalConcepts: [
                        "High-Level and Low-Level System Design principles",
                        "Performance profiling, bottleneck identification and memory optimization",
                        "Technical portfolio presentation and GitHub repository branding",
                        "STAR method behavioral interview answering frameworks"
                    ],
                    advancedSystemTopics: [
                        "Domain-specific scalability case studies and trade-off justification",
                        "Live whiteboarding and machine coding speed execution",
                        "Resume tailoring and LinkedIn engineering network optimization"
                    ],
                    capstoneProject: {
                        title: `Live Production Portfolio Showcase on GitHub`,
                        deliverable: "Production-ready portfolio repository with live demo links and architectural documentation",
                        features: ["Complete README with system diagrams", "Live cloud deployment URL", "Comprehensive test suite results"]
                    },
                    interviewDsaPrep: "Mock technical interviews with industry mentors, algorithmic problem solving & live system design boards"
                }
            ],
            coursesSlug: "/courses"
        };
    }, [staticFiltered, searchQuery]);

    const allDisplayTracks = useMemo(() => {
        if (customDynamicTrack) {
            return [customDynamicTrack];
        }
        return staticFiltered;
    }, [staticFiltered, customDynamicTrack]);

    const activeTrack = useMemo(() => {
        if (customDynamicTrack && customDynamicTrack.id === selectedTrackId) {
            return customDynamicTrack;
        }
        const found = STATIC_CAREER_TRACKS.find(t => t.id === selectedTrackId);
        if (found) return found;
        if (customDynamicTrack) return customDynamicTrack;
        return allDisplayTracks[0] || STATIC_CAREER_TRACKS[0];
    }, [selectedTrackId, customDynamicTrack, allDisplayTracks]);

    const activeTier = activeTrack.tiers[selectedTierIndex] || activeTrack.tiers[0];

    const displayedPhases = useMemo(() => {
        if (activePhaseIndex === "all") return activeTrack.syllabus;
        return [activeTrack.syllabus[activePhaseIndex]] || activeTrack.syllabus;
    }, [activeTrack, activePhaseIndex]);

    return (
        <section className="relative py-8 sm:py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-[#030712] via-[#080d1e] to-[#030712]">
            {/* Background Ambient Glow Gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container mx-auto px-3.5 sm:px-6 max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] sm:text-sm font-semibold mb-3 sm:mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Interactive Career & Detailed Syllabus Intelligence</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.18]"
                    >
                        Know Your Tech Worth &{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                            Explore Detailed Syllabus
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xs sm:text-base md:text-lg mt-2 sm:mt-3.5 max-w-2xl mx-auto"
                    >
                        Search any role to simulate real-time industry CTC and inspect the <strong>exhaustive, step-by-step syllabus</strong> with every language, framework, fundamental, and capstone project detailed.
                    </motion.p>
                </div>

                {/* Main Interactive Matrix Container */}
                <div className="bg-[#0A0F24]/85 backdrop-blur-2xl border border-white/[0.12] rounded-xl sm:rounded-3xl p-2.5 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(59,130,246,0.1)] relative">
                    <div className="absolute top-0 inset-x-6 sm:inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

                    {/* Step 1: Controls Header with SLIM Search Bar */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-4">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                1. Search Or Select Any Tech Role
                            </span>

                            {/* Slim Sleek Search Bar */}
                            <div className="relative w-full sm:w-80 md:w-96">
                                <div className="relative flex items-center h-9 sm:h-9.5 px-3 rounded-full bg-[#060a18]/90 border border-white/15 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-inner">
                                    <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search any role (e.g. AI, Fullstack, DevOps, Python)..."
                                        className="w-full bg-transparent border-none text-xs sm:text-[13px] text-white placeholder:text-slate-500 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                                            title="Clear search"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Filter Pill Shortcuts */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-3 text-xs touch-pan-x -mx-0.5 px-0.5">
                            <span className="text-[11px] text-slate-500 shrink-0 hidden sm:inline">Popular:</span>
                            {["All Roles", "Fullstack AI", "Frontend", "Backend", "AI & Data Science", "DevOps", "Mobile", "Cybersecurity", "Data Analytics", "Data Engineering", "QA", "UI/UX", "Game Dev"].map((tag) => {
                                const isCurrent = (tag === "All Roles" && !searchQuery) || (searchQuery.toLowerCase() === tag.toLowerCase());
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (tag === "All Roles") {
                                                setSearchQuery("");
                                            } else {
                                                setSearchQuery(tag);
                                            }
                                        }}
                                        className={cn(
                                            "px-2.5 py-1 rounded-full font-medium shrink-0 transition-all text-[11px]",
                                            isCurrent
                                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                                                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5"
                                        )}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Track Selector Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3 max-h-[220px] sm:max-h-[380px] overflow-y-auto scrollbar-hide pr-0.5">
                            {allDisplayTracks.map((track) => {
                                const isSelected = track.id === activeTrack.id;
                                const IconComponent = track.icon;
                                return (
                                    <button
                                        key={track.id}
                                        onClick={() => setSelectedTrackId(track.id)}
                                        className={cn(
                                            "relative text-left p-2 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col justify-between group",
                                            isSelected
                                                ? "bg-gradient-to-br from-blue-950/70 to-slate-900 border-blue-500/50 shadow-[0_8px_24px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/30"
                                                : "bg-[#070b19]/60 hover:bg-[#0d1430]/70 border-white/[0.08] hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                                            <div className={cn(
                                                "w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shrink-0",
                                                isSelected 
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                                                    : "bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10"
                                            )}>
                                                <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
                                            </div>
                                            <span className={cn(
                                                "text-[7px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border truncate max-w-[65px] sm:max-w-none",
                                                isSelected
                                                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                                                    : "bg-white/5 text-slate-400 border-white/5"
                                            )}>
                                                {track.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className={cn(
                                                "font-bold text-[10px] min-[360px]:text-[11px] sm:text-sm tracking-tight transition-colors line-clamp-1",
                                                isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                                            )}>
                                                {track.title}
                                            </h3>
                                            <p className="text-[8.5px] sm:text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400 shrink-0" />
                                                <span className="truncate">{track.demandPercent}% hiring</span>
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <motion.div
                                                layoutId="selected-indicator-line"
                                                className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Experience Stage Selector */}
                    <div className="mb-4 sm:mb-7">
                        <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-1">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                2. Select Experience Stage
                            </span>
                            <span className="text-xs text-cyan-400 font-semibold truncate max-w-[140px] sm:max-w-none">
                                {activeTier.subLabel}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 sm:gap-2.5 bg-[#060A18]/80 p-1 rounded-xl sm:rounded-2xl border border-white/[0.05]">
                            {activeTrack.tiers.map((tier, idx) => {
                                const isSelected = idx === selectedTierIndex;
                                return (
                                    <button
                                        key={tier.label}
                                        onClick={() => setSelectedTierIndex(idx)}
                                        className={cn(
                                            "py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl text-center transition-all duration-300 relative flex items-center justify-center min-h-[38px] sm:min-h-[44px]",
                                            isSelected
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 border border-blue-400/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                                        )}
                                    >
                                        <span className="font-semibold text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm tracking-tight whitespace-nowrap truncate">
                                            {tier.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 3: Simulation Results Display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTrack.id}-${selectedTierIndex}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pt-1"
                        >
                            {/* Left Pillar: Compensation Showcase (5 Columns) */}
                            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c142c] via-[#091024] to-[#060a18] border border-blue-500/25 rounded-2xl p-4 sm:p-6 md:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                                <div>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400">
                                            Projected Industry CTC
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                            <TrendingUp className="w-3 h-3" />
                                            {activeTier.multiplier} Hike
                                        </span>
                                    </div>

                                    {/* Big CTC Display */}
                                    <div className="my-1.5 sm:my-2">
                                        <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-300">
                                                {activeTier.ctc}
                                            </span>
                                        </h3>
                                        <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5 flex-wrap">
                                            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>Estimated In-Hand:</span>
                                            <span className="text-cyan-300 font-semibold">{activeTier.monthlyInHand}</span>
                                        </p>
                                    </div>

                                    {/* Languages & Frameworks Summary Badges */}
                                    <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-4 border-t border-white/[0.08] space-y-2">
                                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                <Code className="w-3.5 h-3.5 text-cyan-400" /> Languages:
                                            </span>
                                            {activeTrack.primaryLanguages.slice(0, 3).map(lang => (
                                                <span key={lang} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium font-mono">
                                                    {lang}
                                                </span>
                                            ))}
                                            {activeTrack.primaryLanguages.length > 3 && (
                                                <span className="text-[10px] text-slate-500 font-mono">+{activeTrack.primaryLanguages.length - 3} more</span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-left pt-1">
                                            <div className="bg-black/30 p-2 sm:p-2.5 rounded-xl border border-white/5">
                                                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">
                                                    Timeline
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block truncate">
                                                    {activeTrack.timelineWeeks} Weeks Roadmap
                                                </span>
                                            </div>
                                            <div className="bg-black/30 p-2 sm:p-2.5 rounded-xl border border-white/5">
                                                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">
                                                    Hiring Demand
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-cyan-400 mt-0.5 block flex items-center gap-1 truncate">
                                                    {activeTrack.demandPercent}% High
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Instant Action Buttons - Dedicated Detailed Syllabus & Dedicated Courses */}
                                <div className="mt-5 sm:mt-6 pt-2 space-y-2">
                                    <button
                                        onClick={() => {
                                            setActivePhaseIndex("all");
                                            setIsSyllabusOpen(true);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-3.5 sm:py-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/25 to-indigo-500/20 hover:from-cyan-500/35 hover:to-indigo-500/35 text-cyan-200 hover:text-white font-bold text-xs sm:text-sm border border-cyan-400/40 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-[0.98] transition-all group"
                                    >
                                        <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                                        <span className="truncate">View Detailed Syllabus</span>
                                        <span className="hidden min-[380px]:inline-block ml-auto text-[10px] uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shrink-0">
                                            {activeTrack.timelineWeeks} Wk
                                        </span>
                                    </button>

                                    <Link
                                        href="/courses"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 active:scale-[0.98] transition-all group"
                                    >
                                        <GraduationCap className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Explore All Courses</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto shrink-0" />
                                    </Link>

                                    <Link
                                        href="/internships"
                                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-[11px] sm:text-xs border border-white/10 transition-colors"
                                    >
                                        <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span className="truncate">View Verified Internships</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Pillar: Skills + Hiring Ecosystem (7 Columns) */}
                            <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5 bg-[#070b1a]/60 border border-white/[0.08] rounded-2xl p-4 sm:p-6 md:p-7">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 truncate">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Skill Matrix for {activeTrack.shortTitle}</span>
                                        </h4>
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                                            100% Covered
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {activeTrack.skills.map((skill) => (
                                            <div
                                                key={skill.name}
                                                className="flex items-center gap-1.5 sm:gap-2 bg-[#0d1430] border border-blue-500/20 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm text-slate-200 hover:border-blue-400/40 transition-colors shadow-sm"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] shrink-0" />
                                                <span className="font-semibold">{skill.name}</span>
                                                <span className="text-[9px] sm:text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-md font-mono">
                                                    {skill.tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom: Hiring Radar & Companies */}
                                <div className="pt-3 sm:pt-4 border-t border-white/[0.08]">
                                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                                        <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                            <span>Top Hiring Employers</span>
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                                            Active Hiring
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                                        {activeTrack.topCompanies.map((company) => (
                                            <div
                                                key={company}
                                                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 font-bold text-xs sm:text-sm hover:text-white hover:border-blue-400/30 transition-all flex items-center gap-1.5"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-blue-400" />
                                                {company}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Proof Note */}
                                    <div className="mt-3.5 sm:mt-4 p-2.5 sm:p-3 rounded-xl bg-blue-500/[0.04] border border-blue-500/10 flex items-start gap-2 text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                        <p>
                                            Every Webory syllabus track starts from absolute zero fundamentals and progresses into building production projects with direct mentor feedback and interview prep.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Ultra-Detailed Interactive Syllabus Modal - Fully Mobile Optimized */}
            <AnimatePresence>
                {isSyllabusOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto scrollbar-hide">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSyllabusOpen(false)}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-[#090E23] border border-white/20 rounded-2xl sm:rounded-3xl p-3 min-[400px]:p-4 sm:p-6 md:p-7 shadow-2xl z-10 max-h-[92vh] sm:max-h-[94vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="pb-2.5 sm:pb-4 border-b border-white/10 shrink-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 pr-1">
                                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[9.5px] sm:text-xs font-bold">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{activeTrack.timelineWeeks} Wk Curriculum</span>
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9.5px] sm:text-xs font-semibold truncate max-w-[150px] sm:max-w-none">
                                                {activeTrack.level}
                                            </span>
                                        </div>

                                        <h3 className="text-base min-[400px]:text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                                            {activeTrack.title} — Syllabus
                                        </h3>
                                        <p className="text-[10.5px] sm:text-xs text-slate-400 mt-0.5 truncate">
                                            Prerequisites: <span className="text-cyan-300 font-semibold">{activeTrack.prerequisites}</span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsSyllabusOpen(false)}
                                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                                        aria-label="Close syllabus"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Languages & Tech Stack Summary Bar */}
                                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                            <Code className="w-3 h-3 text-cyan-400" /> Languages:
                                        </span>
                                        {activeTrack.primaryLanguages.slice(0, 4).map(lang => (
                                            <span key={lang} className="px-1.5 sm:px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[9.5px] sm:text-[10px] font-mono font-medium">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                            <Wrench className="w-3 h-3 text-blue-400" /> Frameworks:
                                        </span>
                                        {activeTrack.primaryFrameworks.slice(0, 4).map(fw => (
                                            <span key={fw} className="px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[9.5px] sm:text-[10px] font-mono font-medium">
                                                {fw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Phase Quick Selector Tabs */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-2.5 sm:mt-3 scrollbar-hide text-xs touch-pan-x">
                                    <button
                                        onClick={() => setActivePhaseIndex("all")}
                                        className={cn(
                                            "px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all shrink-0 text-[11px] sm:text-xs",
                                            activePhaseIndex === "all"
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        All Phases
                                    </button>
                                    {activeTrack.syllabus.map((p, idx) => (
                                        <button
                                            key={p.phase}
                                            onClick={() => setActivePhaseIndex(idx)}
                                            className={cn(
                                                "px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all shrink-0 text-[11px] sm:text-xs",
                                                activePhaseIndex === idx
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                            )}
                                        >
                                            Phase {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Exhaustive Syllabus Scrollable Area */}
                            <div className="py-3 sm:py-4 overflow-y-auto scrollbar-hide space-y-4 sm:space-y-5 pr-0.5">
                                {displayedPhases.map((phase, idx) => {
                                    const actualIndex = activePhaseIndex === "all" ? idx : (typeof activePhaseIndex === "number" ? activePhaseIndex : idx);
                                    return (
                                        <div
                                            key={phase.phase}
                                            className="p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-[#060a18] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 sm:space-y-4"
                                        >
                                            {/* Phase Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 sm:pb-3 border-b border-white/10">
                                                <div>
                                                    <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                                                        Phase {actualIndex + 1} • {phase.weeks}
                                                    </span>
                                                    <h4 className="text-sm sm:text-base md:text-lg font-black text-white">
                                                        {phase.title}
                                                    </h4>
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                                                    Step-by-Step Breakdown
                                                </span>
                                            </div>

                                            <p className="text-[11.5px] sm:text-sm text-slate-300 leading-relaxed">
                                                {phase.description}
                                            </p>

                                            {/* Languages & Tools in This Phase */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-black/40 p-2.5 sm:p-3 rounded-xl border border-white/5 text-xs">
                                                <div>
                                                    <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                                                        <Code className="w-3 h-3 text-cyan-400" /> Languages Taught:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                                        {phase.languages.map(l => (
                                                            <span key={l} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[10px] sm:text-[11px]">
                                                                {l}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                                                        <Wrench className="w-3 h-3 text-blue-400" /> Frameworks & Tools:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                                        {phase.frameworksTools.map(t => (
                                                            <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[10px] sm:text-[11px]">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Concept Checklist: Chota se Chota & Bada se Bada */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                {/* Left Column: Fundamental Concepts */}
                                                <div className="p-3 sm:p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/15">
                                                    <span className="text-[11px] sm:text-xs uppercase font-extrabold text-cyan-300 flex items-center gap-1.5 mb-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                                        <span>Fundamental Concepts (Chota se Chota)</span>
                                                    </span>
                                                    <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                                                        {phase.fundamentalConcepts.map((item) => (
                                                            <li key={item} className="flex items-start gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Right Column: Advanced & System Topics */}
                                                <div className="p-3 sm:p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/15">
                                                    <span className="text-[11px] sm:text-xs uppercase font-extrabold text-purple-300 flex items-center gap-1.5 mb-2">
                                                        <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                                        <span>Advanced Systems & Scale (Bada se Bada)</span>
                                                    </span>
                                                    <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                                                        {phase.advancedSystemTopics.map((item) => (
                                                            <li key={item} className="flex items-start gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1 shrink-0" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Capstone Project Box */}
                                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-black/40 border border-blue-400/25">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                                                    <span className="text-[11px] sm:text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                        <span>Production Capstone Project:</span>
                                                    </span>
                                                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">
                                                        {phase.capstoneProject.deliverable}
                                                    </span>
                                                </div>

                                                <h5 className="text-xs sm:text-sm md:text-base font-black text-white mb-1.5">
                                                    {phase.capstoneProject.title}
                                                </h5>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] sm:text-xs text-slate-300">
                                                    {phase.capstoneProject.features.map(f => (
                                                        <div key={f} className="flex items-center gap-1.5">
                                                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                                            <span>{f}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Interview & Placement Milestone */}
                                            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center gap-2 text-[10.5px] sm:text-xs text-emerald-300">
                                                <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>
                                                    <strong>Placement Drill:</strong> {phase.interviewDsaPrep}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Modal Footer - Mobile Thumb Friendly */}
                            <div className="pt-2.5 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 shrink-0">
                                <span className="text-[11px] text-slate-400 hidden sm:inline">
                                    Includes 1-on-1 code reviews, verified GitHub portfolio & placement guidance.
                                </span>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setIsSyllabusOpen(false)}
                                        className="w-1/3 sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                    <Link
                                        href="/courses"
                                        onClick={() => setIsSyllabusOpen(false)}
                                        className="w-2/3 sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 transition-all truncate"
                                    >
                                        <span>Start Learning</span>
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

