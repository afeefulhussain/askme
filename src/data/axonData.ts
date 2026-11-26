import type {
  Wing,
  AxonEvent,
  Project,
  BlogPost,
  VerifiedCertificate,
  AxonMember,
  MembershipApplication,
  Endorsement,
  EventRsvp,
  ContactInquiry,
} from "@/lib/types";

export type {
  Wing,
  AxonEvent,
  Project,
  BlogPost,
  VerifiedCertificate,
  AxonMember,
  MembershipApplication,
  Endorsement,
  EventRsvp,
  ContactInquiry,
};

export const AXON_ORG_METADATA = {
  name: "AXON",
  fullName: "AXON Umbrella Organization",
  tagline: "Independent Technology, Innovation & Leadership Umbrella",
  origin:
    "Originating at IMAC (Innovation & Manufacturing Auxiliary Center), UET Lahore",
  domain: "https://axon.org.pk",
  email: "axon@askme.pk",
  contactAddress:
    "IMAC Complex, University of Engineering & Technology, G.T. Road, Lahore, Pakistan",
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
    leadUsername: "talha",
    role: "Director of Infrastructure",
    tagline:
      "Bare-metal orchestration, custom kernel toolchains, and distributed telemetry.",
    mandate:
      "Engineers AXON's internal compute clusters, self-hosted CI runners, high-availability reverse proxies, and infrastructure-as-code automation across institutional nodes.",
    focus: [
      "Bare-Metal Linux",
      "eBPF Telemetry",
      "Distributed Orchestration",
      "Terraform & NixOS",
      "High-Availability DNS",
    ],
    tools: [
      "Linux Kernel",
      "Tokio / Rust",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Nginx",
    ],
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
    leadUsername: "ayesha",
    role: "Director of Machine Intelligence",
    tagline:
      "Edge tensor compilation, localized LLM pipelines, and computer vision models.",
    mandate:
      "Conducts practical research in quantization (AWQ/GGUF), self-hosted neural inferencing microservices, transformer architecture fine-tuning, and real-time edge vision.",
    focus: [
      "TensorRT Quantization",
      "Local LLM Serving",
      "Speech & Vision Multimodals",
      "PyTorch Tooling",
      "Parameter Efficient Fine-Tuning",
    ],
    tools: [
      "PyTorch",
      "vLLM",
      "CUDA",
      "Hugging Face",
      "ONNX Runtime",
      "Python",
    ],
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
    leadUsername: "hamza",
    role: "Director of Cyber Operations",
    tagline:
      "Offensive exploit mitigation, binary auditing, and adversarial CTF defense.",
    mandate:
      "Performs continuous threat assessments, firmware disassembly, code-level vulnerability hunting, and manages AXON's institutional CTF training squad.",
    focus: [
      "Binary Exploitation",
      "Reverse Engineering",
      "Memory Safety Auditing",
      "Ghidra / IDA Disassembly",
      "Applied Cryptography",
    ],
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
    leadUsername: "irfan",
    role: "Director of Design & Media",
    tagline:
      "Editorial design language, institutional typography, and spatial CAD assets.",
    mandate:
      "Curates the strict visual governance of AXON publications, credential typography, technical schematics, 3D rendering for hardware, and digital media portals.",
    focus: [
      "Editorial Typography",
      "Design Systems",
      "3D CAD Visualization",
      "Vector Credentialing",
      "Interface Architecture",
    ],
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
    leadUsername: "bilal",
    role: "Director of Hardware Engineering",
    tagline:
      "RISC-V architecture, PCB fabrication, RTOS kernels, and ROS2 mobile rovers.",
    mandate:
      "Designs custom micro-controllers, multi-layer PCBs, autonomous ground vehicles, and telemetry sensor matrices operating directly inside IMAC research facilities.",
    focus: [
      "RISC-V Microarchitecture",
      "PCB Design (KiCad)",
      "FreeRTOS & Zephyr",
      "ROS2 Autonomous Navigation",
      "FPGA Synthesis",
    ],
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
    lead: "Irfan Ullah",
    leadUsername: "irfan",
    role: "Lead Systems & Web Architect",
    tagline:
      "High-concurrency web engines, edge caching, and type-safe transactional systems.",
    mandate:
      "Builds and maintains AXON's unified web presence, cryptographic verification gateways, dynamic student portfolio rendering engines, and internal APIs.",
    focus: [
      "Next.js App Router",
      "Serverless Edge Runtimes",
      "PostgreSQL & Row-Level Security",
      "Schema.org & Core Web Vitals",
      "Wasm Tooling",
    ],
    tools: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Supabase",
      "Redis",
    ],
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
    leadUsername: "talha",
    role: "Director of Algorithmic Research",
    tagline:
      "Combinatorial optimization, cache-oblivious algorithms, and ICPC regional training.",
    mandate:
      "Conducts bi-weekly problem-solving sprints, prepares collegiate teams for ICPC Asia regional contests, and publishes algorithmic performance analyses.",
    focus: [
      "Advanced Graph Theory",
      "Segment Trees & Fenwick Trees",
      "Dynamic Programming on Trees",
      "String Matching (Aho-Corasick)",
      "Cache Efficiency",
    ],
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
    leadUsername: "ayesha",
    role: "Director of University Alliances",
    tagline:
      "Charter governance, multi-campus delegations, and student chapter incubation.",
    mandate:
      "Governs AXON chapter incubation across partner universities nationwide, standardizing technical induction criteria, ambassador networks, and institutional MOUs.",
    focus: [
      "Multi-University Governance",
      "Chapter Standardization",
      "Campus Ambassador Programs",
      "Institutional Accreditations",
    ],
    tools: ["Notion Enterprise", "Institutional Charters", "Google Workspace", "Slack"],
    status: "Expanding",
    initiativesCount: 6,
  },
  {
    id: "research-publications",
    slug: "technical-publications",
    name: "Technical Publications & Research",
    directorate: "Directorate of Research & Publications",
    code: "DIR-09/RES",
    lead: "Dr. M. Haris",
    leadUsername: "irfan",
    role: "Chief Research Advisor",
    tagline:
      "Peer-reviewed technical monographs, reproducible codebases, and whitepapers.",
    mandate:
      "Reviews, edits, and archives student technical whitepapers, architectural blueprints, and engineering monographs published under the AXON institutional stamp.",
    focus: [
      "Technical Whitepapers",
      "LaTeX Document Compilers",
      "Code Reproducibility",
      "Peer-Review Pipelines",
    ],
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
    leadUsername: "talha",
    role: "Director of Industry Partnerships",
    tagline:
      "Strategic sponsorship acquisition, recruiter vetting, and industry capstone links.",
    mandate:
      "Connects vetted AXON student engineers with elite technology firms, venture builders, and global research laboratories for fellowships and direct placement.",
    focus: [
      "Industry Sponsorships",
      "Recruiter Talent Pipelines",
      "Executive Fireside Chats",
      "Sponsored Hackathon Tracks",
    ],
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
    leadUsername: "mahnoor",
    role: "Director of Operations",
    tagline:
      "Auditorium staging, multi-camera broadcast switching, and credential verification.",
    mandate:
      "Coordinates on-ground technical execution, hybrid live-streaming infrastructure, attendee badges, and venue staging across university auditoriums.",
    focus: [
      "Hybrid AV Streaming",
      "Stage Operations",
      "Physical Credentialing",
      "UET Auditorium Management",
    ],
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
    wingId: "embedded-robotics",
    capacity: 220,
    speaker: {
      name: "Engr. Daniyal Malik",
      title: "Senior FPGA & Silicon Validation Engineer",
      organization: "Micro-Architectures Lab / IMAC UET",
    },
    description:
      "An intensive institutional deep-dive into digital logic, register-transfer level (RTL) architecture, Verilog synthesis, and the modern transition to open-source FPGA toolchains (Yosys, nextpnr).",
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
    location: "Virtual Amphitheatre & IMAC Node 01",
    isVirtual: true,
    status: "Registrations Open",
    wingId: "systems-infra",
    capacity: 150,
    speaker: {
      name: "Muhammad Talha",
      title: "Lead Infrastructure Architect",
      organization: "AXON Systems Directorate",
      username: "talha",
    },
    description:
      "A hands-on engineering masterclass focused on memory-safe asynchronous runtimes, non-blocking network socket polling, zero-copy packet deserialization, and actor-model concurrent architectures.",
    curriculum: [
      "Tokio executor architecture: Epoll, kqueue, and work-stealing threads",
      "Zero-allocation streaming parsers using bytes and nom",
      "Backpressure propagation in TCP socket pipelines",
      "Deterministic integration testing with simulated network faults",
    ],
    registrationUrl: "/events/distributed-systems-rust",
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
    wingId: "ai-intelligence",
    capacity: 250,
    speaker: {
      name: "Ayesha Noor",
      title: "Machine Learning Research Director",
      organization: "AXON MIA Directorate",
      username: "ayesha",
    },
    description:
      "Bridging the gap between heavy cloud GPU clusters and low-power edge nodes. Analyzing integer quantization schemes (INT4, AWQ, GGUF), layer fusing, and deploying localized LLMs on embedded hardware.",
    curriculum: [
      "Mathematical foundations of weight and activation quantization",
      "TensorRT-LLM engine compilation and kernel autotuning",
      "Benchmarking tokens/sec, memory bandwidth, and thermal throttles",
      "Hands-on deployment of 7B-parameter models on 8GB VRAM nodes",
    ],
    registrationUrl: "/events/edge-ai-quantization",
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
    status: "Registrations Open",
    wingId: "cyber-operations",
    capacity: 60,
    speaker: {
      name: "Hamza Tariq",
      title: "Offensive Security Lead",
      organization: "AXON Cyber Directorate",
      username: "hamza",
    },
    description:
      "Intensive deep-dive into Linux virtual memory management, Return-Oriented Programming (ROP), stack canary bypasses, and heap chunk exploitation in low-level systems software.",
    curriculum: [
      "Linux x86_64 calling conventions and stack frame layout",
      "ROP gadget chaining using Ropper and GDB-PEDA",
      "Glibc malloc internals: tcache poisoning and unsorted bin attacks",
      "Defeating ASLR and PIE via information leak gadgets",
    ],
    registrationUrl: "/events/kernel-memory-ctf",
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
      avatar: "/assets/avatars/irfan.svg",
    },
    summary:
      "A pure-Rust, log-structured merge-tree (LSM) embedded storage engine with concurrent skiplists, bloom filters, and block-based SSTables with LZ4 compression.",
    architecture:
      "Engineered around an atomic write-ahead log (WAL) and memory-mapped MemTable. Level-compacted disk SSTables utilize 10-bit Murmur3 Bloom filters to achieve under 0.8ms point lookups under heavy concurrency.",
    techStack: ["Rust", "LSM Tree", "Bloom Filters", "Memory Mapping", "LZ4", "Tokio"],
    githubRepo: "https://github.com/irfanullah/vortex-storage",
    liveDemoUrl: "https://vortex-bench.axon.org.pk",
    stars: 184,
    forks: 32,
    primaryLanguage: "Rust",
    lastSyncedAt: "2026-11-24",
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
      avatar: "/assets/avatars/talha.svg",
    },
    summary:
      "Zero-overhead Linux kernel observability agent monitoring TCP handshakes, socket drops, and abnormal packet bursts directly in ring buffers via eBPF kprobes.",
    architecture:
      "Compiles bytecode via clang/llvm into the Linux kernel verifier. Communicates back to user space via BPF perf event arrays, forwarding metrics to Prometheus with less than 0.5% CPU overhead.",
    techStack: ["Go", "C", "eBPF", "Linux Kernel", "Prometheus", "Grafana"],
    githubRepo: "https://github.com/axon-org/spectre-trace",
    stars: 265,
    forks: 48,
    primaryLanguage: "Go",
    lastSyncedAt: "2026-11-22",
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
      avatar: "/assets/avatars/ayesha.svg",
    },
    summary:
      "Quantized, pure C++ inference pipeline for multilingual automated speech recognition targeting resource-constrained embedded processors without GPU acceleration.",
    architecture:
      "Converts encoder/decoder attention heads into INT8 symmetric quantizations. Utilizes NEON vector intrinsics on ARM64 and vector extensions on RISC-V to process 30-second audio windows in under 85ms.",
    techStack: ["C++20", "Quantization", "NEON Intrinsics", "Whisper", "RISC-V", "Audio DSP"],
    githubRepo: "https://github.com/axon-org/tensor-whisper",
    stars: 142,
    forks: 19,
    primaryLanguage: "C++",
    lastSyncedAt: "2026-11-20",
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
      avatar: "/assets/avatars/bilal.svg",
    },
    summary:
      "Four-layer custom PCB node with dual STM32 and ESP32 microcontrollers measuring high-precision laboratory current draw, thermal gradients, and environmental conditions across IMAC facilities.",
    architecture:
      "Features opto-isolated current sensing, hardware CAN bus telemetry, and mesh radio relay. Telemetry is validated against on-board EEPROM before transmission to central gateway over MQTT TLS.",
    techStack: ["KiCad", "STM32", "FreeRTOS", "CAN Bus", "MQTT", "C/C++"],
    githubRepo: "https://github.com/axon-org/imac-hardware-nodes",
    stars: 94,
    forks: 11,
    primaryLanguage: "C",
    lastSyncedAt: "2026-11-18",
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
    wingId: "systems-infra",
    publishedAt: "2026-11-18",
    readTime: "8 min read",
    tags: ["Rust", "Systems Programming", "Memory Safety", "High Throughput"],
    summary:
      "When pushing 100,000 requests per second across socket boundaries, traditional JSON or protobuf allocations choke the memory allocator. Here is how we enforce zero-copy memory layouts using FlatBuffers and Rust lifetimes.",
    status: "Published",
    content: `High-throughput network services rarely bottleneck on arithmetic computation. In modern distributed systems, the primary culprits are heap allocation churn, memory fragmentation, and cache invalidation.

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

> Remember: tying the parsed payload slice to the lifetime of the socket buffer eliminates intermediate copies entirely.

By enforcing aligned slices directly over pre-allocated ring buffers, our bare-metal server cluster at **IMAC UET Lahore** reduced P99 tail latency by **68%** under sustained 10Gbps ingress.`,
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
    wingId: "ai-intelligence",
    publishedAt: "2026-11-02",
    readTime: "11 min read",
    tags: ["Machine Learning", "Edge Computing", "TensorRT", "C++"],
    summary:
      "A practical study on quantizing transformer attention heads for ARM Cortex and RISC-V architectures, balancing floating point precision against thermal throttles in edge devices.",
    status: "Published",
    content: `Edge AI demands ruthless optimization. Deploying a 1.5GB FP32 transformer model on an industrial embedded processor with 2GB total RAM is simply impossible without aggressive numerical quantization.

### Symmetric vs Asymmetric Integer Quantization

Quantization maps continuous 32-bit floating-point weights into 8-bit or 4-bit integer values:

\`\`\`text
Q = round(R / S) + Z
\`\`\`

Where:
- **R** represents the original float32 tensor
- **S** is the scaling factor
- **Z** is the zero-point offset

For symmetric quantization on neural weights, zero-point **Z** is set to \`0\`, which allows compiler SIMD pipelines to utilize fused multiply-accumulate (FMA) instructions without subtraction penalties.

Inside the AXON Machine Intelligence lab, we established a pipeline that quantizes Whisper encoder blocks to **INT8** while preserving **97.4%** word error rate (WER) fidelity relative to full FP32 checkpoints.`,
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
  {
    certCode: "AXN-2026-004",
    recipientName: "Muhammad Talha",
    memberId: "AXN-2026-004",
    eventOrRole: "Director of Systems & Cloud Infrastructure (DIR-01)",
    issueDate: "2026-09-01",
    issuerAuthority: "AXON Executive Council & IMAC Directorate",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x9c02d44e117ab390d4a5812cf0018a6c9e47b210",
  },
  {
    certCode: "AXN-2026-009",
    recipientName: "Ayesha Noor",
    memberId: "AXN-2026-009",
    eventOrRole: "Director of Machine Intelligence & Applied AI (DIR-02)",
    issueDate: "2026-09-01",
    issuerAuthority: "AXON Executive Council & IMAC Directorate",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x4b7e1290aa5d4102f8c39b012a6d48e37f2c9001",
  },
];

