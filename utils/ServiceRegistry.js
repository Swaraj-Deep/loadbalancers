const Service = require('./Service');
const minHeap = require('./Heap');

class ServiceRegistry {
  constructor() {
    this.port = 3000;
    this.serviceId = 0;
    minHeap.add({
      key: '0',
      data: {
        service: new Service({
          port: this.port,
          serviceId: `${this.serviceId}`,
        }).start(),
        serviceUrl: 'http://localhost',
        servicePort: this.port,
        serviceId: `${this.serviceId}`,
      },
    });
  }

  addService() {
    this.serviceId++;
    this.port++;
    minHeap.add({
      key: '0',
      data: {
        service: new Service({
          port: this.port,
          serviceId: `${this.serviceId}`,
        }).start(),
        serviceUrl: 'http://localhost',
        servicePort: this.port,
        serviceId: `${this.serviceId}`,
      },
    });
  }

  updateService(serviceId, requestNumber) {
    minHeap.updateByData(serviceId, requestNumber);
  }

  removeService(serviceId) {
    return minHeap.removeByData(serviceId);
  }

  getService() {
    const { data } = minHeap.peek();
    return {
      service: data.service,
      serviceUrl: `${data.serviceUrl}:${data.servicePort}`,
      serviceId: data.serviceId,
    };
  }

  print() {
    minHeap.printHeap();
  }
}

module.exports = new ServiceRegistry();
