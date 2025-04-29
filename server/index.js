require('dotenv').config();
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const memoryStore = new session.MemoryStore();
console.log('KEYCLOAK_CLIENT_ID=', process.env.KEYCLOAK_CLIENT_ID);

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM,
  resource: process.env.KEYCLOAK_CLIENT_ID,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET
  },
  'ssl-required': 'external',
  'confidential-port': 0,
  'bearer-only': true
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('API is up and running!');
});

app.get('/api/themes/:tenantId', keycloak.protect(), (req, res) => {
  const { tenantId } = req.params; 
  const theme = {
    id: tenantId,
    colors: { primary: '#FF5722', background: '#FFFFFF' }
  };
  res.json(theme);
});

app.get('/api/ui/:tenantId/:screen', keycloak.protect(), (req, res) => {
  const { tenantId, screen } = req.params;
  const schema = { screen, components: [] };
  res.json(schema);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});
