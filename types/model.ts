export type ModelCategory = "text" | "image" | "video" | "audio" | "embedding";

export type ModelStatus = "available" | "preview" | "limited" | "coming-soon";

export type PriceUnit = "1K tokens" | "call" | "image" | "second" | "minute";

export type ModelPrice = {
  min: number;
  max: number;
  currency: "USD" | "CNY";
  unit: PriceUnit;
};

export type ModelCard = {
  id: string;
  name: string;
  vendor: string;
  category: ModelCategory;
  status: ModelStatus;
  description: string;

  price: ModelPrice;

  /** 积分消耗（每次调用），无则用 token 计费 */
  credits?: number;
  /** 上下文窗口，e.g. "128K" / "1M+" */
  contextWindow?: string;
  /** 最大 token，如果有则显示 */
  maxTokens?: string;

  /** 违规返还 */
  refundOnViolation?: boolean;
  /** 失败返还 */
  refundOnFailure?: boolean;

  /** 能力标签，e.g. ["reasoning", "code"] */
  capabilities?: string[];
  /** 分辨率（图像/视频模型专用），e.g. ["1K", "2K", "4K"] */
  resolutions?: string[];

  /** 文档链接（站内 or 外部） */
  docsUrl?: string;
  /** OpenAI 兼容 endpoint */
  endpoint?: string;
};
