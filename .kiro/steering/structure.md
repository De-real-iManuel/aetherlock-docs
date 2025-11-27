# AetherLock - Project Structure

## Repository Type

This is a **documentation repository** for the AetherLock Protocol, built with Mintlify. It contains comprehensive technical documentation, not the implementation code.

## Folder Structure

```
/
├── api/                    # API reference documentation
│   ├── chainlink-functions.mdx
│   ├── rest-api.mdx
│   ├── smart-contracts.mdx
│   └── websocket-api.mdx
│
├── design/                 # Technical design documents
│   ├── ai-agent.mdx
│   ├── architecture.mdx
│   ├── data-models.mdx
│   ├── deployment-architecture.mdx
│   ├── error-handling.mdx
│   ├── frontend-design.mdx
│   ├── overview.mdx
│   ├── potv-mechanism.mdx
│   ├── security-considerations.mdx
│   ├── solana-escrow-contract.mdx
│   ├── somnia-integration.mdx
│   ├── testing-strategy.mdx
│   ├── zetachain-integration.mdx
│   └── zkme-integration.mdx
│
├── diagrams/               # Architecture and sequence diagrams
│   ├── architecture-diagrams.md
│   ├── sequence-diagrams.md
│   └── state-diagrams.md
│
├── guides/                 # User guides and tutorials
│   ├── creating-escrow.mdx
│   ├── kyc-verification.mdx
│   ├── submitting-evidence.mdx
│   ├── understanding-verification.mdx
│   └── wallet-connection.mdx
│
├── implementation/         # Implementation and deployment guides
│   ├── backend-setup.mdx
│   ├── environment-variables.mdx
│   ├── frontend-setup.mdx
│   ├── plan.mdx
│   ├── quick-start.mdx
│   ├── solana-deployment.mdx
│   ├── somnia-deployment.mdx
│   ├── troubleshooting.mdx
│   └── zetachain-deployment.mdx
│
├── requirements/           # Product requirements documentation
│   ├── ai-powered-verification.mdx
│   ├── dispute-resolution.mdx
│   ├── escrow-creation-and-fund-management.mdx
│   ├── evidence-storage.mdx
│   ├── frontend-dashboard.mdx
│   └── zero-knowledge-kyc.mdx
│
├── security/               # Security documentation
│   ├── access-controls.mdx
│   ├── cryptographic-proofs.mdx
│   ├── key-management.mdx
│   └── replay-protection.mdx
│
├── assets/                 # Images, logos, videos
│   ├── aetherlock-logo.png
│   ├── demo-video.mp4
│   └── ...
│
├── mint.json               # Mintlify configuration (navigation, theme)
├── package.json            # NPM scripts for validation
├── index.mdx               # Homepage
├── introduction.mdx        # Introduction page
├── how-it-works.mdx        # How it works explanation
├── glossary.mdx            # Terminology glossary
├── technical-architecture.mdx  # Technical architecture overview
├── potv-consensus.mdx      # PoTV consensus mechanism
├── potv-technical-specification.mdx  # PoTV technical spec
├── business-model.mdx      # Business model documentation
├── hackathon.mdx           # Hackathon submission info
└── README.md               # Repository overview
```

## Documentation Organization

### Core Documentation
- **index.mdx**: Landing page with protocol abstract and specifications
- **introduction.mdx**: Detailed introduction to the protocol
- **technical-architecture.mdx**: System architecture and component details
- **how-it-works.mdx**: Step-by-step protocol execution flow

### Specialized Sections
- **PoTV Documentation**: `potv-consensus.mdx` and `potv-technical-specification.mdx` detail the Proof-of-Task Verification mechanism
- **Integration Guides**: `design/` folder contains integration documentation for zkMe, ZetaChain, Somnia, and AI services
- **API Reference**: `api/` folder documents REST, WebSocket, smart contract, and Chainlink APIs

### Validation Scripts
- `validate-docs.js`: Validates documentation structure and Mermaid diagrams
- `validate-mermaid.js`: Validates Mermaid diagram syntax
- `validate-ai-architecture-properties.js`: Validates AI architecture properties
- `validate-code-examples.js`: Validates code examples in documentation

## Navigation Structure

Navigation is defined in `mint.json` with the following groups:
1. Getting Started
2. AWS Global Vibe 2025 (Hackathon)
3. Requirements
4. Technical Design
5. PoTV Consensus
6. Smart Contracts
7. Integrations
8. Security & Quality
9. API Reference
10. Implementation Guides
11. User Guides
12. Security Documentation

## Content Conventions

- All documentation files use `.mdx` format (Markdown with JSX)
- Frontmatter includes `title` and `description` fields
- Mermaid diagrams embedded for architecture visualization
- Code examples in TypeScript, Rust, and Solidity
- Cross-references use relative paths
