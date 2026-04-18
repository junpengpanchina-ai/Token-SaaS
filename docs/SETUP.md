# Setup Guide — Supabase Auth + Vercel 部署

> 这份文档带你把 **Supabase 项目 + Google OAuth + Vercel 部署** 从零配到能登录上线。
> 前端代码已经全部写好（`lib/supabase/`、`/auth/callback`、`/login`、`/dashboard` 等），你只需要按这份文档把后台的"孔"插上。

---

## 0. 架构先看一眼

```
[浏览器]
   │
   │ ① 点 Continue with Google
   ▼
[Next.js @ Vercel] ──────── 只认 Supabase，不碰 Google ────────┐
   │                                                           │
   │ ② signInWithOAuth({ provider: "google" })                 │
   ▼                                                           │
[Supabase Auth]                                                │
   │                                                           │
   │ ③ 用 Client ID / Secret 跟 Google 通话                     │
   ▼                                                           │
[Google OAuth]                                                 │
   │                                                           │
   │ ④ 用户授权成功，回调到 Supabase                            │
   ▼                                                           │
[Supabase] ── ⑤ 生成 session，redirect 到 Next.js /auth/callback ┘
   │
   │ ⑥ Next.js 用 code 换 session 写 cookie
   ▼
[浏览器] → /dashboard（已登录）
```

**关键概念**：
- **Google Client ID / Secret** → 只在 Supabase 存，**Vercel 完全不碰**
- **Supabase URL / Anon Key / Service Role Key** → 只在 Vercel 和本地 `.env.local` 存，**代码里绝不 hardcode**
- **两处都要配 Redirect URL**，而且不是一个地方

---

## 1. Supabase 项目（一次性）

### 1.1 建项目

1. 打开 <https://supabase.com> → **New project**
2. Organization 选你的 → Name 填 `token-saas`（随便）→ Database password 自己记好 → Region 选**离你用户近的**（国内/亚太选 Singapore 或 Tokyo）
3. Create new project，等 2~3 分钟建好

### 1.2 拿三把 key

左侧栏（窄的图标栏）最下面齿轮 → **Project Settings** → **API**：

| 名字（Supabase 里显示） | 对应的环境变量 | 特点 |
|-----|-----|-----|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` | 公开 |
| **Project API keys → anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 公开（给浏览器） |
| **Project API keys → service_role** | `SUPABASE_SERVICE_ROLE_KEY` | **机密**（只服务端用） |

记下来，等下 `.env.local` 和 Vercel 都要用。

从这里也能拿到你的 **Project Ref**（Project URL 里 `https://` 和 `.supabase.co` 之间那串），类似 `swvelgzdlwmnpczguurm`。下面很多地方会用到它。

### 1.3 跑建表 SQL

左侧栏 → **SQL Editor** → **New query**

把 `supabase/schema.sql` 的全部内容粘进去 → **Run**。

完成后你会有：

- `public.profiles`：和 `auth.users` 一对一，开启 RLS，本人才能读写自己
- `public.leads`：留资表，RLS 全锁死（只 service-role 能写）
- 触发器：用户首次 Google 登录时自动建 profile

验证：左侧栏 **Table Editor** → 能看到 `profiles` 和 `leads` 两张表。

---

## 2. Google Cloud Console（拿 OAuth 凭据）

### 2.1 建/选项目

1. 打开 <https://console.cloud.google.com/>
2. 顶部左边项目下拉 → **New Project** → 名字填 `Token SaaS` → Create
3. **切到这个新项目**（顶部下拉选中它，很多人漏这步）

### 2.2 配 OAuth 同意页面

左侧菜单 → **APIs & Services** → **OAuth consent screen**

- **User Type**：**External** → Create

**App information**
- App name：`Token SaaS`
- User support email：你的 Gmail
- App logo：跳过

**App domain**：全部留空

**Developer contact**：你的 Gmail → **Save and continue**

**Scopes**：直接 **Save and continue**

**Test users**：**Add users** → **加你自己的 Gmail**（不加的话登录会报 "App hasn't been verified"）→ **Save and continue**

**Summary** → **Back to Dashboard**

> ⚠️ 应用此时是 **Testing** 模式，只有 Test users 列表里的 Gmail 能登。开发期够用。等正式开放给所有人再点 **Publish App**，那会需要提交审核材料。

### 2.3 建 OAuth Client ID

左侧菜单 → **APIs & Services** → **Credentials** → 顶部 **+ Create Credentials** → **OAuth client ID**

