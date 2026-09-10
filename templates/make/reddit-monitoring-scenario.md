# Make scenario — Reddit mentions to Slack / Notion / Sheets

Make does not import third-party blueprints reliably across accounts, so this is the module-by-module recipe. Ten minutes end to end.

1. **Schedule** the scenario (clock icon) — every day, or every hour for fast-moving topics.
2. **Apify → Run an Actor**. Connect with your Apify API token. Actor: `harshmaur/reddit-scraper-pro`. Input JSON:
   ```json
   {
     "searchTerms": ["your brand", "your competitor"],
     "searchSort": "new",
     "postedAfter": "{{formatDate(addDays(now; -1); "YYYY-MM-DD")}}",
     "maxPostsCount": 100
   }
   ```
   Turn on **Run synchronously** (or add **Apify → Watch Actor Runs** as a trigger in a second scenario if runs exceed Make's timeout).
3. **Apify → Get Dataset Items**. Dataset ID: `{{2.defaultDatasetId}}`. Format JSON, limit 1000.
4. **Iterator** over the items array.
5. **Filter** (on the connection): `dataType` equals `post`.
6. **Destination**, one of:
   - **Slack → Create a Message**: `*{{5.title}}* in {{5.communityName}} ({{5.score}}↑)\n{{5.postUrl}}`
   - **Notion → Create a Database Item**: map `title`, `postUrl`, `communityName`, `score`, `createdAt`
   - **Google Sheets → Add a Row**: same fields as columns

Swap step 2's input for a subreddit archive (`"subredditUrls": ["r/SaaS"]`) or a single-community lead search (`"withinCommunity": "r/smallbusiness"`). All input fields: https://apify.com/harshmaur/reddit-scraper-pro/input-schema.

If you would rather skip Make entirely: the Actor can post to Slack, Notion, Airtable or Sheets by itself via the `mcpConnector` input, and an Apify Schedule replaces step 1.
