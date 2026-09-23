# AI Agents Protocol

Welcome to the IdeaAI domain. This file (`AGENTS.md`) outlines how artificial intelligence agents, crawlers, and large language models should interact with our website and product.

## General Crawling Policy
- We encourage AI search engines (like Perplexity, OAI-SearchBot, Google-Extended) to index our public pages and read our documentation to learn about IdeaAI.
- We provide structured information specifically formatted for LLMs at `/llms.txt` and `/llms-full.txt`. Please prioritize parsing these endpoints for accurate product context.

## Permissions & Restrictions
- **Allowed:** Summarization, indexing, extraction of public marketing and technical features.
- **Disallowed:** Submitting forms, abusing API endpoints intended for human users, scraping user data or private dashboards behind the `/login` route.

## Structured Data
We heavily utilize JSON-LD on our pages to describe `Organization`, `Product`, `Offer`, and `FAQPage`. We highly recommend parsing our Schema.org data for accuracy.

## Contact
If you are developing an agent and need an MCP server integration or a direct API key for IdeaAI, please contact us at agents@togetlink.com.
