![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?style=flat-square&logo=redis&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq-F55036?style=flat-square)
![Discord](https://img.shields.io/badge/Discord-Notifications-5865F2?style=flat-square&logo=discord&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

## 📚 Documentation

Full setup guides, API references, and architecture deep-dives are available at:

**[muhammad-abdullah-khan.docs.buildwithfern.com](https://muhammad-abdullah-khan.docs.buildwithfern.com/ai-incident-report-and-alert-router/introduction)**

# Incident Intake & Notification Service

A Node.js + TypeScript service that receives webhook events, stores them, generates incident summaries with Groq, and dispatches notifications through email and Discord.

## Project Overview

This project accepts incoming event payloads from external systems, persists them in a PostgreSQL database, creates incident records, and sends notifications to configured channels. It is designed for monitoring or alerting pipelines where upstream services push incidents for triage and follow-up.

### What it does

- Accepts webhook events via HTTP
- Validates a shared webhook secret
- Stores event payloads in Prisma/PostgreSQL
- Uses Groq to generate incident titles, severity, summaries, and recommended actions
- Creates incident records and notification entries
- Enqueues email and Discord delivery jobs through BullMQ and Redis
- Exposes simple REST endpoints for managing stored events

## Architecture

The service is split into three main layers:

1. API layer
   - Express application in [src/server.ts](src/server.ts)
   - Webhook endpoint in [src/routes/webhook.ts](src/routes/webhook.ts)
   - Event management endpoints in [src/routes/events.ts](src/routes/events.ts)

2. Data layer
   - PostgreSQL via Prisma in [prisma/schema.prisma](prisma/schema.prisma)
   - Redis for BullMQ job queues in [src/db/redis.ts](src/db/redis.ts)

3. Processing layer
   - Groq-powered report generation in [src/services/groq.ts](src/services/groq.ts)
   - Email and Discord workers in [src/services/workers](src/services/workers)
   - Notification persistence and state updates in [src/services/notifications/notification.ts](src/services/notifications/notification.ts)

### Request flow

1. An external system sends a POST request to /webhook.
2. The server validates the X-Webhook-Secret header.
3. The event is saved to the events table.
4. Groq generates an incident report.
5. An incident row and notification rows are created.
6. Email and Discord jobs are queued in Redis.
7. Worker processes send the actual notifications.

### Architecture diagram

```mermaid
flowchart TD
    A[External Systems<br/>Datadog<br/>Stripe<br/>GitHub<br/>Grafana<br/>Custom Apps<br/>Customer Portal] --> B[Webhook Gateway]
    B --> C[Validate Signature]
    C --> D[PostgreSQL<br/>Raw Events]
    D --> E[BullMQ<br/>Redis Job Queue]
    E --> F[AI Analysis Worker]
    F --> G[AI Classification]
    G --> H[Incident Database]
    H --> I[Create Notification]
    I --> J[Notification Service<br/>Discord<br/>WhatsApp<br/>Email<br/>X]
    J --> K[Dashboard]
```
## 📁 Project Structure

```
src/
├── server.ts           # Express app bootstrap
├── routes/              # Webhook & event management routes
├── controllers/         # Request handlers
├── services/
│   ├── groq.ts          # Groq AI integration
│   ├── workers/         # BullMQ queues & worker bootstrapping
│   └── notifications/   # Email & Discord delivery logic
├── utils/                # Formatting & parsing helpers
prisma/
└── schema.prisma        # Prisma models & database schema
```
## Setup Instructions

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL database
- Redis instance
- SMTP-compatible email account
- Discord webhook URL
- Groq API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file in the project root with the variables listed below.

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Apply database migrations

```bash
npx prisma migrate deploy
```

### 5. Run the application

Start the API server:

```bash
npm run dev
```

Start the worker process in a second terminal:

```bash
npm run worker
```

The API will run on port 5000 by default.

## Environment Variables

The application expects the following environment variables:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
GROQ_API_KEY="your-groq-api-key"
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_USERNAME="default"
REDIS_PASSWORD="your-redis-password"
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-email-password"
PORT="5000"
WEBHOOK_SECRET="your-shared-secret"
```

### Notes

- WEBHOOK_SECRET must match the secret sent in the X-Webhook-Secret header.
- REDIS_HOST should point to a reachable Redis instance for the worker and queue system.
- DATABASE_URL must be a valid PostgreSQL connection string.

## Docker Usage

The repository includes a Dockerfile and docker-compose.yml for containerized development.

### Build and run with Docker Compose

```bash
docker compose up --build
```

This starts:

- an API container running the Express server
- a worker container running the BullMQ workers

The service listens on port 5000.

> The current compose setup expects the required environment variables to be provided through the .env file.

## API Endpoints

Base URL: http://localhost:5000

### Webhook

- POST /webhook
  - Auth header: X-Webhook-Secret
  - Creates an event, incident, and notification jobs

### Event management

- GET /all?page=1&limit=10&order=desc
  - Lists events with pagination and ordering
- GET /status?status=active
  - Filters events by status
- DELETE /delete
  - Deletes an event by id in the request body
- PATCH /:id/status
  - Marks an event as inactive

### Example request

```bash
curl -X POST http://localhost:5000/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-shared-secret" \
  -d '{
    "source": "monitoring-system",
    "status": "active",
    "payload": {
      "service": "auth-api",
      "metric": "error_rate",
      "value": 0.95,
      "region": "us-east-1"
    }
  }'
```

## Example Webhook Payload

```json
{
  "source": "monitoring-system",
  "status": "active",
  "payload": {
    "service": "payments-api",
    "severity": "high",
    "message": "High latency detected",
    "details": {
      "threshold": 500,
      "observed": 842
    }
  }
}
```

## Notes

- The service currently uses a simple in-process Express setup and does not expose a dedicated Swagger UI endpoint.
- Notification delivery is asynchronous via workers, so webhook responses are returned quickly while jobs are processed in the background.
- The generated incident content depends on the Groq model configuration and prompt defined in the application code.
