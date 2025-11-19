# Requirements Document

## Introduction

This specification defines the requirements for correcting the AI verification architecture documentation across the entire AetherLock workspace. The current documentation incorrectly identifies AWS Bedrock as the primary AI provider, when the actual architecture uses Arcanum.ai as primary with OpenAI, Claude, and Gemini as fallbacks. Additionally, the Proof-of-Task Verification (PoTV) consensus mechanism needs clearer explanation as a novel consensus proving human work completion.

## Glossary

- **Arcanum.ai**: Primary AI verification provider for AetherLock's task completion analysis
- **PoTV (Proof-of-Task Verification)**: Novel consensus mechanism developed by AetherLock Labs that proves humans actually completed work, analogous to how PoW proves math and PoS proves money
- **AI Fallback Chain**: Sequential backup AI providers (OpenAI → Claude → Gemini) used when primary provider fails
- **Zero-Knowledge Proof**: Cryptographic proof allowing verification without revealing underlying data
- **Chainlink**: Decentralized oracle network connecting smart contracts to external data and computation
- **AWS Bedrock**: Amazon's managed AI service (incorrectly documented as primary provider)

## Requirements

### Requirement 1

**User Story:** As a technical reader, I want accurate documentation of the AI verification architecture, so that I understand which AI providers are actually used in production.

#### Acceptance Criteria

1. WHEN I read AI verification documentation THEN the system SHALL identify Arcanum.ai as the primary AI provider
2. WHEN I review fallback mechanisms THEN the system SHALL document the correct fallback chain: Arcanum.ai → OpenAI → Claude → Gemini
3. WHEN I examine code examples THEN the system SHALL show Arcanum.ai integration code, not AWS Bedrock
4. WHEN I review environment variables THEN the system SHALL list ARCANUM_API_KEY and ARCANUM_ENDPOINT as primary configuration
5. WHEN I read API documentation THEN the system SHALL reference Arcanum.ai endpoints and response formats

### Requirement 2

**User Story:** As a developer integrating with AetherLock, I want correct AI provider configuration examples, so that I can implement the verification system accurately.

#### Acceptance Criteria

1. WHEN I review integration code THEN the system SHALL provide Arcanum.ai SDK usage examples
2. WHEN I examine fallback logic THEN the system SHALL show the correct provider priority order
3. WHEN I read deployment guides THEN the system SHALL include Arcanum.ai API key setup instructions
4. WHEN I review error handling THEN the system SHALL document Arcanum.ai-specific error codes and retry logic
5. WHEN I examine testing strategies THEN the system SHALL include Arcanum.ai mock services for local development

### Requirement 3

**User Story:** As a hackathon judge or investor, I want clear explanation of the PoTV consensus mechanism, so that I understand the innovation and how it differs from PoW and PoS.

#### Acceptance Criteria

1. WHEN I read about PoTV THEN the system SHALL explain it as proving human work completion, analogous to PoW proving math and PoS proving money
2. WHEN I review the consensus flow THEN the system SHALL document the complete chain: AI analysis → Zero-knowledge proof → Chainlink oracle → Smart contract verification
3. WHEN I examine innovation claims THEN the system SHALL clearly articulate that PoTV was developed by AetherLock Labs
4. WHEN I compare consensus mechanisms THEN the system SHALL provide a comparison table showing PoW vs PoS vs PoTV
5. WHEN I review technical architecture THEN the system SHALL show how PoTV integrates AI, ZK proofs, and blockchain

### Requirement 4

**User Story:** As a content maintainer, I want to identify all files containing incorrect AI provider references, so that I can systematically update the documentation.

#### Acceptance Criteria

1. WHEN I scan the workspace THEN the system SHALL identify all files mentioning "AWS Bedrock" or "Bedrock"
2. WHEN I review requirements documents THEN the system SHALL flag all acceptance criteria referencing AWS Bedrock
3. WHEN I examine design documents THEN the system SHALL identify all architecture diagrams showing AWS Bedrock
4. WHEN I check code examples THEN the system SHALL find all AWS SDK imports and Bedrock API calls
5. WHEN I review environment variable documentation THEN the system SHALL locate all AWS_* configuration references

### Requirement 5

**User Story:** As a technical writer, I want consistent terminology for the AI verification system, so that documentation is clear and professional.

#### Acceptance Criteria

1. WHEN I use AI provider names THEN the system SHALL use "Arcanum.ai" (with proper capitalization and domain)
2. WHEN I reference the consensus mechanism THEN the system SHALL use "PoTV" or "Proof-of-Task Verification" consistently
3. WHEN I describe the fallback chain THEN the system SHALL list providers in order: "Arcanum.ai → OpenAI → Claude → Gemini"
4. WHEN I mention AI infrastructure THEN the system SHALL avoid references to AWS Bedrock unless explicitly comparing alternatives
5. WHEN I update glossary terms THEN the system SHALL ensure all technical terms are defined accurately

### Requirement 6

**User Story:** As a security auditor, I want accurate documentation of the PoTV verification flow, so that I can assess the security properties of the consensus mechanism.

#### Acceptance Criteria

1. WHEN I review the verification flow THEN the system SHALL document how AI analysis results are cryptographically signed
2. WHEN I examine zero-knowledge proofs THEN the system SHALL explain how ZK proofs verify AI results without exposing evidence
3. WHEN I assess Chainlink integration THEN the system SHALL document how oracle networks provide decentralized verification
4. WHEN I review smart contract logic THEN the system SHALL show how on-chain verification validates the complete PoTV chain
5. WHEN I evaluate security properties THEN the system SHALL document attack resistance and failure modes

### Requirement 7

**User Story:** As a business stakeholder, I want accurate cost documentation for AI infrastructure, so that I understand the actual operational expenses.

#### Acceptance Criteria

1. WHEN I review cost breakdowns THEN the system SHALL show Arcanum.ai pricing, not AWS Bedrock pricing
2. WHEN I examine infrastructure costs THEN the system SHALL document actual API costs per verification
3. WHEN I assess scalability economics THEN the system SHALL use correct provider pricing for volume calculations
4. WHEN I review revenue models THEN the system SHALL show accurate profit margins based on real AI costs
5. WHEN I compare alternatives THEN the system SHALL explain why Arcanum.ai was chosen over AWS Bedrock

### Requirement 8

**User Story:** As a partnership stakeholder, I want documentation to reflect actual technology partnerships, so that partnership claims are accurate and verifiable.

#### Acceptance Criteria

1. WHEN I review partner documentation THEN the system SHALL list Arcanum.ai as an AI technology partner
2. WHEN I examine integration partnerships THEN the system SHALL accurately represent zkMe, ZetaChain, Chainlink, and Arcanum.ai relationships
3. WHEN I read about technology stack THEN the system SHALL correctly identify all third-party services used
4. WHEN I review acknowledgments THEN the system SHALL credit Arcanum.ai for AI verification capabilities
5. WHEN I assess partnership benefits THEN the system SHALL explain advantages of Arcanum.ai integration
