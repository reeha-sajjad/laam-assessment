# AI Activity Audit Log

Chronological record of AI-assisted actions taken while building this project, per the
assessment's AI usage requirement. Tool: Claude (Anthropic), agentic coding session with
file/terminal access.

| # | Action | Files touched |
|---|--------|----------------|
| 1 | Scaffolded Next.js app (App Router, Tailwind, JS) via `create-next-app` | project root |
| 2 | Authored seed product data (6 products, varied categories/stock/delivery) | `data/products.json` |
| 3 | Built JSON-backed repository layer with async, DB-shaped functions | `lib/productRepository.js` |
| 4 | Built `GET /api/products/[id]` route | `app/api/products/[id]/route.js` |
| 5 | Built `GET /api/products/[id]/similar` route | `app/api/products/[id]/similar/route.js` |
| 6 | Built `POST /api/cart` route with server-side stock re-validation | `app/api/cart/route.js` |
| 7 | Built client `PurchasePanel` component (size select, price, delivery, cart actions) | `app/components/PurchasePanel.jsx` |
| 8 | Built `SimilarProducts` component | `app/components/SimilarProducts.jsx` |
| 9 | Built PDP page (server component) | `app/product/[id]/page.jsx` |
| 10 | Built catalog landing page | `app/page.jsx` |
| 11 | Styled global layout, header/footer, editorial visual direction | `app/layout.js`, `app/globals.css` |
| 12 | Configured `next.config.mjs` to allow Unsplash image domain | `next.config.mjs` |
| 13 | Ran `npm run build` — **failed**: `next/font/google` couldn't reach `fonts.googleapis.com` in the sandbox | build log |
| 14 | **Corrected**: replaced `next/font/google` with a system font stack in CSS to remove the external network dependency | `app/globals.css`, `app/layout.js` |
| 15 | Ran `npm run build` — passed | — |
| 16 | Booted production server, smoke-tested `/`, `/product/p-1001`, `GET /api/products/p-1001`, and `POST /api/cart` (including an intentionally out-of-stock size, confirmed the API correctly rejected it with 409) | manual verification |
| 17 | Added unit tests for repository logic (Node's built-in test runner) | `tests/productRepository.test.js` |
| 18 | Ran `npm test` — 5/5 passing | — |
| 19 | Wrote README (all 9 required sections) and this audit log | `README.md`, `AUDIT_LOG.md` |

All code was reviewed and, where noted in the README's AI Usage section, corrected before
being accepted into the final submission.
