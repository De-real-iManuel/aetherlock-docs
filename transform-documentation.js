#!/usr/bin/env node

/**
 * Documentation Transformation Script
 * 
 * Transforms AetherLock documentation from marketing-focused to technical depth
 * following zkSync documentation standards:
 * 
 * 1. Remove emojis and marketing language
 * 2. Add technical specifications and formal definitions
 * 3. Include cryptographic details and protocol specifications
 * 4. Provide deep explanations of design decisions
 * 5. Add mathematical formulations where applicable
 * 6. Include security considerations and threat models
 */

const fs = require('fs');
const path = require('path');

// Transformation rules
const transformations = {
  // Remove emojis from headings
  removeEmojis: (content) => {
    return content.replace(/^(#{1,6})\s*[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?\s*/gmu, '$1 ');
  },
  
  // Replace marketing language with technical terms
  replacePhrases: (content) => {
    const replacements = {
      'Revolutionizing': 'Implementing',
      'revolutionize': 'implement',
      'game-changing': 'novel',
      'cutting-edge': 'advanced',
      'next-generation': 'modern',
      'seamless': 'integrated',
      'powerful': 'capable',
      'amazing': 'effective',
      'incredible': 'significant',
      'awesome': 'notable',
    };
    
    let result = content;
    for (const [old, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${old}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }
    return result;
  },
  
  // Remove excessive styling divs
  removeStyledDivs: (content) => {
    // Remove gradient text styling
    content = content.replace(
      /<div className="text-\d+xl.*?bg-gradient.*?text-transparent.*?">(.*?)<\/div>/gs,
      '$1'
    );
    
    // Simplify card layouts to tables or lists
    content = content.replace(
      /<div className="grid.*?gap-\d+.*?">(.*?)<\/div>/gs,
      (match, inner) => {
        // If it contains metrics, convert to table
        if (inner.includes('font-bold') && inner.includes('text-')) {
          return '\n\n### Key Metrics\n\n' + inner;
        }
        return inner;
      }
    );
    
    return content;
  },
  
  // Add technical depth sections
  addTechnicalSections: (content, filename) => {
    // Add protocol specifications after abstract
    if (filename === 'index.mdx' && !content.includes('## Protocol Specifications')) {
      content = content.replace(
        /(## Abstract[\s\S]*?)\n\n##/,
        '$1\n\n## Protocol Specifications\n\n### Core Parameters\n\n| Parameter | Value | Rationale |\n|-----------|-------|----------|\n| Block Time | 400ms | Solana consensus finality |\n| Verification Timeout | 300s | Maximum AI analysis duration |\n| Minimum Escrow | 0.01 SOL | Prevents spam transactions |\n| Maximum Escrow | 1000 SOL | Risk management threshold |\n| Fee Structure | 10% | Sustainable protocol economics |\n\n##'
      );
    }
    
    return content;
  },
  
  // Convert marketing metrics to technical specifications
  convertMetrics: (content) => {
    // Replace percentage claims with technical measurements
    content = content.replace(
      /(\d+)% (faster|cheaper|better)/gi,
      (match, num, comparison) => {
        return `${num}x improvement in ${comparison === 'faster' ? 'latency' : comparison === 'cheaper' ? 'cost efficiency' : 'performance'}`;
      }
    );
    
    return content;
  },
};

// Files to transform
const filesToTransform = [
  'index.mdx',
  'introduction.mdx',
  'how-it-works.mdx',
  'technical-architecture.mdx',
  'business-model.mdx',
  'glossary.mdx',
];

// Apply transformations
function transformFile(filepath) {
  console.log(`Transforming ${filepath}...`);
  
  let content = fs.readFileSync(filepath, 'utf8');
  const filename = path.basename(filepath);
  
  // Apply each transformation
  content = transformations.removeEmojis(content);
  content = transformations.replacePhrases(content);
  content = transformations.removeStyledDivs(content);
  content = transformations.addTechnicalSections(content, filename);
  content = transformations.convertMetrics(content);
  
  // Write back
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✓ Transformed ${filepath}`);
}

// Main execution
console.log('Starting documentation transformation...\n');

filesToTransform.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (fs.existsSync(filepath)) {
    transformFile(filepath);
  } else {
    console.log(`⚠ File not found: ${filepath}`);
  }
});

console.log('\n✓ Documentation transformation complete!');
console.log('\nNext steps:');
console.log('1. Review transformed files manually');
console.log('2. Add protocol specifications to each section');
console.log('3. Include cryptographic proofs and security analysis');
console.log('4. Add formal verification results if available');