- **Application type**：**Web application**
- **Name**：`Token SaaS Web`
- **Authorized JavaScript origins**：留空
- **Authorized redirect URIs** → **+ Add URI** → 填：

  ```
  https://<你的 Project Ref>.supabase.co/auth/v1/callback
  ```

  比如 project ref 是 `swvelgzdlwmnpczguurm`，就填：

  ```
  https://swvelgzdlwmnpczguurm.supabase.co/auth/v1/callback
  ```

  > 📌 **最稳的拿法**：去 Supabase 的 Google Provider 配置页（下一步 3.1 会到），页面上有一个只读的 **Callback URL (for OAuth)** 字段，直接复制那个，一字不差。

- **Create**

### 2.4 复制两个值

弹窗显示：

- **Client ID**：`1234567-xxxxx.apps.googleusercontent.com`
- **Client secret**：`GOCSPX-xxxxxxxxxxxxxxxx`

两个都复制，先贴到记事本暂存（关了弹窗还能从 Credentials 列表里点回来看）。

---

## 3. Supabase 里开 Google Provider

### 3.1 粘凭据

左侧栏 → **Authentication**（人/锁图标）→ **Sign In / Providers**

往下滚到 **Google** → 点展开：

1. 打开 **Enable Sign in with Google** 开关
2. **Client ID (for OAuth)** → 粘 Google 的 Client ID
3. **Client Secret (for OAuth)** → 粘 Google 的 Client Secret
4. 下面那个只读的 **Callback URL (for OAuth)** → 就是你刚刚填到 Google Cloud 的那条（校验一下一致）
5. **Save**

### 3.2 配 Site URL 和 Redirect URLs

左侧栏 → **Authentication** → **URL Configuration**

- **Site URL**：先填本地 `http://localhost:3000`；等部署到 Vercel 后改成生产域名（二选一，只能填一个）
- **Redirect URLs** → 点 **Add URL** 依次加：

  ```
  http://localhost:3000/auth/callback
  https://<你的 vercel 域名>/auth/callback
  ```

  > Preview 部署的域名也要加（比如 PR 预览），可以用通配：`https://*-yourname.vercel.app/auth/callback`

- **Save**

---

## 4. 本地开发

### 4.1 建 `.env.local`

```bash
cp .env.example .env.local
```

打开 `.env.local`，把 4 个值填上（前 3 个从 1.2 拿，第 4 个本地就用默认）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://<你的 ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ `.env.local` 已在 `.gitignore` 里，不会被 push。永远不要把 `SUPABASE_SERVICE_ROLE_KEY` 加 `NEXT_PUBLIC_` 前缀——一加就会被打包进浏览器 JS，等于把数据库裸奔。

### 4.2 跑起来

```bash
npm install    # 只第一次要
npm run dev
```

访问 <http://localhost:3000/login> → **Continue with Google** → 选账号 → 回到 `/dashboard`，看到你的 Gmail 和 User ID 说明成功。

验证 2 件事：
- Supabase Dashboard → Authentication → **Users**：能看到你刚登录的用户
- Supabase Dashboard → Table Editor → `profiles`：对应一条记录被触发器自动建好

---

## 5. Vercel 部署

### 5.1 导入项目

<https://vercel.com> → **Add New → Project** → 从 GitHub 选 `Token-SaaS` 仓库 → Framework 自动识别 Next.js，不用改。

### 5.2 加环境变量（**关键一步**）

Project → **Settings → Environment Variables** → 一条条 **Add New**。

4 个变量，**里面没有 Google 的任何东西**：

| Name | Value 从哪拿 | 勾选环境 |
|------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API → Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API → anon public | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API → service_role（Reveal） | **只勾 Production**（更严） |
| `NEXT_PUBLIC_SITE_URL` | 先填 `https://<vercel 域名>`，部署后拿到真实域名回来改 | Production |

> 🔑 **名字一个字都不能错**，大小写敏感。
> 🔑 `SUPABASE_SERVICE_ROLE_KEY` **绝不能带 `NEXT_PUBLIC_` 前缀**。
> 🔑 **Google 的 Client ID / Secret 不要加到 Vercel**，它们只属于 Supabase。

### 5.3 Deploy

点 **Deploy**。等 build 完成（大概 1~2 分钟），拿到 Vercel 分配的域名，比如：

```
https://token-saas-xxx.vercel.app
```

### 5.4 部署完的回填（**很容易忘**）

拿到真实域名后，**3 个地方**都要更新：

