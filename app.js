const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// Create a counter metric
const counter = new client.Counter({
  name: 'node_request_count',
  help: 'Number of requests received'
});

// Root endpoint
app.get('/', (req, res) => {
  counter.inc();
  res.send('Hello, World!');
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
