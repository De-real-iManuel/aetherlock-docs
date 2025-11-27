#!/usr/bin/env node

/**
 * Cross-Reference Validation Script
 * Validates internal links and navigation structure
 */

const fs = require('fs');
const path = require('path');

// Results storage
const results = {
  links: [],
  brokenLinks: [],
  validLinks: [],
  navigationIssues: [],
  errors: []
};

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
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Extract internal links from markdown content
 */
function extractInternalLinks(content, filePath) {
  const links = [];
  
  // Match markdown links: [text](path)
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = markdownLinkPattern.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];
    
    // Skip external links (http, https, mailto, etc.)
    if (linkPath.startsWith('http://') || 
        linkPath.startsWith('https://') || 
        linkPath.startsWith('mailto:') ||
        linkPath.startsWith('#')) {
      continue;
    }
    
    links.push({
      text: linkText,
      path: linkPath,
      sourceFile: filePath,
      lineNumber: content.substring(0, match.index).split('\n').length
    });
  }
  
  return links;
}

/**
 * Resolve relative path from source file
 */
function resolveRelativePath(sourcePath, linkPath) {
  // Remove leading slash if present
  if (linkPath.startsWith('/')) {
    linkPath = linkPath.substring(1);
  }
  
  // Get directory of source file
  const sourceDir = path.dirname(sourcePath);
  
  // Resolve relative path
  const resolved = path.join(sourceDir, linkPath);
  
  // Normalize path separators
  return resolved.replace(/\\/g, '/');
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  // Try with .mdx extension
  if (fs.existsSync(filePath)) {
    return true;
  }
  
  // Try with .mdx extension if not present
  if (!filePath.endsWith('.mdx') && !filePath.endsWith('.md')) {
    if (fs.existsSync(filePath + '.mdx')) {
      return true;
    }
    if (fs.existsSync(filePath + '.md')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate navigation structure from mint.json
 */
function validateNavigation() {
  try {
    const mintConfig = JSON.parse(fs.readFileSync('mint.json', 'utf8'));
    
    if (!mintConfig.navigation) {
      results.navigationIssues.push({
        type: 'Missing Navigation',
        message: 'mint.json does not contain navigation configuration'
      });
      return;
    }
    
    // Check each navigation group
    mintConfig.navigation.forEach(navItem => {
      if (navItem.group) {
        // Check if pages exist
        if (navItem.pages) {
          navItem.pages.forEach(page => {
            const pagePath = page.endsWith('.mdx') ? page : page + '.mdx';
            
            if (!fileExists(pagePath)) {
              results.navigationIssues.push({
                type: 'Missing Page',
                group: navItem.group,
                page: page,
                message: `Navigation references non-existent page: ${page}`
              });
            }
          });
        }
      }
    });
    
    console.log(`Validated ${mintConfig.navigation.length} navigation groups`);
    
  } catch (error) {
    results.errors.push({
      file: 'mint.json',
      error: error.message
    });
  }
}

/**
 * Process a single file
 */
function processFile(filePath, allFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = extractInternalLinks(content, filePath);
    
    links.forEach(link => {
      results.links.push(link);
      
      // Resolve the link path
      const resolvedPath = resolveRelativePath(filePath, link.path);
      
      // Check if target file exists
      if (fileExists(resolvedPath)) {
        results.validLinks.push({
          ...link,
          resolvedPath
        });
      } else {
        results.brokenLinks.push({
          ...link,
          resolvedPath,
          reason: 'File not found'
        });
      }
    });
    
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
  console.log('\n=== CROSS-REFERENCE VALIDATION REPORT ===\n');
  
  // Links Summary
  console.log('🔗 INTERNAL LINKS');
  console.log('─'.repeat(80));
  console.log(`Total Internal Links: ${results.links.length}`);
  console.log(`Valid Links: ${results.validLinks.length}`);
  console.log(`Broken Links: ${results.brokenLinks.length}\n`);
  
  // Broken Links
  if (results.brokenLinks.length > 0) {
    console.log('❌ BROKEN LINKS');
    console.log('─'.repeat(80));
    
    results.brokenLinks.forEach(link => {
      console.log(`\nSource: ${link.sourceFile}:${link.lineNumber}`);
      console.log(`  Link Text: ${link.text}`);
      console.log(`  Link Path: ${link.path}`);
      console.log(`  Resolved: ${link.resolvedPath}`);
      console.log(`  Reason: ${link.reason}`);
    });
    console.log('');
  } else {
    console.log('✅ No broken internal links found!\n');
  }
  
  // Navigation Issues
  console.log('\n📚 NAVIGATION STRUCTURE');
  console.log('─'.repeat(80));
  
  if (results.navigationIssues.length > 0) {
    console.log(`Found ${results.navigationIssues.length} navigation issues:\n`);
    
    results.navigationIssues.forEach(issue => {
      console.log(`❌ ${issue.type}`);
      if (issue.group) console.log(`   Group: ${issue.group}`);
      if (issue.page) console.log(`   Page: ${issue.page}`);
      console.log(`   Message: ${issue.message}\n`);
    });
  } else {
    console.log('✅ Navigation structure is intact!\n');
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
  console.log(`Total Links Checked: ${results.links.length}`);
  console.log(`Valid Links: ${results.validLinks.length}`);
  console.log(`Broken Links: ${results.brokenLinks.length}`);
  console.log(`Navigation Issues: ${results.navigationIssues.length}`);
  console.log(`Processing Errors: ${results.errors.length}`);
  
  const totalIssues = results.brokenLinks.length + results.navigationIssues.length + results.errors.length;
  
  if (totalIssues === 0) {
    console.log('\n✅ All cross-references are valid!');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} issues - review and fix before finalizing documentation.`);
  }
  
  // Save detailed report
  const reportPath = 'CROSS-REFERENCE-VALIDATION-REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('Starting cross-reference validation...\n');
  
  const files = getAllMdxFiles('.');
  console.log(`Found ${files.length} documentation files to validate\n`);
  
  // Validate navigation structure
  console.log('Validating navigation structure from mint.json...');
  validateNavigation();
  console.log('');
  
  // Process all files
  console.log('Checking internal links...');
  files.forEach(file => {
    processFile(file, files);
  });
  
  generateReport();
}

main();
