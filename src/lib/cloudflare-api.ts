import { CloudflareCredentials, CloudflareLogsResponse, LogEntry, TimeFilter } from '@/types/cloudflare';
import { mockResponse } from './mock-data';

export class CloudflareAPI {
  private credentials: CloudflareCredentials;

  constructor(credentials: CloudflareCredentials) {
    this.credentials = credentials;
  }

  private isDemoMode(): boolean {
    return this.credentials.accountId === 'demo-account' && 
           this.credentials.gatewayName === 'demo-gateway' && 
           this.credentials.token === 'demo-token';
  }

  async fetchLogs(page: number = 1): Promise<CloudflareLogsResponse> {
    // Se for modo demo, retornar dados mock
    if (this.isDemoMode()) {
      return mockResponse;
    }

    const response = await fetch('/api/cloudflare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: this.credentials.accountId,
        gatewayName: this.credentials.gatewayName,
        token: this.credentials.token,
        page,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async fetchAllLogs(): Promise<LogEntry[]> {
    // Se for modo demo, retornar dados mock
    if (this.isDemoMode()) {
      return mockResponse.result;
    }

    const allLogs: LogEntry[] = [];
    let currentPage = 1;
    let totalPages = 1;

    // Fetch first page to get total count
    const firstResponse = await this.fetchLogs(currentPage);
    allLogs.push(...firstResponse.result);

    if (firstResponse.result_info.total_count > 0) {
      totalPages = Math.ceil(firstResponse.result_info.total_count / firstResponse.result_info.per_page);
    }

    // Fetch remaining pages
    for (currentPage = 2; currentPage <= totalPages; currentPage++) {
      try {
        const response = await this.fetchLogs(currentPage);
        allLogs.push(...response.result);
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        break;
      }
    }

    return allLogs;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Se for modo demo, sempre retornar sucesso
      if (this.isDemoMode()) {
        return true;
      }

      const response = await this.fetchLogs(1);
      return response.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
} 