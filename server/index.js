require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is up and running!');
});

app.get('/api/themes/:tenantId', (req, res) => {
  const { tenantId } = req.params; 
  const theme = {
    id: tenantId,
    colors: { primary: '#FF5722', background: '#FFFFFF' }
  };
  res.json(theme);
});

app.get('/api/ui/:tenantId/:screen', (req, res) => {
  const { tenantId, screen } = req.params;
  const schema = { screen, components: [] };
  res.json(schema);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});
