# 人工开通 SOP（V1）

> 自动化没通之前，销售 / 运营就按这份流程跑。
> 目标：第一批客户完全可以人工服务，不需要后台全做完。

---

## 0. 前置

- [ ] 执行过 `docs/ops/schema.sql`，确认 Supabase 有 `leads` / `profiles` / `orders` / `api_keys` 四张表
- [ ] Supabase Auth 已配置 Google OAuth
- [ ] Stripe Payment Links 已在 Dashboard 创建，且成功 / 取消 URL 指向：
  - success: `https://<domain>/checkout/success?plan={starter|pro}`
  - cancel:  `https://<domain>/checkout/cancel`
- [ ] `.env.local` / Vercel env 填好：
  - `NEXT_PUBLIC_STRIPE_LINK_STARTER`
  - `NEXT_PUBLIC_STRIPE_LINK_PRO`
  - 品牌四件套 + API Base URL

---

## 1. 线索进入

线索有三个来源，所有都会落到 Supabase：

| 来源 | 表 | 识别字段 |
|------|----|---------|
| Contact 表单 | `leads` | `source = "contact-page\|plan:xxx"` 或 `"\|topic:channel"` |
| Google 登录 | `profiles` | 新行，`status = pending_activation` |
| Stripe 付款 | `orders` | `status = paid`（webhook 接入前先人工看 Stripe Dashboard） |

**运营每天一次过一遍：**
1. Supabase → `leads` 按 `status = 'new'` 排序
2. Supabase → `profiles` 按 `status = 'pending_activation'` 排序
3. Stripe Dashboard → 按日期看新付款

---

## 2. 判断客户类型

根据信息填入 `profiles.plan`：

| 客户特征 | 判为 | 动作 |
|---------|------|------|
| 付 $29–$99 月费，普通开发者 | `starter` / `pro` | 直接开通 |
| 要求发票 / 批量账号 / 团队 | `pro` | 先回邮件确认细节，再开通 |
| 要求折扣 / 白标 / 转售 | `channel` | 走渠道谈判，单独定价后再开通 |

---

## 3. 开通操作

### 3.1 在 new-api（或上游网关）创建 key

1. 登录 new-api admin
2. 建 user（用客户邮箱作为唯一标识）
3. 生成 API key，记录 upstream_id 和完整 key

### 3.2 更新 Supabase

在 SQL Editor 执行（用真实值替换 `<...>`）：

```sql
-- 激活账户
update public.profiles
set plan = '<starter|pro|channel>',
    status = 'active',
    credits = <初始额度>,
    updated_at = now()
where email = '<客户邮箱>';

-- 记录 key（masked 只存前4+后4）
insert into public.api_keys (user_id, label, masked, upstream_id)
values (
  (select id from public.profiles where email = '<客户邮箱>'),
  'Primary key',
  '<sk-xxx...xxxx>',
  '<new-api 里的 id>'
);

-- 如果是 Stripe 付款，把 order 关联到用户
update public.orders
set user_id = (select id from public.profiles where email = '<客户邮箱>')
where stripe_session_id = '<cs_xxx>';
```

### 3.3 发开通邮件

用 `docs/ops/templates/activation-email.md` 模板，填入：
- 客户名 / 称呼
- 完整 API key（**仅此一次发送**）
- API Base URL（`https://api.<domain>/v1`）
- Docs 链接
- Plan 名称
- 初始额度

---

## 4. 跟进

- 开通 3 天内：主动问一次是否接入成功、有没有 400/401
- 开通 7 天内：问一次实际用量和模型偏好
- 问题集中的 → 汇总到 `docs/ops/templates/faq.md`

---

## 5. 常见异常

| 症状 | 原因 | 处理 |
|------|------|------|
| 客户说付款了但 Dashboard 还 Pending | 没跑 SQL 激活 | 手动 `update profiles set status='active'` |
| 客户反馈 401 | key 没发对 / new-api 没启用 | 查 new-api 日志 + 重发 key |
| 客户要退款 | 按服务条款处理 | Stripe Dashboard refund + `orders.status='refunded'` + `profiles.status='suspended'` |

---

## 6. 不要做的事

- ❌ 把真实 API key 贴在 Supabase `profiles.notes` 里（会被 SELECT 读到）
- ❌ 用 anon key 在前端直接写 `api_keys` 表
- ❌ 在客户没付款 / 没通过审核前发 key
- ❌ 把 `leads.message` 里的客户原话贴到朋友圈
