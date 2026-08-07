# LAAM — Product Discovery & Purchase Confidence

LAAM is a marketplace for South Asian fashion. Customers often browse many similar-looking
products across different brands, sizes, prices, delivery timelines, and stock availability. My goal is to boost Purchase Confidence.

## 1. Problem Understanding

The brief describes the hesitation and uncertainity a customer faces and I have narrowed it down to 5 problems: fit/availability, size stock, final price, delivery trust, and lack of alternatives. Thisis a confidence problem and it usually happens at the product details page. That was my entire focus for this assessment.

## 2. Scope

**Built:**
- A full product detail page — image, price (tax included, stated up front), a size selector where anything out of stock is crossed out and can't be picked, a delivery estimate that's actually calculated from today's date, Add to Cart / Buy Now, and a "similar products" section at the bottom for when the item just isn't the right fit.
- A small homepage with various articles to pick and choose from.
- Three working API endpoints, including a cart endpoint that re-checks stock on the server before confirming anything, I didn't want the app able to lie to a customer about something being available.

**Deliberately not built:**
- Real checkout/payment.
- Saving the cart anywhere — the endpoint validates properly, it just doesn't persist yet.
- Search, filtering, accounts/login.
- A real database (see more below).

## 3. User Flow

1. The user lands on the homepage and click on a product.
2. On the product page, price and tax status are visible immediately so the user doesn't get surprised later.
3. The user picks a size. If it's out of stock, it's crossed out and can't be selected. This is how the user can find out right away, not after trying to check out.
4. If the user picks a size that's running low, the user get a heads-up of how many are items of that size are in-stock there and then instead of at checkout.
5. The user see an actual delivery window, calculated from today, not a static "X-Y days" line.
6. If everything's sold out, the buy buttons disappear and they're pointed at similar items instead of hitting a dead end.
7. Add to Cart / Buy Now hit a real API that double-checks stock before saying yes.

## 4. Technical Approach

**Frontend:** Next.js (App Router) with Tailwind. The interactive bits like the size selection, cart actions are live in their own client component, and everything else renders on the server, so the page stays fast. I went for a clean, editorial look on purpose because this is a fashion product page, and I've noticed the original LAAM page uses a minimalistic style choice so I wanted to keep up with the brand's original UI.

**Backend:** Three API routes. The cart endpoint re-fetches the product server-side and checks the size actually is in-stock before saying the action succeeded. A size selector is easy to fool in the browser; the API isn't.

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
- I added purchase confidence details that weren't basic like adding trust badges under the buy buttons (100% Original Brand, Easy 7-Day Returns, Free Shipping over Rs. 5,000), a low-stock warning when a selected size has fewer than 5 left, and a small "Sold Out" tag on the product image itself when every size is unavailable. These map straight onto the brief's actual problem — they're the kind of detail that makes someone trust hitting "add to cart."
- In the first version of the page, it was showing outside brand names (Khaadi, Outfitters, etc.) on the product page because these products were exported from these brands. So in order to make it more authentic, I went into the product page, the similar-products section, and the homepage grid and removed the brand line from all three, so the experience reads as one consistent LAAM storefront instead of a patchwork of outside labels.
- I used a JSON file instead of a real database. I used a small repository module (lib/productRepository.js) structured exactly like a real database layer would be with the same function names, same async pattern so if this ever needed to move to SQLite or Postgres, nothing outside that one file would have to change. Given the time limit, this got me most of the benefit of proper data access without the setup overhead.
- The layout was originally pulling fonts from Google Fonts, but the production build failed because it couldn't reach the Google Fonts server during the build. Rather than leave that fragile, I switched to a system font stack in globals.css instead. Same look, but now the build doesn't depend on an outside network call at all, so it won't randomly break on a different machine.
- Cleaned up placeholder copy because the first draft had "Demo catalog" and "Demo build" text left all over from early scaffolding. I went through and removed them because I didn't want the site reading like a work-in-progress.

**Assumptions:**
- Single currency (PKR), prices are already final per size, "similar products" is a same-category match rather than a real recommendation engine, one image per product.

## 5. How to Run

```bash
npm install
npm run dev
```
Then open `http://localhost:3000`. Click any product on the homepage to view its product details page, e.g.
`http://localhost:3000/product/p-1001`.

For a production build:
```bash
npm run build
npm run start
```

## 6. Tests

Ran npm test to confirm that all 6 unit tests pass:
- `getProductById` returns the correct product / `null` for an unknown id.
- `getSimilarProducts` never includes the product itself and only returns same-category items.
- `totalStock` sums stock correctly across sizes.
- `estimateDeliveryDate` produces the correct min–max date range from a fixed date.
- `getSimilarProducts` ensures the function returns exactly the number of items requested to keep the UI clean.

**What I'd test next, and why:** I want to test the cart API route directly because it's the one place real money/inventory logic lives, so it's the highest value target for a request/response level test. That's the one place where a bug could actually mislead someone about stock.

## 7. Tradeoffs (because of the 3–4 hour limit)

- JSON file instead of a real database.
- Cart endpoint validates correctly but doesn't persist anywhere yet.
- One image per product, no gallery/zoom.
- No end-to-end browser tests, only manual and unit tests are tested.
- No login/accounts, no real checkout.

## 8. Future Improvements

- Swap the JSON repository for a real database
- Handle the "someone else just bought the last one" edge case gracefully in the UI, not just as an error message.
- Real image galleries, caresoles and size chart guidance 
- A search bar and a filter button
- AI powered size recommendations that allows an AI tool to ask users for their height and weight to suggest the perfect size.
- A real recommendation engine instead of a same category match for similar products.
- Track where people drop off during size selection so we can see the exact moment that triggers people to do so. 

## 9. AI Usage

I used Claude to move fast on the first draft in scaffolding the project, API routes, and the first set of tests which saved a lot of setup time I could then spend actually thinking through the product problem instead. I didn't just take what it gave me, though. A few things I went back and changed myself:
- Thought of the user flow myself and the the different buttons for the UI and prompted claude accordingly 
- I removed the brand names from the UI because they all need to be authenticated under LAAM.
- I also fixed a build failure caused by Google Fonts by switching to system fonts.
- I removed leftover placeholder/demo text so the app didn't read like a prototype.
- I added the trust badges, low stock warning, and sold out tag they directly address the brief's core problem i.e. boosting purchase confidence.
- Reviewed the test file, ran it, and added a 6th test of my own.
---

*Full activity/audit log of the AI-assisted build session is in `AUDIT_LOG.md`.*
