# Ledger / Wallet Service – Assignment

Build a **Ledger / Wallet Service** in **NestJS** with two endpoints:

- `POST /wallet/transaction` → record a new transaction.  

---

## Requirements

- **Transactions & Ledger**  
  - Record each transaction with `transactionId`, `type`, `amount`, `currency`, and `createdAt`.  
  - Positive amounts increase balance, negative amounts decrease balance.  
  - Balance must **never go negative** (reject if insufficient funds).  
  - All transactions are **append-only** (cannot be updated or deleted).  

- **Currency Handling**  
  - Internally store all amounts in **EGP**.  
  - If a different currency is provided, you can use a **mock conversion service** before saving.  

- **Atomicity**  
  - All transactions must be **atomic** (balance should always remain consistent even under concurrent requests).  

- **Idempotency**  
  - If the same `transactionId` is sent more than once, process it **only once**.  

---

## API Documentation

Once the service is running, Swagger API docs are available at:

👉 **http://localhost:8001/api/docs**

---

## Running Locally (without Docker)

1. Clone the repo:
   ```bash
   git clone https://github.com/ahmedttallah/ledger-task.git
   cd ledger-service
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials:
   ```env
   PORT=8001
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=123456
   DATABASE_NAME=ledger
   ```

4. Run database migrations (if configured):
   ```bash
   npm run migration:run
   # or
   yarn migration:run
   ```

5. Start the app:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

6. Access the app:
   - API → http://localhost:8001  
   - Docs → http://localhost:8001/api/docs  

---

## Running with Docker

1. Build and start services:
   ```bash
   docker-compose up --build
   ```

2. Access the app:
   - API → http://localhost:8001  
   - Docs → http://localhost:8001/api/docs  

3. Stop services:
   ```bash
   docker-compose down
   ```

---

## Running Tests

To run the unit tests:

```bash
npm run test
# or
yarn test
```

Or inside Docker:

```bash
docker-compose exec ledger yarn test
```

---

## Covered Test Cases

- ✅ Deposit increases balance.  
- ✅ Withdrawal decreases balance.  
- ✅ Withdrawal rejected if it would go negative.  
- ✅ Idempotent transactions don’t duplicate effects.  
- ⚡ Concurrent transactions keep balance consistent.  

---

## Example Requests

### Deposit
```http
POST /wallet/transaction
Content-Type: application/json

{
  "transactionId": "tx-1001",
  "amount": 500,
  "currency": "EGP"
}
```

### Withdrawal
```http
POST /wallet/transaction
Content-Type: application/json

{
  "transactionId": "tx-1002",
  "amount": -200,
  "currency": "EGP"
}
```

### Response
```json
{
  "transaction": {
    "id": "tx-1001",
    "amountEGP": 500,
    "type": "deposit",
    "currency": "EGP",
    "originalAmount": 500,
    "createdAt": "2025-09-23T10:00:00.000Z"
  },
  "wallet": {
    "balance": 1500,
    "currency": "EGP"
  }
}
```
