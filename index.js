#!/usr/bin/env node
// Stdio MCP server for the Reddit Scraper Pro Apify Actor.
// Env: APIFY_TOKEN (required), REDDIT_SCRAPER_ACTOR (default harshmaur/reddit-scraper-pro).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ACTOR = (process.env.REDDIT_SCRAPER_ACTOR || "harshmaur/reddit-scraper-pro").replace("/", "~");
const TOKEN = process.env.APIFY_TOKEN;
const RUN_TIMEOUT_S = Number(process.env.REDDIT_SCRAPER_TIMEOUT || 300);

async function runActor(input) {
  for (const k of Object.keys(input)) if (input[k] === undefined || input[k] === null || input[k] === "") delete input[k];
  if (!TOKEN) throw new Error("APIFY_TOKEN is not set. Create a free token at https://console.apify.com/account/integrations");
  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?timeout=${RUN_TIMEOUT_S}&clean=true`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}`, "User-Agent": "reddit-scraper-mcp/0.1.0" },
    body: JSON.stringify(input),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Apify ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD").optional();

function reply(items) {
  const counts = {};
  for (const it of items) counts[it.dataType || "item"] = (counts[it.dataType || "item"] || 0) + 1;
  return { content: [{ type: "text", text: JSON.stringify({ count: items.length, byType: counts, items }) }] };
}

const server = new McpServer({ name: "reddit-scraper", version: "0.1.0" });

server.registerTool(
  "search_reddit",
  {
    title: "Search Reddit",
    description:
      "Keyword search across Reddit (or inside one subreddit) and return matching posts as structured JSON: title, body, postUrl, communityName, authorName, score, commentsCount, createdAt. Use for brand monitoring, lead generation, market research, 'what is Reddit saying about X'. Search is literal keyword matching, so pass short terms (several are fine) rather than sentences.",
    inputSchema: {
      queries: z.array(z.string().min(1)).min(1).max(40).describe("Search terms; each runs as its own search"),
      subreddit: z.string().optional().describe("Restrict to one subreddit, e.g. 'SaaS' or 'r/SaaS'"),
      sort: z.enum(["new", "relevance", "top", "hot", "comments"]).default("new"),
      time: z.enum(["all", "hour", "day", "week", "month", "year"]).default("all"),
      postedAfter: date.describe("Only posts on/after this date (UTC)"),
      postedBefore: date.describe("Only posts on/before this date (UTC)"),
      searchComments: z.boolean().default(false).describe("Also return comments that mention the terms"),
      includeCommentThreads: z.boolean().default(false).describe("Fetch comments under each matching post (multiplies result count)"),
      maxCommentsPerPost: z.number().int().min(1).max(1000).default(20),
      maxPosts: z.number().int().min(1).max(5000).default(25).describe("Total posts across all queries"),
      includeNsfw: z.boolean().default(false),
    },
  },
  async (a) =>
    reply(
      await runActor({
        searchTerms: a.queries,
        withinCommunity: a.subreddit || "",
        searchSort: a.sort,
        searchTime: a.time,
        searchPosts: true,
        searchComments: a.searchComments,
        postedAfter: a.postedAfter,
        postedBefore: a.postedBefore,
        crawlCommentsPerPost: a.includeCommentThreads,
        maxCommentsPerPost: a.maxCommentsPerPost,
        maxPostsCount: a.maxPosts,
        includeNSFW: a.includeNsfw,
      }),
    ),
);

server.registerTool(
  "scrape_reddit_urls",
  {
    title: "Scrape Reddit URLs",
    description:
      "Scrape specific Reddit URLs: post permalinks (optionally with the full comment thread), user profile URLs (/user/<name>/ returns the user's posts and comments), subreddit listing URLs (/r/<name>/new/, /r/<name>/top/?t=week) or Reddit search-result page URLs. Returns structured JSON rows with a dataType of post, comment, user or community.",
    inputSchema: {
      urls: z.array(z.string().url()).min(1).max(100),
      includeCommentThreads: z.boolean().default(true).describe("For post URLs, return the comments too"),
      maxCommentsPerPost: z.number().int().min(1).max(5000).default(200),
      maxPosts: z.number().int().min(1).max(5000).default(50).describe("Cap for listing/profile URLs"),
      includeNsfw: z.boolean().default(false),
    },
  },
  async (a) =>
    reply(
      await runActor({
        startUrls: a.urls.map((url) => ({ url })),
        crawlCommentsPerPost: a.includeCommentThreads,
        maxCommentsPerPost: a.maxCommentsPerPost,
        maxPostsCount: a.maxPosts,
        includeNSFW: a.includeNsfw,
      }),
    ),
);

server.registerTool(
  "scrape_subreddit",
  {
    title: "Scrape a subreddit in bulk",
    description:
      "Pull posts from one or more subreddits in bulk (far more than a single listing page), optionally limited to a date window and optionally with each post's comments. Use for building a dataset of a community, trend analysis, or 'what has r/X been discussing since <date>'. Subreddit names only, not post links.",
    inputSchema: {
      subreddits: z.array(z.string().min(1)).min(1).max(20).describe("e.g. ['SaaS', 'r/startups']"),
      postedAfter: date,
      postedBefore: date,
      includeCommentThreads: z.boolean().default(false),
      maxCommentsPerPost: z.number().int().min(1).max(1000).default(20),
      maxPosts: z.number().int().min(1).max(50000).default(200).describe("Total posts across all subreddits"),
      includeNsfw: z.boolean().default(false),
    },
  },
  async (a) =>
    reply(
      await runActor({
        subredditUrls: a.subreddits,
        postedAfter: a.postedAfter,
        postedBefore: a.postedBefore,
        crawlCommentsPerPost: a.includeCommentThreads,
        maxCommentsPerPost: a.maxCommentsPerPost,
        maxPostsCount: a.maxPosts,
        includeNSFW: a.includeNsfw,
      }),
    ),
);

await server.connect(new StdioServerTransport());
