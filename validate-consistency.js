#!/usr/bin/env node

/**
 * Consistency Validation Script for AetherLock Documentation
 * Validates performance metrics, terminology, and deployment status consistency
 */

const fs = require('fs');
const path = require('path');

// Configuration
const EXPECTED_VALUES = {
  verificationTime: '2.1s',
  platformFee: '10%',
  feeBreakdown: ['7%', '2%', '1%'],
  aiProvider: 'Arcanum.ai',
  deploymentStatus: ['Devnet', 'Testnet'],
  invalidClaims: ['99.8% uptime', '94.2% accuracy', '100,000x faster', '1,200 TPS']
};

// Results storage
const results = {
  metrics: [],
  terminology: [],
  deployment: [],
  invalidClaims: [],
  errors: []
};

/**
 * Recursively get all .mdx files
 */
function getAllMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, and .backup directories
      if (!['node_modules', '.git', '.backup', '.kiro'].includes(file)) {
        getAllMdxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Check verification time consistency
 */
function checkVerificationTime(content, filePath) {
  const patterns = [
    /(\d+\.?\d*)\s*(seconds?|s|ms|milliseconds?)/gi,
    /verification\s+time[:\s]+([^\n]+)/gi,
    /(\d+\.?\d*)\s*s\s+(average|verification|D-PoTV)/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const context = content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + 100));
      
      // Check if it's related to D-PoTV verification
      if (context.toLowerCase().includes('potv') || 
          context.toLowerCase().includes('verification') ||
          context.toLowerCase().includes('average')) {
        
        const timeValue = match[0];
        const isCorrect = timeValue.includes('2.1') && timeValue.includes('s');
        
        results.metrics.push({
          file: filePath,
          type: 'Verification Time',
          value: timeValue.trim(),
          expected: EXPECTED_VALUES.verificationTime,
          status: isCorrect ? 'PASS' : 'FAIL',
          context: context.trim()
        });
      }
    }
  });
}

/**
 * Check platform fee consistency
 */
function checkPlatformFee(content, filePath) {
  const feePattern = /(\d+)%\s*(platform\s*)?fee/gi;
  
  let match;
  while ((match = feePattern.exec(content)) !== null) {
    const feeValue = match[1] + '%';
    const context = content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + 100));
    
    results.metrics.push({
      file: filePath,
      type: 'Platform Fee',
      value: feeValue,
      expected: EXPECTED_VALUES.platformFee,
      status: feeValue === EXPECTED_VALUES.platformFee ? 'PASS' : 'FAIL',
      context: context.trim()
    });
  }
  
  // Check fee breakdown
  const breakdownPattern = /(\d+)%\s*\+\s*(\d+)%\s*\+\s*(\d+)%/g;
  while ((match = breakdownPattern.exec(content)) !== null) {
    const breakdown = [match[1] + '%', match[2] + '%', match[3] + '%'];
    const isCorrect = breakdown[0] === '7%' && breakdown[1] === '2%' && breakdown[2] === '1%';
    
    results.metrics.push({
      file: filePath,
      type: 'Fee Breakdown',
      value: breakdown.join(' + '),
      expected: EXPECTED_VALUES.feeBreakdown.join(' + '),
      status: isCorrect ? 'PASS' : 'FAIL',
      context: match[0]
    });
  }
}

/**
 * Check AI provider consistency
 */
function checkAIProvider(content, filePath) {
  const aiProviders = ['Arcanum.ai', 'AWS Bedrock', 'OpenAI', 'Claude', 'Gemini'];
  
  aiProviders.forEach(provider => {
    const pattern = new RegExp(provider.replace('.', '\\.'), 'gi');
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      const context = content.substring(Math.max(0, match.index - 100), Math.min(content.length, match.index + 100));
      
      // Check if it's mentioned as current implementation
      const isCurrent = !context.toLowerCase().includes('planned') &&
                       !context.toLowerCase().includes('future') &&
                       !context.toLowerCase().includes('roadmap') &&
                       !context.toLowerCase().includes('fallback');
      
      if (isCurrent) {
        const isCorrect = provider === EXPECTED_VALUES.aiProvider;
        
        results.terminology.push({
          file: filePath,
          type: 'AI Provider (Current)',
          value: provider,
          expected: EXPECTED_VALUES.aiProvider,
          status: isCorrect ? 'PASS' : 'FAIL',
          context: context.trim()
        });
      }
    }
  });
}

/**
 * Check deployment status consistency
 */
function checkDeploymentStatus(content, filePath) {
  const deploymentPatterns = [
    /mainnet/gi,
    /devnet/gi,
    /testnet/gi,
    /production/gi
  ];
  
  deploymentPatterns.forEach(pattern => {
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      const context = content.substring(Math.max(0, match.index - 100), Math.min(content.length, match.index + 100));
      const value = match[0];
      
      // Check if claiming mainnet/production deployment
      const isMainnetClaim = (value.toLowerCase() === 'mainnet' || value.toLowerCase() === 'production') &&
                            !context.toLowerCase().includes('planned') &&
                            !context.toLowerCase().includes('future') &&
                            !context.toLowerCase().includes('not yet') &&
                            !context.toLowerCase().includes('roadmap');
      
      if (isMainnetClaim) {
        results.deployment.push({
          file: filePath,
          type: 'Deployment Status',
          value: value,
          expected: 'Devnet/Testnet only',
          status: 'FAIL',
          context: context.trim()
        });
      }
    }
  });
}

