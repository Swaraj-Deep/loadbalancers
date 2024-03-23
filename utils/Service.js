const express = require('express');
const request = require('request');

class Service {
  constructor(initialConfig) {
    const config = {
      ...{ port: 3000, serviceId: '000', threshold: 4 },
      ...initialConfig,
    };
    this.port = config.port;
    this.serviceId = config.serviceId;
    this.requestNumber = 0;
    this.threshold = config.threshold;
    setInterval(() => {
      const serviceHealth = {
        status: this.requestNumber < this.threshold ? 'UP' : 'DOWN',
        requestNumber: this.requestNumber,
        serviceId: this.serviceId,
      };
      const data = JSON.stringify(serviceHealth);
      const options = {
        url: 'http://localhost:8000/health',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-id': this.serviceId,
          'x-request-number': this.requestNumber,
        },
        body: data,
      };
      request(options, (error, response, body) => {
        if (error) {
          console.error(`Error sending health status: ${error}`);
        }
        if (this.requestNumber >= this.threshold) {
          setTimeout(() => {
            this.requestNumber = 0;
          }, 5000);
        }
      });
    }, 500);
  }

  start() {
    const app = express();
    const port = this.port;

    app.get('/', (req, res) => {
      this.requestNumber++;
      res.set({
        'x-service-id': this.serviceId,
        'x-request-number': this.requestNumber,
      });
      if (this.requestNumber <= this.threshold) {
        res.send(
          'Hello from service ' + this.serviceId + ' ' + this.requestNumber
        );
      } else {
        res.send(
          'Service overloaded ' + this.serviceId + ' ' + this.requestNumber
        );
      }
    });

    app.listen(port, () => {
      console.log(`Service ${this.serviceId} listening on port ${port}`);
    });

    return `Service registered`;
  }
}

module.exports = Service;
