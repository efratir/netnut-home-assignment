# Web Scraper Assignment

A production-style web scraping system built as a microservices monorepo. Clients submit URLs via a REST API and receive the scraped HTML asynchronously. Each service is independently deployable and the architecture supports horizontal scaling.

---

## Repository Structure

```
├── Scraper/          # NestJS monorepo — all source code and migrations
├── k8s/              # Kubernetes manifests for all services and infrastructure
└── architecture/     # System design diagrams (draw.io + SVG export)
```

---

### Services

| Service | Port | Responsibility |
|---|---|---|
| **API** | 3000 | Public-facing gateway. Forwards requests to Job Manager, returns job status to clients |
| **Job Manager** | 3001 | Creates job records in Postgres, enqueues scrape tasks to Redis via BullMQ |
| **Scraper** | 3002 | BullMQ worker — fetches HTML from URLs, writes results back to Postgres |

### Shared Library (`@scraper/shared`)

Common code shared across all three services:
- `PrismaService` / `PrismaModule` — database client
- `CreateJobDto` / `JobResponseDto` — request/response shapes with validation
- `ScrapeJobPayload` — typed queue message contract
- `SCRAPE_QUEUE` — queue name constant

---

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** NestJS 11
- **Monorepo:** Nx 23
- **Database:** PostgreSQL 15 + Prisma ORM
- **Queue:** Redis 7 + BullMQ
- **Language:** TypeScript 5.9
- **Container orchestration:** Kubernetes (manifests included)

---

## Local Development

### Prerequisites

- Node.js 20+
- Docker Desktop
- npm

### 1. Install dependencies

```bash
cd Scraper
npm install
```

### 2. Start infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.

### 3. Configure environment

```env
DATABASE_URL="postgresql://scraper:scraper@localhost:5432/scraper"

REDIS_HOST=localhost
REDIS_PORT=6379

API_PORT=3000
JOB_MANAGER_PORT=3001
SCRAPER_PORT=3002

JOB_MANAGER_URL=http://localhost:3001

# Optional — leave commented out to scrape without a proxy
# PROXY_URL=http://user:password@your-proxy-host:port
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start all services

Open three terminals and run each service:

```bash
# Terminal 1
npm run serve:api

# Terminal 2
npm run serve:job-manager

# Terminal 3
npm run serve:scraper
```

---
