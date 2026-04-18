# 开通邮件模板

> 用途：客户审核通过、key 已创建后第一封通知。
> 发件人：`{{SALES_EMAIL}}` · 主题：`Your {{BRAND_NAME}} API access is live`

---

Hi {{customer_name}},

Welcome to {{BRAND_NAME}}. Your account is now active.

## Your access

- **Plan**: {{plan}}
- **API Base URL**: `{{API_BASE_URL}}`
- **API Key**: `{{FULL_API_KEY}}`

> Store this key somewhere safe — this is the only time we&#39;ll send it in full.

## Quick test

```bash
curl {{API_BASE_URL}}/chat/completions \
  -H "Authorization: Bearer {{FULL_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'
```

If you use the OpenAI Python SDK, just set `base_url={{API_BASE_URL}}` and `api_key={{FULL_API_KEY}}`.

## What&#39;s next

- Full docs: https://{{BRAND_DOMAIN}}/docs
- Available models: https://{{BRAND_DOMAIN}}/models
- Your dashboard: https://{{BRAND_DOMAIN}}/dashboard

## Need anything?

Reply to this email, or:

- Email: {{SALES_EMAIL}}
- Telegram: {{TELEGRAM}}

Thanks for trusting us to ship your AI workloads.

— The {{BRAND_NAME}} team
