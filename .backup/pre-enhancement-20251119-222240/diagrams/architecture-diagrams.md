# Architecture Diagrams

This file contains all system architecture diagrams for AetherLock Protocol.

## System Architecture Diagram (All Components)

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
    
    subgraph "Verification Layer"
        AI[Arcanum.ai<br/>AI Task Verification]
        KYC[zkMe Verification<br/>Zero-Knowledge KYC]
        Oracle[Chainlink Functions<br/>Oracle Network]
        IPFS[IPFS Storage<br/>Pinata + Web3.Storage]
    end
    
    subgraph "Blockchain Layer"
        Solana[Solana Program<br/>Anchor Framework]
        Zeta[ZetaChain Gateway<br/>Universal App]
        Somnia[Somnia Contract<br/>EVM Settlement]
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
    API --> KYC
    API --> Oracle
    API --> IPFS
    API --> DB
    API --> Redis
    
    WS --> EventProc
    EventProc --> Events
    
    Solana --> Zeta
    Zeta --> Somnia
    Solana --> Events
    
    AI --> Oracle
    KYC --> Zeta
    IPFS --> IPFSNet
    
    EventProc --> Monitoring
    API --> Monitoring
    
    style AI fill:#FF9900
    style KYC fill:#A855F7
    style Solana fill:#14F195
    style Zeta fill:#00D9FF
    style Somnia fill:#FF6B6B
    style DB fill:#336791
    style Redis fill:#DC382D
```


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


## AI Verification Pipeline Diagram

```mermaid
flowchart TB
    subgraph "Evidence Collection"
        A[User Uploads Files<br/>Images, Docs, Code]
        B[Frontend Validation<br/>Type + Size Check]
        C[IPFS Upload<br/>Web3.Storage]
        D[Get Content Hash<br/>CID: QmX7K3b...]
    end
    
    subgraph "AI Processing"
        E[Fetch from IPFS<br/>Retrieve Evidence]
        F[Arcanum.ai<br/>Primary AI Provider]
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
    
    subgraph "On-Chain Settlement"
        N[Update Escrow State<br/>Smart Contract]
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


## Proof-of-Task Verification (PoTV) Flow Diagram

```mermaid
flowchart TB
    subgraph "Phase 1: Evidence Submission"
        A[Freelancer Submits Evidence<br/>Images, Docs, Code]
        B[Upload to IPFS<br/>Decentralized Storage]
        C[Get Content Hash<br/>CID: QmX7K3b...]
        D[Submit Hash On-Chain<br/>Solana Program]
    end
    
    subgraph "Phase 2: AI Analysis"
        E[Chainlink Oracle<br/>Fetch Evidence from IPFS]
        F[Arcanum.ai Analysis<br/>Primary AI Provider]
        G[Fallback Chain<br/>OpenAI → Claude → Gemini]
        H[Quality Assessment<br/>Requirements Matching]
        I[Confidence Score<br/>0-100 Scale]
        J[Cryptographic Signing<br/>HMAC-SHA256]
    end
    
    subgraph "Phase 3: Zero-Knowledge Proof"
        K[Generate ZK Proof<br/>zkMe SDK]
        L[Proof Components<br/>- Verification occurred<br/>- Confidence threshold met<br/>- Timestamp valid]
        M[No Evidence Exposure<br/>Privacy Preserved]
    end
    
    subgraph "Phase 4: Oracle Verification"
        N[Chainlink Functions<br/>Decentralized Oracle Network]
        O[Multiple Nodes Verify<br/>ZK Proof Validation]
        P[Consensus Mechanism<br/>Majority Agreement]
        Q[On-Chain Submission<br/>Signed Transaction]
    end
    
    subgraph "Phase 5: Smart Contract Validation"
        R[Solana Anchor Program<br/>Verify PoTV Chain]
        S[Validate Components<br/>- AI signature valid<br/>- ZK proof correct<br/>- Oracle consensus reached<br/>- Timestamp fresh]
        T[Execute Settlement<br/>Release Funds or Dispute]
        U[Emit Events<br/>Immutable Audit Trail]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    E --> F
    F --> H
    F -.->|Failure| G
    G --> H
    H --> I
    I --> J
    
    J --> K
    K --> L
    L --> M
    
    M --> N
    N --> O
    O --> P
    P --> Q
    
    Q --> R
    R --> S
    S --> T
    T --> U
    
    style F fill:#FF9900
    style K fill:#A855F7
    style N fill:#00D9FF
    style R fill:#14F195
    style T fill:#FFD700
```

**PoTV Consensus Analogy:**

| Consensus Type | What It Proves | How It Works |
|----------------|----------------|--------------|
| **Proof-of-Work (PoW)** | Proves computational work | Miners solve mathematical puzzles to validate blocks |
| **Proof-of-Stake (PoS)** | Proves capital commitment | Validators lock tokens to secure the network |
| **Proof-of-Task Verification (PoTV)** | Proves human work completion | AI + ZK proofs + Oracles verify task quality on-chain |

**PoTV Innovation:**
- Developed by AetherLock Labs as the first consensus mechanism for verifying human task completion quality
- Combines AI analysis, zero-knowledge cryptography, decentralized oracles, and smart contracts
- Enables trustless verification of subjective work quality without exposing private evidence
- Provides cryptographic proof that human work meets specified requirements

