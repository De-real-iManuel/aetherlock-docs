# Architecture Diagrams

This file contains all system architecture diagrams for AetherLock Protocol.

## Current Implementation Architecture (Devnet)

**Status:** ✅ Deployed on Solana Devnet  
**Last Updated:** November 2025

This diagram shows the actual implemented components currently running on devnet.

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Frontend<br/>Tailwind + Three.js]
        Wallet[Multi-Chain Wallets<br/>Phantom, Solflare]
        Dashboard[Dashboard<br/>Real-time Updates]
    end
    
    subgraph "Application Layer"
        API[Express Backend<br/>REST API + Auth]
        WS[WebSocket Server<br/>Socket.io]
        EventProc[Event Processor<br/>Redis Queue]
        Auth[Auth Service<br/>JWT + Wallet Sig]
    end
    
    subgraph "Verification Layer - CURRENT"
        AI[Arcanum.ai<br/>AI Task Verification<br/>PRIMARY ONLY]
        IPFS[IPFS Storage<br/>Basic Implementation]
    end
    
    subgraph "Blockchain Layer - DEVNET"
        Solana[Solana Program<br/>Anchor Framework<br/>DEVNET ONLY]
        Events[Event Logs<br/>Transaction History]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Prisma ORM)]
        Redis[Redis Cache<br/>Session Storage]
    end
    
    UI --> API
    UI --> Wallet
    Wallet --> Solana
    Dashboard --> WS
    
    API --> AI
    API --> IPFS
    API --> DB
    API --> Redis
    
    WS --> EventProc
    EventProc --> Events
    
    Solana --> Events
    
    style AI fill:#FF9900
    style Solana fill:#14F195
    style DB fill:#336791
    style Redis fill:#DC382D
    
    classDef notImplemented fill:#666,stroke:#333,stroke-dasharray: 5 5
```

**Current Limitations:**
- No Chainlink oracle integration (planned)
- No zkMe SDK integration (mock flow only)
- No AI fallback chain (Arcanum.ai only)
- No Pinata pinning service (basic IPFS)
- No ZetaChain integration (testnet only)
- No cross-chain settlement (planned)

---

## Planned Architecture (Future State)

**Status:** 🔄 In Development  
**Timeline:** 2-3 weeks with Kiro IDE

This diagram shows the complete vision with all planned components.

## System Architecture Diagram (All Components - PLANNED)

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Frontend<br/>Tailwind + Three.js]
        Wallet[Multi-Chain Wallets<br/>Phantom, Solflare, Tonkeeper]
        Dashboard[Cyberpunk Dashboard<br/>Real-time Updates]
    end
    
    subgraph "Application Layer"
        API[Express Backend<br/>REST API + Auth]
        WS[WebSocket Server<br/>Socket.io]
        EventProc[Event Processor<br/>Redis Queue]
        Auth[Auth Service<br/>JWT + Wallet Sig]
    end
    
    subgraph "Verification Layer - PLANNED"
        AI[Arcanum.ai<br/>AI Task Verification]
        AIFallback[AI Fallback Chain<br/>OpenAI → Claude → Gemini]
        KYC[zkMe SDK<br/>Zero-Knowledge KYC<br/>NOT YET INTEGRATED]
        Oracle[Chainlink Functions<br/>Oracle Network<br/>PLANNED]
        IPFS[IPFS Storage<br/>Pinata + Web3.Storage<br/>PLANNED]
    end
    
    subgraph "Blockchain Layer - PLANNED"
        Solana[Solana Program<br/>Anchor Framework<br/>MAINNET PLANNED]
        Zeta[ZetaChain Gateway<br/>Universal App<br/>TESTNET ONLY]
        Somnia[Somnia Contract<br/>EVM Settlement<br/>TESTNET ONLY]
        Events[Event Logs<br/>Transaction History]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Prisma ORM)]
        Redis[Redis Cache<br/>Session + Rate Limit]
        IPFSNet[IPFS Network<br/>Decentralized Storage]
        Monitoring[(Monitoring DB<br/>Metrics + Logs)]
    end
    
    UI --> API
    UI --> Wallet
    Wallet --> Solana
    Wallet --> Zeta
    Dashboard --> WS
    
    API --> AI
    API -.->|PLANNED| AIFallback
    API -.->|PLANNED| KYC
    API -.->|PLANNED| Oracle
    API --> IPFS
    API --> DB
    API --> Redis
    
    WS --> EventProc
    EventProc --> Events
    
    Solana -.->|TESTNET| Zeta
    Zeta -.->|TESTNET| Somnia
    Solana --> Events
    
    AI -.->|PLANNED| Oracle
    KYC -.->|PLANNED| Zeta
    IPFS -.->|PLANNED| IPFSNet
    
    EventProc --> Monitoring
    API --> Monitoring
    
    style AI fill:#FF9900
    style KYC fill:#666,stroke:#333,stroke-dasharray: 5 5
    style Oracle fill:#666,stroke:#333,stroke-dasharray: 5 5
    style Solana fill:#14F195
    style Zeta fill:#666,stroke:#333,stroke-dasharray: 5 5
    style Somnia fill:#666,stroke:#333,stroke-dasharray: 5 5
    style DB fill:#336791
    style Redis fill:#DC382D
    
    classDef planned fill:#666,stroke:#333,stroke-dasharray: 5 5
    class AIFallback,KYC,Oracle,Zeta,Somnia planned
```

