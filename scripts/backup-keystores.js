#!/usr/bin/env node

/**
 * Keystore Backup Management Script
 * Automatically backup all tenant keystores to secure location
 * Usage: node backup-keystores.js [backup-location]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createBackup() {
  const backupLocation = process.argv[2] || path.join(process.env.HOME || process.env.USERPROFILE, 'secure-keystore-backup');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(backupLocation, `backup-${timestamp}`);
  
  console.log('🔐 Keystore Backup Manager\n');
  console.log(`📍 Backup location: ${backupDir}`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Created backup directory');
  }
  
  const keystoresDir = path.join(__dirname, '../client/android/app/keystores');
  
  if (!fs.existsSync(keystoresDir)) {
    console.error('❌ Keystores directory not found:', keystoresDir);
    return;
  }
  
  // Find all keystore files
  const keystoreFiles = fs.readdirSync(keystoresDir)
    .filter(file => file.endsWith('-release.keystore'));
    
  if (keystoreFiles.length === 0) {
    console.log('⚠️  No keystore files found to backup');
    return;
  }
  
  console.log(`\n📦 Found ${keystoreFiles.length} keystore(s) to backup:`);
  
  // Copy each keystore file
  keystoreFiles.forEach(file => {
    const sourcePath = path.join(keystoresDir, file);
    const destPath = path.join(backupDir, file);
    
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Backed up: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to backup ${file}:`, error.message);
    }
  });
  
  // Backup gradle.properties (for password reference)
  const gradlePropsSource = path.join(__dirname, '../client/android/gradle.properties');
  const gradlePropsBackup = path.join(backupDir, 'gradle.properties.backup');
  
  try {
    fs.copyFileSync(gradlePropsSource, gradlePropsBackup);
    console.log('✅ Backed up: gradle.properties');
  } catch (error) {
    console.error('❌ Failed to backup gradle.properties:', error.message);
  }
  
  // Create backup manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    keystores: keystoreFiles,
    location: backupDir,
    notes: [
      'These are UPLOAD KEYS for Google Play App Signing',
      'Store this backup in a secure, encrypted location',
      'Google manages the actual app signing keys',
      'Upload keys can be replaced if lost (contact Google Support)'
    ]
  };
  
  fs.writeFileSync(
    path.join(backupDir, 'backup-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\n📋 Backup completed successfully!');
  console.log(`📍 Location: ${backupDir}`);
  console.log(`📄 Files backed up: ${keystoreFiles.length + 1} (includes gradle.properties)`);
  
  console.log('\n🔒 SECURITY RECOMMENDATIONS:');
  console.log('1. Encrypt this backup directory');
  console.log('2. Store in multiple secure locations (cloud + offline)');
  console.log('3. Verify backup integrity regularly');
  console.log('4. Update backup after adding new tenants');
  
  console.log('\n💡 RECOVERY INSTRUCTIONS:');
  console.log('If you need to restore a keystore:');
  console.log(`cp "${backupDir}/<tenant>-release.keystore" client/android/app/keystores/`);
  console.log('Then update gradle.properties with the correct passwords');
}

createBackup();