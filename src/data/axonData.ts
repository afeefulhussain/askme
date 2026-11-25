export interface Wing {
  id: string;
  slug: string;
  name: string;
  directorate: string;
  code: string;
  lead: string;
  role: string;
  tagline: string;
  mandate: string;
  focus: string[];
  tools: string[];
  status: "Active" | "Incubating" | "Expanding";
  initiativesCount: number;
}

export interface AxonEvent {
  id: string;
  slug: string;
  title: string;
  category: "Webinar" | "Technical Workshop" | "Bootcamp" | "Symposium" | "Orientation";
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  status: "Scheduled" | "Completed" | "Registrations Open";
  speaker: {
    name: string;
    title: string;
    organization: string;
  };
  description: string;
  curriculum: string[];
  registrationUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
    username: string;
    memberId: string;
    wing: string;
    avatar: string;
  };
  summary: string;
  architecture: string;
  techStack: string[];
  githubRepo: string;
  liveDemoUrl?: string;
  stars: number;
  forks: number;
  wingId: string;
  status: "Verified & Active" | "Under Review";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
    username: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  summary: string;
  content: string;
}

export interface VerifiedCertificate {
  certCode: string;
  recipientName: string;
  memberId?: string;
  eventOrRole: string;
  issueDate: string;
  issuerAuthority: string;
  status: "Active" | "Revoked";
  type: "Leadership Appointment" | "Workshop Speaker" | "Technical Distinction" | "Hackathon Winner";
  hash: string;
}

export interface AxonMember {
  username: string;
  name: string;
  headline: string;
  memberId: string;
  role: string;
  wing: string;
  chapter: string;
  status: "Active Member" | "Wing Director" | "Executive Council";
  avatar: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  skills: {
    languages: string[];
    frameworks: string[];
    systems: string[];
  };
  timeline: {
    year: string;
    role: string;
    organization: string;
    description: string;
  }[];
}

export const AXON_ORG_METADATA = {
  name: "AXON",
  fullName: "AXON Umbrella Organization",
  tagline: "Independent Technology, Innovation & Leadership Umbrella",
  origin: "Originating at IMAC (Innovation & Manufacturing Auxiliary Center), UET Lahore",
  domain: "https://axon.org.pk",
  email: "axon@askme.pk",
  contactAddress: "IMAC Complex, University of Engineering & Technology, G.T. Road, Lahore, Pakistan",
  socials: {
    github: "https://github.com/axon-org",
    linkedin: "https://linkedin.com/company/axon-org",
    instagram: "https://instagram.com/axon.org",
  },
  metrics: {
    activeMembers: "340+",
    directorates: "11",
    eventsHosted: "24+",
    universityChapters: "4",
    codeRepositories: "86",
  },
};