**Planned Components:**
- Chainlink Functions for oracle verification
- zkMe SDK for real KYC integration
- AI fallback chain (OpenAI → Claude → Gemini)
- Pinata/Web3.Storage for IPFS pinning
- ZetaChain mainnet for cross-chain messaging
- Somnia mainnet for high-speed settlement
- TON and Sui blockchain support


## Cross-Chain Message Flow Diagram

```mermaid
graph LR
    subgraph "Source Chain: Solana"
        S1[User Creates Escrow]
        S2[Lock Funds + 10% Fee]
        S3[Emit xCall Event]
        S4[Receive Callback]
    end
    
    subgraph "Orchestration: ZetaChain"
        Z1[Receive xCall]
        Z2[Validate Message]
        Z3[Route to Target]
        Z4[Handle Callbacks]
        Z5[Finality Proof]
    end
    
    subgraph "Target Chains"
        T1[Somnia Settlement<br/>Fast Finality]
        T2[Sui Settlement<br/>Move VM]
        T3[TON Settlement<br/>Telegram Integration]
    end
    
    subgraph "Settlement Execution"
        E1[Verify Conditions]
        E2[Execute Transfer]
        E3[Emit Confirmation]
        E4[Update State]
    end
    
    S1 --> S2
    S2 --> S3
    S3 --> Z1
    
    Z1 --> Z2
    Z2 --> Z3
    Z3 --> T1
    Z3 --> T2
    Z3 --> T3
    
    T1 --> E1
    T2 --> E1
    T3 --> E1
    
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> Z4
    Z4 --> Z5
    Z5 --> S4
    
    style Z2 fill:#00D9FF
    style E2 fill:#14F195
    style T1 fill:#FF6B6B
```


## AI Verification Pipeline - Current Implementation (Devnet)

**Status:** ✅ Deployed on Solana Devnet  
**Average Time:** 2.1 seconds

This diagram shows the actual AI verification pipeline currently implemented.

```mermaid
flowchart TB
    subgraph "Evidence Collection"
        A[User Uploads Files<br/>Images, Docs, Code]
        B[Frontend Validation<br/>Type + Size Check]
        C[IPFS Upload<br/>Basic Storage]
        D[Get Content Hash<br/>CID: QmX7K3b...]
    end
    
    subgraph "AI Processing - CURRENT"
        E[Fetch from IPFS<br/>Retrieve Evidence]
        F[Arcanum.ai<br/>ONLY Provider]
        G[Semantic Analysis<br/>NLP + Vision]
        H[Quality Scoring<br/>Requirements Check]
        I[Confidence Calculation<br/>0-100 Score]
    end
    
    subgraph "Verification Logic"
        J{Confidence Score}
        K[>90%: Auto-Approve<br/>Release Funds]
        L[50-90%: Human Review<br/>Arbitrator Needed]
        M[<50%: Auto-Reject<br/>Refund Client]
    end
    
    subgraph "On-Chain Settlement - DEVNET"
        N[Update Escrow State<br/>Solana Program]
        O[Release Funds<br/>90% to Freelancer]
        P[Collect Fee<br/>10% to Treasury]
        Q[Emit Events<br/>Transaction Complete]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    E --> F
    F --> G
    G --> H
    H --> I
    
    I --> J
    
    J -->|High| K
    J -->|Medium| L
    J -->|Low| M
    
    K --> N
    L --> N
    M --> N
    
    N --> O
    O --> P
    P --> Q
    
    style F fill:#FF9900
    style J fill:#A855F7
    style O fill:#14F195
    style P fill:#00D9FF
```

