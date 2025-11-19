# Changelog

All notable changes to the AetherLock documentation will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-18

### Added
- Complete documentation structure with 57+ files
- Comprehensive architecture diagrams (16 Mermaid diagrams)
- API reference documentation (REST, WebSocket, Smart Contracts)
- Deployment guides for all components (Solana, ZetaChain, Somnia, Backend, Frontend)
- User guides for wallet connection, KYC, escrow creation, evidence submission
- Security documentation (cryptographic proofs, access controls, key management, replay protection)
- Business documentation (revenue model, market analysis, partnerships, traction)
- Requirements documentation (EARS-compliant requirements)
- Design documentation (PoTv mechanism, AI agent, zkMe integration)
- Implementation guides with environment variables and troubleshooting
- Glossary with 91 technical terms
- Hackathon submission documentation
- Amazon Q usage documentation

### Documentation Quality
- Automated validation scripts (validate-docs.js, content-review.js)
- Comprehensive validation reports
- Content review reports
- Cross-reference mapping
- Table of contents generation

### Technical Coverage
- Solana Anchor program documentation
- ZetaChain Universal App integration
- AWS Bedrock AI verification
- zkMe zero-knowledge KYC
- IPFS evidence storage
- Somnia settlement layer
- Multi-chain wallet support

### Validation Results
- 16 Mermaid diagrams validated
- 91 glossary terms defined
- 100% acceptance criteria coverage
- All 8 requirements documented

## [1.1.0] - 2025-11-19

### Changed
- **AI Provider Migration**: Migrated from AWS Bedrock to Arcanum.ai as primary AI verification provider
  - Updated all AI verification documentation to reference Arcanum.ai
  - Updated fallback chain to: Arcanum.ai → OpenAI → Claude → Gemini
  - Replaced AWS Bedrock SDK references with Arcanum.ai SDK in code examples
  - Updated environment variables from AWS_* to ARCANUM_API_KEY and ARCANUM_ENDPOINT
  - Updated API documentation with Arcanum.ai endpoints and response formats
  - Updated cost documentation to reflect Arcanum.ai pricing ($0.05 per verification)
  - Added rationale for Arcanum.ai selection (technical, cost, operational, and strategic advantages)

### Enhanced
- **PoTV Documentation**: Clarified Proof-of-Task Verification (PoTV) consensus mechanism
  - Added clear explanation: PoTV proves human work completion (analogous to PoW proving math, PoS proving money)
  - Documented complete PoTV flow: AI analysis → ZK proof → Chainlink oracle → Smart contract
  - Added PoW/PoS/PoTV comparison table
  - Attributed PoTV innovation to AetherLock Labs
  - Enhanced security documentation with attack resistance and failure modes

### Updated
- Requirements documentation (ai-powered-verification.mdx)
- Design documentation (ai-agent.mdx, potv-mechanism.mdx)
- API documentation (rest-api.mdx, chainlink-functions.mdx, smart-contracts.mdx, websocket-api.mdx)
- Implementation guides (backend-setup.mdx, environment-variables.mdx)
- Business documentation (business-model.mdx with updated AI costs)
- Partnership documentation (partners.mdx with Arcanum.ai partnership)
- Security documentation (key-management.mdx, cryptographic-proofs.mdx)
- Architecture diagrams (updated to show Arcanum.ai)
- User guides (understanding-verification.mdx)
- Glossary (added Arcanum.ai definition, enhanced PoTV definition)
- Introduction and overview pages (index.mdx, introduction.mdx, how-it-works.mdx, technical-architecture.mdx)

### Migration Notes
- AWS Bedrock references now only appear in comparison/alternative contexts
- All primary code paths use Arcanum.ai SDK
- Environment variable migration: AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY → ARCANUM_API_KEY
- API endpoint migration: bedrock-runtime.*.amazonaws.com → api.arcanum.ai
- Pricing migration: $0.003-$0.015 per 1K tokens → $0.05 per verification (flat rate)

## [Unreleased]
## [1.2.0] - 2025-11-19

### Added
- Comprehensive cross-reference mapping between documentation sections
- Enhanced table of contents with emojis and better organization
- Image optimization analysis and recommendations
- Documentation statistics section

### Changed
- Updated version numbers across all documentation
- Improved navigation structure in table of contents
- Enhanced documentation organization and discoverability

### Optimized
- Analyzed all images for size optimization
- Identified large images requiring compression
- Provided optimization recommendations and tools

### Documentation Quality
- Added cross-reference map (CROSS-REFERENCES.md)
- Updated table of contents with version 1.2.0
- Finalized all dates to 2025-11-19
- Improved section organization and hierarchy



### To Do
- Fix 49 broken internal links (absolute → relative paths)
- Add language identifiers to 217 code blocks
- Fix heading hierarchy issues in implementation guides
- Break up long paragraph in design/zetachain-integration.mdx
- Implement version history tracking system

---

For more details, see the [VALIDATION-REPORT.md](./VALIDATION-REPORT.md) and [CONTENT-REVIEW-REPORT.md](./CONTENT-REVIEW-REPORT.md).
