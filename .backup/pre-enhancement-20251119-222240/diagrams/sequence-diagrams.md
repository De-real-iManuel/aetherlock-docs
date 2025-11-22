# Sequence Diagrams

This file contains all sequence diagrams for AetherLock Protocol workflows.

## Complete Escrow Flow (Client → Contract → Freelancer → AI → Treasury)

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Wallet
    participant Solana as Solana Program
    participant ZetaChain
    participant Freelancer
    participant IPFS
    participant AI as Arcanum.ai
    participant Oracle as Chainlink Oracle
    participant Treasury
    
    Note over Client,Treasury: Phase 1: Escrow Creation
    Client->>Frontend: Create Escrow Request
    Frontend->>Wallet: Request Wallet Connection
    Wallet-->>Frontend: Wallet Connected
    
    Frontend->>Solana: Create Escrow Transaction
    Note right of Solana: Lock $1,100<br/>($1,000 + $100 fee)
    Solana->>Solana: Initialize Escrow Account
    Solana->>ZetaChain: Emit xCall Event
    ZetaChain-->>Solana: Confirmation
    Solana-->>Frontend: Escrow Created
    Frontend-->>Client: Escrow ID: #12345
    
    Note over Client,Treasury: Phase 2: Work Execution
    Freelancer->>Frontend: Accept Escrow
    Freelancer->>Freelancer: Complete Work
    
    Note over Client,Treasury: Phase 3: Evidence Submission
    Freelancer->>Frontend: Submit Evidence
    Frontend->>IPFS: Upload Evidence Files
    IPFS-->>Frontend: Content Hash (CID)
    Frontend->>Solana: Submit Evidence Hash
    Solana->>Solana: Update Escrow State
    Solana-->>Frontend: Evidence Recorded
    
    Note over Client,Treasury: Phase 4: AI Verification
    Solana->>Oracle: Request Verification
    Oracle->>IPFS: Fetch Evidence
    IPFS-->>Oracle: Evidence Files
    Oracle->>AI: Analyze Evidence
    AI->>AI: Semantic Analysis<br/>Quality Scoring
    AI-->>Oracle: Verification Result<br/>Confidence: 94%
    Oracle->>Oracle: Sign Result (Ed25519)
    Oracle->>ZetaChain: Submit Verification
    ZetaChain->>Solana: Update Verification Status
    
    Note over Client,Treasury: Phase 5: Fund Settlement
    Solana->>Solana: Check Verification<br/>Status: APPROVED
    Solana->>Freelancer: Transfer $1,000 (90%)
    Solana->>Treasury: Transfer $100 (10%)
    Solana->>ZetaChain: Emit Settlement Event
    ZetaChain-->>Frontend: Settlement Complete
    Frontend-->>Freelancer: Payment Received
    Frontend-->>Client: Task Completed
    
    Note over Client,Treasury: Total Time: 2.3 seconds
```


## KYC Verification Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant zkMe as zkMe SDK
    participant Backend
    participant ZetaChain
    participant Solana as Solana Program
    
    Note over User,Solana: Phase 1: Initiate KYC
    User->>Frontend: Request KYC Verification
    Frontend->>zkMe: Initialize Session
    zkMe-->>Frontend: Session ID + Widget URL
    Frontend-->>User: Display zkMe Widget
    
    Note over User,Solana: Phase 2: Document Submission
    User->>zkMe: Submit Identity Documents
    Note right of zkMe: - Passport/ID<br/>- Selfie<br/>- Proof of Address
    zkMe->>zkMe: Validate Documents
    zkMe->>zkMe: Generate Zero-Knowledge Proof
    Note right of zkMe: No PII stored<br/>Only cryptographic proof
    
    Note over User,Solana: Phase 3: Proof Verification
    zkMe-->>Frontend: ZK Proof + Credential Hash
    Frontend->>Backend: Submit Proof for Verification
    Backend->>Backend: Verify ZK Proof
    Backend->>ZetaChain: Store Credential Hash
    Note right of ZetaChain: On-chain storage<br/>without PII
    ZetaChain-->>Backend: Credential ID
    
    Note over User,Solana: Phase 4: Link to Wallet
    Backend->>Solana: Link Credential to Wallet
    Solana->>Solana: Update User Account<br/>KYC Status: VERIFIED
    Solana-->>Backend: Verification Complete
    Backend-->>Frontend: Success Response
    Frontend-->>User: ✅ KYC Verified
    
    Note over User,Solana: User can now create/accept escrows
```


## Cross-Chain Settlement Flow

