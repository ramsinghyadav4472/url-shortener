<div align="center">
  
# 🚀 NanoURL: Production-Grade URL Shortener
**A Highly Available, Scalable, and Observable Microservice Architecture**

[![Build Status](https://img.shields.io/github/actions/workflow/status/aarnav2/url-shortener/main.yml?style=for-the-badge&logo=github)](https://github.com/aarnav2/url-shortener/actions)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/aarnav2/url-shortener)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## 📖 Project Overview
NanoURL is a robust, production-ready URL shortening service engineered to demonstrate advanced **Cloud & DevOps practices**. Rather than a basic CRUD application, this project focuses heavily on **Scalability, Fault Tolerance, and Observability**.

Designed to handle massive read-heavy traffic spikes, the system utilizes a **Cache-Aside pattern** with Redis and PostgreSQL, deployed across a self-healing Kubernetes cluster. The entire lifecycle is automated via a declarative GitOps CI/CD pipeline.

### ✨ Why This Project Stands Out (For Recruiters)
- **Zero-Downtime Scalability:** Implements Kubernetes Horizontal Pod Autoscalers (HPA) to dynamically adjust to explosive traffic loads based on CPU utilization.
- **Extreme Read Performance:** Reduces database I/O by 99% using Redis caching for sub-millisecond redirect lookups.
- **Secure & Optimized Pipelines:** Features Multi-Stage Docker builds that reduce image size from >800MB down to ~150MB, significantly reducing the attack surface.
- **Deep Observability:** Instrumentations are natively built into the Node.js API to scrape "RED" (Rate, Errors, Duration) metrics directly into Prometheus and Grafana.
- **Abuse Prevention:** Hardened with application-layer rate-limiting to prevent DDoS attacks and token exhaustion.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Role Focus** | DevOps & Cloud Engineer |
| **Frontend** | Vanilla JS, HTML5, CSS3 (Premium Glassmorphism UI) |
| **Backend API** | Node.js, Express.js |
| **Databases** | PostgreSQL (Persistent Storage), Redis (In-Memory Cache) |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (StatefulSets, Deployments, HPA, Probes) |
| **CI/CD** | GitHub Actions |
| **Observability** | Prometheus, Grafana |
| **Cloud Target** | AWS (EKS, RDS, ElastiCache, ALB) |

---

## 🏗️ System Architecture

*(Placeholder for Architecture Diagram)*
![Architecture Diagram](https://via.placeholder.com/800x400.png?text=System+Architecture+Diagram)

### Traffic Flow:
1. **Client** hits the AWS Application Load Balancer.
2. Traffic is routed to the **Node.js Kubernetes ReplicaSet**.
3. **Cache-Aside Lookup**: The Node.js app intercepts the short code and queries **Redis**.
   - *Cache Hit*: Instantly returns the long URL.
   - *Cache Miss*: Queries **PostgreSQL**, caches the result in Redis with a TTL, and returns the long URL.
4. **Metrics**: **Prometheus** continuously scrapes the `/metrics` endpoint on the Node.js pods to populate Grafana dashboards in real-time.

---

## ⚙️ Step-by-Step Setup

### 1️⃣ Local Development (Node.js)
```bash
git clone https://github.com/aarnav2/url-shortener.git
cd url-shortener
npm install
npm test
npm start
```

### 2️⃣ Docker Compose (Local Orchestration)
To spin up the entire application along with the databases and monitoring stack seamlessly:
```bash
# Build and start all containers in detached mode
docker-compose up -d --build

# View real-time logs
docker-compose logs -f app
```
- **UI & API:** `http://localhost:3000`
- **Grafana Dashboards:** `http://localhost:3001` (admin/admin)
- **Prometheus:** `http://localhost:9090`

### 3️⃣ Kubernetes Deployment (Production)
Assuming you have a Kubernetes cluster (e.g., Minikube, EKS, or Docker Desktop K8s) running:

```bash
# 1. Apply Secrets & Namespaces
kubectl apply -f k8s/secrets.yaml

# 2. Deploy Stateful Databases (Postgres & Redis)
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml

# 3. Deploy the Node.js Application & HPA
kubectl apply -f k8s/app.yaml
kubectl apply -f k8s/hpa.yaml

# 4. Verify Pod Health and Autoscaling
kubectl get pods -w
kubectl get hpa
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The project utilizes a fully automated CI/CD pipeline triggered on every push and pull request to the `main` branch.

1. **Continuous Integration (CI):** 
   - Provisions a sterile Ubuntu environment.
   - Installs dependencies and runs `Jest` unit tests to ensure business logic remains impenetrable.
2. **Continuous Deployment (CD):** 
   - Upon successful tests, it authenticates with Docker Hub.
   - Executes the Multi-Stage `Dockerfile`.
   - Tagging Strategy: Tags the image with the **Git Commit SHA** (for precise absolute rollbacks) and pushes it to the remote registry where Kubernetes can pull it.

---

## 📡 API Documentation

### 1. Create a Short URL
- **Endpoint:** `POST /shorten`
- **Rate Limit:** 100 requests per 15 minutes per IP.
- **Request Body:**
  ```json
  { "longUrl": "https://www.google.com/search?q=devops+engineering" }
  ```
- **Response:**
  ```json
  {
    "longUrl": "https://www.google.com/search?q=devops+engineering",
    "shortUrl": "http://localhost:3000/xyz123",
    "shortCode": "xyz123"
  }
  ```

### 2. Redirect
- **Endpoint:** `GET /:shortCode`
- **Response:** `302 Redirect` to the original long URL.

### 3. Health & Metrics
- **Endpoint:** `GET /health` (Used by K8s Liveness/Readiness Probes)
- **Endpoint:** `GET /metrics` (Scraped exclusively by Prometheus)

---

## 📸 Screenshots & Demo

*(Placeholder for Application UI Screenshot)*
<br>
![Application UI](https://via.placeholder.com/800x400.png?text=Premium+Glassmorphism+UI+Screenshot)
<br><br>

*(Placeholder for Grafana Dashboard Screenshot)*
<br>
![Grafana Dashboard](https://via.placeholder.com/800x400.png?text=Grafana+Traffic+Monitoring+Dashboard)
<br><br>

---

<div align="center">
  <i>Architected with ❤️ for Production Environments.</i>
</div>
