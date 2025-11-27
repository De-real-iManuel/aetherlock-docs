# Requirements Document

## Introduction

This specification defines the requirements for a comprehensive refactor of the AetherLock Protocol documentation. The audit identified 74 critical issues across technical gaps, logical inconsistencies, unrealistic claims, missing components, and architecture misalignment. This refactor will transform the documentation from its current state (company-grade refactor required) to production-ready, investor-grade documentation that accurately represents implemented features while clearly delineating future roadmap items.

## Glossary

- **AetherLock Protocol**: A decentralized omnichain escrow protocol with AI-powered task verification
- **PoTV**: Proof-of-Task Verification - the core consensus mechanism
- **D-PoTV**: Digital Proof-of-Task Verification - for digital deliverables (IMPLEMENTED)
- **P-PoTV**: Physical Proof-of-Task Verification - for physical goods (CONCEPTUAL)
- **Documentation System**: The Mintlify-based documentation site
- **Audit Report**: The comprehensive technical audit identifying 74 issues
- **Implementation Status**: The actual state of features (implemented, testnet, conceptual, planned)
- **Steering Files**: Workspace-level guidance files in .kiro/steering/

## Requirements

### Requirement 1

**User Story:** As a documentation reader, I want accurate information about implemented features, so that I understand what AetherLock actually does versus what it plans to do.

#### Acceptance Criteria

1. WHEN a feature is described in the documentation THEN the Documentation System SHALL clearly indicate its implementation status (implemented, testnet, conceptual, or planned)
2. WHEN P-PoTV is mentioned THEN the Documentation System SHALL label it as "Future Roadmap" and not present it as a current feature
3. WHEN Chainlink oracle integration is referenced THEN the Documentation System SHALL clarify it as "Planned Integration" not current functionality
4. WHEN zkMe integration is discussed THEN the Documentation System SHALL indicate it is in "Partner Integration Progress" with mock flow currently
5. WHEN cross-chain functionality is described THEN the Documentation System SHALL specify "Testnet Only" status and not claim mainnet deployment

### Requirement 2

**User Story:** As a technical evaluator, I want consistent and validated performance metrics, so that I can accurately assess AetherLock's capabilities.

#### Acceptance Criteria

1. WHEN performance metrics are stated THEN the Documentation System SHALL use consistent values across all documentation files
2. WHEN verification time is mentioned THEN the Documentation System SHALL state "2.1s average for D-PoTV" consistently
3. WHEN accuracy claims are made THEN the Documentation System SHALL include validation status and remove unvalidated claims
4. WHEN uptime is referenced THEN the Documentation System SHALL remove "99.8% uptime" claim until validated
5. WHEN transaction throughput is stated THEN the Documentation System SHALL remove "1,200 TPS on Somnia" until load testing is completed

### Requirement 3

**User Story:** As an investor or judge, I want architecture diagrams that match the actual implementation, so that I can understand the real system design.

#### Acceptance Criteria

1. WHEN architecture diagrams are displayed THEN the Documentation System SHALL show only implemented components in the primary architecture
2. WHEN the PoTV flow is diagrammed THEN the Documentation System SHALL show "Evidence → AI → Smart Contract" without unimplemented oracle or ZK proof steps
3. WHEN cross-chain architecture is shown THEN the Documentation System SHALL separate "Current Architecture" from "Planned Architecture"
4. WHEN the AI verification pipeline is illustrated THEN the Documentation System SHALL show only Arcanum.ai integration without unimplemented fallback chain
5. WHEN evidence storage is diagrammed THEN the Documentation System SHALL show basic IPFS without unimplemented Pinata pinning service

### Requirement 4

**User Story:** As a documentation maintainer, I want a clear problem statement, so that readers understand the specific problem AetherLock solves.

#### Acceptance Criteria

1. WHEN the problem statement is presented THEN the Documentation System SHALL articulate the $1.5 trillion trust gap in freelance and e-commerce verification
2. WHEN digital task verification problems are described THEN the Documentation System SHALL cite specific pain points with data (7-14 day verification, 15-20% dispute rate)
3. WHEN physical delivery problems are discussed THEN the Documentation System SHALL explain limitations of existing courier tracking systems
4. WHEN blockchain limitations are addressed THEN the Documentation System SHALL explain why existing crypto escrow solutions fail at verification
5. WHEN the market opportunity is stated THEN the Documentation System SHALL provide validated market size data ($6.15T combined addressable market)

### Requirement 5

**User Story:** As a technical reader, I want accurate PoTV specifications, so that I understand how the verification mechanism actually works.

