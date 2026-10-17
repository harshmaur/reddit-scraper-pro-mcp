# Reddit Scraper MCP server

MCP server for the [Reddit Scraper](https://apify.com/harshmaur/reddit-scraper?fpr=tl88um) Apify Actor. Gives Claude, Cursor, Codex, Windsurf, ChatGPT and any other MCP client three tools for Reddit as structured JSON: keyword search, URL scraping with full comment threads, and bulk subreddit pulls. No Reddit API key, no login. Billed per result on Apify ($2 per 1,000 results, less with Apify plan discounts; the free plan covers small runs).

> **Reddit API and RSS shutdown.** Reddit stops accepting new API access requests on 2026-10-31. Reddit RSS feeds stop on 2026-11-13. This server does not use a Reddit API key, a Reddit app or RSS, so neither date changes your setup.

Two ways to connect. Both need an Apify token. No Apify account yet? [Sign up free](https://console.apify.com/sign-up?fpr=tl88um), then copy the token from https://console.apify.com/account/integrations.

## Option A — remote (nothing to install)

Apify hosts the Actor as an MCP tool:

```json
{
  "mcpServers": {
    "reddit-scraper": {
      "url": "https://mcp.apify.com/?tools=harshmaur/reddit-scraper",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

Stdio-only clients can bridge with `npx mcp-remote https://mcp.apify.com/?tools=harshmaur/reddit-scraper`. This is the endpoint registered in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.harshmaur/reddit-scraper`.

## Option B — local stdio server (this repo)

Purpose-built tools with typed arguments, so the model fills in `queries`, `subreddit`, `postedAfter` instead of a raw Actor input object.

```json
{
  "mcpServers": {
    "reddit-scraper": {
      "command": "npx",
      "args": ["-y", "reddit-scraper-mcp"],
      "env": { "APIFY_TOKEN": "<APIFY_TOKEN>" }
    }
  }
}
```

Published on npm as [`reddit-scraper-mcp`](https://www.npmjs.com/package/reddit-scraper-mcp). Or clone and run `node index.js`. Node 20+.

| Tool | Use it for |
| --- | --- |
| `search_reddit` | Keyword search across Reddit or one subreddit; sort, time window, date range; matching comments and post threads on by default. Brand monitoring, lead discovery, "what is Reddit saying about X". |
| `scrape_reddit_urls` | Post permalinks (with the full thread), `/user/<name>/` profiles, subreddit listing URLs, search-page URLs. |
| `scrape_subreddit` | Bulk posts from one or more subreddits, optionally date-bounded; comment threads on by default. |

Environment:

| Variable | Default | Meaning |
| --- | --- | --- |
| `APIFY_TOKEN` | required | Apify API token |
| `REDDIT_SCRAPER_ACTOR` | `harshmaur/reddit-scraper` | Set to `harshmaur/reddit-scraper-pro` to run the Pro listing instead |
| `REDDIT_SCRAPER_TIMEOUT` | `300` | Seconds to wait for a run |

Every item carries `dataType` (`post`, `comment`, `community`, `user_profile`); posts include `title`, `body`, `postUrl`, `communityName`, `authorName`, `score`, `commentsCount`, `createdAt`, `flair`. Field reference: https://apify.com/harshmaur/reddit-scraper#output-example

## Automation templates

- [`templates/n8n/`](templates/n8n/) — importable n8n workflows: Reddit mentions → Slack, Reddit lead alerts → Google Sheets.
- [`templates/make/`](templates/make/) — Make scenario recipe for Slack, Notion or Sheets.

The Actor can also deliver results itself (Slack, Notion, Airtable, Sheets) through its `mcpConnector` input, with an Apify Schedule as the trigger, if you prefer no middleware.

## Files

- `index.js` — the stdio server
- `server.json` — official MCP Registry manifest for Pro; `server-reddit-scraper.json` — same for the flagship
- `Dockerfile`, `glama.json` — for directory indexers

[MIT](LICENSE). Built by [Harsh Maur](https://github.com/harshmaur).
