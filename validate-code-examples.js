/**
 * Code Example Validation Script
 * Validates all code blocks in documentation for correct imports and dependencies
 */

const fs = require('fs');
const path = require('path');

// Validation results
const results = {
  totalFiles: 0,
  totalCodeBlocks: 0,
  issues: [],
  summary: {
    typescript: { total: 0, issues: 0 },
    javascript: { total: 0, issues: 0 },
    rust: { total: 0, issues: 0 },
    other: { total: 0, issues: 0 }
  }
};

// Patterns to check
const INVALID_PATTERNS = {
  awsImports: [
    /@aws-sdk\/client-bedrock-runtime/,
    /@aws-sdk\/client-bedrock/,
    /BedrockRuntimeClient/,
    /BedrockClient/
  ],
  awsEnvVars: [
    /AWS_ACCESS_KEY_ID(?!\s*\/\/.*alternative)/i,
    /AWS_SECRET_ACCESS_KEY(?!\s*\/\/.*alternative)/i,
    /AWS_REGION(?!\s*\/\/.*alternative)/i,
    /AWS_BEDROCK_(?!\s*\/\/.*alternative)/i
  ],
  awsEndpoints: [
    /bedrock-runtime\.[\w-]+\.amazonaws\.com/,
    /bedrock\.[\w-]+\.amazonaws\.com/
  ]
};

const REQUIRED_PATTERNS = {
  arcanumImports: /arcanum|ArcanumClient/i,
  arcanumEnvVars: /ARCANUM_API_KEY|ARCANUM_ENDPOINT/,
  arcanumEndpoints: /api\.arcanum\.ai/
};

/**
 * Extract code blocks from markdown content
 */
function extractCodeBlocks(content, filePath) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'unknown';
    const code = match[2];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    blocks.push({
      language,
      code,
      filePath,
      lineNumber
    });
  }

  return blocks;
}

/**
 * Validate TypeScript/JavaScript code block
 */
function validateTSJS(block) {
  const issues = [];

  // Check if this is explicitly marked as "NOT USED" or "exploration" code
  const isExplorationCode = /NOT USED|not used|exploration|prototype|initial|explored but/i.test(block.code);
  
  // Check for AWS SDK imports
  INVALID_PATTERNS.awsImports.forEach(pattern => {
    if (pattern.test(block.code) && !isExplorationCode) {
      issues.push({
        severity: 'error',
        message: `AWS Bedrock SDK import found: ${pattern}`,
        line: block.lineNumber,
        suggestion: 'Replace with Arcanum.ai SDK import or mark as exploration code'
      });
    }
  });

  // Check for AWS environment variables in primary code paths
  INVALID_PATTERNS.awsEnvVars.forEach(pattern => {
    if (pattern.test(block.code)) {
      // Check if it's in a comment or marked as alternative/S3/storage
      const lines = block.code.split('\n');
      lines.forEach((line, idx) => {
        if (pattern.test(line) && 
            !line.includes('alternative') && 
            !line.includes('optional') &&
            !line.includes('S3') &&
            !line.includes('storage') &&
            !line.includes('evidence storage')) {
          issues.push({
            severity: 'warning',
            message: `AWS environment variable found: ${line.trim()}`,
            line: block.lineNumber + idx,
            suggestion: 'Use ARCANUM_API_KEY or mark as alternative/S3 storage'
          });
        }
      });
    }
  });

  // Check for AWS endpoints
  INVALID_PATTERNS.awsEndpoints.forEach(pattern => {
    if (pattern.test(block.code) && !isExplorationCode) {
      issues.push({
        severity: 'error',
        message: `AWS Bedrock endpoint found`,
        line: block.lineNumber,
        suggestion: 'Replace with Arcanum.ai endpoint or mark as exploration code'
      });
    }
  });

  // If code mentions AI/verification, check for Arcanum.ai (skip exploration code)
  if (/AI|verification|analyze|provider/i.test(block.code) && !isExplorationCode) {
    const hasArcanum = REQUIRED_PATTERNS.arcanumImports.test(block.code) ||
                       REQUIRED_PATTERNS.arcanumEnvVars.test(block.code) ||
                       REQUIRED_PATTERNS.arcanumEndpoints.test(block.code);
    
    const hasAWS = INVALID_PATTERNS.awsImports.some(p => p.test(block.code)) ||
                   INVALID_PATTERNS.awsEndpoints.some(p => p.test(block.code));

    if (hasAWS && !hasArcanum) {
      issues.push({
        severity: 'error',
        message: 'AI-related code uses AWS Bedrock instead of Arcanum.ai',
        line: block.lineNumber,
        suggestion: 'Update to use Arcanum.ai as primary provider or mark as exploration code'
      });
    }
  }

  return issues;
}

