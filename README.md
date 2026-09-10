# Reddit Scraper MCP server

MCP server for the [Reddit Scraper Pro](https://apify.com/harshmaur/reddit-scraper-pro) Apify Actor (also works with [Reddit Scraper](https://apify.com/harshmaur/reddit-scraper)). Gives Claude, Cursor, Codex, Windsurf, ChatGPT and any other MCP client three tools for Reddit as structured JSON: keyword search, URL scraping with full comment threads, and bulk subreddit pulls. No Reddit API key, no login. Billed per result on Apify ($1.50 per 1,000 + $0.01 per run; the free plan covers small runs).

Two ways to connect. Both need an Apify token from https://console.apify.com/account/integrations.

## Option A — remote (nothing to install)

Apify hosts the Actor as an MCP tool:

```json
{
  "mcpServers": {
    "reddit-scraper-pro": {
      "url": "https://mcp.apify.com/?tools=harshmaur/reddit-scraper-pro",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

Stdio-only clients can bridge with `npx mcp-remote https://mcp.apify.com/?tools=harshmaur/reddit-scraper-pro`. This is the endpoint registered in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.harshmaur/reddit-scraper-pro`.

## Option B — local stdio server (this repo)

Purpose-built tools with typed arguments, so the model fills in `queries`, `subreddit`, `postedAfter` instead of a raw Actor input object.

```json
{
  "mcpServers": {
    "reddit-scraper": {
      "command": "npx",
      "args": ["-y", "github:harshmaur/reddit-scraper-pro-mcp"],
      "env": { "APIFY_TOKEN": "<APIFY_TOKEN>" }
    }
  }
}
```

Or clone and run `node index.js`. Node 20+.

| Tool | Use it for |
| --- | --- |
| `search_reddit` | Keyword search across Reddit or one subreddit; sort, time window, date range, optional comments. Brand monitoring, lead discovery, "what is Reddit saying about X". |
| `scrape_reddit_urls` | Post permalinks (with the full thread), `/user/<name>/` profiles, subreddit listing URLs, search-page URLs. |
| `scrape_subreddit` | Bulk posts from one or more subreddits, optionally date-bounded and with comments. |

Environment:

| Variable | Default | Meaning |
| --- | --- | --- |
| `APIFY_TOKEN` | required | Apify API token |
| `REDDIT_SCRAPER_ACTOR` | `harshmaur/reddit-scraper-pro` | Set to `harshmaur/reddit-scraper` to run the flagship listing instead |
| `REDDIT_SCRAPER_TIMEOUT` | `300` | Seconds to wait for a run |

Every item carries `dataType` (`post`, `comment`, `community`, `user`); posts include `title`, `body`, `postUrl`, `communityName`, `authorName`, `score`, `commentsCount`, `createdAt`, `flair`. Field reference: https://apify.com/harshmaur/reddit-scraper-pro#output-example

## Automation templates

- [`templates/n8n/`](templates/n8n/) — importable n8n workflows: Reddit mentions → Slack, Reddit lead alerts → Google Sheets.
- [`templates/make/`](templates/make/) — Make scenario recipe for Slack, Notion or Sheets.

The Actor can also deliver results itself (Slack, Notion, Airtable, Sheets) through its `mcpConnector` input, with an Apify Schedule as the trigger, if you prefer no middleware.

## Files

- `index.js` — the stdio server
- `server.json` — official MCP Registry manifest for Pro; `server-reddit-scraper.json` — same for the flagship
- `Dockerfile`, `glama.json` — for directory indexers

MIT. Built by [Harsh Maur](https://github.com/harshmaur).