export const WINGS: Wing[] = [
  {
    id: "systems-infra",
    slug: "systems-infrastructure",
    name: "Systems & Cloud Infrastructure",
    directorate: "Directorate of Infrastructure",
    code: "DIR-01/SYS",
    lead: "Muhammad Talha",
    role: "Director of Infrastructure",
    tagline: "Bare-metal orchestration, custom kernel toolchains, and distributed telemetry.",
    mandate: "Engineers AXON's internal compute clusters, self-hosted CI runners, high-availability reverse proxies, and infrastructure-as-code automation across institutional nodes.",
    focus: ["Bare-Metal Linux", "eBPF Telemetry", "Distributed Orchestration", "Terraform & NixOS", "High-Availability DNS"],
    tools: ["Linux Kernel", "Tokio / Rust", "Docker", "Kubernetes", "Prometheus", "Nginx"],
    status: "Active",
    initiativesCount: 7,
  },
  {
    id: "ai-intelligence",
    slug: "machine-intelligence",
    name: "Machine Intelligence & Applied AI",
    directorate: "Directorate of Machine Intelligence",
    code: "DIR-02/MIA",
    lead: "Ayesha Noor",
    role: "Director of Machine Intelligence",
    tagline: "Edge tensor compilation, localized LLM pipelines, and computer vision models.",
    mandate: "Conducts practical research in quantization (AWQ/GGUF), self-hosted neural inferencing microservices, transformer architecture fine-tuning, and real-time edge vision.",
    focus: ["TensorRT Quantization", "Local LLM Serving", "Speech & Vision Multimodals", "PyTorch Tooling", "Parameter Efficient Fine-Tuning"],
    tools: ["PyTorch", "vLLM", "CUDA", "Hugging Face", "ONNX Runtime", "Python"],
    status: "Active",
    initiativesCount: 9,
  },
  {
    id: "cyber-operations",
    slug: "cyber-operations",
    name: "Cyber Operations & Security Defense",
    directorate: "Directorate of Threat Research",
    code: "DIR-03/CYB",
    lead: "Hamza Tariq",
    role: "Director of Cyber Operations",
    tagline: "Offensive exploit mitigation, binary auditing, and adversarial CTF defense.",
    mandate: "Performs continuous threat assessments, firmware disassembly, code-level vulnerability hunting, and manages AXON's institutional CTF training squad.",
    focus: ["Binary Exploitation", "Reverse Engineering", "Memory Safety Auditing", "Ghidra / IDA Disassembly", "Applied Cryptography"],
    tools: ["Ghidra", "Radare2", "Wireshark", "Burp Suite", "GDB", "Rust"],
    status: "Active",
    initiativesCount: 5,
  },
  {
    id: "media-design",
    slug: "media-industrial-design",
    name: "Media, Typography & Spatial Design",
    directorate: "Directorate of Brand & Spatial Systems",
    code: "DIR-04/DSG",
    lead: "Zainab Bilal",
    role: "Director of Design & Media",
    tagline: "Editorial design language, institutional typography, and spatial CAD assets.",
    mandate: "Curates the strict visual governance of AXON publications, credential typography, technical schematics, 3D rendering for hardware, and digital media portals.",
    focus: ["Editorial Typography", "Design Systems", "3D CAD Visualization", "Vector Credentialing", "Interface Architecture"],
    tools: ["Figma", "Blender", "Illustrator", "WebGL / Three.js", "After Effects"],
    status: "Active",
    initiativesCount: 12,
  },
  {
    id: "embedded-robotics",
    slug: "embedded-systems-robotics",
    name: "Embedded Systems & Hardware",
    directorate: "Directorate of Hardware Engineering",
    code: "DIR-05/EMB",
    lead: "Bilal Ahmed",
    role: "Director of Hardware Engineering",
    tagline: "RISC-V architecture, PCB fabrication, RTOS kernels, and ROS2 mobile rovers.",
    mandate: "Designs custom micro-controllers, multi-layer PCBs, autonomous ground vehicles, and telemetry sensor matrices operating directly inside IMAC research facilities.",
    focus: ["RISC-V Microarchitecture", "PCB Design (KiCad)", "FreeRTOS & Zephyr", "ROS2 Autonomous Navigation", "FPGA Synthesis"],
    tools: ["KiCad", "STM32", "ESP32", "ROS2", "Verilog", "C / Embedded C++"],
    status: "Active",
    initiativesCount: 8,
  },
  {
    id: "web-systems",
    slug: "web-systems-platforms",
    name: "Web Systems & Distributed Platforms",
    directorate: "Directorate of Web Architecture",
    code: "DIR-06/WEB",
    lead: "Zaid Farooq",
    role: "Director of Web Platforms",
    tagline: "High-concurrency web engines, edge caching, and type-safe transactional systems.",
    mandate: "Builds and maintains AXON's unified web presence, cryptographic verification gateways, dynamic student portfolio rendering engines, and internal APIs.",
    focus: ["Next.js App Router", "Serverless Edge Runtimes", "PostgreSQL & Row-Level Security", "Schema.org & Core Web Vitals", "Wasm Tooling"],
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase", "Redis"],
    status: "Active",
    initiativesCount: 11,
  },
  {
    id: "competitive-programming",
    slug: "algorithmic-research",
    name: "Algorithmic Research & ICPC",
    directorate: "Directorate of Competitive Programming",
    code: "DIR-07/ALG",
    lead: "Usama Riaz",
    role: "Director of Algorithmic Research",
    tagline: "Combinatorial optimization, cache-oblivious algorithms, and ICPC regional training.",
    mandate: "Conducts bi-weekly problem-solving sprints, prepares collegiate teams for ICPC Asia regional contests, and publishes algorithmic performance analyses.",
    focus: ["Advanced Graph Theory", "Segment Trees & Fenwick Trees", "Dynamic Programming on Trees", "String Matching (Aho-Corasick)", "Cache Efficiency"],
    tools: ["C++20", "Fast I/O", "Codeforces Engine", "Valgrind", "Gnu C++"],
    status: "Active",
    initiativesCount: 14,
  },
  {
    id: "community-chapters",
    slug: "university-alliances",
    name: "University Alliances & Chapters",
    directorate: "Directorate of Institutional Expansion",
    code: "DIR-08/ALL",
    lead: "Sarah Kamran",
    role: "Director of University Alliances",
    tagline: "Charter governance, multi-campus delegations, and student chapter incubation.",
    mandate: "Governs AXON chapter incubation across partner universities nationwide, standardizing technical induction criteria, ambassador networks, and institutional MOUs.",
    focus: ["Multi-University Governance", "Chapter Standardization", "Campus Ambassador Programs", "Institutional Accreditations"],
    tools: ["Notion Enterprise", "Institutional Charters", "Google Workspace", "Slack"],
    status: "Active",
    initiativesCount: 6,
  },
  {
    id: "research-publications",
    slug: "technical-publications",
    name: "Technical Publications & Research",
    directorate: "Directorate of Research & Publications",
    code: "DIR-09/RES",
    lead: "Dr. M. Haris",
    role: "Chief Research Advisor",
    tagline: "Peer-reviewed technical monographs, reproducible codebases, and whitepapers.",
    mandate: "Reviews, edits, and archives student technical whitepapers, architectural blueprints, and engineering monographs published under the AXON institutional stamp.",
    focus: ["Technical Whitepapers", "LaTeX Document Compilers", "Code Reproducibility", "Peer-Review Pipelines"],
    tools: ["LaTeX", "Overleaf", "BibTeX", "Pandoc", "Zenodo"],
    status: "Active",
    initiativesCount: 4,
  },
  {
    id: "corporate-relations",
    slug: "corporate-partnerships",
    name: "Corporate Relations & Industry Pipelines",
    directorate: "Directorate of Corporate Relations",
    code: "DIR-10/COR",
    lead: "Rayan Siddiqui",
    role: "Director of Industry Partnerships",
    tagline: "Strategic sponsorship acquisition, recruiter vetting, and industry capstone links.",
    mandate: "Connects vetted AXON student engineers with elite technology firms, venture builders, and global research laboratories for fellowships and direct placement.",
    focus: ["Industry Sponsorships", "Recruiter Talent Pipelines", "Executive Fireside Chats", "Sponsored Hackathon Tracks"],
    tools: ["CRM Systems", "Corporate Agreements", "LinkedIn Talent Suite"],
    status: "Active",
    initiativesCount: 8,
  },
  {
    id: "event-logistics",
    slug: "event-operations",
    name: "Mission Logistics & Event Operations",
    directorate: "Directorate of Operations",
    code: "DIR-11/OPS",
    lead: "Maryam Chaudhry",
    role: "Director of Operations",
    tagline: "Auditorium staging, multi-camera broadcast switching, and credential verification.",
    mandate: "Coordinates on-ground technical execution, hybrid live-streaming infrastructure, attendee badges, and venue staging across university auditoriums.",
    focus: ["Hybrid AV Streaming", "Stage Operations", "Physical Credentialing", "UET Auditorium Management"],
    tools: ["OBS Studio", "Blackmagic Design", "NDI Protocol", "Event Ticketing APIs"],
    status: "Active",
    initiativesCount: 16,
  },
];

