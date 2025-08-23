const fs = require('fs');
const path = require('path');
const yaml = require('yamljs');
const ejs = require('ejs');

// Load tenant themes from synced YAML file
const tenantsPath = path.resolve(__dirname, '../tenants.yaml');

if (!fs.existsSync(tenantsPath)) {
  console.error('❌ Tenants YAML file not found. Run `npm run sync-themes` first.');
  process.exit(1);
}

const tenants = yaml.load(tenantsPath);

function renderTemplate(templateName, data) {
  const templatePath = path.resolve(__dirname, '../templates', templateName);
  const template = fs.readFileSync(templatePath, 'utf8');
  return ejs.render(template, data);
}

tenants.forEach(tenant => {
  const baseDir = path.resolve(
    __dirname,
    '../client/android/app/src/main/res',
    `values-${tenant.id}`
  );

  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const colorsXml = renderTemplate('colors.xml.ejs', tenant);
  fs.writeFileSync(path.join(baseDir, 'colors.xml'), colorsXml, 'utf8');

  const stringsXml = renderTemplate('strings.xml.ejs', tenant);
  fs.writeFileSync(path.join(baseDir, 'strings.xml'), stringsXml, 'utf8');
});
