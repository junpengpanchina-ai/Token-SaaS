# 常见问题 FAQ 模板

> 用途：客户问到"常见问题"时可以直接贴。
> 也是销售 / 运营的内部话术备忘录。

---

## 接入

**Q: 你们兼容 OpenAI SDK 吗？**
A: 是。只需要改 `base_url`，`api_key` 换成我们发的即可，代码其它部分不用动。

**Q: 支持流式响应吗？**
A: 只要上游提供，我们就透传。`stream: true` 直接用即可。

**Q: 支持 function calling / JSON mode 吗？**
A: 只要上游模型支持，就按 OpenAI spec 透传。Gemini / Claude 的 tool_use 也做了兼容层。

---

## 模型

**Q: 支持哪些模型？**
A: 见 https://{{BRAND_DOMAIN}}/models。每款模型状态分三档：Available / Limited / Preview。

**Q: 模型列表会变吗？**
A: 会。我们会保留主流 SKU，新模型第一时间接入。下线前会提前 30 天通知。

**Q: 能支持我指定的某个小众模型吗？**
A: 可以谈。只要我们能拿到稳定上游，就能接。联系 {{SALES_EMAIL}}。

---

## 价格与计费

**Q: 你们怎么计费？**
A: 月费 + 按量，模型单价见定价页。Channel 客户单独合同。

**Q: 能开发票吗？**
A: Pro 及以上可以。先联系销售确认抬头。

**Q: 支持哪些付款方式？**
A: 信用卡（Stripe）。渠道客户可以走对公 / USDT，视地区协商。

**Q: 可以试用吗？**
A: 可以。开通后发少量额度供测试，满意再升级。

---

## 账户与合规

**Q: 我的数据会被记录吗？**
A: 请求体我们不存，只存请求元信息（时间、模型、token 数）用于计费。

**Q: key 泄露了怎么办？**
A: Dashboard 里可以 Revoke，然后我们帮你新建。建议切换到不同 key 区分环境（prod/staging）。

**Q: 能给我多个 key 吗？**
A: Pro 及以上默认可建多个。Starter 默认一个，额外付费。

---

## 服务状态

**Q: 有 SLA 吗？**
A: Starter 无 SLA。Pro 99.5% 月可用性目标。Channel 按合同。

**Q: 出问题了怎么联系？**
A:
- Email: {{SALES_EMAIL}}
- Telegram: {{TELEGRAM}}
- 工作时间：Mon – Sun，异步响应，大多数问题 1 个工作日内解决
