// Simple integration test for theme sync workflow
const fs = require('fs');
const path = require('path');
const { syncThemes } = require('./sync-themes');
const yaml = require('yamljs');

async function runTests() {
  console.log('🧪 Running theme sync integration tests...');
  
  try {
    // Test 1: Sync themes from database
    console.log('Test 1: Syncing themes from database');
    await syncThemes();
    
    // Test 2: Verify YAML file was created
    const yamlPath = path.resolve(__dirname, '../themes/tenants.yaml');
    if (!fs.existsSync(yamlPath)) {
      throw new Error('YAML file was not created');
    }
    console.log('✅ YAML file created successfully');
    
    // Test 3: Verify YAML structure
    const yamlData = yaml.load(yamlPath);
    if (!Array.isArray(yamlData) || yamlData.length === 0) {
      throw new Error('YAML data is not a valid array');
    }
    console.log(`✅ YAML contains ${yamlData.length} tenant themes`);
    
    // Test 4: Verify required fields
    for (const tenant of yamlData) {
      if (!tenant.id || !tenant.name || !tenant.colors) {
        throw new Error(`Invalid tenant structure: ${JSON.stringify(tenant)}`);
      }
      if (!tenant.colors.primary || !tenant.colors.background) {
        throw new Error(`Missing required colors for tenant ${tenant.id}`);
      }
    }
    console.log('✅ All tenants have required fields');
    
    // Test 5: Test generate-resources.js can read the file
    const generateResourcesPath = path.resolve(__dirname, 'generate-resources.js');
    const { spawn } = require('child_process');
    
    await new Promise((resolve, reject) => {
      const child = spawn('node', [generateResourcesPath], { cwd: __dirname });
      let stderr = '';
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`generate-resources.js failed: ${stderr}`));
        } else {
          resolve();
        }
      });
    });
    
    console.log('✅ generate-resources.js executed successfully');
    
    console.log('🎉 All tests passed! Theme sync workflow is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };