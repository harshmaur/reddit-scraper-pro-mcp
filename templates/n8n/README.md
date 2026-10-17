# n8n templates — Reddit Scraper

Import any JSON in n8n (**Workflows → Import from file**), then set two credentials: **Apify API** (token from https://console.apify.com/account/integrations; no Apify account yet? [Sign up free](https://console.apify.com/sign-up?fpr=tl88um)) and the apps the template sends to (Slack, Google Sheets, OpenAI). Requires the official Apify community node `@apify/n8n-nodes-apify` (Settings → Community nodes → install).

| Template | What it does |
| --- | --- |
| `reddit-brand-monitoring-to-slack.json` | Every 24 h, searches Reddit for your brand and competitor terms posted in the last day and posts each new thread to a Slack channel you pick. |
| `reddit-lead-alerts-to-google-sheets.json` | Every 24 h, finds "looking for a tool" / "alternative to" style posts inside one subreddit and appends them as rows to a Google Sheet. |
| `reddit-buying-intent-lead-scoring-to-slack-and-sheets.json` | Every morning, searches Reddit posts **and comments** for buying-intent phrases, scores each from 0 to 100 with OpenAI, logs all to Google Sheets and sends leads at or above `minScore` to Slack. |
| `reddit-business-ideas-from-pain-points-to-google-sheets.json` | Every Monday, collects last week's "I wish there was" style posts from your subreddits, has OpenAI rate each as a business opportunity, and saves the good ones to Google Sheets. |
| `reddit-brand-mention-digest-to-slack.json` | Every morning, collects yesterday's posts and comments that mention your brand and competitors, and OpenAI writes one Slack digest: volume, sentiment, themes and threads to answer. |

Edit the **Input JSON** on the Apify node to change keywords, subreddit, or limits. Any field from the Actor's input schema works: https://apify.com/harshmaur/reddit-scraper/input-schema. The node's **Maximum Cost per Run** is set to $2 as a safety cap; results are billed at $2 per 1,000 (less with Apify plan discounts).

The three AI templates keep their settings in a **Settings** node at the start, so you edit keywords there and not in the Apify node.
