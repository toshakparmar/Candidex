# Candidex — Question Management API

Lightweight REST API to create, read, update and delete different question types (MCQ, Programming, Descriptive, Image-based). Built with Node.js, Express and TypeScript. This README is intentionally short and actionable.

## Quickstart

1. Install dependencies

```powershell
npm install
```

2. Copy env and set values (update DATABASE_URL for Postgres)

```powershell
copy .env.example .env
# Edit .env (DATABASE_URL)
```

3. Run in development

```powershell
npm run dev
```

4. Build and run production

```powershell
npm run build
npm start
```

Server default: http://localhost:3000

## Important scripts

- `npm run dev` — start in dev (ts-node-dev)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled build
- `npm test` — run Jest tests + coverage
- `npm run test:watch` — Jest in watch mode
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Environment & Prisma

- The app uses Prisma + PostgreSQL. Set `DATABASE_URL` in `.env` (percent-encode special characters in password).
- After setting `.env` run (once) to generate client and create schema:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

## Environment & Prisma

- The app uses Prisma + PostgreSQL. Set `DATABASE_URL` in `.env` (percent-encode special characters in the password).
- After setting `.env` run (once) to generate client and create schema:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

If Prisma engine download fails due to network/proxy, unset proxy env vars or run from a network without that proxy.

## API Overview

Base URL: `/api/v1`

Endpoints (core):

- POST /api/v1/questions — create a question
- GET /api/v1/questions — list questions (pagination + filters)
- GET /api/v1/questions/:id — get single question
- PUT /api/v1/questions/:id — update question
- DELETE /api/v1/questions/:id — delete question
- GET /api/v1/questions/category/:category — questions by category
- GET /api/v1/questions/type/:type — questions by type

Query params for listing (`GET /api/v1/questions`): `page`, `limit`, `type`, `category`, `difficulty`, `visibility`, `tags` (comma-separated), `sortBy`, `sortOrder`.

Request body notes:

- `type` must be one of the defined QuestionType enums (MCQ, PROGRAMMING, DESCRIPTIVE, IMAGE_BASED).
- `content` is a JSON object whose structure depends on the `type` (validated server-side).

Swagger UI (runtime): `/api-docs` — opens interactive API docs.

## Example (minimal create MCQ)

POST /api/v1/questions

```json
{
  "title": "What is 2 + 2?",
  "type": "MCQ",
  "category": "Math",
  "difficulty": "EASY",
  "visibility": "PUBLIC",
  "tags": ["arithmetic"],
  "points": 10,
  "content": {
    "questionContent": "What is the result of 2 + 2?",
    "options": [
      { "id": "a", "text": "3", "isCorrect": false },
      { "id": "b", "text": "4", "isCorrect": true }
    ]
  }
}
```

## Tests

- Run the full test suite and view coverage:

```powershell
npm test
```

The repository has a test in `src/tests/question.test.ts` that exercises the main endpoints.

## Postman / Newman

- A Postman collection is included at `postman_collection.json`.
- To run it automatically with Newman (server must be running):

```powershell
npx newman run postman_collection.json --env-var "baseUrl=http://localhost:3000"
```

## Project layout (key files)

- `src/app.ts` — express app, middleware and swagger setup
- `src/server.ts` — server entry
- `src/routes/question.routes.ts` — route definitions
- `src/controllers/question.controller.ts` — request handling
- `src/services/question.service.ts` — business logic (Prisma-backed)
- `src/validators/question.validator.ts` — express-validator chains
- `src/prismaClient.ts` — Prisma client singleton
- `src/tests/question.test.ts` — integration tests

## Notes & troubleshooting

- If you change the Prisma schema, run `npx prisma generate` again.
- If your DB password contains `@` or other special chars, percent-encode them in `DATABASE_URL` (e.g. `@` -> `%40`).
- Prisma engine download can fail behind a corporate proxy; ensure `HTTPS_PROXY`/`https_proxy` is valid or unset.

---

### Deployment to Render — quick checklist

1. Push repository to GitHub (include `prisma/migrations`).
2. Create a Web Service on Render and connect the GitHub repo (or import `render.yaml`).
3. Add Render environment variables: `DATABASE_URL` (Supabase direct or pooler URL), `NODE_ENV=production`.
4. Confirm Build command: `npm run build && npx prisma generate && npx prisma migrate deploy`.
5. Confirm Start command: `npm start`.

When the service is live, update the top of this README with the public URL.

## Deploy notes — Render environment variables

- Recommended env vars to set in Render (Web Service > Environment):
  - `DATABASE_URL` — runtime DB connection. For Supabase pooler (PgBouncer) use the pooler URL and add `?pgbouncer=true&sslmode=require`.
  - `DIRECT_DATABASE_URL` — direct Postgres URL (no PgBouncer) used only for running migrations during build.
  - `NODE_ENV=production`

- Example Render Build command (forces migrations to run against the direct DB URL):

  sh -lc 'export DATABASE_URL="$DIRECT_DATABASE_URL" && npm run build && npx prisma generate && npx prisma migrate deploy'

- Start command (Render service):

  npm start

Notes:

- We recommend keeping a direct DB connection for migrations (no PgBouncer) and using the pooler URL for runtime. The build command above temporarily sets `DATABASE_URL` to the direct URL during the build/migration step so Prisma migrations run safely.

## Try it — basic curl examples (replace <PUBLIC_URL> with your deployed URL)

Create a question (MCQ)

```bash
curl -X POST "https://<PUBLIC_URL>/api/v1/questions" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is 2 + 2?",
    "type": "MCQ",
    "category": "Math",
    "difficulty": "EASY",
    "visibility": "PUBLIC",
    "tags": ["arithmetic"],
    "points": 10,
    "content": {
      "questionContent": "What is the result of 2 + 2?",
      "options": [
        { "id": "a", "text": "3", "isCorrect": false },
        { "id": "b", "text": "4", "isCorrect": true }
      ]
    }
  }'
```

List questions (first page)

```bash
curl "https://<PUBLIC_URL>/api/v1/questions?page=1&limit=10"
```

Get question by id

```bash
curl "https://<PUBLIC_URL>/api/v1/questions/<QUESTION_ID>"
```

Update a question

```bash
curl -X PUT "https://<PUBLIC_URL>/api/v1/questions/<QUESTION_ID>" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Updated title" }'
```

Delete a question

```bash
curl -X DELETE "https://<PUBLIC_URL>/api/v1/questions/<QUESTION_ID>"
```

## Postman / Newman (production)

- Update the Postman environment `baseUrl` to `https://<PUBLIC_URL>` and export or run with Newman:

```powershell
npx newman run postman_collection.json --env-var "baseUrl=https://<PUBLIC_URL>"
```

---

If you'd like, I can:

- Prepare a ready-to-push GitHub repo (create a commit and remote) if you want me to create the GitHub side.
- Walk through the Render UI steps with exact screenshots and values to set.
- Add a small in-memory fallback mode so you can run the app locally without a database while you finalize deployment credentials.
