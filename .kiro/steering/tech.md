# AetherLock - Technical Stack

## Documentation Platform

This is a **Mintlify documentation site** - a static documentation platform with no build process required.

## Tech Stack

### Blockchain Layer
- **Solana**: Anchor framework (Rust) for primary escrow smart contracts (Devnet)
- **ZetaChain**: Universal Apps (Solidity) for omnichain messaging (Testnet)
- **Somnia**: Optional high-speed settlement contracts (Testnet)

### Backend Services
- **Runtime**: Node.js + TypeScript
- **API Framework**: Express
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis 7 with ioredis client
- **WebSocket**: Socket.io for real-time updates

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Wallet Integration**: Multi-chain adapters (Solflare, Slush, Tonkeeper, Sui Wallet)

### AI & Verification
- **AI Service**: Arcanum.ai (primary, no fallback implemented)
- **Identity**: zkMe SDK (integration in progress, mock flow currently)
- **Oracle**: Chainlink Functions (planned integration, not yet implemented)
- **Signatures**: Ed25519 for cryptographic verification

### Storage
- **Decentralized**: IPFS (basic implementation, no pinning service)
- **Content Addressing**: SHA-256 hashes for evidence integrity

## Common Commands

### Documentation
```bash
# Validate documentation structure and content
npm run validate

# Run content review checks
npm run review

# Run all validation checks
npm run check

# Finalize documentation before deployment
npm run finalize
```

### Development
```bash
# Local development (use Mintlify CLI)
mintlify dev

# No build needed - static site
npm run build  # (placeholder command)
```

## Architecture Patterns

### Smart Contract Patterns
- **Program Derived Addresses (PDAs)**: Deterministic account generation for escrow custody
- **State Machine**: Strict state transitions (Created → Funded → EvidenceSubmitted → Verified → Released/Refunded)
- **Fee Collection**: Automatic 10% treasury fee on fund release
- **Event Emission**: On-chain events for off-chain indexing

### Backend Patterns
- **API Gateway**: Express backend orchestrates business logic
- **Event-Driven**: Blockchain event monitoring with Redis queues
- **Single AI Provider**: Arcanum.ai (no fallback chain implemented)
- **Horizontal Scaling**: Load-balanced API servers with read replicas

### Security Patterns
- **Cryptographic Authentication**: Ed25519 signatures for AI results
- **Zero-Knowledge Proofs**: zkMe for privacy-preserving KYC
- **Access Control**: Role-based permissions with multi-signature for admin functions
- **Reentrancy Protection**: State changes before external calls

## File Organization

- `.mdx` files: Mintlify documentation pages with frontmatter
- `mint.json`: Mintlify configuration (navigation, theme, colors)
- `assets/`: Images, logos, and media files
- Mermaid diagrams embedded in documentation for architecture visualization
