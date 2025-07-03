# Build Issues and Solutions

## Common Build Error

If you encounter the following error during build:

```
Error: ENOENT: no such file or directory, rename 'C:\VF\XLab_Web\.next\export\500.html' -> 'C:\VF\XLab_Web\.next\server\pages\500.html'
```

This is due to an issue with Next.js trying to move error pages from the export directory to the server pages directory.

## Solutions

### Quick Fix

Run our automated fix script:

```bash
npm run fix-build
```

This will:
1. Create all necessary directories
2. Generate error pages in the correct locations
3. Create required manifest files
4. Set up a working standalone server.js

### Manual Fix

If you prefer to fix the issue manually:

1. Create the necessary directories:
   ```bash
   mkdir -p .next/export .next/server/pages .next/standalone
   ```

2. Create 404.html and 500.html in both the export and server/pages directories
   ```bash
   # Content for error pages can be basic HTML with appropriate error messages
   ```

3. Create required manifest files:
   ```bash
   # Create prerender-manifest.json, build-manifest.json, etc.
   ```

4. Create standalone server.js

## Understanding the Issue

Next.js v14.2.4 has an issue during the build process where it attempts to move error pages from the export directory to the server pages directory. If the files don't exist or there's a file system permission issue, the build fails.

Our fix ensures these files exist in both locations before Next.js tries to move them.

## Additional Information

If you're having other build-related issues, check:

1. Make sure all required dependencies are installed
2. Verify you're using the correct Node.js version (v18+)
3. Check for error messages in the console before the build failure

For more assistance, contact the XLab development team. 