export const MEMBERS_PORTFOLIOS: Record<string, AxonMember> = {
  irfan: {
    username: "irfan",
    name: "Irfan Ullah",
    headline: "Systems Engineer & High-Performance Full-Stack Architect",
    memberId: "AXN-2026-018",
    role: "Lead Systems Architect",
    rbacRole: "super_admin",
    wing: "Systems & Cloud Infrastructure",
    wingId: "systems-infra",
    chapter: "IMAC / UET Lahore (Founding Chapter)",
    status: "Executive Council",
    avatar: "/assets/avatars/irfan.svg",
    bio: "Undergraduate systems engineer specializing in low-latency distributed primitives, asynchronous Rust runtime pipelines, and resilient web infrastructure. Leading the technical architecture for the AXON multi-university umbrella platform originating at IMAC UET Lahore.",
    github: "https://github.com/irfanullah",
    githubUsername: "irfanullah",
    linkedin: "https://linkedin.com/in/irfanullah-tech",
    email: "irfan@axon.org.pk",
    graduationYear: 2027,
    internshipAvailable: true,
    themePreference: "obsidian-cyan",
    isPublic: true,
    portfolioViews: 1482,
    education: [
      {
        degree: "B.Sc. Computer Science & Engineering",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2023 – 2027",
      },
    ],
    skills: {
      languages: ["Rust", "TypeScript", "Go", "C++", "Python", "SQL"],
      frameworks: [
        "Next.js (App Router)",
        "Tokio",
        "Node.js",
        "Tailwind CSS",
        "Axum",
        "React",
      ],
      systems: [
        "Linux Kernel",
        "Docker",
        "PostgreSQL",
        "eBPF",
        "Redis",
        "Nginx",
        "Git",
      ],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: "Lead Systems Architect",
        organization: "AXON Umbrella Organization (IMAC UET)",
        description:
          "Architected official web platform, verified credential engine, and bare-metal server cluster.",
      },
      {
        year: "2025 - 2026",
        role: "Research Fellow - Distributed Data Systems",
        organization: "IMAC Laboratories, UET Lahore",
        description:
          "Authored Vortex LSM key-value engine with sub-millisecond point query latency in pure Rust.",
      },
      {
        year: "2024 - 2025",
        role: "Systems Contributor",
        organization: "Open-Source Rust & Linux Ecosystem",
        description:
          "Maintained async utilities, socket telemetry tools, and zero-allocation network serializers.",
      },
    ],
  },
  talha: {
    username: "talha",
    name: "Muhammad Talha",
    headline: "Cloud Infrastructure Engineer & Linux Systems Specialist",
    memberId: "AXN-2026-004",
    role: "Director of Infrastructure",
    rbacRole: "wing_director",
    wing: "Systems & Cloud Infrastructure",
    wingId: "systems-infra",
    chapter: "IMAC / UET Lahore",
    status: "Wing Director",
    avatar: "/assets/avatars/talha.svg",
    bio: "Directing AXON's cloud infrastructure and bare-metal compute nodes. Passionate about kernel-level observability with eBPF, continuous self-hosted delivery pipelines, and resilient server architecture.",
    github: "https://github.com/talha-sys",
    githubUsername: "talha-sys",
    linkedin: "https://linkedin.com/in/talha-sys",
    email: "talha@axon.org.pk",
    graduationYear: 2026,
    internshipAvailable: true,
    themePreference: "imac-emerald",
    isPublic: true,
    portfolioViews: 940,
    education: [
      {
        degree: "B.Sc. Computer Engineering",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2022 – 2026",
      },
    ],
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
        description:
          "Oversees 11 servers, high-availability DNS, and zero-trust internal proxy network.",
      },
    ],
  },
  ayesha: {
    username: "ayesha",
    name: "Ayesha Noor",
    headline: "Applied AI Researcher & Edge Inference Systems Engineer",
    memberId: "AXN-2026-009",
    role: "Director of Machine Intelligence",
    rbacRole: "wing_director",
    wing: "Machine Intelligence & Applied AI",
    wingId: "ai-intelligence",
    chapter: "IMAC / UET Lahore",
    status: "Wing Director",
    avatar: "/assets/avatars/ayesha.svg",
    bio: "Leading research on quantization and low-latency speech/vision transformers for ARM and RISC-V embedded processors inside IMAC AI labs.",
    github: "https://github.com/ayesha-mia",
    githubUsername: "ayesha-mia",
    linkedin: "https://linkedin.com/in/ayesha-noor-ai",
    email: "ayesha@axon.org.pk",
    graduationYear: 2027,
    internshipAvailable: true,
    themePreference: "obsidian-cyan",
    isPublic: true,
    portfolioViews: 1120,
    education: [
      {
        degree: "B.Sc. Artificial Intelligence & Data Science",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2023 – 2027",
      },
    ],
    skills: {
      languages: ["Python", "C++20", "CUDA", "Rust"],
      frameworks: ["PyTorch", "TensorRT", "vLLM", "ONNX Runtime", "Hugging Face"],
      systems: ["ARM NEON", "RISC-V", "Docker", "Linux", "Triton"],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: "Director of Machine Intelligence",
        organization: "AXON MIA Directorate",
        description:
          "Supervises 32 research fellows working on quantized local LLM deployment and edge vision.",
      },
    ],
  },
  bilal: {
    username: "bilal",
    name: "Bilal Ahmed",
    headline: "Embedded Firmware & Custom PCB Systems Architect",
    memberId: "AXN-2026-015",
    role: "Director of Hardware Engineering",
    rbacRole: "wing_director",
    wing: "Embedded Systems & Hardware",
    wingId: "embedded-robotics",
    chapter: "IMAC / UET Lahore",
    status: "Wing Director",
    avatar: "/assets/avatars/bilal.svg",
    bio: "Designing multi-layer mixed-signal PCBs, CAN-bus telemetry nodes, and ROS2 autonomous rovers inside the IMAC hardware workshop at UET Lahore.",
    github: "https://github.com/bilal-hw",
    githubUsername: "bilal-hw",
    linkedin: "https://linkedin.com/in/bilal-ahmed-hw",
    email: "bilal@axon.org.pk",
    graduationYear: 2026,
    internshipAvailable: false,
    themePreference: "monolith-amber",
    isPublic: true,
    portfolioViews: 675,
    education: [
      {
        degree: "B.Sc. Electrical & Electronics Engineering",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2022 – 2026",
      },
    ],
    skills: {
      languages: ["C", "Embedded C++", "Verilog", "Python"],
      frameworks: ["FreeRTOS", "Zephyr RTOS", "ROS2", "STM32 HAL"],
      systems: ["KiCad", "CAN Bus", "FPGA", "MQTT", "Oscilloscope Diagnostics"],
    },
    timeline: [
      {
        year: "2025 - Present",
        role: "Director of Hardware Engineering",
        organization: "AXON Embedded Directorate (IMAC)",
        description:
          "Built IMAC's lab-wide telemetry power sensor matrix and rover prototyping rig.",
      },
    ],
  },
  hamza: {
    username: "hamza",
    name: "Hamza Tariq",
    headline: "Kernel Security Researcher & Binary Exploitation Specialist",
    memberId: "AXN-2026-011",
    role: "Director of Cyber Operations",
    rbacRole: "wing_director",
    wing: "Cyber Operations & Security Defense",
    wingId: "cyber-operations",
    chapter: "IMAC / UET Lahore",
    status: "Wing Director",
    avatar: "/assets/avatars/hamza.svg",
    bio: "Focusing on Linux memory exploitation, vulnerability research, binary disassembly, and defensive red-teaming for AXON infrastructure.",
    github: "https://github.com/hamza-sec",
    githubUsername: "hamza-sec",
    linkedin: "https://linkedin.com/in/hamza-tariq-sec",
    email: "hamza@axon.org.pk",
    graduationYear: 2027,
    internshipAvailable: true,
    themePreference: "editorial-slate",
    isPublic: true,
    portfolioViews: 810,
    education: [
      {
        degree: "B.Sc. Cyber Security & Networks",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2023 – 2027",
      },
    ],
    skills: {
      languages: ["C", "Assembly (x86_64)", "Rust", "Python"],
      frameworks: ["Pwntools", "Ghidra", "GDB-PEDA", "Radare2"],
      systems: ["Linux Internals", "Wireshark", "Burp Suite", "SELinux"],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: "Director of Cyber Operations",
        organization: "AXON Cyber Directorate",
        description:
          "Leads institutional vulnerability audits and national collegiate CTF defense workshops.",
      },
    ],
  },
  mahnoor: {
    username: "mahnoor",
    name: "Mahnoor Khan",
    headline: "Autonomous Robotics & Operations Systems Engineer",
    memberId: "AXN-2026-031",
    role: "Approved Member & Operations Lead",
    rbacRole: "approved_member",
    wing: "Embedded Systems & Hardware",
    wingId: "embedded-robotics",
    chapter: "IMAC / UET Lahore",
    status: "Active Member",
    avatar: "/assets/avatars/mahnoor.svg",
    bio: "Winner of the Autonomous Rover Hardware Hackathon 2026. Developing SLAM navigation nodes and hybrid telemetry interfaces at IMAC.",
    github: "https://github.com/mahnoor-robotics",
    githubUsername: "mahnoor-robotics",
    linkedin: "https://linkedin.com/in/mahnoor-khan-eng",
    email: "mahnoor@axon.org.pk",
    graduationYear: 2028,
    internshipAvailable: true,
    themePreference: "imac-emerald",
    isPublic: true,
    portfolioViews: 530,
    education: [
      {
        degree: "B.Sc. Mechatronics & Control Engineering",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: "2024 – 2028",
      },
    ],
    skills: {
      languages: ["C++", "Python", "TypeScript"],
      frameworks: ["ROS2", "OpenCV", "Next.js", "FreeRTOS"],
      systems: ["LiDAR SLAM", "STM32", "Git", "Docker"],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: "Hardware & Robotics Fellow",
        organization: "AXON Embedded Directorate",
        description:
          "Designed autonomous obstacle-avoidance firmware for the 2026 IMAC Rover competition.",
      },
    ],
  },
};

