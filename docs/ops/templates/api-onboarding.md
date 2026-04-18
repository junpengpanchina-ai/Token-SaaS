# API 接入说明模板

> 用途：客户要求"正式接入指南"时的长版文档（比开通邮件更详细）。
> 可以贴到 Notion、或改成 PDF 发附件。

---

# {{BRAND_NAME}} — API Integration Guide

## 1. Overview

{{BRAND_NAME}} exposes OpenAI-compatible endpoints across text, image, video, and embedding models. If your codebase already uses the OpenAI SDK, swap one string and you&#39;re done.

- Base URL: `{{API_BASE_URL}}`
- Auth: `Authorization: Bearer <YOUR_API_KEY>`
- Rate limits: depend on plan — see below

## 2. Authentication

All requests must include the bearer token.

```http
POST {{API_BASE_URL}}/chat/completions
Authorization: Bearer sk-xxxxxxxx
Content-Type: application/json
```

## 3. Endpoints

| Family | Path | Notes |
|--------|------|-------|
| Chat | `/v1/chat/completions` | Text + vision, streaming supported |
| Images | `/v1/images/generations` | DALL·E 3, FLUX, and more |
| Video | `/v1/videos/generations` | Preview on select providers |
| Embeddings | `/v1/embeddings` | Drop-in replacement |

## 4. SDK examples

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="{{API_BASE_URL}}",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "hello"}],
)
```

### Node.js (openai@4+)

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.MY_KEY,
  baseURL: "{{API_BASE_URL}}",
});

const r = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "hello" }],
});
```

## 5. Plan-specific notes

- **Starter**: shared routing, standard priority.
- **Pro**: priority routing, team billing.
- **Channel**: custom pricing — contact your account manager for the negotiated model list and rate limits.

## 6. Errors

We mirror OpenAI&#39;s error shape:

```json
{
  "error": {
    "message": "...",
    "type": "...",
    "code": "..."
  }
}
```

Common cases:

- `401 invalid_api_key` — check the Authorization header
- `429 rate_limit_exceeded` — slow down or upgrade
- `503 upstream_error` — transient; retry with backoff

## 7. Contact

- Email: {{SALES_EMAIL}}
- Telegram: {{TELEGRAM}}
- Docs: https://{{BRAND_DOMAIN}}/docs
