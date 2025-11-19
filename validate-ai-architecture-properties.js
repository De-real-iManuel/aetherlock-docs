#!/usr/bin/env node

/**
 * AI Architecture Correction Property-Based Validation Script
 * Validates all 13 correctness properties from the design document
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

class PropertyValidationReport {
  constructor() {
    this.properties = [];
    this.totalFiles = 0;
    this.totalIssues = 0;
  }

  addProperty(propertyNumber, name, passed, issues = [], filesChecked = 0) {
    this.properties.push({
      propertyNumber,
      name,
      passed,
      issues,
      filesChecked
    });
    this.totalIssues += issues.length;
  }

  print() {
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.cyan}AI ARCHITECTURE CORRECTION - PROPERTY VALIDATION REPORT${colors.reset}`);
    console.log('='.repeat(80) + '\n');

    this.properties.forEach(prop => {
      const status = prop.passed ? `${colors.green}✓ PASSED${colors.reset}` : `${colors.red}✗ FAILED${colors.reset}`;
      console.log(`Property ${prop.propertyNumber}: ${prop.name}`);
      console.log(`  Status: ${status}`);
      console.log(`  Files Checked: ${prop.filesChecked}`);
      
      if (prop.issues.length > 0) {
        console.log(`  Issues Found: ${prop.issues.length}`);
        prop.issues.forEach((issue, idx) => {
          console.log(`    ${idx + 1}. ${issue.file}:${issue.line || 'N/A'}`);
          console.log(`       ${issue.message}`);
        });
      }
      console.log('');
    });

    const passedCount = this.properties.filter(p => p.passed).length;
    const failedCount = this.properties.length - passedCount;

    console.log('='.repeat(80));
    console.log(`${colors.cyan}SUMMARY${colors.reset}`);
    console.log(`  Total Properties: ${this.properties.length}`);
    console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${failedCount}${colors.reset}`);
    console.log(`  Total Issues: ${this.totalIssues}`);
    console.log(`  Files Scanned: ${this.totalFiles}`);
    console.log('='.repeat(80) + '\n');

    return failedCount === 0;
  }

  toJSON() {
    return {
      timestamp: new Date().toISOString(),
      totalProperties: this.properties.length,
      passedProperties: this.properties.filter(p => p.passed).length,
      failedProperties: this.properties.filter(p => !p.passed).length,
      totalIssues: this.totalIssues,
      totalFiles: this.totalFiles,
      properties: this.properties
    };
  }
}

class AIArchitectureValidator {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.report = new PropertyValidationReport();
    this.allFiles = [];
    this.mdxFiles = [];
  }

  // Find all documentation files
  findDocumentationFiles(dir = this.rootDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules and .git
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }

      if (entry.isDirectory()) {
        this.findDocumentationFiles(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        this.allFiles.push(fullPath);
        this.mdxFiles.push(fullPath);
      }
    }
  }

  // Helper: Read file content
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      return '';
    }
  }

  // Helper: Get relative path
  getRelativePath(filePath) {
    return path.relative(this.rootDir, filePath);
  }

  // Property 1: Primary AI provider consistency
  validateProperty1() {
    console.log(`${colors.blue}Validating Property 1: Primary AI provider consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file mentions AI verification
      if (/AI\s+(verification|analysis|provider|powered)/i.test(content)) {
        filesChecked++;
        
        // Check if AWS Bedrock is mentioned as primary (not in comparison context)
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          // Skip if in comparison context
          if (/compar|alternative|vs|versus|instead of|explored|not used/i.test(line)) {
            return;
          }
          
          // Check for AWS Bedrock as primary
          if (/primary.*AWS Bedrock|AWS Bedrock.*primary|uses AWS Bedrock|powered by AWS Bedrock/i.test(line)) {
            issues.push({
              file: relativePath,
              line: idx + 1,
              message: 'AWS Bedrock identified as primary provider (should be Arcanum.ai)'
            });
          }
        });
      }
    }

    this.report.addProperty(1, 'Primary AI provider consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 2: Fallback chain ordering consistency
  validateProperty2() {
    console.log(`${colors.blue}Validating Property 2: Fallback chain ordering consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;
    const correctOrder = ['Arcanum.ai', 'OpenAI', 'Claude', 'Gemini'];

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file mentions fallback
      if (/fallback|backup.*provider|provider.*chain/i.test(content)) {
        filesChecked++;
        
        // Extract fallback chains (looking for arrow notation)
        const chainPattern = /([A-Za-z.]+)\s*→\s*([A-Za-z.]+)\s*→\s*([A-Za-z.]+)(?:\s*→\s*([A-Za-z.]+))?/g;
        let match;
        
        while ((match = chainPattern.exec(content)) !== null) {
          const providers = [match[1], match[2], match[3], match[4]].filter(Boolean).map(p => p.trim());
          
          // Check if order matches
          let orderCorrect = true;
          for (let i = 0; i < Math.min(providers.length, correctOrder.length); i++) {
            if (providers[i] !== correctOrder[i]) {
              orderCorrect = false;
              break;
            }
          }
          
          if (!orderCorrect) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            issues.push({
              file: relativePath,
              line: lineNumber,
              message: `Incorrect fallback order: ${providers.join(' → ')} (should be ${correctOrder.join(' → ')})`
            });
          }
        }
      }
    }

    this.report.addProperty(2, 'Fallback chain ordering consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 3: Code example API consistency
  validateProperty3() {
    console.log(`${colors.blue}Validating Property 3: Code example API consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Extract code blocks
      const codeBlockRegex = /```(?:typescript|javascript|ts|js)\n([\s\S]*?)```/g;
      let match;
      
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const code = match[1];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        // Skip if marked as exploration or not used
        if (/NOT USED|not used|exploration|prototype/i.test(code)) {
          continue;
        }
        
        filesChecked++;
        
        // Check for AWS Bedrock SDK imports
        if (/@aws-sdk\/client-bedrock|BedrockRuntimeClient|BedrockClient/i.test(code)) {
          issues.push({
            file: relativePath,
            line: lineNumber,
            message: 'Code example uses AWS Bedrock SDK (should use Arcanum.ai SDK)'
          });
        }
      }
    }

    this.report.addProperty(3, 'Code example API consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 4: Environment variable consistency
  validateProperty4() {
    console.log(`${colors.blue}Validating Property 4: Environment variable consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file mentions environment variables
      if (/environment.*variable|env.*var|\.env|configuration/i.test(content)) {
        filesChecked++;
        
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          // Skip if marked as alternative, optional, or for S3/storage
          if (/alternative|optional|S3|storage|evidence storage/i.test(line)) {
            return;
          }
          
          // Check for AWS_* variables as primary (not ARCANUM_*)
          if (/AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_BEDROCK_/i.test(line)) {
            // Check if ARCANUM_API_KEY is mentioned nearby (within 5 lines)
            const contextStart = Math.max(0, idx - 5);
            const contextEnd = Math.min(lines.length, idx + 5);
            const context = lines.slice(contextStart, contextEnd).join('\n');
            
            if (!/ARCANUM_API_KEY|ARCANUM_ENDPOINT/i.test(context)) {
              issues.push({
                file: relativePath,
                line: idx + 1,
                message: 'AWS environment variables without ARCANUM_* as primary'
              });
            }
          }
        });
      }
    }

    this.report.addProperty(4, 'Environment variable consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 5: API endpoint consistency
  validateProperty5() {
    console.log(`${colors.blue}Validating Property 5: API endpoint consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file mentions API endpoints
      if (/API.*endpoint|endpoint.*URL|api\..*\.com/i.test(content)) {
        filesChecked++;
        
        // Check for AWS Bedrock endpoints
        const bedrockEndpointPattern = /bedrock-runtime\.[\w-]+\.amazonaws\.com|bedrock\.[\w-]+\.amazonaws\.com/g;
        let match;
        
        while ((match = bedrockEndpointPattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          issues.push({
            file: relativePath,
            line: lineNumber,
            message: `AWS Bedrock endpoint found: ${match[0]} (should use Arcanum.ai endpoint)`
          });
        }
      }
    }

    this.report.addProperty(5, 'API endpoint consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 6: Fallback code priority consistency
  validateProperty6() {
    console.log(`${colors.blue}Validating Property 6: Fallback code priority consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Extract code blocks with fallback logic
      const codeBlockRegex = /```(?:typescript|javascript|ts|js)\n([\s\S]*?)```/g;
      let match;
      
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const code = match[1];
        
        if (/fallback|priority|provider.*order/i.test(code)) {
          filesChecked++;
          const lineNumber = content.substring(0, match.index).split('\n').length;
          
          // Check for priority array
          const priorityPattern = /priority.*\[([^\]]+)\]|providers.*\[([^\]]+)\]/i;
          const priorityMatch = code.match(priorityPattern);
          
          if (priorityMatch) {
            const providersStr = priorityMatch[1] || priorityMatch[2];
            // Check if order is correct (should start with Arcanum)
            if (!/arcanum/i.test(providersStr.split(',')[0])) {
              issues.push({
                file: relativePath,
                line: lineNumber,
                message: 'Fallback priority array does not start with Arcanum.ai'
              });
            }
          }
        }
      }
    }

    this.report.addProperty(6, 'Fallback code priority consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 7: PoTV flow completeness
  validateProperty7() {
    console.log(`${colors.blue}Validating Property 7: PoTV flow completeness...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;
    const requiredComponents = ['AI analysis', 'Zero-knowledge proof', 'Chainlink oracle', 'Smart contract'];

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file documents PoTV
      if (/PoTV|Proof-of-Task Verification/i.test(content)) {
        filesChecked++;
        
        // Check for all four components
        const missingComponents = [];
        
        if (!/AI\s+(analysis|verification|powered)/i.test(content)) {
          missingComponents.push('AI analysis');
        }
        if (!/zero-knowledge\s+proof|ZK\s+proof|zkMe/i.test(content)) {
          missingComponents.push('Zero-knowledge proof');
        }
        if (!/Chainlink\s+oracle|oracle\s+network/i.test(content)) {
          missingComponents.push('Chainlink oracle');
        }
        if (!/smart\s+contract|on-chain\s+verification/i.test(content)) {
          missingComponents.push('Smart contract');
        }
        
        if (missingComponents.length > 0) {
          issues.push({
            file: relativePath,
            line: 'N/A',
            message: `PoTV documentation missing components: ${missingComponents.join(', ')}`
          });
        }
      }
    }

    this.report.addProperty(7, 'PoTV flow completeness', issues.length === 0, issues, filesChecked);
  }

  // Property 8: Terminology capitalization consistency
  validateProperty8() {
    console.log(`${colors.blue}Validating Property 8: Terminology capitalization consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      if (/arcanum/i.test(content)) {
        filesChecked++;
        
        // Check for incorrect variations
        const incorrectVariations = [
          /\barcanum\b(?!\.ai)/gi,  // "arcanum" without ".ai"
          /\bARCANUM\b/g,            // "ARCANUM" all caps
          /\bArcanum\b(?!\.ai)/g     // "Arcanum" without ".ai"
        ];
        
        incorrectVariations.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            
            // Skip if in URL or code comment
            if (/https?:\/\/|\/\/|#/.test(line)) {
              continue;
            }
            
            issues.push({
              file: relativePath,
              line: lineNumber,
              message: `Incorrect capitalization: "${match[0]}" (should be "Arcanum.ai")`
            });
          }
        });
      }
    }

    this.report.addProperty(8, 'Terminology capitalization consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 9: PoTV terminology consistency
  validateProperty9() {
    console.log(`${colors.blue}Validating Property 9: PoTV terminology consistency...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      if (/proof.*task|PoT/i.test(content)) {
        filesChecked++;
        
        // Check for incorrect variations
        const incorrectVariations = [
          /\bPoTv\b/g,              // "PoTv" with lowercase v
          /\bPOTV\b/g,              // "POTV" all caps
          /\bProof of Task\b/g      // "Proof of Task" without hyphens
        ];
        
        incorrectVariations.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            issues.push({
              file: relativePath,
              line: lineNumber,
              message: `Incorrect terminology: "${match[0]}" (should be "PoTV" or "Proof-of-Task Verification")`
            });
          }
        });
      }
    }

    this.report.addProperty(9, 'PoTV terminology consistency', issues.length === 0, issues, filesChecked);
  }

  // Property 10: AWS Bedrock context restriction
  validateProperty10() {
    console.log(`${colors.blue}Validating Property 10: AWS Bedrock context restriction...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      if (/AWS Bedrock|Bedrock API/i.test(content)) {
        filesChecked++;
        
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (/AWS Bedrock|Bedrock API/i.test(line)) {
            // Check if in comparison context
            const contextStart = Math.max(0, idx - 3);
            const contextEnd = Math.min(lines.length, idx + 3);
            const context = lines.slice(contextStart, contextEnd).join('\n');
            
            const isComparisonContext = /compar|alternative|vs|versus|instead of|chose|selected|why|explored|not used|over AWS/i.test(context);
            
            if (!isComparisonContext) {
              issues.push({
                file: relativePath,
                line: idx + 1,
                message: 'AWS Bedrock mentioned outside comparison/alternative context'
              });
            }
          }
        });
      }
    }

    this.report.addProperty(10, 'AWS Bedrock context restriction', issues.length === 0, issues, filesChecked);
  }

  // Property 11: Cost documentation accuracy
  validateProperty11() {
    console.log(`${colors.blue}Validating Property 11: Cost documentation accuracy...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file mentions costs or pricing
      if (/cost|pricing|price|per.*verification|\$0\./i.test(content)) {
        filesChecked++;
        
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          // Check for AWS Bedrock pricing in cost sections
          if (/\$0\.003|\$0\.015|per.*1K.*token/i.test(line)) {
            // Check if this is in a comparison context
            const contextStart = Math.max(0, idx - 3);
            const contextEnd = Math.min(lines.length, idx + 3);
            const context = lines.slice(contextStart, contextEnd).join('\n');
            
            if (!/compar|alternative|vs|versus|AWS Bedrock/i.test(context)) {
              issues.push({
                file: relativePath,
                line: idx + 1,
                message: 'AWS Bedrock pricing mentioned without comparison context'
              });
            }
          }
          
          // Check if Arcanum.ai pricing is mentioned in cost sections
          if (/cost|pricing/i.test(line) && !/Arcanum\.ai|\$0\.05/i.test(content)) {
            // Only flag if this is a primary cost section
            if (/primary|main|actual|operational/i.test(line)) {
              issues.push({
                file: relativePath,
                line: idx + 1,
                message: 'Cost section does not reference Arcanum.ai pricing'
              });
            }
          }
        });
      }
    }

    this.report.addProperty(11, 'Cost documentation accuracy', issues.length === 0, issues, filesChecked);
  }

  // Property 12: Security documentation completeness
  validateProperty12() {
    console.log(`${colors.blue}Validating Property 12: Security documentation completeness...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;
    const requiredSecurityComponents = [
      { pattern: /cryptographic.*sign|sign.*result/i, name: 'Cryptographic signing' },
      { pattern: /zero-knowledge.*proof|ZK.*proof/i, name: 'Zero-knowledge proofs' },
      { pattern: /oracle.*decentrali|chainlink.*network/i, name: 'Oracle decentralization' },
      { pattern: /smart.*contract.*validat|on-chain.*validat/i, name: 'Smart contract validation' }
    ];

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file documents PoTV security
      if (/(PoTV|Proof-of-Task).*security|security.*PoTV/i.test(content)) {
        filesChecked++;
        
        const missingComponents = [];
        
        requiredSecurityComponents.forEach(component => {
          if (!component.pattern.test(content)) {
            missingComponents.push(component.name);
          }
        });
        
        if (missingComponents.length > 0) {
          issues.push({
            file: relativePath,
            line: 'N/A',
            message: `PoTV security documentation missing: ${missingComponents.join(', ')}`
          });
        }
      }
    }

    this.report.addProperty(12, 'Security documentation completeness', issues.length === 0, issues, filesChecked);
  }

  // Property 13: Arcanum.ai rationale documentation
  validateProperty13() {
    console.log(`${colors.blue}Validating Property 13: Arcanum.ai rationale documentation...${colors.reset}`);
    
    const issues = [];
    let filesChecked = 0;

    for (const file of this.mdxFiles) {
      const content = this.readFile(file);
      const relativePath = this.getRelativePath(file);
      
      // Check if file compares AI providers
      if (/AWS Bedrock.*Arcanum\.ai|Arcanum\.ai.*AWS Bedrock/i.test(content)) {
        filesChecked++;
        
        // Check for rationale keywords
        const hasRationale = /why.*Arcanum|chose.*Arcanum|selected.*Arcanum|advantages.*Arcanum|benefits.*Arcanum|reason.*Arcanum/i.test(content);
        
        if (!hasRationale) {
          issues.push({
            file: relativePath,
            line: 'N/A',
            message: 'Provider comparison lacks rationale for choosing Arcanum.ai'
          });
        }
      }
    }

    this.report.addProperty(13, 'Arcanum.ai rationale documentation', issues.length === 0, issues, filesChecked);
  }

  // Run all property validations
  async validate() {
    console.log(`\n${colors.cyan}Starting AI Architecture Property Validation...${colors.reset}\n`);
    
    this.findDocumentationFiles();
    this.report.totalFiles = this.mdxFiles.length;
    console.log(`Found ${this.mdxFiles.length} documentation files\n`);

    // Validate all 13 properties
    this.validateProperty1();
    this.validateProperty2();
    this.validateProperty3();
    this.validateProperty4();
    this.validateProperty5();
    this.validateProperty6();
    this.validateProperty7();
    this.validateProperty8();
    this.validateProperty9();
    this.validateProperty10();
    this.validateProperty11();
    this.validateProperty12();
    this.validateProperty13();

    // Print report
    const success = this.report.print();

    // Save JSON report
    const reportPath = 'AI-ARCHITECTURE-VALIDATION-REPORT.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.report.toJSON(), null, 2));
    console.log(`${colors.cyan}Detailed report saved to: ${reportPath}${colors.reset}\n`);

    return success;
  }
}

// Main execution
const rootDir = path.join(__dirname);
const validator = new AIArchitectureValidator(rootDir);

validator.validate().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(`${colors.red}Validation failed with error:${colors.reset}`, error);
  process.exit(1);
});