export const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: "app-101",
    name: "Daniyal Tariq",
    email: "daniyal@uet.edu.pk",
    university: "UET Lahore",
    roleType: "General Member Engineer",
    preferredWing: "systems-infra",
    githubUsername: "daniyal-tariq",
    statement:
      "Built custom Docker container isolation tools in Go and contributed patches to student Linux lab clusters.",
    status: "Pending",
    submittedAt: "2026-11-24",
  },
  {
    id: "app-102",
    name: "Zoya Fatima",
    email: "zoya@fast.edu.pk",
    university: "FAST-NUCES Lahore",
    roleType: "Campus Ambassador Lead",
    preferredWing: "community-chapters",
    githubUsername: "zoya-fatima",
    statement:
      "Organized two inter-university AI study groups and looking to establish an official AXON federated chapter at FAST Lahore.",
    status: "Pending",
    submittedAt: "2026-11-23",
  },
  {
    id: "app-103",
    name: "Hassan Raza",
    email: "hassan@giki.edu.pk",
    university: "GIKI Topi",
    roleType: "University Chapter Founder",
    preferredWing: "community-chapters",
    githubUsername: "hassan-raza",
    statement:
      "Founding chapter initiative for GIKI Topi focusing on embedded systems and systems engineering.",
    status: "Approved",
    assignedRole: "approved_member",
    generatedMemberId: "AXN-2026-042",
    generatedUsername: "hassan",
    submittedAt: "2026-11-20",
    reviewedAt: "2026-11-21",
  },
];

