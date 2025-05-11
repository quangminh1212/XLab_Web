const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Starting SWC and webpack-manifest-plugin fix ===');

// Fix SWC warning by adding a fallback option
function fixSwcWarning() {
  console.log('📦 Fixing SWC warning...');
  
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.error('❌ next.config.js not found!');
    return;
  }
  
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Check if swcMinify is already configured
  if (!nextConfig.includes('swcMinify:')) {
    // Find the last bracket of the nextConfig object
    const lastBraceIndex = nextConfig.lastIndexOf('};');
    
    if (lastBraceIndex !== -1) {
      // Insert swcMinify configuration before the last brace
      const configWithSwc = nextConfig.slice(0, lastBraceIndex) + 
        '  swcMinify: true,\n' +
        '  swcLoader: {\n' +
        '    implementation: require.resolve("@next/swc-wasm-nodejs"),\n' +
        '  },\n' + 
        nextConfig.slice(lastBraceIndex);
      
      fs.writeFileSync(nextConfigPath, configWithSwc);
      console.log('✅ Added swcMinify and swcLoader configurations to next.config.js');
    } else {
      console.error('❌ Could not find the end of the config object in next.config.js');
    }
  } else {
    console.log('⚠️ swcMinify configuration already exists in next.config.js');
  }
}

// Fix webpack-manifest-plugin warning
function fixWebpackManifestWarning() {
  console.log('📄 Fixing webpack-manifest-plugin warning...');
  
  try {
    // Update the webpack configuration in next.config.js to handle missing webpack-manifest-plugin
    const nextConfigPath = path.join(__dirname, 'next.config.js');
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (nextConfig.includes('webpack-manifest-plugin not found')) {
      console.log('⚠️ webpack-manifest-plugin warning handler already exists');
      return;
    }
    
    // Find the webpack configuration section
    const webpackConfigIndex = nextConfig.indexOf('webpack: (config, { dev, isServer }) => {');
    
    if (webpackConfigIndex !== -1) {
      // Find where the WebpackManifestPlugin is added
      const manifestPluginIndex = nextConfig.indexOf('const { WebpackManifestPlugin } = require(\'webpack-manifest-plugin\');');
      
      if (manifestPluginIndex !== -1) {
        // Extract the entire try-catch block or create one if it doesn't exist
        const manifestPluginTryCatchRegex = /try\s*{[\s\S]*?WebpackManifestPlugin[\s\S]*?}\s*catch\s*\(error\)\s*{[\s\S]*?}/;
        const tryCatchMatch = nextConfig.match(manifestPluginTryCatchRegex);
        
        if (tryCatchMatch) {
          console.log('⚠️ try-catch block for WebpackManifestPlugin already exists');
        } else {
          // Wrap the WebpackManifestPlugin code in a try-catch block
          const beforeManifestPlugin = nextConfig.substring(0, manifestPluginIndex);
          const afterManifestPlugin = nextConfig.substring(manifestPluginIndex);
          
          // Find the end of the WebpackManifestPlugin code block
          const endOfPluginCode = afterManifestPlugin.indexOf(');');
          const manifestPluginCode = afterManifestPlugin.substring(0, endOfPluginCode + 2);
          const afterPluginCode = afterManifestPlugin.substring(endOfPluginCode + 2);
          
          // Create the wrapped code
          const wrappedCode = beforeManifestPlugin + 
            'try {\n' +
            '        ' + manifestPluginCode + '\n' +
            '      } catch (error) {\n' +
            '        console.warn(\'webpack-manifest-plugin not found or failed to initialize. Skipping manifest generation.\');\n' +
            '      }' + 
            afterPluginCode;
          
          fs.writeFileSync(nextConfigPath, wrappedCode);
          console.log('✅ Added try-catch block around WebpackManifestPlugin usage');
        }
      } else {
        console.log('⚠️ WebpackManifestPlugin instantiation not found in next.config.js');
      }
    } else {
      console.log('⚠️ webpack configuration not found in next.config.js');
    }
  } catch (error) {
    console.error('❌ Error fixing webpack-manifest-plugin warning:', error);
  }
}

// Reinstall dependencies
function reinstallDependencies() {
  console.log('🔄 Reinstalling SWC and webpack-manifest-plugin dependencies...');
  
  try {
    // Check if packages are already installed
    const packageJson = require('./package.json');
    const devDependencies = packageJson.devDependencies || {};
    
    // Only install @next/swc-wasm-nodejs if not already installed
    if (!devDependencies['@next/swc-wasm-nodejs']) {
      console.log('Installing @next/swc-wasm-nodejs...');
      try {
        execSync('npm install @next/swc-wasm-nodejs --save-dev', { stdio: 'inherit' });
        console.log('✅ Installed @next/swc-wasm-nodejs');
      } catch (err) {
        console.log('⚠️ Could not install @next/swc-wasm-nodejs, but it may already be installed.');
      }
    } else {
      console.log('✅ @next/swc-wasm-nodejs is already installed');
    }
    
    // Only install webpack-manifest-plugin if not already installed
    if (!devDependencies['webpack-manifest-plugin']) {
      console.log('Installing webpack-manifest-plugin...');
      try {
        execSync('npm install webpack-manifest-plugin --save-dev', { stdio: 'inherit' });
        console.log('✅ Installed webpack-manifest-plugin');
      } catch (err) {
        console.log('⚠️ Could not install webpack-manifest-plugin, but it may already be installed.');
      }
    } else {
      console.log('✅ webpack-manifest-plugin is already installed');
    }
  } catch (error) {
    console.error('❌ Error reinstalling dependencies:', error);
  }
}

// Modify experimental settings
function fixExperimentalSettings() {
  console.log('🔧 Fixing experimental settings in next.config.js...');
  
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.error('❌ next.config.js not found!');
    return;
  }
  
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Check if experimental settings exist and remove swcMinify from them if it does
  if (nextConfig.includes('experimental:')) {
    // If swcMinify is in experimental, remove it
    const experimentalRegex = /experimental:\s*{[^}]*?swcMinify:[^,}]*,?[^}]*?}/;
    const experimentalMatch = nextConfig.match(experimentalRegex);
    
    if (experimentalMatch) {
      const experimentalSection = experimentalMatch[0];
      const updatedExperimental = experimentalSection.replace(/swcMinify:[^,}]*,?/, '');
      nextConfig = nextConfig.replace(experimentalRegex, updatedExperimental);
      fs.writeFileSync(nextConfigPath, nextConfig);
      console.log('✅ Removed swcMinify from experimental settings');
    } else {
      console.log('✅ swcMinify not found in experimental settings');
    }
  } else {
    console.log('✅ No experimental settings found');
  }
}

// Run all fixes
fixSwcWarning();
fixWebpackManifestWarning();
reinstallDependencies();
fixExperimentalSettings();

console.log('=== SWC and webpack-manifest-plugin fixes completed ===');