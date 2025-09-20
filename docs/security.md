# Curas MVP - Security Model

This document outlines the security threat model, controls, and procedures for the Curas MVP. Our goal is to meet OWASP ASVS L1/L2 controls appropriate for a non-PHI application.

## 1. Threat Model (STRIDE-lite)

We use a simplified STRIDE model to identify potential threats.

| Category | Threat | Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | An attacker impersonates a Nurse or NUM. | - **Authentication**: AWS Cognito manages user credentials (username/password). Strong password policies enforced. <br> - **Authorization**: API endpoints are protected with JWTs issued by Cognito. Backend validates token signature and claims on every request. |
| **Tampering** | An attacker modifies data in transit or at rest (e.g., changing a checklist response). | - **In-Transit**: TLS 1.2+ enforced by AWS CloudFront and Application Load Balancer. <br> - **At-Rest**: Data is encrypted at rest in AWS RDS and S3. <br> - **Input Validation**: Strict server-side validation (Hibernate Validator) on all incoming data to prevent invalid or malicious payloads. <br> - **Immutability**: `ActivityEvent` log creates an immutable audit trail of all significant actions. |
| **Repudiation** | A user denies performing an action (e.g., submitting a checklist). | - **Auditing**: Every state change (create, update, submit) is recorded in the `ActivityEvent` table, including `actorUserId`, `occurredAt`, and a `requestId`. <br> - **Attribution**: User and timestamp are recorded for all key actions (e.g., `openedByUserId`, `submittedByUserId`). |
| **Information Disclosure** | An unauthorized party gains access to sensitive data (e.g., ward activity). | - **Authorization**: Role-based access control (RBAC) is enforced at the API layer using `@PreAuthorize` annotations. NUMs can see ward-level data; Nurses are restricted to their own actions. <br> - **Data Segregation**: API queries are scoped by `wardId` to prevent data leakage across wards. <br> - **S3 Security**: S3 buckets are private. File uploads/downloads use short-lived presigned URLs generated on-demand. <br> - **Secrets Management**: No secrets are stored in the repository. See §2 below. |
| **Denial of Service (DoS)** | An attacker overwhelms the service, making it unavailable for legitimate users. | - **Rate Limiting**: API Gateway and/or Spring Boot middleware will be configured to limit requests per IP/user. <br> - **Infrastructure**: AWS Shield Basic provides DDoS protection. AWS Fargate and RDS offer scalable resources. <br> - **Resource Limits**: File upload size is validated and limited to 10 MB. Request body sizes are limited by the web server. |
| **Elevation of Privilege** | A user with Nurse role gains NUM-level access. | - **RBAC**: Backend authorization logic strictly validates user roles from the JWT claim against the required role for each endpoint or service method. Horizontal privilege escalation is prevented by scoping data access by user/ward ID. |

## 2. Key Security Controls

- **Authentication**: Handled by AWS Cognito. The backend is a "resource server" that validates JWTs.
- **Authorization**: Enforced server-side using Spring Security's method-level security (`@PreAuthorize`). Roles (`NURSE`, `NUM`) are derived from JWT claims.
- **Input Validation**: All API inputs are validated on the server side using `hibernate-validator` against DTOs. Invalid requests are rejected with a `400 Bad Request` and a `problem+json` response.
- **Secure Uploads**: File uploads use a presigned URL pattern. The client requests a URL from the backend, which grants temporary PUT access to a specific key in a private S3 bucket. The backend validates file type and size before generating the URL.
- **CORS**: Cross-Origin Resource Sharing is configured on the backend to only allow requests from the deployed PWA's origin.
- **WAF**: A basic AWS WAF is deployed in front of CloudFront, providing protection against common web exploits like SQL injection and cross-site scripting (XSS).
- **HTTP Security Headers**: The application will be configured to send security headers (e.g., `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`).

## 3. Secrets Management

**No secrets shall ever be committed to the Git repository.**

- **Infrastructure Secrets** (e.g., RDS password): Managed by AWS Secrets Manager. The Fargate task role is granted permission to read these secrets at runtime.
- **Application Secrets** (e.g., Cognito Pool ID): These are passed to the application as environment variables.
- **Local Development**: Developers use `.env` files, which are listed in `.gitignore` and are not committed. A `.env.sample` file is provided in the repository as a template.
