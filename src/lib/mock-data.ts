import { LogEntry, CloudflareLogsResponse } from '@/types/cloudflare';

// Dados de exemplo baseados na estrutura real da API do Cloudflare
// Simulando dados de julho a agosto com padrão semelhante à imagem
export const mockLogs: LogEntry[] = [
  // 11 de Julho - Alto uso
  { id: "1", created_at: "2024-07-11T10:30:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0125, tokens_in: 3000000, tokens_out: 5500000 },
  { id: "2", created_at: "2024-07-11T11:15:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.0080, tokens_in: 1800000, tokens_out: 3400000 },
  { id: "3", created_at: "2024-07-11T12:00:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-sonnet", cost: 0.0150, tokens_in: 3500000, tokens_out: 6300000 },
  
  // 12 de Julho - Alto uso
  { id: "4", created_at: "2024-07-12T09:45:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0118, tokens_in: 2800000, tokens_out: 5000000 },
  { id: "5", created_at: "2024-07-12T14:20:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.0095, tokens_in: 2200000, tokens_out: 4000000 },
  { id: "6", created_at: "2024-07-12T15:10:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0135, tokens_in: 3200000, tokens_out: 5700000 },
  
  // 13 de Julho - Pico máximo
  { id: "7", created_at: "2024-07-13T08:30:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-haiku", cost: 0.0185, tokens_in: 4500000, tokens_out: 7500000 },
  { id: "8", created_at: "2024-07-13T10:00:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.0120, tokens_in: 2800000, tokens_out: 5000000 },
  { id: "9", created_at: "2024-07-13T11:15:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0160, tokens_in: 3800000, tokens_out: 6700000 },
  { id: "10", created_at: "2024-07-13T13:30:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-sonnet", cost: 0.0200, tokens_in: 4800000, tokens_out: 8200000 },
  
  // 14 de Julho - Alto uso
  { id: "11", created_at: "2024-07-14T09:00:00Z", metadata: { email: "user5@example.com" }, model: "gpt-3.5-turbo", cost: 0.0108, tokens_in: 2500000, tokens_out: 4500000 },
  { id: "12", created_at: "2024-07-14T14:45:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0128, tokens_in: 3000000, tokens_out: 5400000 },
  { id: "13", created_at: "2024-07-14T16:20:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-haiku", cost: 0.0082, tokens_in: 2000000, tokens_out: 3300000 },
  
  // 15 de Julho - Alto uso
  { id: "14", created_at: "2024-07-15T10:10:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0132, tokens_in: 3100000, tokens_out: 5600000 },
  { id: "15", created_at: "2024-07-15T11:30:00Z", metadata: { email: "user4@example.com" }, model: "gpt-3.5-turbo", cost: 0.0090, tokens_in: 2100000, tokens_out: 3700000 },
  
  // 16 de Julho - Alto uso
  { id: "16", created_at: "2024-07-16T08:00:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0115, tokens_in: 2700000, tokens_out: 4900000 },
  { id: "17", created_at: "2024-07-16T12:15:00Z", metadata: { email: "user3@example.com" }, model: "claude-3-sonnet", cost: 0.0140, tokens_in: 3300000, tokens_out: 5900000 },
  { id: "18", created_at: "2024-07-16T15:45:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.0085, tokens_in: 2000000, tokens_out: 3500000 },
  
  // 17 de Julho - Alto uso
  { id: "19", created_at: "2024-07-17T09:30:00Z", metadata: { email: "user4@example.com" }, model: "gpt-4", cost: 0.0120, tokens_in: 2800000, tokens_out: 5100000 },
  { id: "20", created_at: "2024-07-17T11:00:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-haiku", cost: 0.0095, tokens_in: 2200000, tokens_out: 4000000 },
  { id: "21", created_at: "2024-07-17T14:20:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.0070, tokens_in: 1600000, tokens_out: 2900000 },
  
  // 18 de Julho - Alto uso
  { id: "22", created_at: "2024-07-18T08:45:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0135, tokens_in: 3200000, tokens_out: 5700000 },
  { id: "23", created_at: "2024-07-18T10:15:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-sonnet", cost: 0.0165, tokens_in: 3900000, tokens_out: 6900000 },
  { id: "24", created_at: "2024-07-18T13:30:00Z", metadata: { email: "user1@example.com" }, model: "gpt-3.5-turbo", cost: 0.0088, tokens_in: 2100000, tokens_out: 3600000 },
  
  // 19 de Julho - Alto uso
  { id: "25", created_at: "2024-07-19T09:00:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0118, tokens_in: 2800000, tokens_out: 5000000 },
  { id: "26", created_at: "2024-07-19T11:45:00Z", metadata: { email: "user2@example.com" }, model: "claude-3-haiku", cost: 0.0092, tokens_in: 2200000, tokens_out: 3800000 },
  { id: "27", created_at: "2024-07-19T15:20:00Z", metadata: { email: "user4@example.com" }, model: "gpt-3.5-turbo", cost: 0.0075, tokens_in: 1800000, tokens_out: 3000000 },
  
  // 20 de Julho - Alto uso
  { id: "28", created_at: "2024-07-20T08:30:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0140, tokens_in: 3300000, tokens_out: 5900000 },
  { id: "29", created_at: "2024-07-20T10:00:00Z", metadata: { email: "user3@example.com" }, model: "claude-3-sonnet", cost: 0.0170, tokens_in: 4000000, tokens_out: 7200000 },
  { id: "30", created_at: "2024-07-20T12:45:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.0090, tokens_in: 2100000, tokens_out: 3700000 },
  
  // 21 de Julho - Alto uso
  { id: "31", created_at: "2024-07-21T09:15:00Z", metadata: { email: "user4@example.com" }, model: "gpt-4", cost: 0.0125, tokens_in: 2900000, tokens_out: 5300000 },
  { id: "32", created_at: "2024-07-21T11:30:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-haiku", cost: 0.0098, tokens_in: 2300000, tokens_out: 4100000 },
  { id: "33", created_at: "2024-07-21T14:00:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.0072, tokens_in: 1700000, tokens_out: 2900000 },
  
  // 22 de Julho - Alto uso
  { id: "34", created_at: "2024-07-22T08:00:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0138, tokens_in: 3200000, tokens_out: 5900000 },
  { id: "35", created_at: "2024-07-22T10:30:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-sonnet", cost: 0.0168, tokens_in: 3900000, tokens_out: 7100000 },
  { id: "36", created_at: "2024-07-22T13:15:00Z", metadata: { email: "user1@example.com" }, model: "gpt-3.5-turbo", cost: 0.0085, tokens_in: 2000000, tokens_out: 3500000 },
  
  // 23 de Julho - Alto uso
  { id: "37", created_at: "2024-07-23T09:45:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0115, tokens_in: 2700000, tokens_out: 4900000 },
  { id: "38", created_at: "2024-07-23T11:20:00Z", metadata: { email: "user2@example.com" }, model: "claude-3-haiku", cost: 0.0095, tokens_in: 2200000, tokens_out: 4000000 },
  { id: "39", created_at: "2024-07-23T14:50:00Z", metadata: { email: "user4@example.com" }, model: "gpt-3.5-turbo", cost: 0.0078, tokens_in: 1800000, tokens_out: 3200000 },
  
  // 24 de Julho - Queda significativa
  { id: "40", created_at: "2024-07-24T10:00:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0025, tokens_in: 600000, tokens_out: 1000000 },
  { id: "41", created_at: "2024-07-24T12:30:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.0018, tokens_in: 400000, tokens_out: 800000 },
  
  // 25 de Julho - Baixo uso
  { id: "42", created_at: "2024-07-25T09:15:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0015, tokens_in: 350000, tokens_out: 650000 },
  { id: "43", created_at: "2024-07-25T11:45:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-haiku", cost: 0.0012, tokens_in: 300000, tokens_out: 500000 },
  
  // 26 de Julho - Baixo uso
  { id: "44", created_at: "2024-07-26T08:30:00Z", metadata: { email: "user1@example.com" }, model: "gpt-3.5-turbo", cost: 0.0008, tokens_in: 200000, tokens_out: 300000 },
  { id: "45", created_at: "2024-07-26T10:15:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0010, tokens_in: 250000, tokens_out: 400000 },
  
  // 27 de Julho - Baixo uso
  { id: "46", created_at: "2024-07-27T09:00:00Z", metadata: { email: "user2@example.com" }, model: "claude-3-haiku", cost: 0.0005, tokens_in: 120000, tokens_out: 180000 },
  { id: "47", created_at: "2024-07-27T11:30:00Z", metadata: { email: "user4@example.com" }, model: "gpt-3.5-turbo", cost: 0.0007, tokens_in: 180000, tokens_out: 270000 },
  
  // 28 de Julho - Baixo uso
  { id: "48", created_at: "2024-07-28T08:45:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.0006, tokens_in: 150000, tokens_out: 250000 },
  { id: "49", created_at: "2024-07-28T10:20:00Z", metadata: { email: "user3@example.com" }, model: "claude-3-sonnet", cost: 0.0009, tokens_in: 220000, tokens_out: 380000 },
  
  // 29 de Julho - Baixo uso
  { id: "50", created_at: "2024-07-29T09:30:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.0004, tokens_in: 100000, tokens_out: 150000 },
  { id: "51", created_at: "2024-07-29T11:00:00Z", metadata: { email: "user4@example.com" }, model: "gpt-4", cost: 0.0005, tokens_in: 120000, tokens_out: 230000 },
  
  // 30 de Julho - Baixo uso
  { id: "52", created_at: "2024-07-30T08:15:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-haiku", cost: 0.0003, tokens_in: 80000, tokens_out: 120000 },
  { id: "53", created_at: "2024-07-30T10:45:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.0004, tokens_in: 100000, tokens_out: 150000 },
  
  // 31 de Julho - Baixo uso
  { id: "54", created_at: "2024-07-31T09:00:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.0002, tokens_in: 50000, tokens_out: 100000 },
  { id: "55", created_at: "2024-07-31T11:30:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-sonnet", cost: 0.0003, tokens_in: 80000, tokens_out: 120000 },
  
  // 1 de Agosto - Mínimo uso
  { id: "56", created_at: "2024-08-01T16:30:00Z", metadata: { email: "user1@example.com" }, model: "gpt-3.5-turbo", cost: 0.0001, tokens_in: 30000, tokens_out: 50000 },
  { id: "57", created_at: "2024-08-01T19:00:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.0001, tokens_in: 40000, tokens_out: 60000 },
  
  // 2 de Agosto - Mínimo uso
  { id: "58", created_at: "2024-08-02T16:15:00Z", metadata: { email: "user2@example.com" }, model: "claude-3-haiku", cost: 0.00005, tokens_in: 15000, tokens_out: 25000 },
  { id: "59", created_at: "2024-08-02T18:45:00Z", metadata: { email: "user4@example.com" }, model: "gpt-3.5-turbo", cost: 0.00008, tokens_in: 20000, tokens_out: 30000 },
  
  // 3 de Agosto - Mínimo uso
  { id: "60", created_at: "2024-08-03T15:00:00Z", metadata: { email: "user1@example.com" }, model: "gpt-4", cost: 0.00005, tokens_in: 12000, tokens_out: 18000 },
  { id: "61", created_at: "2024-08-03T17:30:00Z", metadata: { email: "user3@example.com" }, model: "claude-3-sonnet", cost: 0.00006, tokens_in: 15000, tokens_out: 25000 },
  
  // 4 de Agosto - Mínimo uso
  { id: "62", created_at: "2024-08-04T16:45:00Z", metadata: { email: "user2@example.com" }, model: "gpt-3.5-turbo", cost: 0.00003, tokens_in: 8000, tokens_out: 12000 },
  { id: "63", created_at: "2024-08-04T18:15:00Z", metadata: { email: "user4@example.com" }, model: "gpt-4", cost: 0.00004, tokens_in: 10000, tokens_out: 15000 },
  
  // 5 de Agosto - Mínimo uso
  { id: "64", created_at: "2024-08-05T15:30:00Z", metadata: { email: "user1@example.com" }, model: "claude-3-haiku", cost: 0.00002, tokens_in: 6000, tokens_out: 9000 },
  { id: "65", created_at: "2024-08-05T17:00:00Z", metadata: { email: "user3@example.com" }, model: "gpt-3.5-turbo", cost: 0.00003, tokens_in: 8000, tokens_out: 12000 },
  
  // 6 de Agosto - Mínimo uso
  { id: "66", created_at: "2024-08-06T16:00:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.00001, tokens_in: 4000, tokens_out: 6000 },
  { id: "67", created_at: "2024-08-06T18:30:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-sonnet", cost: 0.00002, tokens_in: 6000, tokens_out: 9000 },
  
  // 7 de Agosto - Mínimo uso
  { id: "68", created_at: "2024-08-07T15:15:00Z", metadata: { email: "user1@example.com" }, model: "gpt-3.5-turbo", cost: 0.00001, tokens_in: 3000, tokens_out: 5000 },
  { id: "69", created_at: "2024-08-07T17:45:00Z", metadata: { email: "user3@example.com" }, model: "gpt-4", cost: 0.00001, tokens_in: 5000, tokens_out: 7000 },
  
  // 8 de Agosto - Mínimo uso (hoje)
  { id: "70", created_at: "2024-08-08T16:00:00Z", metadata: { email: "user2@example.com" }, model: "gpt-4", cost: 0.00002, tokens_in: 8000, tokens_out: 12000 },
  { id: "71", created_at: "2024-08-08T19:30:00Z", metadata: { email: "user4@example.com" }, model: "claude-3-sonnet", cost: 0.00003, tokens_in: 10000, tokens_out: 15000 }
];

export const mockResponse: CloudflareLogsResponse = {
  success: true,
  result: mockLogs,
  result_info: {
    count: 71,
    page: 1,
    per_page: 100,
    total_count: 71
  },
  errors: [],
  messages: []
}; 