# AI Activity Audit Log

Chronological record of AI-assisted actions taken while building this project. Note I do not have any visibility into anything the developer did outside of this session (e.g. what the developer reviewed, decided, or changed.)

Tool: Claude (Anthropic)

**What I built:**

- Scaffolded the Next.js project (App Router, Tailwind, JavaScript) using `create-next-app`.

- Wrote the seed product data — products with varied categories,  and delivery

  windows.

- Wrote the data-access layer (`lib/productRepository.js`) — a JSON-file-backed repository

  with async functions, deliberately shaped the way a real database repository would be, so

  it's easy to swap later.

- Wrote the three API routes: `GET /api/products/[id]`, `GET /api/products/[id]/similar`,

  and `POST /api/cart.`

- Wrote the PDP page, the purchase panel component (size selection, price, delivery, cart

  actions), and the landing page.

- Wrote the initial layout, styling, and visual direction.

- Wrote the initial test suite (`tests/productRepository.test.js`) | 5/5 tests passing using `npm test`|

- Wrote this log | `AUDIT_LOG.md` | and the intial version of the README file |`README.md`|