export const EVENTS: AxonEvent[] = [
  {
    id: "evt-01",
    slug: "zeros-and-ones",
    title: "Zeros and Ones: Digital Logic, Hardware Synthesis & Verilog Workflows",
    category: "Technical Workshop",
    date: "2026-11-15",
    time: "18:00 - 21:00 PKT",
    location: "IMAC Main Lecture Hall, UET Lahore (Hybrid Live Stream)",
    isVirtual: true,
    status: "Completed",
    speaker: {
      name: "Engr. Daniyal Malik",
      title: "Senior FPGA & Silicon Validation Engineer",
      organization: "Micro-Architectures Lab / IMAC UET",
    },
    description: "An intensive institutional deep-dive into digital logic, register-transfer level (RTL) architecture, Verilog synthesis, and the modern transition to open-source FPGA toolchains (Yosys, nextpnr).",
    curriculum: [
      "Transistor-level CMOS logic and propagation delay physics",
      "RTL state machine design in synthesizable Verilog",
      "FPGA bitstream generation with open-source toolchains",
      "Simulation and waveform timing analysis with GTKWave",
    ],
  },
  {
    id: "evt-02",
    slug: "distributed-systems-rust",
    title: "High-Throughput Systems Engineering in Rust & Tokio",
    category: "Technical Workshop",
    date: "2026-12-04",
    time: "19:00 - 21:30 PKT",
    location: "Virtual Amphitheatre & Discord Stage",
    isVirtual: true,
    status: "Registrations Open",
    speaker: {
      name: "Muhammad Talha",
      title: "Lead Infrastructure Architect",
      organization: "AXON Systems Directorate",
    },
    description: "A hands-on engineering masterclass focused on memory-safe asynchronous runtimes, non-blocking network socket polling, zero-copy packet deserialization, and actor-model concurrent architectures.",
    curriculum: [
      "Tokio executor architecture: Epoll, kqueue, and work-stealing threads",
      "Zero-allocation streaming parsers using bytes and nom",
      "Backpressure propagation in TCP socket pipelines",
      "Deterministic integration testing with simulated network faults",
    ],
    registrationUrl: "/join?track=events&id=distributed-systems-rust",
  },
  {
    id: "evt-03",
    slug: "edge-ai-quantization",
    title: "Applied Machine Intelligence: Quantization & TensorRT at the Edge",
    category: "Symposium",
    date: "2026-12-18",
    time: "15:00 - 18:00 PKT",
    location: "UET Lahore Main Seminar Hall / Streamed Globally",
    isVirtual: true,
    status: "Scheduled",
    speaker: {
      name: "Ayesha Noor",
      title: "Machine Learning Research Director",
      organization: "AXON MIA Directorate",
    },
    description: "Bridging the gap between heavy cloud GPU clusters and low-power edge nodes. Analyzing integer quantization schemes (INT4, AWQ, GGUF), layer fusing, and deploying localized LLMs on embedded hardware.",
    curriculum: [
      "Mathematical foundations of weight and activation quantization",
      "TensorRT-LLM engine compilation and kernel autotuning",
      "Benchmarking tokens/sec, memory bandwidth, and thermal throttles",
      "Hands-on deployment of 7B-parameter models on 8GB VRAM nodes",
    ],
    registrationUrl: "/join?track=events&id=edge-ai-quantization",
  },
  {
    id: "evt-04",
    slug: "kernel-memory-ctf",
    title: "Kernel Operations & Memory Exploitation Masterclass",
    category: "Bootcamp",
    date: "2027-01-10",
    time: "14:00 - 19:00 PKT",
    location: "IMAC Lab 4, UET Lahore (Restricted In-Person Seating)",
    isVirtual: false,
    status: "Scheduled",
    speaker: {
      name: "Hamza Tariq",
      title: "Offensive Security Lead",
      organization: "AXON Cyber Directorate",
    },
    description: "Intensive deep-dive into Linux virtual memory management, Return-Oriented Programming (ROP), stack canary bypasses, and heap chunk exploitation in low-level systems software.",
    curriculum: [
      "Linux x86_64 calling conventions and stack frame layout",
      "ROP gadget chaining using Ropper and GDB-PEDA",
      "Glibc malloc internals: tcache poisoning and unsorted bin attacks",
      "Defeating ASLR and PIE via information leak gadgets",
    ],
    registrationUrl: "/join?track=events&id=kernel-memory-ctf",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "vortex-lsm-engine",
    title: "Vortex: High-Throughput Embedded Key-Value Storage Engine",
    author: {
      name: "Irfan Ullah",
      username: "irfan",
      memberId: "AXN-2026-018",
      wing: "Systems & Infrastructure",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    },
    summary: "A pure-Rust, log-structured merge-tree (LSM) embedded storage engine with concurrent skiplists, bloom filters, and block-based SSTables with LZ4 compression.",
    architecture: "Engineered around an atomic write-ahead log (WAL) and memory-mapped MemTable. Level-compacted disk SSTables utilize 10-bit Murmur3 Bloom filters to achieve under 0.8ms point lookups under heavy concurrency.",
    techStack: ["Rust", "LSM Tree", "Bloom Filters", "Memory Mapping", "LZ4", "Tokio"],
    githubRepo: "https://github.com/irfanullah/vortex-storage",
    liveDemoUrl: "https://vortex-bench.axon.org.pk",
    stars: 184,
    forks: 32,
    wingId: "systems-infra",
    status: "Verified & Active",
  },
  {
    id: "proj-02",
    slug: "ebpf-spectre-telemetry",
    title: "SpectreTrace: Kernel Socket Telemetry & Anomaly Detection",
    author: {
      name: "Muhammad Talha",
      username: "talha",
      memberId: "AXN-2026-004",
      wing: "Systems & Infrastructure",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    },
    summary: "Zero-overhead Linux kernel observability agent monitoring TCP handshakes, socket drops, and abnormal packet bursts directly in ring buffers via eBPF kprobes.",
    architecture: "Compiles bytecode via clang/llvm into the Linux kernel verifier. Communicates back to user space via BPF perf event arrays, forwarding metrics to Prometheus with less than 0.5% CPU overhead.",
    techStack: ["Go", "C", "eBPF", "Linux Kernel", "Prometheus", "Grafana"],
    githubRepo: "https://github.com/axon-org/spectre-trace",
    stars: 265,
    forks: 48,
    wingId: "systems-infra",
    status: "Verified & Active",
  },
  {
    id: "proj-03",
    slug: "edge-whisper-synth",
    title: "TensorWhisper: Sub-100ms Speech Inferencing for ARM & RISC-V",
    author: {
      name: "Ayesha Noor",
      username: "ayesha",
      memberId: "AXN-2026-009",
      wing: "Machine Intelligence",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    },
    summary: "Quantized, pure C++ inference pipeline for multilingual automated speech recognition targeting resource-constrained embedded processors without GPU acceleration.",
    architecture: "Converts encoder/decoder attention heads into INT8 symmetric quantizations. Utilizes NEON vector intrinsics on ARM64 and vector extensions on RISC-V to process 30-second audio windows in under 85ms.",
    techStack: ["C++20", "Quantization", "NEON Intrinsics", "Whisper", "RISC-V", "Audio DSP"],
    githubRepo: "https://github.com/axon-org/tensor-whisper",
    stars: 142,
    forks: 19,
    wingId: "ai-intelligence",
    status: "Verified & Active",
  },
  {
    id: "proj-04",
    slug: "imac-telemetry-matrix",
    title: "IMAC Autonomous Telemetry & Power Node Matrix",
    author: {
      name: "Bilal Ahmed",
      username: "bilal",
      memberId: "AXN-2026-015",
      wing: "Embedded Systems",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    },
    summary: "Four-layer custom PCB node with dual STM32 and ESP32 microcontrollers measuring high-precision laboratory current draw, thermal gradients, and environmental conditions across IMAC facilities.",
    architecture: "Features opto-isolated current sensing, hardware CAN bus telemetry, and mesh radio relay. Telemetry is validated against on-board EEPROM before transmission to central gateway over MQTT TLS.",
    techStack: ["KiCad", "STM32", "FreeRTOS", "CAN Bus", "MQTT", "C/C++"],
    githubRepo: "https://github.com/axon-org/imac-hardware-nodes",
    stars: 94,
    forks: 11,
    wingId: "embedded-robotics",
    status: "Verified & Active",
  },
];