export const INITIAL_ENDORSEMENTS: Endorsement[] = [
  {
    id: "end-01",
    recipientUsername: "irfan",
    directorName: "Muhammad Talha",
    directorRole: "Director of Infrastructure (DIR-01)",
    wingId: "systems-infra",
    badgeTitle: "Core Infrastructure Architect",
    note: "Engineered the zero-copy telemetry ingestion layer and cryptographic verification schema used across all 11 AXON directorates.",
    awardedAt: "2026-11-12",
  },
  {
    id: "end-02",
    recipientUsername: "mahnoor",
    directorName: "Bilal Ahmed",
    directorRole: "Director of Hardware Engineering (DIR-05)",
    wingId: "embedded-robotics",
    badgeTitle: "IMAC Rover Hackathon Champion",
    note: "Demonstrated exceptional real-time PID control and LiDAR SLAM integration under 48-hour competition constraints.",
    awardedAt: "2026-09-30",
  },
];

export const INITIAL_RSVPS: EventRsvp[] = [
  {
    id: "rsvp-01",
    eventSlug: "distributed-systems-rust",
    eventTitle: "High-Throughput Systems Engineering in Rust & Tokio",
    name: "Irfan Ullah",
    email: "irfan@axon.org.pk",
    university: "IMAC / UET Lahore",
    memberId: "AXN-2026-018",
    createdAt: "2026-11-20",
  },
];

export const INITIAL_INQUIRIES: ContactInquiry[] = [];
