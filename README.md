# LAAM — Product Discovery & Purchase Confidence

A single, focused slice of the LAAM shopping experience: the **Product Detail Page (PDP)**,
built to remove the specific hesitations a customer has right before deciding to buy.

## 1. Problem Understanding

The brief describes five distinct sources of doubt: fit/availability, size stock, final price,
delivery trust, and lack of alternatives. Rather than build multiple shallow screens (browse,
cart, checkout), I concentrated all five into the one screen where the doubt actually happens —
the PDP — and made each one visibly and immediately answerable without the customer having to
dig, guess, or open a support chat.

## 2. Scope

**Built:**
- Product detail page: image, price (with "tax incl." shown explicitly so the price on screen
  is the price paid), per-size stock with unavailable sizes visibly crossed out and unselectable,
  a computed delivery date range, Add to Cart / Buy Now actions, and a "similar products" rail
  driven by category.
- A tiny catalog landing page so the PDP has real entry points to click through from.
- Backend API: `GET /api/products/:id`, `GET /api/products/:id/similar`,
  `POST /api/cart` — the last one re-validates stock server-side rather than trusting the
  client's last-known state (see Edge Cases below).

**Deliberately not built:**
- Real checkout / payment.
- A persisted cart or order history (the `POST /api/cart` endpoint is a real, validated
  endpoint — it just doesn't write anywhere yet).
- Search, filters, or a full catalog/browse experience.
- Auth/accounts.
- A real database — see Technical Approach and Future Improvements.

## 3. User Flow

1. Customer lands on `/` (a minimal catalog) or arrives directly on a product link.
2. On the PDP, they immediately see brand, name, rating, and price with tax status stated
   up front — no surprise fees at checkout.
3. They pick a size. Out-of-stock sizes are visibly struck through and disabled, so
   availability is answered before they try to buy, not after a failed checkout.
4. They see a computed delivery window ("Estimated delivery: Aug 11 - Aug 12") calculated
   from today's date, not a static promise.
5. If a product is sold out in every size, the buy actions are hidden entirely and the
   customer is pointed at the "similar picks" rail instead of hitting a dead end.
6. Add to Cart / Buy Now call a real API that re-checks stock before confirming — if someone
   else bought the last unit a second earlier, the customer gets an honest error, not a false
   confirmation.

## 4. Technical Approach

**Frontend:** Next.js App Router (React). Server components fetch data directly (`page.jsx`
for both `/` and `/product/[id]`); the interactive parts (size selection, cart actions) are
isolated into a client component (`PurchasePanel`) so only the interactive slice ships JS to
the browser. Styling is Tailwind CSS with a deliberately restrained, editorial layout — plenty
of whitespace, serif headings, muted neutral background — intentionally different from
high-density marketplace UIs (e.g. Temu-style grids), since LAAM is a fashion brand context
where trust and clarity matter more than volume of stimuli.

**Backend:** Next.js Route Handlers under `app/api/`. Kept as real HTTP endpoints (not just
server components quietly reading data) specifically so there's a genuine API boundary to
validate against — `POST /api/cart` is the one that matters: it re-fetches the product
server-side and checks the requested size still has stock before returning success.

**Data model:**
```
Product
├─ id, name, brand, category
├─ price, currency
├─ image, description, rating, reviewCount
├─ deliveryDays: { min, max }        // used to compute a live delivery date
└─ sizes: [ { size, stock } ]        // per-size inventory
```

**Key technical decisions:**
- **JSON-file repository instead of a real database.** `lib/productRepository.js` exposes
  async functions (`getProductById`, `getSimilarProducts`, etc.) with the exact same shape a
  SQLite/Postgres-backed repository would have. All data access goes through this one module —
  nothing else touches the JSON file directly. This was the single highest-leverage tradeoff
  for a 3-hour budget: it gets 90% of the architectural benefit of a real DB (a clean
  data-access boundary, easy to swap later) for a fraction of the setup time.
- **Server-side stock re-validation on `POST /api/cart`.** The size selector is easy to fool
  in the browser; the API is not. This was a deliberate edge case to cover because the brief's
  whole premise is *purchase confidence* — an API that silently accepts an out-of-stock order
  would undermine exactly the trust this project is supposed to build.
- **System fonts instead of next/font/google.** Keeps the build fully offline-capable — no
  external network call required to produce a production build.

**Assumptions:**
- Prices are single-currency (PKR) and already final (no per-size price deltas).
- "Similar products" = same category, simple slice — no real recommendation logic.
- One product image per product (no gallery) — acceptable for a 3-hour PDP-focused scope.

## 5. How to Run

```bash
npm install
npm run dev
```
Then open `http://localhost:3000`. Click any product on the homepage to view its PDP, e.g.
`http://localhost:3000/product/p-1001`.

For a production build:
```bash
npm run build
npm run start
```

## 6. Tests

Added (`npm test`, uses Node's built-in test runner, no extra dependencies):
- `getProductById` returns the correct product / `null` for an unknown id.
- `getSimilarProducts` never includes the product itself and only returns same-category items.
- `totalStock` sums stock correctly across sizes.
- `estimateDeliveryDate` produces the correct min–max date range from a fixed date.

**What I'd test next, and why:** the `POST /api/cart` route handler directly (currently only
smoke-tested manually via curl) — it's the one place real money/inventory logic lives, so it's
the highest-value target for a request/response-level test. After that, a component test on
`PurchasePanel` for the "no size selected" and "sold out" states, since those are the two UI
states most likely to regress silently.

## 7. Tradeoffs (because of the 3–4 hour limit)

- JSON file instead of a real database (explained above).
- No cart/order persistence — the API validates and responds correctly but doesn't write state.
- One image per product, no zoom/gallery.
- No automated end-to-end/browser tests — relied on manual + unit testing given the time box.
- No auth, no real checkout flow.

## 8. Future Improvements (if going to production)

- Swap `productRepository.js`'s internals for a real database (SQLite for a quick step up,
  Postgres for production) — the function signatures wouldn't need to change anywhere else.
- Persist cart state (per-session or per-account) and add optimistic UI with rollback on the
  409 stock-conflict response, which the API already returns.
- Real image galleries + size-chart/fit guidance, which is a big lever on "is this available
  for me" beyond stock.
- Real recommendation logic for "similar products" (price band, past behavior) instead of a
  category match.
- Basic analytics on drop-off at the size-selection step, since that's the exact moment this
  project is designed to de-risk.

## 9. AI Usage

**Tools used:** Claude (Anthropic), used directly in an agentic coding session with file and
terminal access.

**What AI helped with:**
- Scaffolding the Next.js project structure and initial file/folder layout.
- Generating the first draft of all component, API route, and repository code.
- Writing the unit tests and running `npm run build` / `npm test` to verify everything actually
  works before calling it done.

**What I reviewed/changed manually:** the product scope and which of the five pain points to
prioritize on one screen, the visual design direction (explicitly steering away from a
dense/cluttered marketplace look), the decision to make `POST /api/cart` re-validate stock
server-side rather than trust the client, and the final content of this README.

**One example of correcting AI output:** the first build attempt used `next/font/google`
(Playfair Display + Inter) for typography. The production build failed because the sandboxed
environment couldn't reach `fonts.googleapis.com`. Rather than leave a build with an external
network dependency, I had it switched to a system font stack declared directly in
`globals.css` — same visual intent (serif display font for headings, clean sans for body),
zero external dependency, and a build that will succeed in any environment, including CI.

---

*Full activity/audit log of the AI-assisted build session is in `AUDIT_LOG.md`.*
