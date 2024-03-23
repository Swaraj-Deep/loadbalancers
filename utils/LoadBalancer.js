const express = require('express');
const request = require('request');
const serviceRegistry = require('./ServiceRegistry');

class LoadBalancer {
  constructor(config = { port: 8000 }) {
    this.port = config.port;
  }

  start() {
    const app = express();
    const port = this.port;
    app.use(express.json());

    app.post('/health', (req, res) => {
      const serviceId = req.headers['x-service-id'];
      const requestNumber = req.headers['x-request-number'];
      const healthData = req.body;
      if (healthData.status === 'DOWN') {
        serviceRegistry.addService();
        serviceRegistry.removeService(serviceId);
      } else {
        serviceRegistry.updateService(serviceId, requestNumber);
      }
      res.sendStatus(200);
    });

    app.get('/', (req, res) => {
      const { serviceUrl } = serviceRegistry.getService();
      const options = {
        url: serviceUrl,
        method: req.method,
        headers: req.headers,
        qs: req.query,
      };

      const forwardReq = request(options);

      req
        .pipe(forwardReq)
        .on('response', (forwardRes) => {
          res.writeHead(forwardRes.statusCode, forwardRes.headers);
          forwardRes.pipe(res);
        })
        .on('error', (err) => {
          res.statusCode = 502;
          res.end(`Error: ${err.message}`);
        });
    });

    app.listen(port, () => {
      console.log(`LoadBalancer listening on port ${port}`);
    });
  }
}

module.exports = LoadBalancer;