**Current Implementation:**
- ✅ Basic IPFS storage (no Pinata/Web3.Storage)
- ✅ Arcanum.ai verification (no fallback chain)
- ✅ Confidence scoring (0-100)
- ✅ Smart contract settlement on Solana Devnet

**Not Yet Implemented:**
- ❌ Pinata/Web3.Storage pinning service
- ❌ AI fallback chain (OpenAI, Claude, Gemini)
- ❌ Chainlink oracle integration
- ❌ Cryptographic signing of AI results

---

## AI Verification Pipeline - Planned Architecture

**Status:** 🔄 Future Roadmap  
**Timeline:** 2-3 weeks with Kiro IDE

This diagram shows the planned AI verification pipeline with all future components.

```mermaid
flowchart TB
    subgraph "Evidence Collection"
        A[User Uploads Files<br/>Images, Docs, Code]
        B[Frontend Validation<br/>Type + Size Check]
        C[IPFS Upload<br/>Pinata + Web3.Storage]
        D[Get Content Hash<br/>CID: QmX7K3b...]
    end
    
    subgraph "AI Processing - PLANNED"
        E[Fetch from IPFS<br/>Retrieve Evidence]
        F[Arcanum.ai<br/>Primary Provider]
        F2[AI Fallback Chain<br/>OpenAI → Claude → Gemini]
        G[Semantic Analysis<br/>NLP + Vision]
        H[Quality Scoring<br/>Requirements Check]
        I[Confidence Calculation<br/>0-100 Score]
        J[Cryptographic Signing<br/>Ed25519 Signature]
    end
    
    subgraph "Oracle Layer - PLANNED"
        K[Chainlink Functions<br/>Decentralized Oracle]
        L[Multi-Node Verification<br/>Consensus]
    end
    
    subgraph "Verification Logic"
        M{Confidence Score}
        N[>90%: Auto-Approve<br/>Release Funds]
        O[50-90%: Human Review<br/>Arbitrator Needed]
        P[<50%: Auto-Reject<br/>Refund Client]
    end
    
    subgraph "On-Chain Settlement - MAINNET"
        Q[Update Escrow State<br/>Solana Program]
        R[Release Funds<br/>90% to Freelancer]
        S[Collect Fee<br/>10% to Treasury]
        T[Emit Events<br/>Transaction Complete]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    E --> F
    F --> G
    F -.->|Failure| F2
    F2 --> G
    G --> H
    H --> I
    I --> J
    
    J --> K
    K --> L
    L --> M
    
    M -->|High| N
    M -->|Medium| O
    M -->|Low| P
    
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R
    R --> S
    S --> T
    
    style F fill:#FF9900
    style F2 fill:#666,stroke:#333,stroke-dasharray: 5 5
    style K fill:#666,stroke:#333,stroke-dasharray: 5 5
    style M fill:#A855F7
    style R fill:#14F195
    style S fill:#00D9FF
    
    classDef planned fill:#666,stroke:#333,stroke-dasharray: 5 5
    class F2,J,K,L planned
```

**Planned Components:**
- Pinata/Web3.Storage for IPFS pinning
- AI fallback chain (OpenAI → Claude → Gemini)
- Chainlink Functions for oracle verification
- Ed25519 cryptographic signing
- Multi-node consensus
- Solana mainnet deployment


## Security Layers Diagram