export const BLOGS: BlogPost[] = [
  {
    id: "blog-01",
    slug: "zero-copy-deserialization-rust",
    title: "Zero-Copy Deserialization & Memory Alignment in High-Throughput Systems",
    author: {
      name: "Irfan Ullah",
      username: "irfan",
      role: "Lead Systems Architect, AXON",
    },
    publishedAt: "2026-11-18",
    readTime: "8 min read",
    tags: ["Rust", "Systems Programming", "Memory Safety", "High Throughput"],
    summary: "When pushing 100,000 requests per second across socket boundaries, traditional JSON or protobuf allocations choke the memory allocator. Here is how we enforce zero-copy memory layouts using FlatBuffers and Rust lifetimes.",
    content: `
High-throughput network services rarely bottleneck on arithmetic computation. In modern distributed systems, the primary culprits are heap allocation churn, memory fragmentation, and cache invalidation.

### The Memory Allocation Penalty

When an incoming packet hits a kernel socket buffer, copying bytes into a newly allocated heap struct incurs a significant penalty:
1. Syscall overhead to traverse user/kernel boundaries.
2. Dynamic heap allocation lock contention in multi-threaded runtimes.
3. Cache evictions caused by non-contiguous memory layouts.

\`\`\`rust
// Zero-copy representation referencing the raw socket buffer directly:
#[repr(C, packed)]
pub struct PacketHeader<'a> {
    pub magic: u32,
    pub payload_len: u16,
    pub payload: &'a [u8],
}

impl<'a> PacketHeader<'a> {
    #[inline(always)]
    pub fn parse_zero_copy(buf: &'a [u8]) -> Result<Self, &'static str> {
        if buf.len() < 6 {
            return Err("Buffer underflow");
        }
        let magic = u32::from_be_bytes(buf[0..4].try_into().unwrap());
        let len = u16::from_be_bytes(buf[4..6].try_into().unwrap()) as usize;
        if buf.len() < 6 + len {
            return Err("Incomplete packet payload");
        }
        Ok(PacketHeader {
            magic,
            payload_len: len as u16,
            payload: &buf[6..6 + len],
        })
    }
}
\`\`\`

By tying the parsed payload slice to the lifetime of the socket buffer, we achieve zero heap allocations per incoming frame. In our internal benchmarks on AXON's bare-metal server cluster at IMAC, this reduced P99 latency by 68%.
    `,
  },
  {
    id: "blog-02",
    slug: "quantizing-speech-transformers-edge",
    title: "Engineering Low-Latency Neural Speech Models on Edge Microprocessors",
    author: {
      name: "Ayesha Noor",
      username: "ayesha",
      role: "Director of Machine Intelligence, AXON",
    },
    publishedAt: "2026-11-02",
    readTime: "11 min read",
    tags: ["Machine Learning", "Edge Computing", "TensorRT", "C++"],
    summary: "A practical study on quantizing transformer attention heads for ARM Cortex and RISC-V architectures, balancing floating point precision against thermal throttles in edge devices.",
    content: `
Edge AI demands ruthless optimization. Deploying a 1.5GB FP32 transformer model on an industrial embedded processor with 2GB total RAM is simply impossible without aggressive numerical quantization.

### Symmetric vs Asymmetric Integer Quantization

Quantization maps continuous 32-bit floating-point weights into 8-bit or 4-bit integer values:
\`\`\`text
Q = round(R / S) + Z
\`\`\`
Where:
- **R** represents the original float32 tensor
- **S** is the scaling factor
- **Z** is the zero-point offset

For symmetric quantization on neural weights, zero-point **Z** is set to 0, which allows compiler SIMD pipelines to utilize fused multiply-accumulate (FMA) instructions without subtraction penalties.

Inside the AXON Machine Intelligence lab, we established a pipeline that quantizes Whisper encoder blocks to INT8 while preserving 97.4% word error rate (WER) fidelity relative to full FP32 checkpoints.
    `,
  },
];

