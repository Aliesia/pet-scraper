# pet-scraper — Project Notes & TODOs

## What this project does

Scrapes clan and war statistics from `royaleapi.com` using Puppeteer, merges the data, and saves it to MongoDB via Mongoose. Entry point is `index.js`; scraping logic is in `webscraping.js`; DB persistence is in `resultAnalysis.js`.

Environment variables required (`.env`):
- `CLAN_TAG` — Clash Royale clan tag (uppercase letters and digits only)
- `MONGOURI` — MongoDB connection string

---

## Known issues (found in security review, July 2026)

### Critical

- **`resultAnalysis.js` — `forEach(async ...)` does not await saves**
  `Array.forEach` ignores the returned Promise, so all `.save()` calls are fire-and-forget.
  On any rejection Node.js 15+ terminates the process; on earlier versions errors are silently swallowed.
  Fix: replace with `await Promise.all(dataObj.map(member => new memberModel(member).save()))`.

### Major

- **`resultAnalysis.js` — `dropCollection` can race with connection establishment**
  `mongoose.connection.db` is `null` until after the connection fires; raw driver calls are not queued
  by Mongoose's connection buffering (model operations are).
  Fix: replace `mongoose.connection.db.dropCollection('members')` with `await memberModel.deleteMany({})`.

- **`resultAnalysis.js` — MongoDB credentials leaked in error logs**
  `.catch(err => console.log(err))` on the connect call logs the full error, which Mongoose routinely
  includes the URI (with credentials) in. Fix: log a generic message instead.

- **`webscraping.js` — `browser.close()` is not awaited**
  Leaves zombie Chromium processes on repeated runs. Fix: `await browser.close()`.

- **`webscraping.js` — returns `undefined` silently on scraping failure**
  If the `try` block throws, `clanMembers` is `undefined`. The caller then calls `.forEach()` on it,
  producing a misleading `TypeError`. Fix: throw explicitly or return an empty array with a warning.

- **`index.js` — `compareAndSaveResults(dataObj)` is not awaited**
  Errors from the save step are silently lost. The `.catch(console.error)` only covers `webscraping()`.
  Fix: chain the calls — `.then(dataObj => compareAndSaveResults(dataObj)).catch(console.error)`.

- **`data.js` — `CLAN_TAG` not validated before URL construction**
  A missing or malformed tag produces a bad URL that Puppeteer navigates to without warning.
  Fix: validate against `/^[A-Z0-9]+$/` and throw early if invalid.

### Minor

- **`webscraping.js` — `headless: true` routes through deprecated legacy mode in Puppeteer v25**
  Pass `headless: 'shell'` to explicitly opt into the old mode, or test with the new headless renderer
  (omit the option — it defaults to new headless in v25).

- **`data.js` — `wars` field typed as `Object` in the Mongoose schema**
  No structure or validation; silent corruption if the scraped page changes shape.

- **`package.json` — `dotenv` pinned at `^8.2.0`** (current is v16). Consider upgrading.

- **No tests.** The data-merge logic in `resultAnalysis.js` and the Mongoose model are good candidates
  for unit tests using fixture data, so DOM changes on royaleapi.com are caught before a live run.

---

## Architecture note

The current pattern drops the entire `members` collection before re-inserting. If the scrape partially
fails after the drop, the previous good data is lost. A safer pattern: upsert by `tag` using
`bulkWrite`, or insert into a staging collection and rename it atomically.