```mermaid
graph TB
    subgraph "Application Security"
        AS1[Input Validation<br/>Sanitization]
        AS2[Rate Limiting<br/>DDoS Protection]
        AS3[CORS Protection<br/>Origin Validation]
        AS4[SQL Injection Prevention<br/>Parameterized Queries]
    end
    
    subgraph "Authentication Security"
        AU1[Wallet Signature<br/>Ed25519 Verification]
        AU2[JWT Token Management<br/>Secure Sessions]
        AU3[Session Security<br/>HttpOnly Cookies]
        AU4[Multi-Factor Auth<br/>zkMe KYC]
    end
    
    subgraph "Blockchain Security"
        BS1[PDA Validation<br/>Program Derived Addresses]
        BS2[Signer Authorization<br/>Access Control]
        BS3[Reentrancy Guards<br/>State Locks]
        BS4[Integer Overflow<br/>Checked Math]
    end
    
    subgraph "Data Security"
        DS1[Encryption at Rest<br/>AES-256]
        DS2[TLS in Transit<br/>TLS 1.3]
        DS3[Zero-Knowledge Proofs<br/>zkMe Integration]
        DS4[Content Addressing<br/>IPFS Hashes]
    end
    
    subgraph "Infrastructure Security"
        IS1[Network Segmentation<br/>Isolated Environments]
        IS2[DDoS Protection<br/>Cloudflare]
        IS3[Intrusion Detection<br/>Automated Alerts]
        IS4[Automated Patching<br/>Security Updates]
    end
    
    AS1 --> AU1
    AS2 --> AU2
    AS3 --> AU3
    AS4 --> AU4
    
    AU1 --> BS1
    AU2 --> BS2
    AU3 --> BS3
    AU4 --> BS4
    
    BS1 --> DS1
    BS2 --> DS2
    BS3 --> DS3
    BS4 --> DS4
    
    DS1 --> IS1
    DS2 --> IS2
    DS3 --> IS3
    DS4 --> IS4
    
    style DS3 fill:#A855F7
    style BS1 fill:#14F195
    style IS2 fill:#FF6B6B
    style AU1 fill:#00D9FF
```


## Current D-PoTV Flow (Digital Tasks Only - IMPLEMENTED)

**Status:** ✅ Deployed on Solana Devnet  
**Average Time:** 2.1 seconds

This diagram shows the actual implemented D-PoTV flow for digital task verification.

```mermaid
flowchart TB
    subgraph "Phase 1: Evidence Submission"
        A[Freelancer Submits Evidence<br/>Code, Docs, Design Files]
        B[Upload to IPFS<br/>Basic Storage]
        C[Get Content Hash<br/>CID: QmX7K3b...]
        D[Submit Hash On-Chain<br/>Solana Devnet]
    end
    
    subgraph "Phase 2: AI Analysis - CURRENT"
        E[Backend Fetches Evidence<br/>From IPFS]
        F[Arcanum.ai Analysis<br/>ONLY Provider]
        G[Quality Assessment<br/>Requirements Matching]
        H[Confidence Score<br/>0-100 Scale]
    end
    
    subgraph "Phase 3: Smart Contract Settlement"
        I[Submit Result On-Chain<br/>Solana Program]
        J[Validate Confidence Score<br/>>90% = Approve<br/>50-90% = Review<br/><50% = Reject]
        K[Execute Settlement<br/>Release Funds or Refund]
        L[Emit Events<br/>Audit Trail]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    E --> F
    F --> G
    G --> H
    
    H --> I
    I --> J
    J --> K
    K --> L
    
    style F fill:#FF9900
    style I fill:#14F195
    style K fill:#FFD700
```

**Current Implementation:**
- ✅ IPFS evidence storage (basic)
- ✅ Arcanum.ai verification (primary only)
- ✅ Confidence scoring (0-100)
- ✅ Smart contract settlement
- ✅ Event emission

**Not Yet Implemented:**
- ❌ Chainlink oracle integration
- ❌ AI fallback chain
- ❌ Zero-knowledge proofs
- ❌ Cryptographic signing of AI results
- ❌ Multi-node consensus

---

## Data Flow - Current Implementation (Devnet)

**Status:** ✅ Deployed on Solana Devnet

This diagram shows how data flows through the actual implemented system.

