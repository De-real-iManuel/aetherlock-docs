# Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Cyberpunk Dashboard]
        WC[Wallet Connector]
        WS[WebSocket Client]
    end
    
    subgraph "ZetaChain Omnichain"
        ZC[ZetaChain Contracts]
        zkMe[zkMe KYC Protocol]
        CCM[Cross-Chain Messaging]
    end
    
    subgraph "Multi-Chain Layer"
        SOL[Solana Escrow Program]
        ETH[Ethereum Contracts]
        POLY[Polygon Contracts]
        ARB[Arbitrum Contracts]
    end
    
    subgraph "AI & Oracle Layer"
        BR[AWS Bedrock Claude]
        VE[Verification Engine]
        DR[Dispute Resolution AI]
        API[API Gateway]
    end
    
    subgraph "Storage Layer"
        IPFS[IPFS Network]
        W3S[Web3.Storage]
        CACHE[Redis Cache]
        DB[(PostgreSQL)]
    end
    
    subgraph "External Services"
        AWS[AWS Services]
        GATEWAYS[IPFS Gateways]
        ORACLES[Price Oracles]
    end

    %% Frontend connections
    UI --> WC
    UI --> WS
    WC --> SOL
    WC --> ETH
    WC --> POLY
    WC --> ARB
    
    %% ZetaChain connections
    ZC --> CCM
    zkMe --> ZC
    CCM --> SOL
    CCM --> ETH
    CCM --> POLY
    CCM --> ARB
    
    %% AI Layer connections
    API --> BR
    VE --> BR
    DR --> BR
    VE --> IPFS
    DR --> IPFS
    
    %% Storage connections
    W3S --> IPFS
    IPFS --> GATEWAYS
    VE --> CACHE
    DR --> CACHE
    API --> DB
    
    %% External connections
    BR --> AWS
    W3S --> AWS
    SOL --> ORACLES
    ETH --> ORACLES
    
    %% WebSocket connections
    WS -.-> API
    API -.-> WS
    
    %% Cross-chain messaging
    CCM -.-> VE
    VE -.-> CCM

    classDef frontend fill:#9333ea,stroke:#06b6d4,stroke-width:2px,color:#fff
    classDef blockchain fill:#10b981,stroke:#06b6d4,stroke-width:2px,color:#fff
    classDef ai fill:#06b6d4,stroke:#9333ea,stroke-width:2px,color:#fff
    classDef storage fill:#f59e0b,stroke:#10b981,stroke-width:2px,color:#fff
    classDef external fill:#6b7280,stroke:#374151,stroke-width:2px,color:#fff
    classDef omnichain fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff

    class UI,WC,WS frontend
    class SOL,ETH,POLY,ARB blockchain
    class BR,VE,DR,API ai
    class IPFS,W3S,CACHE,DB storage
    class AWS,GATEWAYS,ORACLES external
    class ZC,zkMe,CCM omnichain
```

## Component Interactions

### Escrow Creation Flow
1. **User Interface**: User initiates escrow creation through cyberpunk dashboard
2. **Wallet Integration**: Wallet connector handles transaction signing
3. **Smart Contract**: Escrow program creates PDA and locks funds
4. **Cross-Chain Sync**: ZetaChain propagates escrow state across chains
5. **Storage**: Escrow metadata stored on IPFS with hash recorded on-chain

### AI Verification Process
1. **Evidence Submission**: Files uploaded to IPFS via Web3.Storage
2. **Verification Trigger**: Smart contract emits verification request event
3. **AI Processing**: Bedrock Claude analyzes evidence and task requirements
4. **Decision Logic**: Verification engine processes AI output and confidence scores
5. **Result Storage**: Verification results cached and stored on-chain

### zkMe KYC Integration
1. **Identity Request**: User initiates KYC through zkMe SDK
2. **Proof Generation**: Zero-knowledge proofs generated client-side
3. **ZetaChain Verification**: Proofs verified on ZetaChain omnichain
4. **Cross-Chain Sync**: KYC status synchronized across all supported chains
5. **Compliance Check**: Escrow operations validate KYC requirements

### Dispute Resolution Workflow
1. **Dispute Detection**: AI monitors for verification failures and conflicts
2. **Evidence Analysis**: Bedrock processes all submitted evidence
3. **Multi-Tier Resolution**: Automated, AI-assisted, or human arbitration
4. **Decision Execution**: Resolution automatically executed on-chain
5. **Cross-Chain Update**: Dispute outcomes synchronized across chains

## Security Architecture

### Multi-Layer Security
- **Smart Contract Security**: Formal verification and audit processes
- **AI Security**: Input validation and output verification for AI systems
- **Privacy Protection**: Zero-knowledge proofs and encrypted storage
- **Access Control**: Role-based permissions and time-locked operations
- **Cross-Chain Security**: Verified messaging and state synchronization

### Threat Mitigation
- **Reentrancy Protection**: Checks-effects-interactions pattern
- **Oracle Manipulation**: Multiple price feed sources and validation
- **AI Manipulation**: Confidence thresholds and human oversight
- **Cross-Chain Attacks**: Message verification and replay protection
- **Privacy Breaches**: Client-side proof generation and encrypted storage

This architecture ensures scalability, security, and interoperability while maintaining the cyberpunk aesthetic and user experience that defines AetherLock Protocol.