# n8n templates — Reddit Scraper Pro

Import either JSON in n8n (**Workflows → Import from file**), then set two credentials: **Apify API** (token from https://console.apify.com/account/integrations) and Slack or Google Sheets. Requires the official Apify community node `@apify/n8n-nodes-apify` (Settings → Community nodes → install).

| Template | What it does |
| --- | --- |
| `reddit-brand-monitoring-to-slack.json` | Every 24 h, searches Reddit for your brand and competitor terms posted since yesterday and posts each new thread to a Slack channel. |
| `reddit-lead-alerts-to-google-sheets.json` | Every 24 h, finds "looking for a tool" / "alternative to" style posts inside one subreddit and appends them as rows to a Google Sheet. |

Edit the **Input JSON** on the Apify node to change keywords, subreddit, or limits. Any field from the Actor's input schema works: https://apify.com/harshmaur/reddit-scraper-pro/input-schema. The node's **Maximum Cost per Run** is set to $2 as a safety cap; results are billed at $1.50 per 1,000.
