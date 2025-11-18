# Mintlify Deployment Guide

**Version:** 1.0.0  
**Last Updated:** 2024

## Overview

This guide provides step-by-step instructions for deploying the AetherLock documentation to Mintlify.

## Prerequisites

Before deploying, ensure you have:

- [ ] Mintlify account created
- [ ] GitHub repository connected to Mintlify
- [ ] All validation checks passed (`npm run check`)
- [ ] All broken links fixed
- [ ] All code blocks have language identifiers
- [ ] mint.json configuration file is correct

## Pre-Deployment Checklist

### 1. Run Validation

```bash
# Run all validation checks
npm run check

# Or run individually
npm run validate  # Check structure, links, diagrams
npm run review    # Check content quality
npm run finalize  # Generate TOC, changelog, etc.
```

### 2. Review Reports

Check the following reports for any issues:

- [ ] `VALIDATION-REPORT.md` - No critical errors
- [ ] `CONTENT-REVIEW-REPORT.md` - Content complete
- [ ] `TABLE-OF-CONTENTS.md` - All sections present
- [ ] `CHANGELOG.md` - Version history updated

### 3. Verify Configuration

Check `mint.json` configuration:

```json
{
  "name": "AetherLock",
  "logo": {
    "dark": "/assets/aetherlock-logo.png",
    "light": "/assets/aetherlock-logo.png"
  },
  "favicon": "/assets/favicon.ico",
  "colors": {
    "primary": "#9333EA",
    "light": "#A855F7",
    "dark": "#7C3AED"
  },
  "navigation": [
    // ... navigation structure
  ]
}
```

### 4. Test Locally

```bash
# Install Mintlify CLI (if not already installed)
npm install -g mintlify

# Start local development server
mintlify dev

# Open browser to http://localhost:3000
# Verify all pages load correctly
# Check all links work
# Verify all diagrams render
# Test all code examples display properly
```

## Deployment Steps

### Option 1: Deploy via Mintlify Dashboard (Recommended)

1. **Login to Mintlify**
   - Go to [mintlify.com](https://mintlify.com)
   - Sign in with your account

2. **Connect Repository**
   - Click "New Documentation"
   - Connect your GitHub repository
   - Select the repository containing the documentation
   - Choose the branch (usually `main` or `master`)

3. **Configure Build Settings**
   - Root directory: `AetherLock-Lab-main` (or leave blank if docs are in root)
   - Build command: (leave default)
   - Publish directory: (leave default)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-5 minutes)
   - Check build logs for any errors

5. **Verify Deployment**
   - Visit the provided URL (e.g., `your-docs.mintlify.app`)
   - Test navigation
   - Verify all pages load
   - Check all links work
   - Test search functionality

### Option 2: Deploy via Mintlify CLI

```bash
# Install Mintlify CLI
npm install -g mintlify

# Login to Mintlify
mintlify login

# Deploy from documentation directory
cd AetherLock-Lab-main
mintlify deploy

# Follow prompts to select project and confirm deployment
```

### Option 3: Deploy via GitHub Integration

1. **Setup GitHub Action**
   
   Create `.github/workflows/deploy-docs.yml`:

   ```yaml
   name: Deploy Documentation

   on:
     push:
       branches:
         - main
       paths:
         - 'AetherLock-Lab-main/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install Mintlify
           run: npm install -g mintlify
         
         - name: Deploy to Mintlify
           run: |
             cd AetherLock-Lab-main
             mintlify deploy
           env:
             MINTLIFY_API_KEY: ${{ secrets.MINTLIFY_API_KEY }}
   ```

2. **Add Mintlify API Key**
   - Go to GitHub repository settings
   - Navigate to Secrets and Variables → Actions
   - Add new secret: `MINTLIFY_API_KEY`
   - Get API key from Mintlify dashboard

3. **Push to GitHub**
   - Commit changes
   - Push to main branch
   - GitHub Action will automatically deploy

## Post-Deployment Verification

### 1. Visual Review

- [ ] Homepage loads correctly
- [ ] Logo and favicon display
- [ ] Color scheme matches brand
- [ ] Navigation menu is complete
- [ ] Search functionality works
- [ ] All sections are accessible

### 2. Content Verification

- [ ] All pages load without errors
- [ ] Code blocks have syntax highlighting
- [ ] Mermaid diagrams render correctly
- [ ] Images and assets load
- [ ] Tables format properly
- [ ] Lists and formatting correct

### 3. Link Testing

- [ ] Internal links navigate correctly
- [ ] External links open in new tabs
- [ ] Anchor links jump to correct sections
- [ ] No 404 errors

### 4. Interactive Elements

- [ ] Code copy buttons work
- [ ] Collapsible sections expand/collapse
- [ ] Tabs switch correctly
- [ ] Search returns relevant results
- [ ] Mobile navigation works

