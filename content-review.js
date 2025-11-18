#!/usr/bin/env node

/**
 * Manual Content Review Script
 * Checks acceptance criteria coverage, terminology consistency, 
 * placeholder formatting, and readability
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

class ContentReview {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.mdxFiles = [];
    this.glossaryTerms = new Set();
    this.findings = {
      acceptanceCriteria: [],
      terminology: [],
      placeholders: [],
      readability: [],
    };
  }

  findMdxFiles(dir = this.rootDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        this.findMdxFiles(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        this.mdxFiles.push(fullPath);
      }
    }
  }

  loadGlossary() {
    const glossaryPath = path.join(this.rootDir, 'glossary.mdx');
    if (!fs.existsSync(glossaryPath)) {
      console.log(`${colors.yellow}Warning: glossary.mdx not found${colors.reset}`);
      return;
    }

    const content = fs.readFileSync(glossaryPath, 'utf-8');
    const termRegex = /\*\*([^*]+)\*\*:/g;
    let match;
    
    while ((match = termRegex.exec(content)) !== null) {
      this.glossaryTerms.add(match[1].toLowerCase());
    }

    console.log(`${colors.green}✓ Loaded ${this.glossaryTerms.size} glossary terms${colors.reset}\n`);
  }

  checkAcceptanceCriteria() {
    console.log(`${colors.blue}Checking acceptance criteria coverage...${colors.reset}`);

    // Define acceptance criteria from requirements
    const criteria = {
      'Requirement 1': {
        '1.1': 'Complete architecture diagrams',
        '1.2': 'Production-ready code snippets',
        '1.3': 'PoTv mechanism explanation',
        '1.4': 'Integration points documentation',
        '1.5': 'Deployment instructions',
      },
      'Requirement 2': {
        '2.1': 'REST API documentation',
        '2.2': 'Smart contract interfaces',
        '2.3': 'Cross-chain integration patterns',
        '2.4': 'AWS Bedrock integration',
        '2.5': 'Testing frameworks',
      },
      'Requirement 3': {
        '3.1': '10% revenue structure',
        '3.2': 'Market analysis',
        '3.3': 'Scaling economics',
        '3.4': 'zkMe partnership',
        '3.5': 'Traction metrics',
      },
      'Requirement 4': {
        '4.1': 'Multi-chain wallet connection',
        '4.2': 'zkMe KYC process',
        '4.3': 'Escrow creation guide',
        '4.4': 'Evidence submission',
        '4.5': 'Verification results',
      },
      'Requirement 5': {
        '5.1': 'Ed25519 signatures',
        '5.2': 'Access controls',
        '5.3': 'Replay protection',
        '5.4': 'Key management',
        '5.5': 'Zero-knowledge proofs',
      },
      'Requirement 6': {
        '6.1': 'Solana deployment',
        '6.2': 'ZetaChain deployment',
        '6.3': 'Backend deployment',
        '6.4': 'Monitoring setup',
        '6.5': 'Troubleshooting guide',
      },
      'Requirement 7': {
        '7.1': 'Hierarchical structure',
        '7.2': 'Syntax highlighting',
        '7.3': 'Mermaid diagrams',
        '7.4': 'Placeholder formatting',
        '7.5': 'Version history',
      },
      'Requirement 8': {
        '8.1': 'Compelling overview',
        '8.2': 'Demo videos',
        '8.3': 'Feature highlights',
        '8.4': 'Comparison tables',
        '8.5': 'Clear CTAs',
      },
    };

    // Check for key content indicators
    const contentChecks = {
      'architecture diagrams': ['design/architecture.mdx', 'technical-architecture.mdx'],
      'PoTv mechanism': ['design/potv-mechanism.mdx'],
      'REST API': ['api/rest-api.mdx'],
      'smart contracts': ['api/smart-contracts.mdx', 'design/solana-escrow-contract.mdx'],
      'AWS Bedrock': ['design/ai-agent.mdx'],
      'business model': ['business-model.mdx'],
      'market analysis': ['market-analysis.mdx'],
      'zkMe partnership': ['partners.mdx', 'design/zkme-integration.mdx'],
      'wallet connection': ['guides/wallet-connection.mdx'],
      'KYC verification': ['guides/kyc-verification.mdx'],
      'escrow creation': ['guides/creating-escrow.mdx'],
      'evidence submission': ['guides/submitting-evidence.mdx'],
      'security documentation': ['security/cryptographic-proofs.mdx', 'security/access-controls.mdx'],
      'deployment guides': ['implementation/solana-deployment.mdx', 'implementation/zetachain-deployment.mdx'],
      'troubleshooting': ['implementation/troubleshooting.mdx'],
    };

    let covered = 0;
    let missing = 0;

    for (const [topic, files] of Object.entries(contentChecks)) {
      const exists = files.some(file => {
        const fullPath = path.join(this.rootDir, file);
        return fs.existsSync(fullPath);
      });

      if (exists) {
        covered++;
        console.log(`  ${colors.green}✓${colors.reset} ${topic}`);
      } else {
        missing++;
        console.log(`  ${colors.red}✗${colors.reset} ${topic} - Missing: ${files.join(', ')}`);
        this.findings.acceptanceCriteria.push(`Missing: ${topic}`);
      }
    }

    console.log(`\n  Coverage: ${covered}/${covered + missing} topics documented\n`);
  }

  checkTerminologyConsistency() {
    console.log(`${colors.blue}Checking terminology consistency...${colors.reset}`);

    // Key terms that should be consistent
    const keyTerms = [
      { correct: 'AetherLock', variations: ['aetherlock', 'Aetherlock', 'AETHERLOCK'] },
      { correct: 'PoTv', variations: ['POTV', 'potv', 'Potv'] },
      { correct: 'ZetaChain', variations: ['Zetachain', 'zetachain', 'ZETACHAIN'] },
      { correct: 'zkMe', variations: ['ZkMe', 'ZKME', 'zkme'] },
      { correct: 'AWS Bedrock', variations: ['aws bedrock', 'Bedrock', 'AWS bedrock'] },
      { correct: 'Solana', variations: ['solana', 'SOLANA'] },
      { correct: 'IPFS', variations: ['ipfs', 'Ipfs'] },
    ];

    let inconsistencies = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      for (const term of keyTerms) {
        for (const variation of term.variations) {
          // Skip if it's in a code block
          const codeBlockRegex = /```[\s\S]*?```/g;
          const contentWithoutCode = content.replace(codeBlockRegex, '');

          if (contentWithoutCode.includes(variation)) {
            inconsistencies++;
            console.log(`  ${colors.yellow}⚠${colors.reset} ${relativePath}: Found "${variation}" (should be "${term.correct}")`);
            this.findings.terminology.push(`${relativePath}: "${variation}" → "${term.correct}"`);
          }
        }
      }
    }

    if (inconsistencies === 0) {
      console.log(`  ${colors.green}✓ No terminology inconsistencies found${colors.reset}\n`);
    } else {
      console.log(`  ${colors.yellow}Found ${inconsistencies} terminology inconsistencies${colors.reset}\n`);
    }
  }

  checkPlaceholderFormatting() {
    console.log(`${colors.blue}Checking placeholder formatting...${colors.reset}`);

    const placeholderPatterns = [
      { pattern: /<[A-Z_]+>/, format: '<PLACEHOLDER>', example: '<YOUR_API_KEY>' },
      { pattern: /\[YOUR_[A-Z_]+\]/, format: '[YOUR_PLACEHOLDER]', example: '[YOUR_API_KEY]' },
      { pattern: /YOUR_[A-Z_]+/, format: 'YOUR_PLACEHOLDER', example: 'YOUR_API_KEY' },
    ];

    let wellFormatted = 0;
    let poorlyFormatted = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      // Find all potential placeholders
      const allPlaceholders = content.match(/[A-Z_]{5,}|<[A-Z_]+>|\[YOUR_[A-Z_]+\]/g) || [];

      for (const placeholder of allPlaceholders) {
        // Check if it matches a standard format
        const matchesStandard = placeholderPatterns.some(p => p.pattern.test(placeholder));

        if (matchesStandard) {
          wellFormatted++;
        } else if (placeholder.length > 4 && placeholder === placeholder.toUpperCase()) {
          // Might be a poorly formatted placeholder
          poorlyFormatted++;
          console.log(`  ${colors.yellow}⚠${colors.reset} ${relativePath}: Possible unformatted placeholder: ${placeholder}`);
          this.findings.placeholders.push(`${relativePath}: ${placeholder}`);
        }
      }
    }

    console.log(`  ${colors.green}✓ ${wellFormatted} well-formatted placeholders${colors.reset}`);
    if (poorlyFormatted > 0) {
      console.log(`  ${colors.yellow}⚠ ${poorlyFormatted} potentially poorly formatted placeholders${colors.reset}`);
    }
    console.log('');
  }

  checkReadability() {
    console.log(`${colors.blue}Checking readability...${colors.reset}`);

    let issues = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      // Check for very long paragraphs (> 500 words without break)
      const paragraphs = content.split(/\n\n+/);
      for (const para of paragraphs) {
        const wordCount = para.split(/\s+/).length;
        if (wordCount > 500 && !para.includes('```')) {
          issues++;
          console.log(`  ${colors.yellow}⚠${colors.reset} ${relativePath}: Very long paragraph (${wordCount} words)`);
          this.findings.readability.push(`${relativePath}: Long paragraph (${wordCount} words)`);
        }
      }

      // Check for missing section breaks in long files
      const lines = content.split('\n');
      if (lines.length > 500) {
        const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
        if (headingCount < 5) {
          issues++;
          console.log(`  ${colors.yellow}⚠${colors.reset} ${relativePath}: Long file (${lines.length} lines) with few headings (${headingCount})`);
          this.findings.readability.push(`${relativePath}: Needs more section breaks`);
        }
      }
    }

    if (issues === 0) {
      console.log(`  ${colors.green}✓ No major readability issues found${colors.reset}\n`);
    } else {
      console.log(`  ${colors.yellow}Found ${issues} readability issues${colors.reset}\n`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.cyan}CONTENT REVIEW SUMMARY${colors.reset}`);
    console.log('='.repeat(80) + '\n');

    console.log(`${colors.magenta}Files Reviewed:${colors.reset} ${this.mdxFiles.length}`);
    console.log(`${colors.magenta}Glossary Terms:${colors.reset} ${this.glossaryTerms.size}\n`);

    if (this.findings.acceptanceCriteria.length > 0) {
      console.log(`${colors.red}Acceptance Criteria Issues: ${this.findings.acceptanceCriteria.length}${colors.reset}`);
      this.findings.acceptanceCriteria.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    if (this.findings.terminology.length > 0) {
      console.log(`${colors.yellow}Terminology Issues: ${this.findings.terminology.length}${colors.reset}`);
      this.findings.terminology.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
      if (this.findings.terminology.length > 10) {
        console.log(`  ... and ${this.findings.terminology.length - 10} more`);
      }
      console.log('');
    }

    if (this.findings.placeholders.length > 0) {
      console.log(`${colors.yellow}Placeholder Issues: ${this.findings.placeholders.length}${colors.reset}`);
      this.findings.placeholders.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
      if (this.findings.placeholders.length > 10) {
        console.log(`  ... and ${this.findings.placeholders.length - 10} more`);
      }
      console.log('');
    }

    if (this.findings.readability.length > 0) {
      console.log(`${colors.yellow}Readability Issues: ${this.findings.readability.length}${colors.reset}`);
      this.findings.readability.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    const totalIssues = 
      this.findings.acceptanceCriteria.length +
      this.findings.terminology.length +
      this.findings.placeholders.length +
      this.findings.readability.length;

    console.log('='.repeat(80));
    if (totalIssues === 0) {
      console.log(`${colors.green}✓ Content review passed with no critical issues!${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Found ${totalIssues} issues requiring attention${colors.reset}`);
    }
    console.log('='.repeat(80) + '\n');

    return totalIssues === 0;
  }

  async review() {
    console.log(`\n${colors.cyan}Starting manual content review...${colors.reset}\n`);
    
    this.findMdxFiles();
    this.loadGlossary();
    
    this.checkAcceptanceCriteria();
    this.checkTerminologyConsistency();
    this.checkPlaceholderFormatting();
    this.checkReadability();
    
    return this.generateReport();
  }
}

// Main execution
const rootDir = path.join(__dirname);
const reviewer = new ContentReview(rootDir);

reviewer.review().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(`${colors.red}Review failed with error:${colors.reset}`, error);
  process.exit(1);
});
