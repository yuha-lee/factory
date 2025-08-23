const fs = require('fs');
const path = require('path');
const yaml = require('yamljs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncThemes() {
  try {
    console.log('🔄 Syncing themes from Supabase...');
    
    // Fetch tenant themes from database
    const { data: tenantThemes, error } = await supabase
      .from('tenant_themes')
      .select('tenant_id, name, theme');
    
    if (error) {
      throw new Error(`Failed to fetch tenant themes: ${error.message}`);
    }
    
    if (!tenantThemes || tenantThemes.length === 0) {
      console.warn('⚠️  No tenant themes found in database');
      return;
    }
    
    // Transform to YAML format expected by generate-resources.js
    const yamlData = tenantThemes.map(row => {
      const { tenant_id, name, theme } = row;
      
      // Validate required fields
      if (!name) {
        throw new Error(`Missing name for tenant ${tenant_id}`);
      }
      if (!theme || !theme.colors) {
        throw new Error(`Invalid theme data for tenant ${tenant_id}: missing colors`);
      }
      
      return {
        id: tenant_id,
        name: name,
        colors: theme.colors,
        logo: theme.logo || null
      };
    });
    
    // Write to YAML file
    const outputPath = path.resolve(__dirname, '../tenants.yaml');
    const yamlString = yaml.stringify(yamlData, 2);
    
    // Output path is in root directory, no need to create directory
    
    fs.writeFileSync(outputPath, yamlString, 'utf8');
    
    console.log(`✅ Successfully synced ${yamlData.length} tenant themes to ${outputPath}`);
    
    // Log synced tenants
    yamlData.forEach(tenant => {
      console.log(`   - ${tenant.id}: ${tenant.name}`);
    });
    
  } catch (error) {
    console.error('❌ Theme sync failed:', error.message);
    process.exit(1);
  }
}

// Run sync if called directly
if (require.main === module) {
  syncThemes();
}

module.exports = { syncThemes };