### 5. Performance

- [ ] Pages load quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

## Troubleshooting

### Build Fails

**Issue:** Build fails with "Invalid mint.json"

**Solution:**
1. Validate JSON syntax: `npx jsonlint mint.json`
2. Check all required fields are present
3. Verify file paths in navigation exist

**Issue:** Build fails with "Missing files"

**Solution:**
1. Check all files referenced in mint.json exist
2. Verify file paths are relative to root
3. Ensure no typos in file names

### Broken Links

**Issue:** Links return 404 errors

**Solution:**
1. Run validation: `npm run validate`
2. Fix broken links in VALIDATION-REPORT.md
3. Convert absolute paths to relative paths
4. Redeploy

### Diagrams Not Rendering

**Issue:** Mermaid diagrams show as code blocks

**Solution:**
1. Verify Mermaid is enabled in mint.json
2. Check diagram syntax: `npm run validate`
3. Ensure code blocks use ```mermaid
4. Test locally with `mintlify dev`

### Images Not Loading

**Issue:** Images show broken image icon

**Solution:**
1. Verify images exist in `/assets` directory
2. Check file paths are correct
3. Ensure images are committed to repository
4. Verify image formats are supported (PNG, JPG, SVG)

### Search Not Working

**Issue:** Search returns no results

**Solution:**
1. Wait 5-10 minutes after deployment for indexing
2. Clear browser cache
3. Check if content is properly indexed in Mintlify dashboard
4. Verify pages have proper headings and content

## Custom Domain Setup

### 1. Add Custom Domain in Mintlify

1. Go to Mintlify dashboard
2. Navigate to Settings → Domains
3. Click "Add Custom Domain"
4. Enter your domain (e.g., `docs.aetherlock.io`)

### 2. Configure DNS

Add CNAME record in your DNS provider:

```
Type: CNAME
Name: docs (or your subdomain)
Value: cname.mintlify.com
TTL: 3600
```

### 3. Verify Domain

1. Wait for DNS propagation (5-60 minutes)
2. Click "Verify" in Mintlify dashboard
3. SSL certificate will be automatically provisioned

### 4. Update Links

Update any hardcoded links in documentation to use new domain.

## Staging Environment

### Setup Staging

1. Create a separate branch: `staging`
2. Connect staging branch to Mintlify
3. Use staging URL for testing: `your-docs-staging.mintlify.app`

### Deployment Workflow

```
Development → Staging → Production

1. Make changes in feature branch
2. Merge to staging branch
3. Test on staging URL
4. Merge to main branch
5. Auto-deploy to production
```

## Rollback Procedure

If deployment has issues:

### Option 1: Revert via Dashboard

1. Go to Mintlify dashboard
2. Navigate to Deployments
3. Find previous successful deployment
4. Click "Rollback"

### Option 2: Revert via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## Monitoring

### Analytics

Enable analytics in mint.json:

```json
{
  "analytics": {
    "ga4": {
      "measurementId": "G-XXXXXXXXXX"
    }
  }
}
```

### Error Tracking

Monitor deployment logs in Mintlify dashboard:
- Build errors
- 404 errors
- Slow page loads
- Search issues

## Maintenance

### Regular Updates

- [ ] Update version number in package.json
- [ ] Update CHANGELOG.md with changes
- [ ] Run validation checks
- [ ] Test locally before deploying
- [ ] Deploy during low-traffic periods

### Content Updates

For minor content updates:
1. Edit files directly
2. Commit and push
3. Auto-deploy (if GitHub integration enabled)

For major updates:
1. Create feature branch
2. Make changes
3. Test locally
4. Deploy to staging
5. Review and test
6. Merge to main
7. Deploy to production

## Support

### Mintlify Support

- Documentation: [mintlify.com/docs](https://mintlify.com/docs)
- Community: [mintlify.com/community](https://mintlify.com/community)
- Email: support@mintlify.com

### Project Support

- Validation Issues: Run `npm run check` and review reports
- Content Issues: See CONTENT-REVIEW-REPORT.md
- Technical Issues: See implementation/troubleshooting.mdx

## Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] All validation checks pass
- [ ] All broken links fixed
- [ ] All code blocks have language identifiers
- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] Local testing completed
- [ ] Staging deployment tested (if applicable)

### Deployment
- [ ] Deployed to Mintlify
- [ ] Build completed successfully
- [ ] No build errors in logs

### Post-Deployment
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Search works
- [ ] Links work
- [ ] Diagrams render
- [ ] Images load
- [ ] Code highlighting works
- [ ] Mobile responsive
- [ ] Performance acceptable

### Verification
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested on different browsers
- [ ] No console errors
- [ ] Analytics tracking (if enabled)

---

**Ready to Deploy?** Follow the steps above and use the checklist to ensure a smooth deployment!