```mermaid
flowchart LR
    subgraph "User Layer"
        U[User Browser]
    end
    
    subgraph "Frontend - React"
        UI[React UI<br/>Tailwind CSS]
        WS[WebSocket Client<br/>Real-time Updates]
    end
    
    subgraph "Backend - Node.js"
        API[Express API<br/>REST Endpoints]
        WSS[Socket.io Server<br/>Event Broadcasting]
        EP[Event Processor<br/>Redis Queue]
    end
    
    subgraph "External Services"
        AI[Arcanum.ai<br/>AI Verification]
        IPFS[IPFS Network<br/>Evidence Storage]
    end
    
    subgraph "Blockchain - Devnet"
        SOL[Solana Program<br/>Anchor Framework]
        EV[Event Logs<br/>Transaction History]
    end
    
    subgraph "Data Storage"
        DB[(PostgreSQL<br/>User Data)]
        REDIS[(Redis<br/>Cache + Sessions)]
    end
    
    U --> UI
    U --> WS
    
    UI --> API
    WS --> WSS
    
    API --> AI
    API --> IPFS
    API --> SOL
    API --> DB
    API --> REDIS
    
    SOL --> EV
    EV --> EP
    EP --> WSS
    WSS --> WS
    
    style AI fill:#FF9900
    style SOL fill:#14F195
    style DB fill:#336791
    style REDIS fill:#DC382D
```

**Data Flow Steps:**
1. User submits evidence through React UI
2. Frontend uploads to IPFS, gets content hash
3. API calls Arcanum.ai for verification
4. API submits result to Solana program
5. Solana emits events to event logs
6. Event processor picks up events from Redis queue
7. WebSocket server broadcasts updates to connected clients
8. User receives real-time notification

---

## Planned P-PoTV Flow (Physical Goods - FUTURE ROADMAP)

**Status:** 🔄 Conceptual Design  
**Timeline:** 12 weeks development  
**Estimated Cost:** $500K-$1M

This diagram shows the planned P-PoTV flow for physical goods verification.

```mermaid
flowchart TB
    subgraph "Phase 1: Physical Evidence"
        PA[User Submits Photos<br/>Package, Receipt, GPS]
        PB[Upload to IPFS<br/>With Metadata]
        PC[Extract GPS Coordinates<br/>Timestamp Data]
        PD[Submit Hash On-Chain]
    end
    
    subgraph "Phase 2: Computer Vision - PLANNED"
        PE[AI Image Analysis<br/>Object Detection]
        PF[Tamper Detection<br/>Authenticity Check]
        PG[GPS Verification<br/>Location Matching]
        PH[Courier API Integration<br/>Tracking Validation]
    end
    
    subgraph "Phase 3: ZK Location Proof - PLANNED"
        PI[Generate ZK Proof<br/>Location Valid]
        PJ[No GPS Exposure<br/>Privacy Preserved]
        PK[Cryptographic Proof<br/>Delivery Confirmed]
    end
    
    subgraph "Phase 4: Settlement"
        PL[Submit Verification<br/>On-Chain]
        PM[Validate All Proofs<br/>Multi-Factor Check]
        PN[Execute Settlement<br/>Release or Refund]
    end
    
    PA --> PB
    PB --> PC
    PC --> PD
    PD --> PE
    
    PE --> PF
    PF --> PG
    PG --> PH
    
    PH --> PI
    PI --> PJ
    PJ --> PK
    
    PK --> PL
    PL --> PM
    PM --> PN
    
    style PE fill:#666,stroke:#333,stroke-dasharray: 5 5
    style PI fill:#666,stroke:#333,stroke-dasharray: 5 5
    style PL fill:#666,stroke:#333,stroke-dasharray: 5 5
    
    classDef notImplemented fill:#666,stroke:#333,stroke-dasharray: 5 5
    class PE,PF,PG,PH,PI,PJ,PK,PL,PM,PN notImplemented
```

**P-PoTV Requirements (Not Yet Built):**
- Computer vision for image matching
- GPS verification with ZK proofs
- Tamper detection algorithms
- Courier API integrations (FedEx, UPS, DHL)
- Multi-source evidence correlation
- Physical authenticity checks





---

## Complete Planned Architecture with Timeline

**Status:** 🔄 Development Roadmap  
**Total Timeline:** 17+ weeks

This diagram shows the complete vision with all planned components organized by development phase.

