# Reddit Scraper Pro – remote MCP server

Remote [MCP](https://modelcontextprotocol.io) endpoint for the [Reddit Scraper Pro](https://apify.com/harshmaur/reddit-scraper-pro) Apify Actor. Any MCP client (Claude Desktop, Claude Code, Cursor, Codex, Windsurf, ChatGPT) can call it as a tool to pull Reddit posts, full comment threads, keyword search results, user profiles and subreddit listings as structured JSON. No Reddit API key, no login, no rate-limit juggling.

Pricing is pay-per-result on Apify: $1.50 per 1,000 results plus $0.01 per run start. Apify's free tier covers small runs.

## Endpoint

```
https://mcp.apify.com/?tools=harshmaur/reddit-scraper-pro
```

Streamable HTTP. Authenticate with an Apify API token in the `Authorization: Bearer <APIFY_TOKEN>` header (create one free at https://console.apify.com/account/integrations), or let the client complete Apify's OAuth flow.

## Client config

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

Clients that only speak stdio can bridge with `npx mcp-remote https://mcp.apify.com/?tools=harshmaur/reddit-scraper-pro`.

## What the tool does

| Ask the agent | Input the tool uses |
| --- | --- |
| "Find Reddit posts mentioning my product this month" | `searchTerms` + `postedAfter` |
| "Scrape the top posts in r/SaaS" | `subredditUrls` |
| "Pull every comment from this thread" | `startUrls` + `crawlCommentsPerPost` |
| "What has this user posted?" | `startUrls` with a `/user/` URL |
| "Search only inside r/startups" | `searchTerms` + `withinCommunity` |

Results are JSON rows with a `dataType` discriminator (`post`, `comment`, `user`, `community`) and 140+ documented fields. Optional post-run delivery into Slack, Notion, Sheets or Airtable via Apify MCP connectors (`mcpConnector` input).

## Registry entry

`server.json` in this repo is what is published to the [official MCP Registry](https://registry.modelcontextprotocol.io) under `io.github.harshmaur/reddit-scraper-pro`.

## Links

- Actor page and full docs: https://apify.com/harshmaur/reddit-scraper-pro
- Apify MCP server docs: https://docs.apify.com/platform/integrations/mcp
