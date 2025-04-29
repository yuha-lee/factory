const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const ejs = require('ejs');

const tenants = YAML.load(path.resolve(__dirname, '../themes/tenants.yaml'));

tenants.forEach(t => {
  const baseDir = path.resolve(__dirname, '../build/generated/res', t.id);
  const valuesDir = path.join(baseDir, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });

  const colorsTemplate = fs.readFileSync(
    path.resolve(__dirname, '../templates/colors.xml.ejs'),
    'utf8'
  );
  const colorsXml = ejs.render(colorsTemplate, { colors: t.colors });
  fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml);

  const stringsTemplate = fs.readFileSync(
    path.resolve(__dirname, '../templates/strings.xml.ejs'),
    'utf8'
  );
  const stringsXml = ejs.render(stringsTemplate, { appName: t.name });
  fs.writeFileSync(path.join(valuesDir, 'strings.xml'), stringsXml);
});
