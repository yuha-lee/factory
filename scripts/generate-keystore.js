#!/usr/bin/env node

/**
 * Multi-Tenant Android Upload Key Generator
 * Generates tenant-specific UPLOAD KEYS for Google Play App Signing
 * 
 * IMPORTANT: These are UPLOAD KEYS, not app signing keys!
 * - Upload keys: Used to upload APK/AAB to Google Play (managed by you)
 * - App signing keys: Used to sign the actual APK users download (managed by Google)
 * 
 * Usage: node generate-keystore.js <tenantId>
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

function generateSecurePassword(length = 20) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789.';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function updateGradleProperties(tenantId, storePassword, keyPassword) {
  const gradlePropsPath = path.join(__dirname, '../client/android/gradle.properties');
  let content = fs.readFileSync(gradlePropsPath, 'utf8');
  
  const tenantUpper = tenantId.toUpperCase();
  const newConfig = `
# ${tenantId} keystore configuration
${tenantUpper}_STORE_FILE=keystores/${tenantId}-release.keystore
${tenantUpper}_STORE_PASSWORD=${storePassword}
${tenantUpper}_KEY_ALIAS=${tenantId}-key
${tenantUpper}_KEY_PASSWORD=${keyPassword}
`;

  // Check if tenant config already exists
  const configRegex = new RegExp(`# ${tenantId} keystore configuration[\\s\\S]*?(?=\\n\\n|\\n#|$)`, 'g');
  if (content.match(configRegex)) {
    content = content.replace(configRegex, newConfig.trim());
  } else {
    content += newConfig;
  }
  
  fs.writeFileSync(gradlePropsPath, content);
  console.log(`✅ Updated gradle.properties with ${tenantId} configuration`);
}

async function updateFlavorsGradle(tenantId) {
  const flavorsPath = path.join(__dirname, '../client/android/app/flavors.gradle');
  
  if (!fs.existsSync(flavorsPath)) {
    const initialContent = `// Auto-generated tenant list
def tenantList = ['${tenantId}']
`;
    fs.writeFileSync(flavorsPath, initialContent);
    console.log(`✅ Created flavors.gradle with ${tenantId}`);
    return;
  }
  
  let content = fs.readFileSync(flavorsPath, 'utf8');
  
  // Update tenant list if it exists
  const tenantListRegex = /def tenantList = \[(.*?)\]/s;
  const match = content.match(tenantListRegex);
  
  if (match) {
    const currentTenants = match[1]
      .split(',')
      .map(t => t.trim().replace(/['"]/g, ''))
      .filter(t => t);
    
    if (!currentTenants.includes(tenantId)) {
      currentTenants.push(tenantId);
      const newTenantList = currentTenants.map(t => `'${t}'`).join(', ');
      content = content.replace(tenantListRegex, `def tenantList = [${newTenantList}]`);
      fs.writeFileSync(flavorsPath, content);
      console.log(`✅ Added ${tenantId} to flavors.gradle`);
    }
  } else {
    // Add tenant list to the file
    const newContent = `// Auto-generated tenant list
def tenantList = ['${tenantId}']

${content}`;
    fs.writeFileSync(flavorsPath, newContent);
    console.log(`✅ Updated flavors.gradle with ${tenantId}`);
  }
}

async function generateKeystore() {
  const tenantId = process.argv[2];
  
  if (!tenantId) {
    console.log('❌ Usage: node generate-keystore.js <tenantId>');
    console.log('📋 Example: node generate-keystore.js tenantC');
    rl.close();
    return;
  }
  
  console.log(`🔐 Generating UPLOAD KEY for tenant: ${tenantId}`);
  console.log(`📋 This will create an upload key for Google Play App Signing`);
  console.log(`🛡️  Google will manage the actual app signing key for security\n`);
  
  const keystorePath = path.join(__dirname, '../client/android/app/keystores', `${tenantId}-release.keystore`);
  const keystoreDir = path.dirname(keystorePath);
  
  // Create keystores directory if it doesn't exist
  if (!fs.existsSync(keystoreDir)) {
    fs.mkdirSync(keystoreDir, { recursive: true });
  }
  
  if (fs.existsSync(keystorePath)) {
    console.log(`⚠️  Warning: ${tenantId}-release.keystore already exists!`);
    const overwrite = await question('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Keystore generation cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('Please provide the following information for your keystore:\n');
  
  // Auto-generate secure passwords or allow manual input
  const useAutoPassword = await question('Use auto-generated secure passwords? (Y/n): ');
  let storePassword, keyPassword;
  
  if (useAutoPassword.toLowerCase() !== 'n') {
    storePassword = generateSecurePassword();
    keyPassword = generateSecurePassword();
    console.log('🔐 Generated secure passwords automatically');
  } else {
    storePassword = await question('Store password (min 6 chars): ');
    keyPassword = await question('Key password (min 6 chars): ');
  }
  
  const keyAlias = `${tenantId}-key`;
  const commonName = await question(`Common Name (e.g., ${tenantId} App): `);
  const orgUnit = await question('Organizational Unit (e.g., Development): ');
  const org = await question('Organization (e.g., Your Company): ');
  const city = await question('City: ');
  const state = await question('State/Province: ');
  const country = await question('Country Code (e.g., US): ');
  
  rl.close();
  
  const dname = `CN=${commonName}, OU=${orgUnit}, O=${org}, L=${city}, ST=${state}, C=${country}`;
  
  const command = [
    'keytool',
    '-genkeypair',
    '-v',
    '-storetype', 'PKCS12',
    '-keystore', `"${keystorePath}"`,
    '-alias', keyAlias,
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', '10000',
    '-storepass', storePassword,
    '-keypass', keyPassword,
    '-dname', `"${dname}"`
  ].join(' ');
  
  try {
    console.log('\n🔄 Generating keystore...');
    execSync(command, { stdio: 'inherit' });
    
    // Update gradle.properties with new tenant config
    await updateGradleProperties(tenantId, storePassword, keyPassword);
    
    // Update flavors.gradle with new tenant
    await updateFlavorsGradle(tenantId);
    
    console.log(`\n✅ UPLOAD KEY generated successfully for ${tenantId}!`);
    console.log(`📍 Location: ${keystorePath}`);
    console.log(`🔑 Key alias: ${keyAlias}`);
    console.log('\n🔐 KEY TYPE: Upload Key (for Google Play App Signing)');
    console.log('   - This key uploads APK/AAB to Google Play');
    console.log('   - Google will create and manage the actual app signing key');
    console.log('   - Users download APKs signed by Google\'s app signing key');
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. This is an UPLOAD KEY - Google manages the app signing key');
    console.log('2. Store your upload key and passwords securely');
    console.log('3. Never commit the keystore or real passwords to version control');
    console.log('4. The passwords have been added to gradle.properties');
    console.log('5. Upload keys can be replaced if lost (contact Google Support)');
    console.log(`6. Test the build: ./gradlew assemble${tenantId.charAt(0).toUpperCase() + tenantId.slice(1)}Release`);
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Build and upload your first APK to Google Play Console');
    console.log('2. Google will automatically create the app signing key');
    console.log('3. Verify Google Play App Signing is enabled in Console');
    
  } catch (error) {
    console.error('❌ Error generating keystore:', error.message);
    process.exit(1);
  }
}

generateKeystore().catch(console.error);