# State Diagrams

This file contains all state machine diagrams for AetherLock Protocol.

## Escrow State Machine

```mermaid
stateDiagram-v2
    [*] --> Created: Create Escrow
    
    Created --> FundsLocked: Deposit Funds
    Created --> Cancelled: Cancel (Before Deposit)
    
    FundsLocked --> WorkInProgress: Freelancer Accepts
    FundsLocked --> Cancelled: Timeout/Cancel
    
    WorkInProgress --> EvidenceSubmitted: Submit Evidence
    WorkInProgress --> Cancelled: Mutual Agreement
    
    EvidenceSubmitted --> AIVerifying: Trigger Verification
    
    AIVerifying --> Approved: AI Confidence > 90%
    AIVerifying --> NeedsReview: AI Confidence 50-90%
    AIVerifying --> Rejected: AI Confidence < 50%
    AIVerifying --> Failed: Verification Error
    
    NeedsReview --> UnderArbitration: Assign Arbitrator
    
    UnderArbitration --> Approved: Arbitrator Approves
    UnderArbitration --> Rejected: Arbitrator Rejects
    UnderArbitration --> PartialApproval: Partial Release
    
    Approved --> Settling: Release Funds
    PartialApproval --> Settling: Partial Release
    
    Settling --> Completed: Funds Transferred
    Settling --> Failed: Transfer Error
    
    Rejected --> Refunding: Return to Client
    Refunding --> Refunded: Refund Complete
    Refunding --> Failed: Refund Error
    
    Failed --> UnderArbitration: Manual Review
    
    Completed --> [*]
    Refunded --> [*]
    Cancelled --> [*]
    
    note right of AIVerifying
        AI Analysis:
        - Evidence quality
        - Requirement matching
        - Confidence scoring
    end note
    
    note right of UnderArbitration
        Human Review:
        - Expert evaluation
        - Additional evidence
        - Final decision
    end note
```


## Verification State Transitions

```mermaid
stateDiagram-v2
    [*] --> Pending: Evidence Submitted
    
    Pending --> Queued: Enter Verification Queue
    
    Queued --> Processing: AI Analysis Started
    
    Processing --> AnalyzingEvidence: Fetch from IPFS
    
    AnalyzingEvidence --> ScoringQuality: Evidence Retrieved
    
    ScoringQuality --> CalculatingConfidence: Quality Assessed
    
    CalculatingConfidence --> HighConfidence: Score > 90%
    CalculatingConfidence --> MediumConfidence: Score 50-90%
    CalculatingConfidence --> LowConfidence: Score < 50%
    CalculatingConfidence --> Error: Analysis Failed
    
    HighConfidence --> SigningResult: Auto-Approve
    MediumConfidence --> EscalatingToHuman: Needs Review
    LowConfidence --> SigningResult: Auto-Reject
    
    SigningResult --> SubmittingOnChain: Ed25519 Signature
    
    SubmittingOnChain --> Verified: On-Chain Update
    SubmittingOnChain --> RetrySubmission: Blockchain Error
    
    RetrySubmission --> SubmittingOnChain: Retry (Max 3)
    RetrySubmission --> Error: Max Retries Exceeded
    
    EscalatingToHuman --> AwaitingArbitrator: Assign Case
    
    AwaitingArbitrator --> ArbitratorReview: Arbitrator Assigned
    
    ArbitratorReview --> SigningResult: Decision Made
    
    Error --> ManualIntervention: Alert Team
    ManualIntervention --> Queued: Retry After Fix
    
    Verified --> [*]
    
    note right of CalculatingConfidence
        Confidence Factors:
        - AI score (70%)
        - Reputation (20%)
        - Risk assessment (10%)
    end note
    
    note right of EscalatingToHuman
        Escalation Triggers:
        - Medium confidence
        - High-value escrow
        - Complex requirements
        - Dispute filed
    end note
```


## User Journey States

```mermaid
stateDiagram-v2
    [*] --> Visitor: Land on Platform
    
    Visitor --> ConnectingWallet: Click "Connect Wallet"
    
    ConnectingWallet --> WalletConnected: Wallet Approved
    ConnectingWallet --> Visitor: Connection Rejected
    
    WalletConnected --> InitiatingKYC: Start KYC Process
    
    InitiatingKYC --> SubmittingDocuments: zkMe Widget Opened
    
    SubmittingDocuments --> VerifyingIdentity: Documents Uploaded
    SubmittingDocuments --> InitiatingKYC: Retry Upload
    
    VerifyingIdentity --> KYCVerified: Proof Generated
    VerifyingIdentity --> KYCFailed: Verification Failed
    
    KYCFailed --> SubmittingDocuments: Retry KYC
    KYCFailed --> WalletConnected: Skip KYC (Limited Access)
    
    KYCVerified --> BrowsingEscrows: Access Full Platform
    
    BrowsingEscrows --> CreatingEscrow: Create New Escrow (Client)
    BrowsingEscrows --> AcceptingEscrow: Accept Escrow (Freelancer)
    BrowsingEscrows --> ViewingDetails: View Escrow Details
    
    CreatingEscrow --> DepositingFunds: Fill Escrow Form
    
    DepositingFunds --> EscrowActive: Funds Locked
    DepositingFunds --> BrowsingEscrows: Transaction Failed
    
    AcceptingEscrow --> WorkingOnTask: Escrow Accepted
    
    WorkingOnTask --> UploadingEvidence: Work Completed
    
    UploadingEvidence --> AwaitingVerification: Evidence Submitted
    
    AwaitingVerification --> VerificationComplete: AI Approved
    AwaitingVerification --> DisputeProcess: Verification Disputed
    AwaitingVerification --> UploadingEvidence: Resubmit Evidence
    
    VerificationComplete --> ReceivingPayment: Funds Released
    
    ReceivingPayment --> CompletedTransaction: Payment Confirmed
    
    DisputeProcess --> ArbitrationReview: Arbitrator Assigned
    
    ArbitrationReview --> VerificationComplete: Dispute Resolved
    ArbitrationReview --> RefundIssued: Dispute Upheld
    
    RefundIssued --> CompletedTransaction: Refund Confirmed
    
    EscrowActive --> BrowsingEscrows: Monitor Status
    ViewingDetails --> BrowsingEscrows: Back to List
    CompletedTransaction --> BrowsingEscrows: New Transaction
    
    CompletedTransaction --> [*]: Disconnect
    
    note right of KYCVerified
        Verified Users Can:
        - Create escrows
        - Accept escrows
        - Submit evidence
        - Participate in disputes
    end note
    
    note right of AwaitingVerification
        Verification Time:
        - Average: 2.3 seconds
        - Max: 30 seconds
        - Timeout: 5 minutes
    end note
    
    note right of DisputeProcess
        Dispute Resolution:
        - Client files dispute
        - Additional evidence
        - Arbitrator review
        - Final decision
    end note
```


## Cross-Chain Escrow State Machine

```mermaid
stateDiagram-v2
    [*] --> Initialized: Create Cross-Chain Escrow
    
    Initialized --> SourceLocked: Lock Funds on Source Chain
    
    SourceLocked --> MessageSent: Emit xCall to ZetaChain
    
    MessageSent --> ZetaProcessing: ZetaChain Receives Message
    
    ZetaProcessing --> RoutingToTarget: Validate & Route
    
    RoutingToTarget --> TargetReceived: Target Chain Receives
    
    TargetReceived --> TargetInitialized: Create Escrow on Target
    TargetReceived --> RoutingFailed: Target Chain Error
    
    TargetInitialized --> CallbackSent: Send Confirmation
    
    CallbackSent --> SourceUpdated: Update Source Chain
    CallbackSent --> CallbackFailed: Callback Error
    
    SourceUpdated --> CrossChainActive: Both Chains Synced
    
    CrossChainActive --> VerificationTriggered: Evidence Submitted
    
    VerificationTriggered --> VerificationComplete: AI Approved
    
    VerificationComplete --> SettlementInitiated: Trigger Settlement
    
    SettlementInitiated --> TargetSettling: Release on Target Chain
    
    TargetSettling --> TargetSettled: Funds Transferred
    TargetSettling --> SettlementFailed: Transfer Error
    
    TargetSettled --> SourceNotified: Notify Source Chain
    
    SourceNotified --> SourceSettled: Update Source State
    SourceNotified --> NotificationFailed: Notification Error
    
    SourceSettled --> Completed: Cross-Chain Complete
    
    RoutingFailed --> Reverting: Initiate Revert
    CallbackFailed --> Reverting: Initiate Revert
    SettlementFailed --> Reverting: Initiate Revert
    NotificationFailed --> ManualReconciliation: Alert Operators
    
    Reverting --> SourceRefunded: Unlock Source Funds
    
    SourceRefunded --> Aborted: Cross-Chain Aborted
    
    ManualReconciliation --> SourceSettled: Manual Fix
    ManualReconciliation --> Aborted: Cannot Reconcile
    
    Completed --> [*]
    Aborted --> [*]
    
    note right of ZetaProcessing
        ZetaChain Validation:
        - Message format
        - Source chain verification
        - Gas estimation
        - Route selection
    end note
    
    note right of CrossChainActive
        Synchronized State:
        - Source: Funds locked
        - Target: Escrow created
        - Both chains linked
        - Ready for settlement
    end note
    
    note right of Reverting
        Revert Scenarios:
        - Target chain failure
        - Callback timeout
        - Settlement error
        - Manual abort
    end note
```
