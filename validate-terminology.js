#!/usr/bin/env node

/**
 * Terminology Consistency Validation Script
 * Validates technical terms against glossary definitions
 */

const fs = require('fs');
const path = require('path');

// Load glossary
const glossaryPath = 'glossary.mdx';
const glossaryTerms = {};

// Results storage
const results = {
  glossaryTerms: [],
  feeBreakdown: [],
  deploymentStatus: [],
  inconsistencies: [],
  errors: []
};

/**
 * Parse glossary file
 */
function parseGlossary() {
  try {
    const content = fs.readFileSync(glossaryPath, 'utf8');
    
    // Extract term definitions (format: **Term**: Definition)
    const termPattern = /\*\*([^*]+)\*\*:\s*([^\n]+)/g;
    let match;
    
    while ((match = termPattern.exec(content)) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      glossaryTerms[term] = definition;
    }
    
    console.log(`Loaded ${Object.keys(glossaryTerms).length} terms from glossary\n`);
  } catch (error) {
    console.error(`Error loading glossary: ${error.message}`);
  }
}

/**
 * Get all documentation files
 */
function getAllMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.backup', '.kiro'].includes(file)) {
        getAllMdxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      if (file !== 'glossary.mdx') {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Check fee breakdown consistency
 */
function checkFeeBreakdown(content, filePath) {
  // Look for fee breakdowns
  const patterns = [
    /(\d+)%\s*\+\s*(\d+)%\s*\+\s*(\d+)%/g,
    /(\d+)%\s+treasury.*?(\d+)%\s+AI.*?(\d+)%\s+network/gi,
    /treasury[:\s]+(\d+)%.*?AI[:\s]+(\d+)%.*?network[:\s]+(\d+)%/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const values = [match[1], match[2], match[3]];
      const isCorrect = values[0] === '7' && values[1] === '2' && values[2] === '1';
      
      results.feeBreakdown.push({
        file: filePath,
        found: `${values[0]}% + ${values[1]}% + ${values[2]}%`,
        expected: '7% + 2% + 1%',
        status: isCorrect ? 'PASS' : 'FAIL',
        context: match[0]
      });
    }
  });
}

/**
 * Check deployment status language uniformity
 */
function checkDeploymentStatusLanguage(content, filePath) {
  const statusTerms = {
    devnet: [],
    testnet: [],
    mainnet: [],
    production: []
  };
  
  // Find all deployment status mentions
  const patterns = {
    devnet: /devnet/gi,
    testnet: /testnet/gi,
    mainnet: /mainnet/gi,
    production: /production/gi
  };
  
  Object.keys(patterns).forEach(key => {
    let match;
    while ((match = patterns[key].exec(content)) !== null) {
      const context = content.substring(
        Math.max(0, match.index - 100),
        Math.min(content.length, match.index + 100)
      );
      
      // Check if it's a deployment status mention (not Docker, npm, etc.)
      const isDeploymentStatus = 
        context.toLowerCase().includes('deploy') ||
        context.toLowerCase().includes('network') ||
        context.toLowerCase().includes('chain') ||
        context.toLowerCase().includes('status');
      
      const isDockerOrNpm = 
        context.includes('npm ci --only=production') ||
        context.includes('NODE_ENV') ||
        context.includes('FROM node') ||
        context.includes('RUN npm') ||
        context.includes('docker') ||
        context.includes('Docker');
      
      if (isDeploymentStatus && !isDockerOrNpm) {
        statusTerms[key].push({
          file: filePath,
          term: match[0],
          context: context.trim()
        });
      }
    }
  });
  
  // Check for consistent language
  Object.keys(statusTerms).forEach(key => {
    if (statusTerms[key].length > 0) {
      results.deploymentStatus.push({
        term: key,
        occurrences: statusTerms[key].length,
        files: [...new Set(statusTerms[key].map(s => s.file))]
      });
    }
  });
}

/**
 * Check glossary term usage
 */
