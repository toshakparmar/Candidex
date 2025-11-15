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

# Candidex — Question Management API

Deployed: https://candidex.onrender.com

Lightweight REST API to create, read, update and delete question types (MCQ, Programming, Descriptive, Image-based). This README focuses on the deployed API usage and examples.

Base URL (deployed): https://candidex.onrender.com/api/v1

Health and docs

- Health: GET https://candidex.onrender.com/health
- Swagger UI (interactive docs): https://candidex.onrender.com/api-docs

All requests must use the Content-Type: application/json header when sending a body.

## Endpoints — full reference (with example request bodies)

1. Create question

- Method: POST
- Route: /api/v1/questions
- Description: Create a new question. The `type` field controls shape of `content`.
- Example body (MCQ):

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

- Example body (Programming):

```json
{
  "title": "Reverse a string",
  "type": "PROGRAMMING",
  "category": "Algorithms",
  "difficulty": "MEDIUM",
  "visibility": "PRIVATE",
  "tags": ["string", "algorithm"],
  "points": 30,
  "content": {
    "description": "Write a function that reverses a string",
    "template": "function reverse(s) { /* ... */ }",
    "tests": ["hello => olleh"]
  }
}
```

- Response: 201 Created with the created question object (includes `id`, timestamps).

Example curl:

```bash
curl -X POST "https://candidex.onrender.com/api/v1/questions" \
  -H "Content-Type: application/json" \
  -d '@create_mcq.json'
```

2. List questions (with pagination & filters)

- Method: GET
- Route: /api/v1/questions
- Query params:
  - page (default 1)
  - limit (default 10)
  - type (MCQ|PROGRAMMING|DESCRIPTIVE|IMAGE_BASED)
  - category
  - difficulty (EASY|MEDIUM|HARD)
  - visibility (PUBLIC|PRIVATE)
  - tags (comma-separated)
  - sortBy (e.g., createdAt, title)
  - sortOrder (asc|desc)

- Response: 200 OK with { items: [...], total, page, limit }

Example curl:

```bash
curl "https://candidex.onrender.com/api/v1/questions?page=1&limit=10"
```

3. Get single question

- Method: GET
- Route: /api/v1/questions/:id
- Response: 200 OK with the question object or 404 if not found.

Example curl:

```bash
curl "https://candidex.onrender.com/api/v1/questions/REPLACE_WITH_ID"
```

4. Update question

- Method: PUT
- Route: /api/v1/questions/:id
- Body: Partial or full question object (only fields provided will be updated). Example to update the title:

```json
{ "title": "Updated title" }
```

- Response: 200 OK with updated question object.

Example curl:

```bash
curl -X PUT "https://candidex.onrender.com/api/v1/questions/REPLACE_WITH_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title"}'
```

5. Delete question

- Method: DELETE
- Route: /api/v1/questions/:id
- Response: 204 No Content on success or 404 if not found.

Example curl:

```bash
curl -X DELETE "https://candidex.onrender.com/api/v1/questions/REPLACE_WITH_ID"
```

6. List by category

- Method: GET
- Route: /api/v1/questions/category/:category
- Response: 200 OK with array of questions in that category.

Example curl:

```bash
curl "https://candidex.onrender.com/api/v1/questions/category/Math"
```

7. List by type

- Method: GET
- Route: /api/v1/questions/type/:type
- Response: 200 OK with array of questions of that type.

Example curl:

```bash
curl "https://candidex.onrender.com/api/v1/questions/type/MCQ"
```

## Notes & troubleshooting

- All request/response examples assume the deployed base URL: https://candidex.onrender.com
- Use `Content-Type: application/json` for requests with bodies.
- If a request fails with 500, check the server logs on Render for detailed error messages.
- The Swagger UI at /api-docs lists the same endpoints and shows live request bodies you can try from the browser.

## License

This project is licensed under the MIT License. Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

© 2025 toshakparmar — https://github.com/toshakparmar/Candidex
