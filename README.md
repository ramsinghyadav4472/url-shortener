# 🚀  URL Shortener

A scalable, high-performance URL shortener system designed with DevOps best practices. Built to demonstrate containerization, orchestration, CI/CD, and monitoring.

## 🏗️ Architecture

```text
[Client] -> [LoadBalancer (K8s Service)]
                    |
          [URL Shortener App (Node.js)]
          /         |         \
   [Redis Cache] [Postgres DB] [Prometheus]
```

## 🛠️ Tech Stack
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL (StatefulSet in K8s)
- **Cache**: Redis (Deployment in K8s)
- **Orchestration**: Docker & Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus & Grafana (Phase 5)

## 📦 Features
- **Cache-Aside Pattern**: Sub-millisecond redirects via Redis.
- **Multi-Stage Docker Builds**: Optimized production images (~150MB).
- **Self-Healing**: Kubernetes Liveness and Readiness probes.
- **Resource Management**: CPU and Memory limits for cluster stability.
- **Secrets Management**: Sealed configurations using K8s Secrets.

## 🚀 Getting Started

### Local Development (Docker Compose)
```bash
docker-compose up --build
```
The app will be available at `http://localhost:3000`.

### Kubernetes Deployment
```bash
kubectl apply -f k8s/
```

### Running Tests
```bash
npm install
npm test
```

## 📈 Roadmap
- [x] Phase 1: Core Logic
- [x] Phase 2: Dockerization
- [x] Phase 3: Kubernetes Manifests
- [x] Phase 4: CI/CD Pipeline
- [ ] Phase 5: Monitoring & Logging
- [ ] Phase 6: Scaling & Optimization
