export interface CloudflareCredentials {
  accountId: string;
  gatewayName: string;
  token: string;
}

export interface ResultInfo {
  count: number;
  page: number;
  per_page: number;
  total_count: number;
}

export interface LogEntry {
  id: string;
  created_at: string;
  metadata: {
    email: string;
    [key: string]: unknown;
  };
  model: string;
  cost: number;
  tokens: number;
  [key: string]: unknown;
}

export interface CloudflareLogsResponse {
  success: boolean;
  result: LogEntry[];
  result_info: ResultInfo;
  errors: unknown[];
  messages: unknown[];
}

export interface UserStats {
  email: string;
  totalCost: number;
  totalTokens: number;
  requestCount: number;
  models: {
    [model: string]: {
      cost: number;
      tokens: number;
      requests: number;
    };
  };
}

export interface ModelStats {
  model: string;
  totalCost: number;
  totalTokens: number;
  requestCount: number;
  users: {
    [email: string]: {
      cost: number;
      tokens: number;
      requests: number;
    };
  };
}

export type TimeFilter = '24h' | '3d' | '7d' | '14d' | '30d'; 