export const CERTIFICATES_DATABASE: VerifiedCertificate[] = [
  {
    certCode: "AXN-2026-018",
    recipientName: "Irfan Ullah",
    memberId: "AXN-2026-018",
    eventOrRole: "Lead Systems Architect & Full-Stack Directorate Lead",
    issueDate: "2026-10-15",
    issuerAuthority: "AXON Executive Council & IMAC Directorate",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x8f4d92a11b6c0032e5f8a0984518bb201c34ef71",
  },
  {
    certCode: "AXN-CERT-9042",
    recipientName: "Engr. Daniyal Malik",
    eventOrRole: "Guest Lecturer - Zeros & Ones: Digital Logic & Hardware Synthesis",
    issueDate: "2026-11-15",
    issuerAuthority: "AXON Technical Workshop Board",
    status: "Active",
    type: "Workshop Speaker",
    hash: "0x3e18a902df55c48b22a0179d63c45719ef10c411",
  },
  {
    certCode: "AXN-CERT-8819",
    recipientName: "Mahnoor Khan",
    memberId: "AXN-2026-031",
    eventOrRole: "First Place - Autonomous Rover Hardware Hackathon 2026",
    issueDate: "2026-09-28",
    issuerAuthority: "Directorate of Hardware Engineering / IMAC",
    status: "Active",
    type: "Hackathon Winner",
    hash: "0x77c41a0e8841bb7f201095d321045a999fa41092",
  },
  {
    certCode: "AXN-CERT-7731",
    recipientName: "Bilal Siddiqui",
    memberId: "AXN-2026-052",
    eventOrRole: "Certified Completion - High-Concurrency Cloud Systems Fellowship",
    issueDate: "2026-08-10",
    issuerAuthority: "Directorate of Cloud Infrastructure",
    status: "Active",
    type: "Technical Distinction",
    hash: "0x12a90041cf55b62e491024f881920141bb0981ae",
  },
];