#### Acceptance Criteria

1. WHEN D-PoTV is specified THEN the Documentation System SHALL document the actual implementation with code examples
2. WHEN confidence scoring is explained THEN the Documentation System SHALL provide the actual formula and decision thresholds
3. WHEN limitations are discussed THEN the Documentation System SHALL list all current limitations (no plagiarism detection, no multi-file analysis, etc.)
4. WHEN edge cases are documented THEN the Documentation System SHALL describe failure modes and handling
5. WHEN P-PoTV is mentioned THEN the Documentation System SHALL clearly label it as "Future Roadmap" with conceptual architecture only

### Requirement 6

**User Story:** As a developer integrating with AetherLock, I want accurate API documentation, so that I can build integrations successfully.

#### Acceptance Criteria

1. WHEN API endpoints are documented THEN the Documentation System SHALL include only implemented endpoints with accurate request/response schemas
2. WHEN smart contract methods are listed THEN the Documentation System SHALL provide actual Anchor program method signatures
3. WHEN WebSocket events are described THEN the Documentation System SHALL document only implemented event types
4. WHEN Chainlink Functions are referenced THEN the Documentation System SHALL move to "Planned Integrations" section
5. WHEN authentication is documented THEN the Documentation System SHALL describe the actual authentication mechanism implemented

### Requirement 7

**User Story:** As a documentation reader, I want consistent terminology and fee structures, so that I am not confused by contradictions.

#### Acceptance Criteria

1. WHEN the platform fee is mentioned THEN the Documentation System SHALL consistently state "10% platform fee" with breakdown (7% treasury + 2% AI + 1% network)
2. WHEN AI providers are discussed THEN the Documentation System SHALL clarify Arcanum.ai is the current provider without contradictory statements about AWS Bedrock
3. WHEN deployment status is referenced THEN the Documentation System SHALL consistently state "Devnet/Testnet" without mainnet claims
4. WHEN transaction volumes are cited THEN the Documentation System SHALL ensure all metrics are internally consistent
5. WHEN technical terms are used THEN the Documentation System SHALL use definitions from the glossary consistently

### Requirement 8

**User Story:** As a project stakeholder, I want unnecessary files removed, so that the documentation repository is clean and maintainable.

#### Acceptance Criteria

1. WHEN the refactor is complete THEN the Documentation System SHALL remove all duplicate backup files from .backup/ directory
2. WHEN validation reports are reviewed THEN the Documentation System SHALL remove temporary validation report files (CODE-VALIDATION-REPORT.json, MERMAID-VALIDATION-REPORT.json, etc.)
3. WHEN completion summaries are assessed THEN the Documentation System SHALL remove task completion summary files (TASK-1-COMPLETION-SUMMARY.md, etc.)
4. WHEN transformation artifacts are evaluated THEN the Documentation System SHALL remove intermediate transformation files (transform-documentation.js, finalize-docs.js, etc.)
5. WHEN the repository is cleaned THEN the Documentation System SHALL retain only essential documentation files and validation scripts

### Requirement 9

**User Story:** As a documentation maintainer, I want updated steering files, so that future AI assistance is guided by accurate project information.

#### Acceptance Criteria

1. WHEN steering files are updated THEN the Documentation System SHALL revise product.md to reflect actual implementation status
2. WHEN technical stack is documented THEN the Documentation System SHALL update tech.md to remove unimplemented components
3. WHEN project structure is described THEN the Documentation System SHALL ensure structure.md matches the cleaned repository
4. WHEN performance metrics are referenced in steering THEN the Documentation System SHALL update to validated metrics only
5. WHEN deployment status is mentioned in steering THEN the Documentation System SHALL clarify devnet/testnet status

### Requirement 10

**User Story:** As a hackathon judge or investor, I want a clear roadmap, so that I understand the project's development trajectory.

#### Acceptance Criteria

1. WHEN the roadmap is presented THEN the Documentation System SHALL separate "Phase 1: MVP (Current)" from future phases
2. WHEN Phase 2 features are listed THEN the Documentation System SHALL include production-ready features (AI fallback, Chainlink oracle, zkMe SDK, mainnet deployment)
3. WHEN Phase 3 features are described THEN the Documentation System SHALL detail omnichain expansion (ZetaChain, TON, Sui, Somnia)
4. WHEN Phase 4 features are outlined THEN the Documentation System SHALL specify P-PoTV implementation (GPS, image matching, tamper detection)
5. WHEN timeline estimates are provided THEN the Documentation System SHALL include realistic development time estimates for each phase
