# Data Models

## Escrow Lifecycle State Diagram

```mermaid
stateDiagram-v2
    [*] --> Created: Initialize Escrow
    Created --> Funded: Deposit Funds
    Created --> Cancelled: Cancel Before Funding
    
    Funded --> PendingVerification: Submit Evidence
    Funded --> Expired: Deadline Exceeded
    Funded --> Cancelled: Mutual Cancellation
    
    PendingVerification --> Verified: AI Approval (>90% confidence)
    PendingVerification --> Funded: AI Rejection (<50% confidence)
    PendingVerification --> Disputed: AI Uncertain (50-90% confidence)
    PendingVerification --> Expired: Verification Timeout
    
    Verified --> Completed: Release Funds
    Verified --> Disputed: Manual Dispute
    
    Disputed --> Completed: Resolution: Release
    Disputed --> Cancelled: Resolution: Refund
    Disputed --> PartialRelease: Resolution: Partial
    
    PartialRelease --> Completed: Final Settlement
    
    Expired --> Refunded: Auto Refund
    Cancelled --> Refunded: Process Refund
    
    Completed --> [*]
    Refunded --> [*]
    
    note right of PendingVerification
        AI Confidence Thresholds:
        >90%: Auto Approve
        50-90%: Human Review
        <50%: Auto Reject
    end note
    
    note right of Disputed
        Multi-tier Resolution:
        Tier 1: AI Analysis
        Tier 2: Human Review
        Tier 3: Arbitration Panel
    end note
```

## TypeScript Data Models

### Core Escrow Interface

```typescript
interface Escrow {
  id: string;
  escrowId: number;
  payer: string; // Wallet address
  payee: string; // Wallet address
  amount: bigint; // Amount in smallest unit (lamports for SOL)
  tokenMint?: string; // Token mint address (undefined for SOL)
  status: EscrowStatus;
  deadline: number; // Unix timestamp
  taskMetadataHash: string; // IPFS hash
  evidenceHash?: string; // IPFS hash
  verificationResult?: VerificationResult;
  kycVerified: boolean;
  treasuryFee: bigint;
  createdAt: number;
  updatedAt: number;
  chainId: string;
  transactionHash: string;
}

enum EscrowStatus {
  CREATED = 'created',
  FUNDED = 'funded',
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
  PARTIAL_RELEASE = 'partial_release'
}
```

### Verification and AI Models

```typescript
interface VerificationResult {
  confidenceScore: number; // 0-100
  decision: VerificationDecision;
  analysisHash: string; // IPFS hash of detailed analysis
  verifiedAt: number;
  aiModel: string; // e.g., 'claude-3-sonnet'
  processingTime: number; // milliseconds
  reviewRequired: boolean;
}

enum VerificationDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

interface AIAnalysis {
  escrowId: string;
  taskDescription: string;
  evidenceAnalysis: EvidenceAnalysis[];
  complianceCheck: ComplianceResult;
  riskAssessment: RiskAssessment;
  recommendation: string;
  confidence: number;
  reasoning: string[];
  suggestedImprovements?: string[];
}

interface EvidenceAnalysis {
  fileHash: string;
  fileType: string;
  analysisType: 'text' | 'image' | 'document' | 'video';
  extractedContent: string;
  relevanceScore: number;
  qualityScore: number;
  authenticity: number;
  findings: string[];
}
```

### User and Identity Models

```typescript
interface User {
  walletAddress: string;
  chainId: string;
  kycStatus: KYCStatus;
  reputation: UserReputation;
  preferences: UserPreferences;
  createdAt: number;
  lastActiveAt: number;
}

interface KYCStatus {
  verified: boolean;
  level: 'basic' | 'enhanced' | 'premium';
  issuedAt?: number;
  expiresAt?: number;
  credentialHash?: string;
  provider: 'zkme';
  chainVerified: string; // ZetaChain address
}

interface UserReputation {
  totalEscrows: number;
  completedEscrows: number;
  disputedEscrows: number;
  averageRating: number;
  trustScore: number; // 0-100
  badges: string[];
}

interface UserPreferences {
  theme: 'cyberpunk' | 'classic';
  notifications: NotificationSettings;
  defaultChain: string;
  language: string;
  timezone: string;
}
```

### Dispute Resolution Models

```typescript
interface Dispute {
  id: string;
  escrowId: string;
  initiatedBy: string; // wallet address
  reason: DisputeReason;
  status: DisputeStatus;
  tier: 1 | 2 | 3; // Resolution tier
  evidence: DisputeEvidence[];
  aiAnalysis?: AIDisputeAnalysis;
  arbitrators?: string[]; // wallet addresses
  resolution?: DisputeResolution;
  createdAt: number;
  resolvedAt?: number;
}

enum DisputeReason {
  TASK_NOT_COMPLETED = 'task_not_completed',
  POOR_QUALITY = 'poor_quality',
  DEADLINE_MISSED = 'deadline_missed',
  REQUIREMENTS_NOT_MET = 'requirements_not_met',
  FRAUDULENT_EVIDENCE = 'fraudulent_evidence',
  OTHER = 'other'
}

enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  AWAITING_ARBITRATION = 'awaiting_arbitration',
  RESOLVED = 'resolved',
  APPEALED = 'appealed'
}

interface DisputeResolution {
  decision: 'release_full' | 'refund_full' | 'partial_release' | 'escalate';
  payeeAmount: bigint;
  payerRefund: bigint;
  reasoning: string;
  arbitratorFee: bigint;
  finalizedAt: number;
}
```

### Storage and Metadata Models

```typescript
interface IPFSMetadata {
  hash: string;
  size: number;
  mimeType: string;
  filename: string;
  uploadedAt: number;
  uploadedBy: string;
  encrypted: boolean;
  accessControl: AccessControl;
}

interface AccessControl {
  public: boolean;
  allowedUsers: string[]; // wallet addresses
  expiresAt?: number;
  requiresKYC: boolean;
}

interface TaskMetadata {
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  category: string;
  tags: string[];
  estimatedDuration: number; // hours
  skillsRequired: string[];
  attachments: IPFSMetadata[];
}
```

### Notification and Event Models

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: number;
  expiresAt?: number;
}

enum NotificationType {
  ESCROW_CREATED = 'escrow_created',
  FUNDS_DEPOSITED = 'funds_deposited',
  EVIDENCE_SUBMITTED = 'evidence_submitted',
  VERIFICATION_COMPLETE = 'verification_complete',
  DISPUTE_INITIATED = 'dispute_initiated',
  FUNDS_RELEASED = 'funds_released',
  KYC_REQUIRED = 'kyc_required',
  DEADLINE_APPROACHING = 'deadline_approaching'
}

interface BlockchainEvent {
  id: string;
  escrowId: string;
  eventType: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  data: Record<string, any>;
  timestamp: number;
  chainId: string;
}
```

These data models provide a comprehensive foundation for AetherLock's multi-chain escrow system, ensuring type safety and consistency across all components while supporting the complex workflows of AI verification and dispute resolution.