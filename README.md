

Prometheus + Grafana:

Project:
E:\Projects\Monitoring
│   app.js
│   package.json
│   Dockerfile
│   docker-compose.yml
│   prometheus.yml
--------------------------

App.js
-------------------------------
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
-----------------------------------

package.json:
---------------------------------
{
  "name": "monitoring-app",
  "version": "1.0.0",
  "main": "app.js",
  "type": "commonjs",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prom-client": "^15.0.0"
  }
}
------------------------------------
Prometheus.yaml
-----------------------------------
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
------------------------------------
docker-compose.yml
-----------------------------------
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
-----------------------------------

Dockerfile
-------------------------------------
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
--------------------------------------

npm list express
npm list prom-client

Start the app:
node app.js


docker-compose up -d --build
docker ps

docker-compose exec prometheus ping app

move inside the Prometheus :
docker-compose exec prometheus sh

check the output:
curl http://app:3000/metrics




docker run -it --network monitoring_default alpine sh
apk add curl
curl http://app:3000/metrics




Data Source in Grafana:
http://monitoring-prometheus-1:9090



In Grafana Dashboard:

Grafana → + → Dashboard → Add new panel

Select Prometheus as data source

Query your metric:

node_request_count


	