#### ① Vercel 里改 `NEXT_PUBLIC_SITE_URL`
- Settings → Environment Variables → 找到 `NEXT_PUBLIC_SITE_URL` → Edit → 改成真实域名 → Save
- Deployments → 最新一条右边 `...` → **Redeploy**（**取消勾** Use existing Build Cache）

#### ② Supabase → Authentication → URL Configuration
- **Site URL** 改成 Vercel 真实域名
- **Redirect URLs** 追加 `https://<真实域名>/auth/callback`（本地的 `http://localhost:3000/auth/callback` 保留）

#### ③ Google Cloud Console 要不要改？
- **不用改**。Google 只认 Supabase 那个 `https://<ref>.supabase.co/auth/v1/callback`，跟你 Vercel 域名完全无关。

### 5.5 线上验证

访问 `https://<vercel 域名>/login` → Continue with Google → 回到 `/dashboard`。

---

## 6. 留资接口（`/api/leads`）

这个已经直接能用了——代码里 `app/api/leads/route.ts` 用 `SUPABASE_SERVICE_ROLE_KEY` 绕过 RLS 写入 `public.leads` 表。

**测试**：首页滚到底 / Contact 页 → 提交 LeadForm → Supabase Table Editor → `leads` 表能看到新记录。

---

## 7. 常见报错速查

| 现象 | 原因 | 解决 |
|------|------|------|
| Vercel build 失败 "Missing NEXT_PUBLIC_SUPABASE_URL..." | 环境变量没设 / 没勾 Production | 5.2 重新设 |
| Vercel build 过了，页面打开 500 | 运行时环境变量没加载 | 5.2 之后必须 5.4 Redeploy 一次 |
| 点 Google 跳转后报 `redirect_uri_mismatch` | Google Cloud 里 Authorized redirect URI 跟 Supabase callback 不一致 | 2.3 检查 URI，最稳是从 3.1 Callback URL 字段复制 |
| "This app hasn't been verified" / access_denied | 你的 Gmail 不在 OAuth consent screen 的 Test users 里 | 2.2 加进去 |
| 登录回来跳到 `/login?error=...` | Supabase 里 Client Secret 粘错了 | 3.1 重新粘 |
| OAuth 后跳到首页而不是 `/dashboard` | Supabase Redirect URLs 没加 `/auth/callback` | 3.2 加上 |
| 本地正常，线上登录后白屏 | `NEXT_PUBLIC_SITE_URL` 还是 localhost | 5.4 ① |
| Leads 提交 500 | `SUPABASE_SERVICE_ROLE_KEY` 没设 / 拼错 / 带了 `NEXT_PUBLIC_` 前缀 | 5.2 重检 |

---

## 8. 安全检查清单（上线前跑一遍）

- [ ] `.env.local` 在 `.gitignore` 里，`git status` 看不到它
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 不带 `NEXT_PUBLIC_` 前缀
- [ ] Supabase 所有表都开启了 RLS（Table Editor 里每张表右边有 "RLS enabled" 标识）
- [ ] `leads` 表没有任何 policy（纯靠 service-role 写入）
- [ ] `profiles` 表 policy 只允许用户读/改自己那行
- [ ] Google OAuth consent screen 里 Test users 没有不相关的人
- [ ] Vercel 环境变量里没有 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`（不该存在）
- [ ] 生产 `NEXT_PUBLIC_SITE_URL` 指向真实域名，不是 localhost

---

## 9. 之后要加功能时去哪改

| 要做的事 | 改哪 |
|---------|-----|
| 新加一个 OAuth 提供商（GitHub / Apple） | Supabase Providers 配一下 → `services/auth.service.ts` 加个 `signInWithGithub` → 按钮 |
| 要邮箱 + 密码登录 | Supabase 已开 Email，写一个 form → `supabase.auth.signInWithPassword({ email, password })` |
| 登录后跳转到 `/dashboard` 以外的页面 | `signInWithGoogle(next)` 传一个 `next` path 就行，回调自动跳 |
| Dashboard 只给 Pro 用户看 | `app/dashboard/page.tsx` 里加一段查 `profiles.plan` 判断 |
| 新加一张业务表 | 写到 `supabase/schema.sql` → Supabase SQL Editor Run → 如果前端要读，写到 `services/xxx.service.ts`，**不要**直接在页面里 `supabase.from(...)` |

---

**核心原则再强调一遍**：

> Google 凭据 → 只 Supabase
> Supabase 凭据 → 只 Vercel + 本地 `.env.local`
> 页面 → 只调 `services/*` 或 `lib/supabase/*`，绝不直接 hardcode key