```mermaid
sequenceDiagram
    participant User as User (Solana)
    participant Solana as Solana Program
    participant ZetaGW as ZetaChain Gateway
    participant ZetaContract as ZetaChain Universal Contract
    participant Somnia as Somnia Settlement Contract
    participant Recipient as Recipient (Somnia)
    
    Note over User,Recipient: Phase 1: Initiate Cross-Chain Transfer
    User->>Solana: Create Cross-Chain Escrow
    Note right of Solana: Lock funds on Solana<br/>Amount: 1000 USDC
    Solana->>Solana: Lock Funds in Escrow PDA
    Solana->>ZetaGW: Emit xCall Event
    Note right of ZetaGW: Message: CREATE_ESCROW<br/>Destination: Somnia<br/>Data: {amount, recipient}
    
    Note over User,Recipient: Phase 2: ZetaChain Processing
    ZetaGW->>ZetaContract: Route Message
    ZetaContract->>ZetaContract: Validate Message Format
    ZetaContract->>ZetaContract: Verify Source Chain
    ZetaContract->>ZetaContract: Encode Cross-Chain Data
    
    Note over User,Recipient: Phase 3: Target Chain Execution
    ZetaContract->>Somnia: onCall(sourceChain, message)
    Somnia->>Somnia: Decode Message
    Somnia->>Somnia: Initialize Escrow State
    Note right of Somnia: Escrow created on Somnia<br/>Linked to Solana escrow
    Somnia-->>ZetaContract: Confirmation Event
    
    Note over User,Recipient: Phase 4: Callback to Source
    ZetaContract->>ZetaGW: Process Callback
    ZetaGW->>Solana: onCallback(success, escrowId)
    Solana->>Solana: Update Escrow Status<br/>Cross-Chain: ACTIVE
    Solana-->>User: Cross-Chain Escrow Created
    
    Note over User,Recipient: Phase 5: Settlement Trigger
    Solana->>ZetaGW: Emit xCall(RELEASE_FUNDS)
    ZetaGW->>ZetaContract: Route Settlement Message
    ZetaContract->>Somnia: onCall(RELEASE_FUNDS)
    Somnia->>Somnia: Verify Conditions Met
    Somnia->>Recipient: Transfer Funds
    Somnia-->>ZetaContract: Settlement Complete
    ZetaContract->>Solana: onCallback(settled)
    Solana->>Solana: Mark Escrow Complete
    
    Note over User,Recipient: Total Time: ~5 seconds (cross-chain)
```


## Dispute Resolution Flow

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant Solana as Solana Program
    participant AI as Arcanum.ai
    participant Arbitrator
    participant Freelancer
    participant Treasury
    
    Note over Client,Treasury: Phase 1: Dispute Initiation
    Client->>Frontend: Dispute Evidence Quality
    Frontend->>Backend: Create Dispute Request
    Backend->>Solana: Initiate Dispute
    Solana->>Solana: Update Escrow Status<br/>Status: DISPUTED
    Solana->>Solana: Lock Funds (No Release)
    Solana-->>Backend: Dispute Created
    Backend-->>Frontend: Dispute ID: #789
    Frontend-->>Client: Dispute Submitted
    Frontend-->>Freelancer: Dispute Notification
    
    Note over Client,Treasury: Phase 2: Evidence Review
    Freelancer->>Frontend: Submit Additional Evidence
    Frontend->>Backend: Upload Supplementary Files
    Backend->>AI: Re-analyze All Evidence
    AI->>AI: Comprehensive Analysis<br/>Original + New Evidence
    AI-->>Backend: Updated Verification<br/>Confidence: 78%
    
    Note over Client,Treasury: Phase 3: Arbitrator Assignment
    Backend->>Backend: Check AI Confidence
    Note right of Backend: 78% < 85% threshold<br/>Requires human review
    Backend->>Arbitrator: Assign Dispute Case
    Arbitrator->>Frontend: Access Dispute Dashboard
    Frontend-->>Arbitrator: Display All Evidence
    
    Note over Client,Treasury: Phase 4: Arbitrator Review
    Arbitrator->>Arbitrator: Review Evidence<br/>- Original submission<br/>- Client complaint<br/>- Additional evidence<br/>- AI analysis
    Arbitrator->>Frontend: Submit Decision
    Note right of Arbitrator: Decision: APPROVE<br/>Reasoning: Work meets<br/>requirements despite<br/>minor issues
    
    Note over Client,Treasury: Phase 5: Resolution Execution
    Frontend->>Backend: Process Arbitrator Decision
    Backend->>Solana: Update Escrow with Decision
    Solana->>Solana: Verify Arbitrator Signature
    Solana->>Freelancer: Release $950 (95%)
    Note right of Solana: Partial release due to<br/>minor quality issues
    Solana->>Client: Refund $50 (5%)
    Solana->>Treasury: Collect $100 (10%)
    Solana-->>Backend: Resolution Complete
    Backend-->>Frontend: Settlement Processed
    Frontend-->>Client: Partial Refund Issued
    Frontend-->>Freelancer: Payment Released
    
    Note over Client,Treasury: Resolution Time: 24-48 hours
