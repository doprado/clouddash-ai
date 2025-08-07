import { LogEntry, CloudflareLogsResponse } from '@/types/cloudflare';

// Dados de exemplo baseados na estrutura real da API do Cloudflare
export const mockLogs: LogEntry[] = [
  {
    id: "1",
    created_at: "2024-01-15T10:30:00Z",
    metadata: { email: "user1@example.com" },
    model: "gpt-4",
    cost: 0.0025,
    tokens: 1500
  },
  {
    id: "2",
    created_at: "2024-01-15T11:15:00Z",
    metadata: { email: "user2@example.com" },
    model: "gpt-3.5-turbo",
    cost: 0.0012,
    tokens: 800
  },
  {
    id: "3",
    created_at: "2024-01-15T12:00:00Z",
    metadata: { email: "user1@example.com" },
    model: "claude-3-sonnet",
    cost: 0.0030,
    tokens: 2000
  },
  {
    id: "4",
    created_at: "2024-01-15T13:45:00Z",
    metadata: { email: "user3@example.com" },
    model: "gpt-4",
    cost: 0.0018,
    tokens: 1200
  },
  {
    id: "5",
    created_at: "2024-01-15T14:20:00Z",
    metadata: { email: "user2@example.com" },
    model: "gpt-3.5-turbo",
    cost: 0.0009,
    tokens: 600
  },
  {
    id: "6",
    created_at: "2024-01-15T15:10:00Z",
    metadata: { email: "user1@example.com" },
    model: "gpt-4",
    cost: 0.0035,
    tokens: 2200
  },
  {
    id: "7",
    created_at: "2024-01-15T16:30:00Z",
    metadata: { email: "user4@example.com" },
    model: "claude-3-haiku",
    cost: 0.0015,
    tokens: 1000
  },
  {
    id: "8",
    created_at: "2024-01-15T17:00:00Z",
    metadata: { email: "user3@example.com" },
    model: "gpt-3.5-turbo",
    cost: 0.0010,
    tokens: 700
  },
  {
    id: "9",
    created_at: "2024-01-15T18:15:00Z",
    metadata: { email: "user2@example.com" },
    model: "gpt-4",
    cost: 0.0020,
    tokens: 1300
  },
  {
    id: "10",
    created_at: "2024-01-15T19:30:00Z",
    metadata: { email: "user1@example.com" },
    model: "claude-3-sonnet",
    cost: 0.0040,
    tokens: 2500
  },
  {
    id: "11",
    created_at: "2024-01-15T20:00:00Z",
    metadata: { email: "user5@example.com" },
    model: "gpt-3.5-turbo",
    cost: 0.0008,
    tokens: 500
  },
  {
    id: "12",
    created_at: "2024-01-15T21:45:00Z",
    metadata: { email: "user3@example.com" },
    model: "gpt-4",
    cost: 0.0028,
    tokens: 1800
  },
  {
    id: "13",
    created_at: "2024-01-15T22:20:00Z",
    metadata: { email: "user1@example.com" },
    model: "claude-3-haiku",
    cost: 0.0012,
    tokens: 800
  },
  {
    id: "14",
    created_at: "2024-01-15T23:10:00Z",
    metadata: { email: "user2@example.com" },
    model: "gpt-4",
    cost: 0.0032,
    tokens: 2000
  },
  {
    id: "15",
    created_at: "2024-01-16T00:30:00Z",
    metadata: { email: "user4@example.com" },
    model: "gpt-3.5-turbo",
    cost: 0.0015,
    tokens: 1000
  }
];

export const mockResponse: CloudflareLogsResponse = {
  success: true,
  result: mockLogs,
  result_info: {
    count: 15,
    page: 1,
    per_page: 20,
    total_count: 15
  },
  errors: [],
  messages: []
}; 