# KicksMtaani — SneakRoom

Premium sneaker e-commerce platform for Kenya. Built with modern technologies to deliver a seamless shopping experience with M-Pesa and Flutterwave payment integrations.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9
- [Docker](https://www.docker.com/) & Docker Compose

### Setup

```bash
# Clone the repository
git clone https://github.com/error302/kicksmtaani.git
cd kicksmtaani

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Start infrastructure services (Postgres, Redis, Meilisearch)
docker compose up -d

# Run database migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

The storefront runs at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:4000](http://localhost:4000).

## Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | Next.js 14, React 18, Tailwind CSS, Zustand     |
| **Backend**        | Express.js, Prisma ORM                          |
| **Database**       | PostgreSQL 16                                   |
| **Cache**          | Redis 7                                         |
| **Search**         | Meilisearch v1.6                                |
| **Payments**       | M-Pesa (Safaricom Daraja API), Flutterwave      |
| **Notifications**  | Africa's Talking (SMS), Nodemailer (Email)      |
| **Infrastructure** | Docker Compose, Turborepo                       |
| **Tooling**        | TypeScript, ESLint, Prettier, Husky, Commitlint |

## Project Structure

```
kicksmtaani/
├── apps/
│   ├── web/              # Next.js 14 storefront (SneakRoom)
│   └── api/              # Express REST API
├── packages/
│   ├── db/               # Prisma schema & migrations
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── tests/
│   └── load/             # k6 load testing scripts
├── docs/                 # Project documentation
├── infrastructure/       # Deployment & infra configs
├── docker-compose.yml    # Local development services
└── turbo.json            # Turborepo pipeline config
```

## API Endpoints

All API routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| `POST` | `/auth/register` | Register a new user      |
| `POST` | `/auth/login`    | Login and receive tokens |
| `POST` | `/auth/refresh`  | Refresh access token     |
| `GET`  | `/auth/me`       | Get current user profile |

### Products

| Method | Endpoint              | Description                                     |
| ------ | --------------------- | ----------------------------------------------- |
| `GET`  | `/products`           | List products (supports filtering & pagination) |
| `GET`  | `/products/:slug`     | Get product by slug                             |
| `GET`  | `/products/search?q=` | Full-text search via Meilisearch                |

### Orders

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| `POST` | `/orders`         | Create a new order               |
| `GET`  | `/orders`         | List authenticated user's orders |
| `GET`  | `/orders/:id`     | Get order details                |
| `POST` | `/orders/:id/pay` | Initiate payment for an order    |

### Payments

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| `POST` | `/payments/webhook/mpesa`       | M-Pesa callback handler      |
| `POST` | `/payments/webhook/flutterwave` | Flutterwave callback handler |

### Admin

| Method   | Endpoint              | Description                    |
| -------- | --------------------- | ------------------------------ |
| `GET`    | `/admin/stats`        | Dashboard statistics           |
| `GET`    | `/admin/orders`       | List all orders                |
| `PATCH`  | `/admin/orders/:id`   | Update order status            |
| `GET`    | `/admin/products`     | List all products (admin view) |
| `POST`   | `/admin/products`     | Create a product               |
| `PATCH`  | `/admin/products/:id` | Update a product               |
| `DELETE` | `/admin/products/:id` | Delete a product               |

## Available Scripts

```bash
# Development
pnpm dev                # Start all apps in dev mode
pnpm build              # Build all packages
pnpm lint               # Lint all packages
pnpm typecheck          # Type-check all packages

# Database
pnpm db:migrate         # Run Prisma migrations
pnpm db:seed            # Seed the database
pnpm db:studio          # Open Prisma Studio

# Testing
pnpm test                       # Run unit tests
pnpm --filter @kicksmtaani/web test:e2e   # Run E2E tests
```

## Testing

### Unit & Integration Tests

```bash
pnpm test
```

### End-to-End Tests

```bash
pnpm --filter @kicksmtaani/web test:e2e
```

### Load Tests

Load tests use [k6](https://k6.io/). Install k6 first, then run:

```bash
k6 run tests/load/api.js
```

## Deployment

### Frontend — Vercel

1. Import the repository on [Vercel](https://vercel.com)
2. Set the root directory to `apps/web`
3. Configure environment variables from `.env.example`
4. Deploy

### Backend — Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect the GitHub repository
3. Set the root directory to `apps/api`
4. Add a PostgreSQL and Redis service
5. Configure environment variables
6. Deploy

### Full Stack — Docker Compose (Production)

```bash
# Build and start all services
docker compose -f docker-compose.yml up -d --build
```

## Environment Variables

All required environment variables are documented in [`.env.example`](.env.example). Key variables include:

| Variable                 | Description                    |
| ------------------------ | ------------------------------ |
| `DATABASE_URL`           | PostgreSQL connection string   |
| `REDIS_URL`              | Redis connection string        |
| `JWT_SECRET`             | Secret key for JWT signing     |
| `MEILISEARCH_URL`        | Meilisearch instance URL       |
| `MPESA_CONSUMER_KEY`     | M-Pesa Daraja API consumer key |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret key         |
| `AFRICASTALKING_API_KEY` | Africa's Talking SMS API key   |

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `pnpm lint` and `pnpm typecheck` pass
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
5. Open a Pull Request

## License

MIT
