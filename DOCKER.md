# Docker Setup Guide

This project includes Docker and Docker Compose configuration for easy development and deployment.

## Prerequisites

- Docker
- Docker Compose

## Running with Docker Compose

### Start the services

```bash
docker-compose up
```

To run in the background:

```bash
docker-compose up -d
```

### Stop the services

```bash
docker-compose down
```

To also remove the PostgreSQL data volume:

```bash
docker-compose down -v
```

## Services

### PostgreSQL Database
- **Host**: postgres
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: match_three_game
- **Data Volume**: postgres_data (persistent across restarts)

### Application
- **Container**: match-three-app
- **Port**: 3000
- **Health Check**: http://localhost:3000/health
- **Swagger Docs**: http://localhost:3000/api-docs

## Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

- `DB_NAME`: PostgreSQL database name (match_three_game)
- `DB_USER`: PostgreSQL user (postgres)
- `DB_PASS`: PostgreSQL password (postgres)
- `DB_HOST`: PostgreSQL host (postgres - service name)
- `DB_PORT`: PostgreSQL port (5432)
- `NODE_ENV`: Node environment (development)
- `PORT`: Application port (3000)

## Useful Docker Compose Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Execute commands in running container
docker-compose exec app npm run build
docker-compose exec postgres psql -U postgres -d match_three_game

# Restart services
docker-compose restart

# Remove everything (including volumes)
docker-compose down -v
```

## Manual Docker Builds (if needed)

```bash
# Build the image
docker build -t match-three-game-ts .

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST=postgres \
  -e DB_USER=postgres \
  -e DB_PASS=postgres \
  -e DB_NAME=match_three_game \
  match-three-game-ts
```

## Development Workflow

1. Start services with Docker Compose:
   ```bash
   docker-compose up
   ```

2. The application will automatically:
   - Install dependencies
   - Compile TypeScript
   - Connect to PostgreSQL
   - Start the server on port 3000

3. Access the API at: http://localhost:3000
4. Access Swagger documentation at: http://localhost:3000/api-docs

## Troubleshooting

### Database connection refused
- Ensure PostgreSQL service is running: `docker-compose ps`
- Check if port 5432 is available
- View logs: `docker-compose logs postgres`

### Application won't start
- Check logs: `docker-compose logs app`
- Ensure database is healthy: `docker-compose logs postgres | grep healthcheck`

### Port already in use
- Change ports in docker-compose.yml or use:
  ```bash
  docker-compose up -p <port>:3000
  ```