function checkGlossaryTermUsage(content, filePath) {
  Object.keys(glossaryTerms).forEach(term => {
    // Create case-insensitive pattern
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    if (pattern.test(content)) {
      results.glossaryTerms.push({
        file: filePath,
        term: term,
        status: 'FOUND'
      });
    }
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    checkFeeBreakdown(content, filePath);
    checkDeploymentStatusLanguage(content, filePath);
    checkGlossaryTermUsage(content, filePath);
    
  } catch (error) {
    results.errors.push({
      file: filePath,
      error: error.message
    });
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n=== TERMINOLOGY CONSISTENCY REPORT ===\n');
  
  // Fee Breakdown
  console.log('💰 FEE BREAKDOWN CONSISTENCY');
  console.log('─'.repeat(80));
  const feesPassed = results.feeBreakdown.filter(r => r.status === 'PASS').length;
  const feesTotal = results.feeBreakdown.length;
  console.log(`Status: ${feesPassed}/${feesTotal} checks passed\n`);
  
  results.feeBreakdown.forEach(result => {
    if (result.status === 'FAIL') {
      console.log(`❌ ${result.file}`);
      console.log(`   Found: ${result.found}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Context: ${result.context}`);
      console.log('');
    }
  });
  
  if (feesPassed === feesTotal && feesTotal > 0) {
    console.log('✅ All fee breakdowns are consistent (7% + 2% + 1% = 10%)\n');
  }
  
  // Deployment Status
  console.log('\n🚀 DEPLOYMENT STATUS LANGUAGE');
  console.log('─'.repeat(80));
  
  results.deploymentStatus.forEach(result => {
    console.log(`${result.term.toUpperCase()}: ${result.occurrences} occurrences`);
    console.log(`   Files: ${result.files.length} unique files`);
  });
  
  console.log('\n📝 Expected Usage:');
  console.log('   - "Devnet" for Solana development network');
  console.log('   - "Testnet" for ZetaChain and other test networks');
  console.log('   - "Mainnet" should only appear in "Future Roadmap" or "Planned" sections');
  console.log('   - "Production" should only appear in Docker/npm contexts or future plans\n');
  
  // Glossary Terms
  console.log('\n📚 GLOSSARY TERM USAGE');
  console.log('─'.repeat(80));
  
  const termUsage = {};
  results.glossaryTerms.forEach(result => {
    if (!termUsage[result.term]) {
      termUsage[result.term] = 0;
    }
    termUsage[result.term]++;
  });
  
  console.log(`Total glossary terms: ${Object.keys(glossaryTerms).length}`);
  console.log(`Terms found in documentation: ${Object.keys(termUsage).length}\n`);
  
  Object.keys(termUsage).sort().forEach(term => {
    console.log(`   ${term}: ${termUsage[term]} occurrences`);
  });
  
  // Unused terms
  const unusedTerms = Object.keys(glossaryTerms).filter(term => !termUsage[term]);
  if (unusedTerms.length > 0) {
    console.log('\n⚠️  Glossary terms not found in documentation:');
    unusedTerms.forEach(term => {
      console.log(`   - ${term}`);
    });
  }
  
  // Errors
  if (results.errors.length > 0) {
    console.log('\n❗ ERRORS');
    console.log('─'.repeat(80));
    results.errors.forEach(error => {
      console.log(`File: ${error.file}`);
      console.log(`Error: ${error.error}\n`);
    });
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  console.log('─'.repeat(80));
  console.log(`Fee Breakdown Checks: ${feesPassed}/${feesTotal} passed`);
  console.log(`Deployment Status Terms: ${results.deploymentStatus.length} types found`);
  console.log(`Glossary Terms Used: ${Object.keys(termUsage).length}/${Object.keys(glossaryTerms).length}`);
  console.log(`Processing Errors: ${results.errors.length}`);
  
  if (feesPassed === feesTotal && results.errors.length === 0) {
    console.log('\n✅ Terminology validation passed!');
  } else {
    console.log('\n⚠️  Review issues above for terminology consistency.');
  }
  
  // Save detailed report
  const reportPath = 'TERMINOLOGY-CONSISTENCY-REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('Starting terminology consistency validation...\n');
  
  parseGlossary();
  
  const files = getAllMdxFiles('.');
  console.log(`Found ${files.length} documentation files to validate\n`);
  
  files.forEach(file => {
    processFile(file);
  });
  
  generateReport();
}

main();