```mermaid
graph TB
    subgraph "Phase 1: MVP - CURRENT ✅"
        P1A[Solana Devnet<br/>Basic Escrow]
        P1B[Arcanum.ai<br/>Single Provider]
        P1C[Basic IPFS<br/>Storage]
        P1D[React Frontend<br/>Dashboard]
    end
    
    subgraph "Phase 2: Production-Ready 🔄<br/>Timeline: 2-3 weeks"
        P2A[Solana Mainnet<br/>Production Deploy]
        P2B[AI Fallback Chain<br/>OpenAI → Claude → Gemini]
        P2C[Chainlink Functions<br/>Oracle Network]
        P2D[zkMe SDK<br/>Real Integration]
        P2E[Pinata + Web3.Storage<br/>IPFS Pinning]
        P2F[Ed25519 Signing<br/>Cryptographic Auth]
    end
    
    subgraph "Phase 3: Omnichain Expansion 🔄<br/>Timeline: 3 weeks"
        P3A[ZetaChain Mainnet<br/>Cross-Chain Messaging]
        P3B[TON Integration<br/>Telegram Ecosystem]
        P3C[Sui Integration<br/>Move VM Support]
        P3D[Somnia Settlement<br/>High-Speed Layer]
        P3E[Cross-Chain Callbacks<br/>onRevert + onAbort]
    end
    
    subgraph "Phase 4: Physical Verification 🔄<br/>Timeline: 12 weeks<br/>Cost: $500K-$1M"
        P4A[P-PoTV Implementation<br/>Physical Goods]
        P4B[Computer Vision<br/>Image Matching]
        P4C[GPS + ZK Proofs<br/>Location Privacy]
        P4D[Tamper Detection<br/>Authenticity Checks]
        P4E[Courier APIs<br/>FedEx, UPS, DHL]
        P4F[Multi-Source Evidence<br/>Correlation Engine]
    end
    
    P1A --> P2A
    P1B --> P2B
    P1C --> P2E
    
    P2A --> P3A
    P2C --> P3A
    P2D --> P3A
    
    P3A --> P3B
    P3A --> P3C
    P3A --> P3D
    
    P2B --> P4A
    P2C --> P4A
    P3A --> P4A
    
    P4A --> P4B
    P4A --> P4C
    P4A --> P4D
    P4A --> P4E
    P4A --> P4F
    
    style P1A fill:#14F195
    style P1B fill:#FF9900
    style P1C fill:#00D9FF
    style P1D fill:#A855F7
    
    style P2A fill:#666,stroke:#FFD700,stroke-width:3px
    style P2B fill:#666,stroke:#FFD700,stroke-width:3px
    style P2C fill:#666,stroke:#FFD700,stroke-width:3px
    style P2D fill:#666,stroke:#FFD700,stroke-width:3px
    style P2E fill:#666,stroke:#FFD700,stroke-width:3px
    style P2F fill:#666,stroke:#FFD700,stroke-width:3px
    
    style P3A fill:#666,stroke:#00D9FF,stroke-width:3px
    style P3B fill:#666,stroke:#00D9FF,stroke-width:3px
    style P3C fill:#666,stroke:#00D9FF,stroke-width:3px
    style P3D fill:#666,stroke:#00D9FF,stroke-width:3px
    style P3E fill:#666,stroke:#00D9FF,stroke-width:3px
    
    style P4A fill:#666,stroke:#FF6B6B,stroke-width:3px
    style P4B fill:#666,stroke:#FF6B6B,stroke-width:3px
    style P4C fill:#666,stroke:#FF6B6B,stroke-width:3px
    style P4D fill:#666,stroke:#FF6B6B,stroke-width:3px
    style P4E fill:#666,stroke:#FF6B6B,stroke-width:3px
    style P4F fill:#666,stroke:#FF6B6B,stroke-width:3px
```

**Development Phases:**

**Phase 1: MVP (Current) ✅**
- Solana Devnet deployment
- Arcanum.ai integration
- Basic IPFS storage
- React dashboard
- D-PoTV for digital tasks only

**Phase 2: Production-Ready (2-3 weeks) 🔄**
- Solana mainnet deployment
- AI fallback chain (OpenAI → Claude → Gemini)
- Chainlink Functions oracle integration
- zkMe SDK real integration (not mock)
- Pinata + Web3.Storage IPFS pinning
- Ed25519 cryptographic signing

**Phase 3: Omnichain Expansion (3 weeks) 🔄**
- ZetaChain mainnet integration
- TON blockchain support
- Sui blockchain support
- Somnia settlement layer
- Cross-chain message callbacks (onRevert, onAbort)

**Phase 4: Physical Verification (12 weeks, $500K-$1M) 🔄**
- P-PoTV implementation
- Computer vision for image matching
- GPS verification with ZK proofs
- Tamper detection algorithms
- Courier API integrations (FedEx, UPS, DHL)
- Multi-source evidence correlation
