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

## State (2026-10-23)

- n8n, published under [creators/harshmaur](https://n8n.io/creators/harshmaur/):
  - [20980 Send new subreddit posts to Slack with Apify Reddit scraper](https://n8n.io/workflows/20980-send-new-subreddit-posts-to-slack-with-apify-reddit-scraper/)
  - [21035 Track Reddit keyword mentions with Apify and send alerts to Slack and Gmail](https://n8n.io/workflows/21035-track-reddit-keyword-mentions-with-apify-and-send-alerts-to-slack-and-gmail/)
- n8n: richer lead scoring (21329), "Score Reddit buying-intent leads with Apify, OpenAI, Google Sheets and Slack", was published on 2026-10-20. Business ideas (21436) was rejected as too basic. The trend-analysis version below is ready for approval before resubmitting the same submission. Brand digest waits until business ideas is published.
- Make, approved:
  - [20007 Reddit keyword alerts without the Reddit API: new brand and competitor mentions to Slack daily](https://www.make.com/hq/template/20007) (approved 2026-10-16)
  - [20018 Score Reddit buying-intent leads with AI and send hot leads to Slack](https://www.make.com/hq/template/20018) (approved 2026-10-19)
- Make links use `make.com/hq/template/<id>`. That link opens the template after the user signs in to Make. On 2026-10-20 the public page `make.com/en/templates/<id>-<slug>` gave 404 for both templates.
- awesome-n8n-templates: five workflows in [enescingoz/awesome-n8n-templates#262](https://github.com/enescingoz/awesome-n8n-templates/pull/262), open.

## n8n AI templates (submit as templates 2-4)

Each template opens with an Overview canvas note. Copy its text into the matching portal fields: Quick overview (50 words or fewer), How it works, Setup, Customization and Additional info. After the AI check, replace any AI-written text with the approved text before selecting **Submit for human review**.

**Score Reddit leads with OpenAI, draft replies from author history, and send Slack alerts and a weekly summary** — `n8n/reddit-buying-intent-lead-scoring-to-slack-and-sheets.json`. Categories: Sales, Lead Generation, AI. Nodes: Schedule Trigger, Set, If, Apify, Code, Remove Duplicates, Basic LLM Chain, OpenAI Chat Model, Structured Output Parser, Google Sheets, Filter, Slack.

**Find and validate business ideas from Reddit pain points with OpenAI, Google Sheets and a weekly Slack brief** — `n8n/reddit-business-ideas-from-pain-points-to-google-sheets.json`. Categories: Market Research, AI. Nodes: Schedule Trigger, Set, Code, Apify, Filter, Remove Duplicates, Basic LLM Chain, OpenAI Chat Model, Structured Output Parser, Google Sheets, Slack.

**Send a daily Reddit brand mention digest with AI sentiment to Slack, from posts and comments** — `n8n/reddit-brand-mention-digest-to-slack.json`. Categories: Marketing, Social Media Monitoring, AI. Nodes: Schedule Trigger, Set, Apify, Code, Remove Duplicates, If, Basic LLM Chain, OpenAI Chat Model, Slack.

### Business ideas — trend-analysis portal text

Resubmit the existing submission **21436** after approval. Do not create a new template. The portal may keep its own title. Its Implement changes modal accepts only an updated workflow file; if it has no text fields, the new instructions are in the canvas Overview note.

**Quick overview (39 words)**

Every Monday this workflow finds Reddit posts where people complain or wish for a tool and rates each idea with OpenAI. It reads the comments on the best ones to check demand, then sends a weekly brief to Slack.

**How it works**

1. **Every Monday** (08:00) reads your phrases, subreddits and limits from **Settings**.
2. **Search Reddit for pain points** finds posts from the last 7 days that match phrases like "I wish there was" or "so frustrated with", in each subreddit you list.
3. **Keep posts with real text** drops link posts and one-liners. **Skip posts already checked** drops posts from earlier runs.
4. **Rate the opportunity** asks OpenAI for the problem, who has it, a product idea and a first 1-10 score. **Good ideas only** keeps scores at or above `minScore`, and **Top ideas only** keeps the best `maxIdeas`.
5. **Read thread comments** gets the top comments of those ideas in one Apify run.
6. **Validate with comments** reads them and returns the demand evidence, the tools people already use, the gap, a small first product, a first test and a new score. **Still good after comments** drops ideas that fall below `minScore`, and **Save idea to Google Sheets** keeps the rest.
7. **Read earlier ideas** loads the sheet. **Group recurring problems** groups the same customer problem and audience across this week and up to eight weeks of saved ideas.
8. **Count and rank trend evidence** counts distinct threads and weeks, compares the last 7 days with the previous 7 days, and ranks the trends. **Save weekly trend history** keeps the counts and source links in a `Trends` tab.
9. **Write the weekly brief** picks one idea to test and reports the measured trends. **Post brief to Slack** sends it.

**Setup**

1. Add the **Apify** node (`@apify/n8n-nodes-apify`, a verified node) if your n8n does not have it yet.
2. Create an **Apify API** credential with the token from [Apify Console → API & Integrations](https://console.apify.com/settings/integrations). No account yet? [Sign up free](https://console.apify.com/sign-up?fpr=tl88um); the free plan includes monthly credit.
3. Add an **OpenAI** credential and select it in the four OpenAI model nodes.
4. Create a Google Sheet with an `Ideas` tab and the columns `foundAt, score, firstScore, category, problem, audience, idea, demand, existingTools, gap, mvp, firstTest, subreddit, title, upvotes, comments, url`. Add a `Trends` tab with the columns `weekEnding, problem, audience, thisWeekThreads, previousWeekThreads, change, status, threadsSeen, weeksSeen, evidenceUrls`. Connect Google Sheets and pick the same file in **Save idea to Google Sheets**, **Read earlier ideas** and **Save weekly trend history**.
5. Connect Slack and pick a channel in **Post brief to Slack**.
6. Edit `subreddits` and `phrases` in **Settings**.

**Customization**

- Leave `subreddits` empty to search all of Reddit.
- Put a phrase in quotes for an exact match. Exact phrases find far fewer posts, so keep them for busy subreddits.
- Change the scoring rules in **Rate the opportunity** and **Validate with comments** to fit B2B, consumer or local businesses.
- `maxIdeas` and `commentsPerPost` set how many ideas get validated and how many comments each one reads.
- Reddit results cost about $2 per 1,000 on Apify. Comments add up to `commentsPerPost` + 1 results for each validated idea (up to 260 results, about $0.52 before start fees, at the default limits). Each subreddit search run has a $2 cap; the comment run has a $1 cap. OpenAI costs are separate.
- Trend counts cover only validated threads saved by this workflow, with at most 150 earlier threads from the last eight weeks. Each thread counts once. The `Trends` tab keeps one row per problem per run.

**Additional info**

For founders, indie hackers and product teams who look for problems worth solving. Reddit data comes from the [Reddit Scraper](https://apify.com/harshmaur/reddit-scraper?fpr=tl88um) Actor on Apify, so you need **no Reddit API key or OAuth app approval**.

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