/**
 * Validate Rust code block
 */
function validateRust(block) {
  const issues = [];

  // Check for AWS SDK dependencies
  if (/aws-sdk-bedrockruntime|aws-sdk-bedrock/.test(block.code)) {
    issues.push({
      severity: 'error',
      message: 'AWS Bedrock Rust dependency found',
      line: block.lineNumber,
      suggestion: 'Replace with Arcanum.ai Rust client'
    });
  }

  // Check for AWS environment variables
  INVALID_PATTERNS.awsEnvVars.forEach(pattern => {
    if (pattern.test(block.code)) {
      issues.push({
        severity: 'warning',
        message: 'AWS environment variable found in Rust code',
        line: block.lineNumber,
        suggestion: 'Use ARCANUM_API_KEY'
      });
    }
  });

  return issues;
}

/**
 * Validate a single code block
 */
function validateCodeBlock(block) {
  const lang = block.language.toLowerCase();

  if (lang === 'typescript' || lang === 'ts') {
    results.summary.typescript.total++;
    const issues = validateTSJS(block);
    if (issues.length > 0) {
      results.summary.typescript.issues += issues.length;
    }
    return issues;
  } else if (lang === 'javascript' || lang === 'js') {
    results.summary.javascript.total++;
    const issues = validateTSJS(block);
    if (issues.length > 0) {
      results.summary.javascript.issues += issues.length;
    }
    return issues;
  } else if (lang === 'rust' || lang === 'rs') {
    results.summary.rust.total++;
    const issues = validateRust(block);
    if (issues.length > 0) {
      results.summary.rust.issues += issues.length;
    }
    return issues;
  } else {
    results.summary.other.total++;
    return [];
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const codeBlocks = extractCodeBlocks(content, filePath);

    results.totalCodeBlocks += codeBlocks.length;

    codeBlocks.forEach(block => {
      const issues = validateCodeBlock(block);
      if (issues.length > 0) {
        results.issues.push({
          file: filePath,
          language: block.language,
          lineNumber: block.lineNumber,
          issues: issues
        });
      }
    });
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, etc.
      if (!file.startsWith('.') && file !== 'node_modules') {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Generate validation report
 */
function generateReport() {
  console.log('\n=== CODE EXAMPLE VALIDATION REPORT ===\n');
  console.log(`Total files scanned: ${results.totalFiles}`);
  console.log(`Total code blocks found: ${results.totalCodeBlocks}`);
  console.log(`\nCode blocks by language:`);
  console.log(`  TypeScript: ${results.summary.typescript.total} (${results.summary.typescript.issues} issues)`);
  console.log(`  JavaScript: ${results.summary.javascript.total} (${results.summary.javascript.issues} issues)`);
  console.log(`  Rust: ${results.summary.rust.total} (${results.summary.rust.issues} issues)`);
  console.log(`  Other: ${results.summary.other.total}`);

  const totalIssues = results.issues.length;
  console.log(`\nTotal issues found: ${totalIssues}`);

  if (totalIssues > 0) {
    console.log('\n=== ISSUES DETAIL ===\n');
    
    results.issues.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.file}:${item.lineNumber} (${item.language})`);
      item.issues.forEach(issue => {
        console.log(`   [${issue.severity.toUpperCase()}] ${issue.message}`);
        console.log(`   Suggestion: ${issue.suggestion}`);
      });
      console.log('');
    });
  } else {
    console.log('\n✓ All code examples are valid!');
  }

  // Write JSON report
  const reportPath = 'CODE-VALIDATION-REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report written to: ${reportPath}`);

  return totalIssues === 0;
}

/**
 * Main execution
 */
function main() {
  console.log('Starting code example validation...\n');

  const markdownFiles = findMarkdownFiles('.');
  results.totalFiles = markdownFiles.length;

  console.log(`Found ${markdownFiles.length} markdown files\n`);

  markdownFiles.forEach(file => {
    processFile(file);
  });

  const success = generateReport();
  process.exit(success ? 0 : 1);
}

// Run the script
main();
