# Publishing the templates (paste-ready)

Neither gallery indexes GitHub. Each takes a submission from Harsh's account. Files here are the source of truth; re-submit when they change.

## n8n template library — https://creators.n8n.io

Apply once as a creator (free; ties templates to the Apify affiliate program if you opt in). Then **Templates → Submit**, paste the JSON from `templates/n8n/*.json` into "Template code" and fill:

**Template 1**

- Name: `Monitor Reddit for brand and competitor mentions and post new threads to Slack`
- Description:

  > Runs every 24 hours, searches Reddit for the keywords you list (your brand, competitors, product category) and posts every new thread from the last day to a Slack channel with title, subreddit, score and link. Uses the Reddit Scraper Apify Actor through the official Apify node, so there is no Reddit API key, OAuth app or rate-limit handling. Change the keywords and date window in the Apify node's Input JSON; add `withinCommunity` to watch a single subreddit. Results cost $2 per 1,000 on Apify (less with plan discounts), and the node's cost cap is preset to $2 per run.

- Setup steps:
  1. Install the community node `@apify/n8n-nodes-apify` (Settings → Community nodes).
  2. Create an Apify API credential with a token from https://console.apify.com/account/integrations (free plan works).
  3. Connect Slack and pick the channel in the last node.
  4. Edit `searchTerms` in the Apify node's Input JSON.
- Categories: Marketing, Sales, Social Media Monitoring. Nodes: Schedule Trigger, Apify, Filter, Slack.

**Template 2**

- Name: `Collect Reddit buying-intent posts from a subreddit into Google Sheets every day`
- Description:

  > Every day this workflow searches one subreddit for posts where people ask for tool recommendations or alternatives ("looking for a tool", "alternative to", "any recommendations for") and appends each new post to a Google Sheet with date, title, author, score, link and the first 500 characters of the body. It uses the Reddit Scraper Apify Actor via the official Apify node, so no Reddit developer account is needed. Swap the subreddit and phrases in the Input JSON to fit your niche; the sheet becomes a lead list you can work through or feed to a CRM.

- Setup steps: as above, with Google Sheets in place of Slack; create a sheet with a tab named `Leads` and pick it in the last node.
- Categories: Sales, Lead Generation. Nodes: Schedule Trigger, Apify, Filter, Google Sheets.

## State (2026-10-20)

- n8n, published under [creators/harshmaur](https://n8n.io/creators/harshmaur/):
  - [20980 Send new subreddit posts to Slack with Apify Reddit scraper](https://n8n.io/workflows/20980-send-new-subreddit-posts-to-slack-with-apify-reddit-scraper/)
  - [21035 Track Reddit keyword mentions with Apify and send alerts to Slack and Gmail](https://n8n.io/workflows/21035-track-reddit-keyword-mentions-with-apify-and-send-alerts-to-slack-and-gmail/)
- n8n, in review since 2026-10-20: the lead-scoring template. The business-ideas and brand-digest templates follow, one at a time.
- Make, approved:
  - [20007 Reddit keyword alerts without the Reddit API: new brand and competitor mentions to Slack daily](https://www.make.com/hq/template/20007) (approved 2026-10-16)
  - [20018 Score Reddit buying-intent leads with AI and send hot leads to Slack](https://www.make.com/hq/template/20018) (approved 2026-10-19)
- Make links use `make.com/hq/template/<id>`. That link opens the template after the user signs in to Make. On 2026-10-20 the public page `make.com/en/templates/<id>-<slug>` gave 404 for both templates.
- awesome-n8n-templates: five workflows in [enescingoz/awesome-n8n-templates#262](https://github.com/enescingoz/awesome-n8n-templates/pull/262), open.

## n8n AI templates (submit as templates 2-4)

Each one opens with an overview sticky note in n8n's "How it works / Setup / Customization" format, so the template page and the canvas show the same text. Paste that note as the description.

**Score Reddit buying-intent leads with OpenAI and send hot leads to Slack and Google Sheets** — `n8n/reddit-buying-intent-lead-scoring-to-slack-and-sheets.json`. Categories: Sales, Lead Generation, AI. Nodes: Schedule Trigger, Set, Apify, Code, Remove Duplicates, Basic LLM Chain, OpenAI Chat Model, Structured Output Parser, Google Sheets, Filter, Slack.

**Find business ideas in Reddit pain points with Apify, OpenAI and Google Sheets** — `n8n/reddit-business-ideas-from-pain-points-to-google-sheets.json`. Categories: Market Research, AI. Nodes: Schedule Trigger, Set, Code, Apify, Filter, Remove Duplicates, Basic LLM Chain, OpenAI Chat Model, Structured Output Parser, Google Sheets.

**Send a daily Reddit brand mention digest with AI sentiment to Slack, from posts and comments** — `n8n/reddit-brand-mention-digest-to-slack.json`. Categories: Marketing, Social Media Monitoring, AI. Nodes: Schedule Trigger, Set, Apify, Code, Remove Duplicates, If, Basic LLM Chain, OpenAI Chat Model, Slack.

## Make AI template

Build `make/reddit-lead-scoring-scenario.md` in Make and submit it with the listing text at the end of that file.

## Make public templates — https://www.make.com/en/templates

Make only accepts templates built in its own editor. Build the scenario from `templates/make/reddit-monitoring-scenario.md` in your Make account, then **Templates → Create template from scenario**, **Publish**, then **Request approval** for the public library (Make reviews it; the Apify app is an official app, so it is eligible).

- Name: `Send new Reddit mentions of your brand to Slack every day`
- Description:

  > Watches Reddit for the keywords you choose and sends each new thread from the last 24 hours to Slack. Powered by the Reddit Scraper Actor on Apify: no Reddit API key, pay $2 per 1,000 results. Edit the keywords, add a subreddit filter or a date range in the Run an Actor module's input.

- Suggested variants once the first is approved: Notion database row, Google Sheets row.

## After approval

Add the gallery links to `README.md` here and to the "Integrate with n8n, Zapier, and Make" section of both Store READMEs (`actors/reddit/main` and `actors/reddit/subscription` in the private repo).
