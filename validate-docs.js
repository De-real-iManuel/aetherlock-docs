#!/usr/bin/env node

/**
 * Documentation Validation Script
 * Validates markdown files, links, Mermaid diagrams, and code examples
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class ValidationReport {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  addError(category, message) {
    this.errors.push({ category, message });
  }

  addWarning(category, message) {
    this.warnings.push({ category, message });
  }

  addPass(category, message) {
    this.passed.push({ category, message });
  }

  print() {
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.cyan}DOCUMENTATION VALIDATION REPORT${colors.reset}`);
    console.log('='.repeat(80) + '\n');

    if (this.passed.length > 0) {
      console.log(`${colors.green}✓ PASSED (${this.passed.length})${colors.reset}`);
      this.passed.forEach(p => console.log(`  ${colors.green}✓${colors.reset} ${p.category}: ${p.message}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}⚠ WARNINGS (${this.warnings.length})${colors.reset}`);
      this.warnings.forEach(w => console.log(`  ${colors.yellow}⚠${colors.reset} ${w.category}: ${w.message}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log(`${colors.red}✗ ERRORS (${this.errors.length})${colors.reset}`);
      this.errors.forEach(e => console.log(`  ${colors.red}✗${colors.reset} ${e.category}: ${e.message}`));
      console.log('');
    }

    console.log('='.repeat(80));
    console.log(`${colors.cyan}SUMMARY${colors.reset}`);
    console.log(`  Passed: ${colors.green}${this.passed.length}${colors.reset}`);
    console.log(`  Warnings: ${colors.yellow}${this.warnings.length}${colors.reset}`);
    console.log(`  Errors: ${colors.red}${this.errors.length}${colors.reset}`);
    console.log('='.repeat(80) + '\n');

    return this.errors.length === 0;
  }
}

class DocumentationValidator {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.report = new ValidationReport();
    this.mdxFiles = [];
    this.allLinks = new Set();
    this.allFiles = new Set();
  }

  // Find all MDX files
  findMdxFiles(dir = this.rootDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules and hidden directories
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        this.findMdxFiles(fullPath);
      } else if (entry.isFile()) {
        this.allFiles.add(fullPath);
        if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
          this.mdxFiles.push(fullPath);
        }
      }
    }
  }

  // Validate markdown structure
  validateMarkdownStructure() {
    console.log(`${colors.blue}Validating markdown structure...${colors.reset}`);
    
    let totalChecks = 0;
    let issues = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      // Check for code blocks with language identifiers
      const codeBlockRegex = /```(\w*)\n/g;
      let match;
      while ((match = codeBlockRegex.exec(content)) !== null) {
        totalChecks++;
        if (!match[1]) {
          this.report.addWarning('Code Block', `${relativePath}: Code block without language identifier at position ${match.index}`);
          issues++;
        }
      }

      // Check for proper heading hierarchy
      const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
      let prevLevel = 0;
      headings.forEach((heading, idx) => {
        totalChecks++;
        const level = heading.match(/^#+/)[0].length;
        if (level > prevLevel + 1 && prevLevel !== 0) {
          this.report.addWarning('Heading Hierarchy', `${relativePath}: Skipped heading level (${prevLevel} to ${level})`);
          issues++;
        }
        prevLevel = level;
      });
    }

    if (issues === 0) {
      this.report.addPass('Markdown Structure', `All ${totalChecks} structure checks passed`);
    }
  }

  // Validate internal links
  validateLinks() {
    console.log(`${colors.blue}Validating internal links...${colors.reset}`);
    
    let totalLinks = 0;
    let brokenLinks = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);
      const fileDir = path.dirname(file);

      // Find markdown links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        totalLinks++;

        // Skip external links and anchors
        if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('#')) {
          continue;
        }

        // Check if internal file link exists
        const linkedFile = path.resolve(fileDir, linkUrl.split('#')[0]);
        if (!fs.existsSync(linkedFile)) {
          this.report.addError('Broken Link', `${relativePath}: Link to "${linkUrl}" is broken`);
          brokenLinks++;
        }
      }
    }

    if (brokenLinks === 0) {
      this.report.addPass('Internal Links', `All ${totalLinks} internal links are valid`);
    }
  }

  // Validate Mermaid diagrams
  validateMermaidDiagrams() {
    console.log(`${colors.blue}Validating Mermaid diagrams...${colors.reset}`);
    
    let totalDiagrams = 0;
    let invalidDiagrams = 0;

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      // Find Mermaid code blocks
      const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
      let match;

      while ((match = mermaidRegex.exec(content)) !== null) {
        totalDiagrams++;
        const diagramCode = match[1];

        // Basic validation checks
        if (!diagramCode.trim()) {
          this.report.addError('Mermaid Diagram', `${relativePath}: Empty Mermaid diagram`);
          invalidDiagrams++;
          continue;
        }

        // Check for common diagram types
        const validTypes = ['graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'flowchart', 'gantt', 'pie'];
        const hasValidType = validTypes.some(type => diagramCode.trim().startsWith(type));
        
        if (!hasValidType) {
          this.report.addWarning('Mermaid Diagram', `${relativePath}: Diagram may have invalid type declaration`);
        }

        // Check for basic syntax issues
        if (diagramCode.includes('-->') && !diagramCode.match(/graph|flowchart/)) {
          this.report.addWarning('Mermaid Diagram', `${relativePath}: Arrow syntax may not match diagram type`);
        }
      }
    }

    if (invalidDiagrams === 0) {
      this.report.addPass('Mermaid Diagrams', `All ${totalDiagrams} Mermaid diagrams have valid structure`);
    }
  }

  // Validate code examples
  validateCodeExamples() {
    console.log(`${colors.blue}Validating code examples...${colors.reset}`);
    
    let totalExamples = 0;
    let issues = 0;

    const languagePatterns = {
      typescript: /\b(interface|type|const|let|var|function|class|import|export)\b/,
      javascript: /\b(const|let|var|function|class|import|export)\b/,
      rust: /\b(fn|let|mut|pub|struct|impl|use)\b/,
      solidity: /\b(contract|function|mapping|address|uint|pragma)\b/,
      bash: /\b(echo|cd|npm|yarn|cargo|anchor)\b/,
      json: /^\s*[{\[]/,
    };

    for (const file of this.mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.rootDir, file);

      // Find code blocks
      const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
      let match;

      while ((match = codeBlockRegex.exec(content)) !== null) {
        const language = match[1].toLowerCase();
        const code = match[2];
        totalExamples++;

        // Skip if no language specified
        if (!language) continue;

        // Check if code matches expected language patterns
        if (languagePatterns[language]) {
          if (!languagePatterns[language].test(code)) {
            this.report.addWarning('Code Example', `${relativePath}: ${language} code may not contain expected syntax`);
            issues++;
          }
        }

        // Check for placeholder patterns
        const placeholderRegex = /<[A-Z_]+>|\[YOUR_[A-Z_]+\]|YOUR_[A-Z_]+|PLACEHOLDER/g;
        const placeholders = code.match(placeholderRegex);
        if (placeholders && placeholders.length > 0) {
          // This is actually good - placeholders should be present
          // Just verify they're properly formatted
          placeholders.forEach(p => {
            if (!p.match(/^(<[A-Z_]+>|\[YOUR_[A-Z_]+\]|YOUR_[A-Z_]+)$/)) {
              this.report.addWarning('Placeholder', `${relativePath}: Inconsistent placeholder format: ${p}`);
            }
          });
        }
      }
    }

    if (issues === 0) {
      this.report.addPass('Code Examples', `All ${totalExamples} code examples validated`);
    }
  }

  // Validate glossary terms
  validateGlossaryTerms() {
    console.log(`${colors.blue}Validating glossary consistency...${colors.reset}`);
    
    const glossaryFile = path.join(this.rootDir, 'glossary.mdx');
    if (!fs.existsSync(glossaryFile)) {
      this.report.addWarning('Glossary', 'glossary.mdx not found');
      return;
    }

    const glossaryContent = fs.readFileSync(glossaryFile, 'utf-8');
    
    // Extract glossary terms (looking for **Term**: pattern)
    const termRegex = /\*\*([^*]+)\*\*:/g;
    const glossaryTerms = new Set();
    let match;
    
    while ((match = termRegex.exec(glossaryContent)) !== null) {
      glossaryTerms.add(match[1].toLowerCase());
    }

    this.report.addPass('Glossary', `Found ${glossaryTerms.size} terms in glossary`);
  }

  // Run all validations
  async validate() {
    console.log(`\n${colors.cyan}Starting documentation validation...${colors.reset}\n`);
    
    this.findMdxFiles();
    console.log(`Found ${this.mdxFiles.length} documentation files\n`);

    this.validateMarkdownStructure();
    this.validateLinks();
    this.validateMermaidDiagrams();
    this.validateCodeExamples();
    this.validateGlossaryTerms();

    return this.report.print();
  }
}

// Main execution
const rootDir = path.join(__dirname);
const validator = new DocumentationValidator(rootDir);

validator.validate().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(`${colors.red}Validation failed with error:${colors.reset}`, error);
  process.exit(1);
});