/**
 * Check for invalid claims that should be removed
 */
function checkInvalidClaims(content, filePath) {
  EXPECTED_VALUES.invalidClaims.forEach(claim => {
    const pattern = new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    if (pattern.test(content)) {
      const match = content.match(pattern);
      const index = content.indexOf(match[0]);
      const context = content.substring(Math.max(0, index - 50), Math.min(content.length, index + 100));
      
      results.invalidClaims.push({
        file: filePath,
        type: 'Invalid Claim',
        value: claim,
        expected: 'Should be removed or validated',
        status: 'FAIL',
        context: context.trim()
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
    
    checkVerificationTime(content, filePath);
    checkPlatformFee(content, filePath);
    checkAIProvider(content, filePath);
    checkDeploymentStatus(content, filePath);
    checkInvalidClaims(content, filePath);
    
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
  console.log('\n=== CONSISTENCY VALIDATION REPORT ===\n');
  
  // Metrics Summary
  console.log('📊 PERFORMANCE METRICS');
  console.log('─'.repeat(80));
  const metricsPassed = results.metrics.filter(r => r.status === 'PASS').length;
  const metricsTotal = results.metrics.length;
  console.log(`Status: ${metricsPassed}/${metricsTotal} checks passed\n`);
  
  results.metrics.forEach(result => {
    if (result.status === 'FAIL') {
      console.log(`❌ ${result.file}`);
      console.log(`   Type: ${result.type}`);
      console.log(`   Found: ${result.value}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Context: ${result.context.substring(0, 100)}...`);
      console.log('');
    }
  });
  
  // Terminology Summary
  console.log('\n📝 TERMINOLOGY CONSISTENCY');
  console.log('─'.repeat(80));
  const termsPassed = results.terminology.filter(r => r.status === 'PASS').length;
  const termsTotal = results.terminology.length;
  console.log(`Status: ${termsPassed}/${termsTotal} checks passed\n`);
  
  results.terminology.forEach(result => {
    if (result.status === 'FAIL') {
      console.log(`❌ ${result.file}`);
      console.log(`   Type: ${result.type}`);
      console.log(`   Found: ${result.value}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Context: ${result.context.substring(0, 100)}...`);
      console.log('');
    }
  });
  
  // Deployment Status Summary
  console.log('\n🚀 DEPLOYMENT STATUS');
  console.log('─'.repeat(80));
  console.log(`Status: ${results.deployment.length} issues found\n`);
  
  results.deployment.forEach(result => {
    console.log(`❌ ${result.file}`);
    console.log(`   Type: ${result.type}`);
    console.log(`   Found: ${result.value}`);
    console.log(`   Expected: ${result.expected}`);
    console.log(`   Context: ${result.context.substring(0, 100)}...`);
    console.log('');
  });
  
  // Invalid Claims Summary
  console.log('\n⚠️  INVALID CLAIMS');
  console.log('─'.repeat(80));
  console.log(`Status: ${results.invalidClaims.length} invalid claims found\n`);
  
  results.invalidClaims.forEach(result => {
    console.log(`❌ ${result.file}`);
    console.log(`   Claim: ${result.value}`);
    console.log(`   Action: ${result.expected}`);
    console.log(`   Context: ${result.context.substring(0, 100)}...`);
    console.log('');
  });
  
  // Errors
  if (results.errors.length > 0) {
    console.log('\n❗ ERRORS');
    console.log('─'.repeat(80));
    results.errors.forEach(error => {
      console.log(`File: ${error.file}`);
      console.log(`Error: ${error.error}\n`);
    });
  }
  
  // Overall Summary
  console.log('\n=== SUMMARY ===');
  console.log('─'.repeat(80));
  const totalIssues = results.metrics.filter(r => r.status === 'FAIL').length +
                     results.terminology.filter(r => r.status === 'FAIL').length +
                     results.deployment.length +
                     results.invalidClaims.length;
  
  console.log(`Total Issues Found: ${totalIssues}`);
  console.log(`  - Metric Inconsistencies: ${results.metrics.filter(r => r.status === 'FAIL').length}`);
  console.log(`  - Terminology Issues: ${results.terminology.filter(r => r.status === 'FAIL').length}`);
  console.log(`  - Deployment Status Issues: ${results.deployment.length}`);
  console.log(`  - Invalid Claims: ${results.invalidClaims.length}`);
  console.log(`  - Processing Errors: ${results.errors.length}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ All consistency checks passed!');
  } else {
    console.log('\n⚠️  Issues found - review and fix before finalizing documentation.');
  }
  
  // Save detailed report
  const reportPath = 'CONSISTENCY-VALIDATION-REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('Starting consistency validation...\n');
  
  const files = getAllMdxFiles('.');
  console.log(`Found ${files.length} documentation files to validate\n`);
  
  files.forEach(file => {
    processFile(file);
  });
  
  generateReport();
}

main();
