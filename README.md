# Load Balancer with Min-Heap

## Overview

This is a basic implementation of a load balancer that uses a min-heap data structure to distribute incoming requests among a cluster of backend servers. The primary goal is to balance the load across servers based on their current utilization.

## Current Implementation

### Load Balancer Node

- A single load balancer node is deployed, acting as an entry point for all incoming client requests.
- The load balancer maintains a min-heap of backend servers, sorted by their current load.
- When a new request arrives, the load balancer forwards it to the backend server with the minimum load from the min-heap.

### Backend Server Management

- Backend servers are added to the min-heap initially.
- A health check mechanism monitors the servers' health and resource utilization.
- If a server fails or reaches a defined utilization threshold (e.g., 80%), a new server is added to the min-heap.
- New servers are added as the root of the min-heap to prioritize them for receiving traffic.

## Future Scope

### Load Balancer Scalability

- Implement Anycast routing to distribute incoming traffic across multiple load balancer instances for high availability.
- Scale horizontally by adding more load balancer nodes as traffic increases.

### Write-Ahead Log (WAL) for State Persistence

- Introduce a Write-Ahead Log (WAL) to persist the load balancer's state (min-heap) across instances.
- Use a distributed WAL Server cluster to store and replicate the WAL from all load balancer instances.
- In case of a load balancer failure, new instances can recover their state by replaying the WAL.

### Request Buffering with Apache Kafka

- Implement a distributed request queue using Apache Kafka to buffer requests during load balancer failures.
- Once a new load balancer instance is launched, it can start processing the buffered requests from the queue.

### Monitoring, Logging, and Autoscaling

- Implement comprehensive monitoring and logging solutions for the entire system.
- Collect and analyze metrics to identify bottlenecks and performance issues.
- Implement autoscaling policies to dynamically scale load balancer instances based on traffic patterns.
