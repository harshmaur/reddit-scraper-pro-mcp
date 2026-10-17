# Make scenario — score Reddit buying-intent leads with AI, alert Slack, log to Sheets

Make has no public Reddit template that scores leads with AI. This recipe builds one with the Apify app, Make AI Toolkit, Google Sheets and Slack. Make AI Toolkit runs on Make's own AI provider, so users need no OpenAI key. It takes about 15 minutes.

1. **Schedule**: every day at 08:00.
2. **Apify → Run an Actor** (the current module, not the legacy one). Search Actors from: Apify Store Actors. Actor: `harshmaur/reddit-scraper`. Run synchronously: Yes. Input JSON:
   ```json
   {
     "searchTerms": ["\"looking for a tool\"", "\"any recommendations for\"", "\"alternative to\"", "\"is there an app\""],
     "searchPosts": true,
     "searchComments": true,
     "searchSort": "new",
     "postedAfter": "1 day",
     "commentedAfter": "1 day",
     "maxPostsCount": 50,
     "maxCommentsCount": 50
   }
   ```
3. **Apify → Get Dataset Items**. Dataset ID: `{{1.defaultDatasetId}}`. Limit 1000. It outputs one bundle per item, so no Iterator is needed.
4. **Data store → Check the existence of a record** with key `{{2.id}}` in a key-only data store. On the next connection add a filter: `{{3.exist}}` equal to false (Boolean operators), so each lead is scored once.
5. **Make AI Toolkit → Simple Text Prompt** on Make's AI Provider (no API key). It has one Text field:
   ```
   You qualify sales leads from Reddit. We sell: <your product>. Return only bare JSON with no code fences: {"score": 0-100, "need": "<one sentence>", "replyAngle": "<one helpful sentence>"}. 80-100: asks for a tool that fits our product. 50-79: has the problem but does not ask. 0-49: news, hiring, self-promotion, unrelated.

   Reddit post or comment: {{ifempty(2.title; 2.postTitle)}} — {{substring(2.body; 0; 2000)}}
   ```
6. **JSON → Parse JSON** on `{{4.answer}}`, with a data structure that holds `score`, `need` and `replyAngle`.
7. **Data store → Add/replace a record** with key `{{2.id}}`.
8. **Google Sheets → Add a Row**: `{{5.score}}`, `{{5.need}}`, `{{5.replyAngle}}`, `{{2.dataType}}`, `{{ifempty(2.communityName; 2.subredditName)}}`, `{{ifempty(2.title; 2.postTitle)}}`, `{{ifempty(2.postUrl; 2.url)}}`, `{{2.authorName}}`.
9. On the next connection, a filter `{{5.score}}` ≥ 70, then **Slack → Send a Message**: `:fire: {{5.score}}/100 Reddit lead — {{5.need}}\n{{ifempty(2.postUrl; 2.url)}}`.

Module numbers count modules, not steps. The schedule is not a module, so Run an Actor is 1, Get Dataset Items 2, the existence check 3, Make AI 4, Parse JSON 5, Add/replace 6, Google Sheets 7 and Slack 8.

Posts carry `title`, `communityName`, `postUrl` and `createdAt`. Comments carry `subredditName`, `url` and `commentCreatedAt`; comments from comment search also carry `postTitle`, comments collected per post do not. The `ifempty` calls cover both.

Gallery listing:

- Name: `Score Reddit buying-intent leads with AI and send hot leads to Slack`
- Description: Every day this scenario finds Reddit posts and comments where people ask for a tool, scores each one from 0 to 100 with Make AI, saves every lead to Google Sheets and sends leads that score 70 or more to Slack. It uses the Reddit Scraper Actor on Apify, so it needs no Reddit API key and no OpenAI key. Reddit results cost about $2 per 1,000.
