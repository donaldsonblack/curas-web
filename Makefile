.PHONY: help up down install test clean

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  up          - Start local development services (PostgreSQL)."
	@echo "  down        - Stop local development services."
	@echo "  install     - Install all project dependencies (frontend and backend)."
	@echo "  test        - Run tests for both frontend and backend."
	@echo "  clean       - Remove build artifacts and node_modules."

# --- Docker Compose Commands ---
up:
	@echo "Starting local PostgreSQL container..."
	docker-compose up -d


down:
	@echo "Stopping local PostgreSQL container..."
	docker-compose down

# --- Project Lifecycle Commands ---
install:
	@echo "Installing backend dependencies..."
	@cd backend && ./mvnw dependency:go-offline
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install


test:
	@echo "Running backend tests..."
	@cd backend && ./mvnw test
	@echo "Running frontend tests..."
	@cd frontend && npm test


clean:
	@echo "Cleaning backend..."
	@cd backend && ./mvnw clean
	@echo "Cleaning frontend..."
	@cd frontend && rm -rf node_modules dist
	@echo "Stopping and removing docker volumes..."
	docker-compose down -v
