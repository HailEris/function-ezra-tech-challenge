# Ezra Sr. Quality Engineering Challenge

## 🏗 Architecture & Strategy
This repository implements a **Tiered Testing Architecture** using Playwright and the Page Object Model (POM). My strategy focuses on high-impact user journeys and regulatory compliance (HIPAA).

### Test Organization
*   **Smoke Tests (`tests/e2e-booking-smoke.spec.ts`)**: Validates the "Golden Path" from landing to successful payment.
*   **Functional Validation (`tests/identity-validation.spec.ts`)**: Deep-dive into clinical eligibility logic (e.g., 18+ age requirement) and form state.
*   **Transactional Integrity (`tests/payment-validation.spec.ts`)**: Handles complex iFrame interactions with Stripe and validates financial error-handling.

### Senior-Level Decisions
*   **Encapsulation**: Used `BasePage` and `protected` modifiers to ensure tests interact only with high-level Page Object methods, making the suite resilient to UI changes.
*   **Dynamic Data**: Created `BaseUtils` to calculate ages relative to the current date, ensuring tests remain "evergreen."
*   **Security Critique**: Addressed IDOR (Insecure Direct Object Reference) risks by designing integration tests that verify cross-user data isolation. I recommend an **API Gateway/mTLS** approach to reduce the 100+ endpoint attack surface.

## 🚀 Getting Started

### Prerequisites
*   **macOS / Windows**: [Docker Desktop](https://www.docker.com) (includes Docker Engine and Compose V2 via WSL2 on Windows).
*   **Linux**: [Docker Engine](https://docs.docker.com) and the [Docker Compose plugin](https://docs.docker.com/compose/install/linux/).

### Running Tests
To build the image and run the entire suite with automated report syncing:
```bash
docker compose up --build
```

### Viewing Reports
After the test run the report can be viewed using the following command:
```bash
npx playwright show-report playwright-report
```
