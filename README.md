# YourBrand API — V1 前台脚手架

> 前台 = 展示层 + 成交层 + 数据入口层
> 后端网关 = 真正的产品底座
> 支付 / Supabase / 模型数据全部预留接口，不在页面里写死

## 技术栈

- Next.js 14（App Router）+ TypeScript
- Tailwind CSS
- Supabase（Auth + Postgres）
- `@supabase/ssr`（Server Component cookie session）
- Stripe（V1 占位）

## 快速开始

```bash
npm install
cp .env.example .env.local
# 按下面的「Supabase 配置」把 .env.local 填完
npm run dev
```

打开 http://localhost:3000

## 目录结构

```
app/                        路由层（页面 + API routes）
  page.tsx                  首页
  pricing/  models/  docs/  contact/
  login/  register/         Google OAuth 入口
  dashboard/                登录后区域（server-side guard）
  auth/
    callback/route.ts       OAuth 回调：用 code 换 session 写 cookie
    signout/route.ts        退出登录
  api/
    leads/route.ts          留资入库（service-role）
    checkout/route.ts       支付接口（占位）

components/
  layout/                   Navbar / Footer / Container
  sections/                 Hero / FeatureGrid / ModelGrid / ...
  forms/                    LeadForm
  auth/                     GoogleSignInButton
  ui/

lib/                        基础能力层（第三方 SDK + 常量 + 工具）
  env.ts                    环境变量集中读取 + 断言
  supabase/
    client.ts               浏览器 client（Client Component 用）
    server.ts               Server Component / Route Handler / Server Action 用
    middleware.ts           中间件刷新 session
    admin.ts                service-role，绕过 RLS，仅服务端
  stripe.ts / api.ts / constants.ts / utils.ts

services/                   业务逻辑层（页面不直调 lib）
  auth.service.ts           signInWithGoogle 等
  lead.service.ts / checkout.service.ts / model.service.ts / pricing.service.ts

data/                       静态内容层
types/                      共享类型
supabase/schema.sql         建表脚本（profiles + leads + trigger）
middleware.ts               根 middleware，每次请求刷 session
```

## 分层规则（后面接手的人必须遵守）

1. **新页面** → 只进 `app/`，不乱建层级
2. **重复 UI** → 必须抽 `components/`，不允许复制粘贴 3 遍
3. **第三方连接** → 一律走 `lib/`（Supabase / Stripe / fetch）
4. **业务逻辑** → 一律走 `services/`
5. **静态文案** → 一律放 `data/`，不要硬编码到 JSX
6. **Supabase client 三选一**：
   - Client Component：`lib/supabase/client.ts`
   - Server Component / Route Handler / Server Action：`lib/supabase/server.ts`
   - 需要绕过 RLS（写 leads、后台 job）：`lib/supabase/admin.ts`
7. **service-role key 只在服务端** —— 永远不要带 `NEXT_PUBLIC_` 前缀

## 环境变量

见 `.env.example`：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase 配置（一次性）

### 1. 建项目 + 拿 key

1. 打开 https://supabase.com 新建项目
2. **Settings → API**：复制 `Project URL`、`anon public`、`service_role` 三个值到 `.env.local`

### 2. 跑建表脚本

**SQL Editor** → 新建 query → 粘贴 `supabase/schema.sql` 的全部内容 → Run。

建好后你会有：

- `public.profiles`：和 `auth.users` 一对一，开启 RLS，只能本人读写
- `public.leads`：留资表，RLS 全锁死，只有 service-role（`/api/leads`）能写
- 触发器：用户首次 OAuth 登录时自动建 profile

### 3. 打开 Google OAuth

#### 3.1 Google Cloud Console

1. 打开 https://console.cloud.google.com/
2. 建 project（或用现有的）
3. **APIs & Services → OAuth consent screen**：
   - User type: **External**
   - App name / support email 填一下
   - Scopes 默认（email / profile / openid）
   - Test users 加上你自己的 Gmail（开发期用 Testing 模式就够）
4. **Credentials → Create Credentials → OAuth client ID**：
   - Application type: **Web application**
   - **Authorized redirect URIs** 加一条：
     ```
     https://<你的项目>.supabase.co/auth/v1/callback
     ```
   - 创建后复制 **Client ID** 和 **Client Secret**

#### 3.2 Supabase Dashboard

1. **Authentication → Providers → Google** → 打开
2. 粘贴上一步的 **Client ID** / **Client Secret** → Save
3. **Authentication → URL Configuration**：
   - **Site URL**：`http://localhost:3000`（上线后改成正式域名）
   - **Redirect URLs** 加：
     ```
     http://localhost:3000/auth/callback
     https://你的正式域名/auth/callback
     ```

### 4. 本地启

```bash
npm run dev
```

- 访问 http://localhost:3000/login → 点 **Continue with Google** → Google 授权 → 回到 `/dashboard`
- Navbar 右上角会从 `Sign in / Get access` 变成 `Dashboard / Sign out`
- 访问首页提交 LeadForm → Supabase `leads` 表里就能看到数据

## 认证流程一图流

```
[Browser]                    [Next.js]                 [Supabase]          [Google]
   │  click "Continue with Google"
   ├─────────────────────────▶ signInWithOAuth ─────────▶ redirect ────────▶ OAuth
   │                                                                          │
   │◀──────────── /auth/callback?code=xxx ─────────────────────────────────────┤
   │                              │
   │                              ├─ exchangeCodeForSession(code) ───▶ Supabase
   │                              │◀── session (access/refresh token)
   │                              │
   │◀───── redirect /dashboard ──┤ (cookie 已写好)
   │
   │  后续请求                   middleware.ts ── refresh session on every req
```

## 开发顺序建议

1. ~~跑通首页 / Pricing / Models / Docs / Contact~~（已完成）
2. ~~接 Supabase Auth（Google 登录） + `leads` 入库~~（当前步骤）
3. **下一步**：接 Stripe，替换 Pricing / Hero / CTA 按钮的占位
4. 再下一步：Dashboard 真实数据（API keys / 用量 / 账单）

## 最关键的一句

**这套前台架构不是为了今天写爽，是为了后面任何人接手都不把项目做成屎山。**