export const MEMBERS_PORTFOLIOS: Record<string, AxonMember> = {
  irfan: {
    username: "irfan",
    name: "Irfan Ullah",
    headline: "Systems Engineer & High-Performance Full-Stack Architect",
    memberId: "AXN-2026-018",
    role: "Lead Systems Architect",
    wing: "Systems & Infrastructure Directorate",
    chapter: "IMAC / UET Lahore (Founding Chapter)",
    status: "Executive Council",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces",
    bio: "Undergraduate systems engineer specializing in low-latency distributed primitives, asynchronous Rust runtime pipelines, and resilient web infrastructure. Leading the technical architecture for the AXON multi-university umbrella platform originating at IMAC UET Lahore.",
    github: "https://github.com/irfanullah",
    linkedin: "https://linkedin.com/in/irfanullah-tech",
    email: "irfan@axon.org.pk",
    skills: {
      languages: ["Rust", "TypeScript", "Go", "C++", "Python", "SQL"],
      frameworks: ["Next.js (App Router)", "Tokio", "Node.js", "Tailwind CSS", "Axum", "React"],
      systems: ["Linux Kernel", "Docker", "PostgreSQL", "eBPF", "Redis", "Nginx", "Git"],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: "Lead Systems Architect",
        organization: "AXON Umbrella Organization (IMAC UET)",
        description: "Architected official web platform, verified credential engine, and bare-metal server cluster.",
      },
      {
        year: "2025 - 2026",
        role: "Research Fellow - Distributed Data Systems",
        organization: "IMAC Laboratories, UET Lahore",
        description: "Authored Vortex LSM key-value engine with sub-millisecond point query latency in pure Rust.",
      },
      {
        year: "2024 - 2025",
        role: "Systems Contributor",
        organization: "Open-Source Rust & Linux Ecosystem",
        description: "Maintained async utilities, socket telemetry tools, and zero-allocation network serializers.",
      },
    ],
  },
  talha: {
    username: "talha",
    name: "Muhammad Talha",
    headline: "Cloud Infrastructure Engineer & Linux Systems Specialist",
    memberId: "AXN-2026-004",
    role: "Director of Infrastructure",
    wing: "Systems & Infrastructure",
    chapter: "IMAC / UET Lahore",
    status: "Wing Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    bio: "Directing AXON's cloud infrastructure and bare-metal compute nodes. Passionate about kernel-level observability with eBPF, continuous self-hosted delivery pipelines, and resilient server architecture.",
    github: "https://github.com/talha-sys",
    linkedin: "https://linkedin.com/in/talha-sys",
    email: "talha@axon.org.pk",
    skills: {
      languages: ["Go", "C", "Bash", "Python", "Rust"],
      frameworks: ["Kubernetes", "Docker", "Terraform", "Prometheus", "NixOS"],
      systems: ["Linux Kernel", "eBPF", "WireGuard", "HAProxy", "Ceph"],
    },
    timeline: [
      {
        year: "2025 - Present",
        role: "Director of Infrastructure",
        organization: "AXON Umbrella Organization",
        description: "Oversees 11 servers, high-availability DNS, and zero-trust internal proxy network.",
      },
    ],
  },
};
