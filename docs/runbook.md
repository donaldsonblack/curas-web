# Curas MVP - Runbook

**Version**: 0.1.0

This document provides instructions for setting up, running, and managing the Curas PWA and its backend services.

## 1. Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Java](https://adoptium.net/) (Temurin 21)
- [Docker](https://www.docker.com/) & Docker Compose
- [Terraform](https://www.terraform.io/)
- [AWS CLI](https://aws.amazon.com/cli/), configured with appropriate credentials.
- `make`

## 2. Environment Variables

The application requires environment variables for both frontend and backend. Create a `.env` file in both the `/frontend` and `/backend` directories based on the samples below.

### Backend (`/backend/.env.sample`)

```sh
# application.yml overrides for local development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=curas_dev
DB_USER=curas
DB_PASSWORD=localdev

# AWS Cognito (replace with actual values after infra setup)
COGNITO_USER_POOL_ID=ap-southeast-2_xxxxxxxxx
COGNITO_REGION=ap-southeast-2

# AWS S3 (replace with actual values after infra setup)
S3_BUCKET_NAME=curas-mvp-attachments-xxxx
S3_REGION=ap-southeast-2

# JWT Issuer URL
JWT_ISSUER_URI=https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_xxxxxxxxx
```

### Frontend (`/frontend/.env.sample`)

```sh
VITE_API_BASE_URL=http://localhost:8080/api
VITE_COGNITO_USER_POOL_ID=ap-southeast-2_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=ap-southeast-2
```

## 3. Local Development

Use the provided `Makefile` for common tasks.

1.  **Start local dependencies (Postgres DB)**:
    ```bash
    make up
    ```

2.  **Run Backend API**:
    Open a new terminal in `/backend`.
    ```bash
    ./mvnw spring-boot:run
    # API will be available at http://localhost:8080
    ```

3.  **Run Frontend PWA**:
    Open a new terminal in `/frontend`.
    ```bash
    npm install
    npm run dev
    # App will be available at http://localhost:5173
    ```

## 4. First-Time Setup & Seeding

After the infrastructure is deployed via Terraform, you will need to perform these manual steps:

1.  **Configure AWS Cognito**:
    - Create a User Pool and an App Client.
    - Update the `.env` files with the correct Pool ID, Client ID, and Region.

2.  **Seed the Database**:
    - Run the seeding script to populate the database with initial wards, assets, and checklist templates.
    ```bash
    # Ensure backend is running
    cd scripts
    npm install
    npx ts-node seed-assets.ts
    ```

## 5. Demo Users

Use the following credentials to log in to the application. These users will be created during the seeding process.

-   **Role**: Nurse Unit Manager (NUM)
    -   **Username**: `num@example.org`
    -   **Password**: `TempPass123!`

-   **Role**: Nurse
    -   **Username**: `nurse@example.org`
    -   **Password**: `TempPass123!`

## 6. Deployment

Deployment is handled by the GitHub Actions workflows in `/.github/workflows`.

-   `ci.yml`: Runs on every pull request. Performs linting, testing, and builds.
-   `deploy.yml`: Runs on merge to `main` branch. Triggers a Terraform plan (requires manual approval) and then applies infrastructure changes, builds and pushes container images, and deploys the application.
