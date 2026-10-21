# n8n templates — Reddit Scraper

Import any JSON in n8n (**Workflows → Import from file**), then set two credentials: **Apify API** (token from https://console.apify.com/account/integrations; no Apify account yet? [Sign up free](https://console.apify.com/sign-up?fpr=tl88um)) and the apps the template sends to (Slack, Google Sheets, OpenAI). Requires the official Apify community node `@apify/n8n-nodes-apify` (Settings → Community nodes → install).

| Template | What it does |
| --- | --- |
| `reddit-brand-monitoring-to-slack.json` | Every 24 h, searches Reddit for your brand and competitor terms posted in the last day and posts each new thread to a Slack channel you pick. |
| `reddit-lead-alerts-to-google-sheets.json` | Every 24 h, finds "looking for a tool" / "alternative to" style posts inside one subreddit and appends them as rows to a Google Sheet. |
| `reddit-buying-intent-lead-scoring-to-slack-and-sheets.json` | Every morning, searches Reddit posts **and comments** for buying-intent phrases, scores each from 0 to 100 with OpenAI and logs all to Google Sheets. For each lead at or above `minScore`, reads the author's recent Reddit history, drafts a reply with OpenAI and sends both to Slack. Every Monday, posts a weekly summary of needs and best leads to Slack. |
| `reddit-business-ideas-from-pain-points-to-google-sheets.json` | Every Monday, finds Reddit pain points and rates them with OpenAI. Reads comments on the best ideas to check demand, current tools and gaps, then saves ideas that pass to Google Sheets. Sends a weekly Slack brief with a first test and problems that also appeared in earlier weeks. |
| `reddit-brand-mention-digest-to-slack.json` | Every morning, collects yesterday's posts and comments that mention your brand and competitors, and OpenAI writes one Slack digest: volume, sentiment, themes and threads to answer. |

Edit the **Input JSON** on the Apify node to change keywords, subreddit, or limits. Any field from the Actor's input schema works: https://apify.com/harshmaur/reddit-scraper/input-schema. Search runs have **Maximum Cost per Run** set to $2; the business-ideas comment run has a $1 cap; results are billed at $2 per 1,000 (less with Apify plan discounts).

The three AI templates keep their settings in a **Settings** node at the start, so you edit keywords there and not in the Apify node.

The business-ideas template needs an `Ideas` sheet with the 17 headers listed in its **Overview** note. Select the same file in both Google Sheets nodes. Its default limits validate at most 10 ideas and read up to 25 comments per idea; OpenAI costs are separate.
