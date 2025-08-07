import { LogEntry, UserStats, ModelStats, TimeFilter } from '@/types/cloudflare';

export class DataProcessor {
  private static getTimeFilterDate(timeFilter: TimeFilter): Date {
    const now = new Date();
    
    switch (timeFilter) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '3d':
        return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '14d':
        return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  private static filterLogsByTime(logs: LogEntry[], timeFilter: TimeFilter): LogEntry[] {
    const filterDate = this.getTimeFilterDate(timeFilter);
    
    return logs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= filterDate;
    });
  }

  static processUserStats(logs: LogEntry[], timeFilter: TimeFilter = '24h'): UserStats[] {
    const filteredLogs = this.filterLogsByTime(logs, timeFilter);
    const userMap = new Map<string, UserStats>();

    filteredLogs.forEach(log => {
      const email = log.metadata.email || 'unknown';
      
      if (!userMap.has(email)) {
        userMap.set(email, {
          email,
          totalCost: 0,
          totalTokens: 0,
          requestCount: 0,
          models: {}
        });
      }

      const userStats = userMap.get(email)!;
      userStats.totalCost += log.cost || 0;
      userStats.totalTokens += log.tokens || 0;
      userStats.requestCount += 1;

      // Process model usage
      const model = log.model || 'unknown';
      if (!userStats.models[model]) {
        userStats.models[model] = {
          cost: 0,
          tokens: 0,
          requests: 0
        };
      }

      userStats.models[model].cost += log.cost || 0;
      userStats.models[model].tokens += log.tokens || 0;
      userStats.models[model].requests += 1;
    });

    return Array.from(userMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  }

  static processModelStats(logs: LogEntry[], timeFilter: TimeFilter = '24h'): ModelStats[] {
    const filteredLogs = this.filterLogsByTime(logs, timeFilter);
    const modelMap = new Map<string, ModelStats>();

    filteredLogs.forEach(log => {
      const model = log.model || 'unknown';
      const email = log.metadata.email || 'unknown';
      
      if (!modelMap.has(model)) {
        modelMap.set(model, {
          model,
          totalCost: 0,
          totalTokens: 0,
          requestCount: 0,
          users: {}
        });
      }

      const modelStats = modelMap.get(model)!;
      modelStats.totalCost += log.cost || 0;
      modelStats.totalTokens += log.tokens || 0;
      modelStats.requestCount += 1;

      // Process user usage
      if (!modelStats.users[email]) {
        modelStats.users[email] = {
          cost: 0,
          tokens: 0,
          requests: 0
        };
      }

      modelStats.users[email].cost += log.cost || 0;
      modelStats.users[email].tokens += log.tokens || 0;
      modelStats.users[email].requests += 1;
    });

    return Array.from(modelMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  }

  static getTopModels(logs: LogEntry[], timeFilter: TimeFilter = '24h', limit: number = 10): { model: string; cost: number; requests: number }[] {
    const filteredLogs = this.filterLogsByTime(logs, timeFilter);
    const modelMap = new Map<string, { cost: number; requests: number }>();

    filteredLogs.forEach(log => {
      const model = log.model || 'unknown';
      
      if (!modelMap.has(model)) {
        modelMap.set(model, { cost: 0, requests: 0 });
      }

      const stats = modelMap.get(model)!;
      stats.cost += log.cost || 0;
      stats.requests += 1;
    });

    return Array.from(modelMap.entries())
      .map(([model, stats]) => ({ model, ...stats }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, limit);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  static formatTokens(tokens: number): string {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  }
} 