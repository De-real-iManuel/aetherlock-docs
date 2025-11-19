/**
 * Mermaid Diagram Validation Script
 * Extracts and validates all Mermaid diagrams from documentation
 */

const fs = require('fs');
const path = require('path');

// Files to scan for Mermaid diagrams
const filesToScan = [
  '.kiro/specs/ai-architecture-correction/design.md',
  'technical-architecture.mdx',
  'security/cryptographic-proofs.mdx',
  'partners.mdx',
  'market-analysis.mdx',
  'index.mdx',
  'how-it-works.mdx',
  'guides/understanding-verification.mdx',
  'diagrams/architecture-diagrams.md',
  'diagrams/state-diagrams.md',
  'diagrams/sequence-diagrams.md',
  'design/architecture.mdx',
  'design/somnia-integration.mdx',
  'design/zkme-integration.mdx',
  'design/solana-escrow-contract.mdx',
  'design/potv-mechanism.mdx',
  'design/data-models.mdx',
  'design/ai-agent.mdx',
  'business-model.mdx',
  'api/smart-contracts.mdx',
  'api/chainlink-functions.mdx',
  'traction.mdx'
];

// Extract Mermaid diagrams from a file
function extractMermaidDiagrams(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Handle both Unix (\n) and Windows (\r\n) line endings
    const mermaidRegex = /```mermaid\r?\n([\s\S]*?)```/g;
    const diagrams = [];
    let match;
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      const diagramContent = match[1].trim();
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      diagrams.push({
        content: diagramContent,
        lineNumber: lineNumber,
        filePath: filePath
      });
    }
    
    return diagrams;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Basic Mermaid syntax validation
function validateMermaidSyntax(diagram) {
  const errors = [];
  const warnings = [];
  const content = diagram.content;
  
  // Check for diagram type
  const diagramTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
    'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'gantt',
    'pie', 'quadrantChart', 'xychart-beta'
  ];
  
  const hasValidType = diagramTypes.some(type => 
    content.trim().startsWith(type)
  );
  
  if (!hasValidType) {
    errors.push('No valid diagram type found at start');
  }
  
  // Check for common syntax errors
  
  // 1. Unclosed brackets
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push(`Mismatched square brackets: ${openBrackets} open, ${closeBrackets} close`);
  }
  
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
  }
  
  // Skip brace checking for ER diagrams as they have special syntax
  const isErDiagram = content.trim().startsWith('erDiagram');
  if (!isErDiagram) {
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched curly braces: ${openBraces} open, ${closeBraces} close`);
    }
  }
  
  // 2. Check for invalid arrow syntax (skip for sequence diagrams as -->> is valid)
  const isSequenceDiagram = content.includes('sequenceDiagram');
  if (!isSequenceDiagram) {
    const invalidArrows = content.match(/-->[^\s\[\|\-]/g);
    if (invalidArrows) {
      warnings.push(`Potentially invalid arrow syntax: ${invalidArrows.join(', ')}`);
    }
  }
  
  // 3. Check for empty nodes
  if (content.match(/\[\s*\]/)) {
    warnings.push('Empty node labels found');
  }
  
  // 4. Check for subgraph syntax
  if (content.includes('subgraph')) {
    const subgraphCount = (content.match(/subgraph/g) || []).length;
    const endCount = (content.match(/^\s*end\s*$/gm) || []).length;
    if (subgraphCount > endCount) {
      errors.push(`Unclosed subgraph: ${subgraphCount} subgraphs, ${endCount} end statements`);
    }
  }
  
  // 5. Check for participant in non-sequence diagrams
  if (content.includes('participant') && !content.includes('sequenceDiagram')) {
    warnings.push('participant keyword used outside sequenceDiagram');
  }
  
  // 6. Check for common typos
  if (content.match(/\bsubgraph\s+[^"'\n]*\s+subgraph\b/)) {
    errors.push('Nested subgraph without proper closure');
  }
  
  return { errors, warnings };
}

// Main validation function
function validateAllDiagrams() {
  console.log('🔍 Scanning for Mermaid diagrams...\n');
  
  let totalDiagrams = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];
  
  for (const file of filesToScan) {
    const diagrams = extractMermaidDiagrams(file);
    
    if (diagrams.length > 0) {
      console.log(`📄 ${file}: Found ${diagrams.length} diagram(s)`);
      
      diagrams.forEach((diagram, index) => {
        totalDiagrams++;
        const validation = validateMermaidSyntax(diagram);
        
        const result = {
          file: file,
          diagramNumber: index + 1,
          lineNumber: diagram.lineNumber,
          errors: validation.errors,
          warnings: validation.warnings,
          content: diagram.content
        };
        
        results.push(result);
        
        if (validation.errors.length > 0) {
          totalErrors += validation.errors.length;
          console.log(`  ❌ Diagram ${index + 1} (line ${diagram.lineNumber}): ${validation.errors.length} error(s)`);
          validation.errors.forEach(err => console.log(`     - ${err}`));
        }
        
        if (validation.warnings.length > 0) {
          totalWarnings += validation.warnings.length;
          console.log(`  ⚠️  Diagram ${index + 1} (line ${diagram.lineNumber}): ${validation.warnings.length} warning(s)`);
          validation.warnings.forEach(warn => console.log(`     - ${warn}`));
        }
        
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
          console.log(`  ✅ Diagram ${index + 1} (line ${diagram.lineNumber}): Valid`);
        }
      });
      
      console.log('');
    }
  }
  
  // Summary
  console.log('═'.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total diagrams found: ${totalDiagrams}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ All Mermaid diagrams are valid!');
  } else if (totalErrors === 0) {
    console.log('\n⚠️  All diagrams are syntactically valid but have warnings');
  } else {
    console.log('\n❌ Some diagrams have errors that need to be fixed');
  }
  
  // Generate detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalDiagrams,
    totalErrors,
    totalWarnings,
    results: results.filter(r => r.errors.length > 0 || r.warnings.length > 0)
  };
  
  fs.writeFileSync(
    'MERMAID-VALIDATION-REPORT.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📝 Detailed report saved to: MERMAID-VALIDATION-REPORT.json');
  
  return totalErrors === 0;
}

// Run validation
const success = validateAllDiagrams();
process.exit(success ? 0 : 1);