```



## Proof-of-Task Verification (PoTV) Detailed Flow

```mermaid
sequenceDiagram
    participant Freelancer
    participant IPFS
    participant Oracle as Chainlink Oracle
    participant AI as Arcanum.ai
    participant Fallback as Fallback Providers<br/>(OpenAI/Claude/Gemini)
    participant zkMe as zkMe SDK
    participant ZetaChain
    participant Solana as Solana Program
    participant Client
    
    Note over Freelancer,Client: Phase 1: Evidence Submission & Storage
    Freelancer->>IPFS: Upload Evidence Files
    Note right of IPFS: Decentralized storage<br/>Content addressing
    IPFS-->>Freelancer: Content Hash (CID)
    Freelancer->>Solana: Submit Evidence Hash
    Solana->>Solana: Update Escrow State<br/>Status: EVIDENCE_SUBMITTED
    Solana-->>Freelancer: Evidence Recorded
    
    Note over Freelancer,Client: Phase 2: AI Analysis (PoTV Component 1)
    Solana->>Oracle: Trigger Verification Request
    Oracle->>IPFS: Fetch Evidence by CID
    IPFS-->>Oracle: Evidence Files
    
    Oracle->>AI: Analyze Evidence<br/>POST /v1/analyze
    Note right of AI: Primary provider:<br/>Arcanum.ai
    
    alt Arcanum.ai Success
        AI->>AI: Semantic Analysis<br/>Quality Scoring<br/>Requirements Matching
        AI-->>Oracle: Verification Result<br/>Confidence: 94%
    else Arcanum.ai Failure
        AI-->>Oracle: Error Response
        Oracle->>Fallback: Retry with OpenAI
        Note right of Fallback: Fallback chain:<br/>OpenAI → Claude → Gemini
        Fallback-->>Oracle: Verification Result<br/>Confidence: 91%
    end
    
    Oracle->>Oracle: Sign Result<br/>HMAC-SHA256 + Timestamp
    Note right of Oracle: Cryptographic signature<br/>prevents tampering
    
    Note over Freelancer,Client: Phase 3: Zero-Knowledge Proof (PoTV Component 2)
    Oracle->>zkMe: Generate ZK Proof
    Note right of zkMe: Proof includes:<br/>- Verification occurred<br/>- Confidence ≥ threshold<br/>- Timestamp valid<br/><br/>Does NOT reveal:<br/>- Evidence content<br/>- AI model details<br/>- Analysis reasoning
    zkMe->>zkMe: Create Cryptographic Proof
    zkMe-->>Oracle: ZK Proof Generated
    
    Note over Freelancer,Client: Phase 4: Oracle Consensus (PoTV Component 3)
    Oracle->>Oracle: Validate ZK Proof
    Note right of Oracle: Multiple oracle nodes<br/>independently verify
    Oracle->>Oracle: Reach Consensus<br/>Majority Agreement
    Oracle->>ZetaChain: Submit Verification<br/>with ZK Proof
    Note right of ZetaChain: Cross-chain message<br/>with proof payload
    
    Note over Freelancer,Client: Phase 5: On-Chain Validation (PoTV Component 4)
    ZetaChain->>Solana: Update Verification Status
    Solana->>Solana: Validate PoTV Chain<br/>1. AI signature valid?<br/>2. ZK proof correct?<br/>3. Oracle consensus?<br/>4. Timestamp fresh?
    
    alt All Validations Pass
        Solana->>Solana: Mark as APPROVED
        Solana->>Freelancer: Release Funds (90%)
        Solana->>Solana: Collect Fee (10%)
        Solana-->>Client: Task Completed
        Solana-->>Freelancer: Payment Received
    else Validation Fails
        Solana->>Solana: Mark as DISPUTED
        Solana-->>Client: Manual Review Required
        Solana-->>Freelancer: Funds Held Pending Review
    end
    
    Note over Freelancer,Client: PoTV Complete: Cryptographic proof of human work quality
    Note over Freelancer,Client: Total Time: ~2.3 seconds (average)
```

**PoTV Security Properties:**

1. **AI Result Integrity**: Cryptographic signatures prevent tampering with verification results
2. **Privacy Preservation**: Zero-knowledge proofs verify without exposing evidence content
3. **Decentralization**: Multiple oracle nodes prevent single point of failure
4. **Immutability**: On-chain validation creates permanent audit trail
5. **Fallback Resilience**: Provider chain ensures high availability (Arcanum.ai → OpenAI → Claude → Gemini)

