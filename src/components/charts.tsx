'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogEntry, TimeFilter } from '@/types/cloudflare';
import { DataProcessor } from '@/lib/data-processor';

interface DailyData {
  date: string;
  cost: number;
  tokens: number;
}

interface ChartsProps {
  logs: LogEntry[];
  timeFilter: TimeFilter;
  chartTimeFilter?: TimeFilter; // Filtro específico para os gráficos
  loading?: boolean; // Estado de carregamento
  error?: string | null; // Estado de erro
}

export function Charts({ logs, timeFilter, chartTimeFilter, loading = false, error = null }: ChartsProps) {
  // Converter data UTC para fuso horário local (GMT-3)
  const convertUTCToLocal = (utcDate: string): Date => {
    const date = new Date(utcDate);
    // Ajustar para GMT-3 (3 horas a menos que UTC)
    const localDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    return localDate;
  };

  // Processar dados por dia
  const processDailyData = (logs: LogEntry[], timeFilter: TimeFilter): DailyData[] => {
    const filteredLogs = DataProcessor.filterLogsByTime(logs, timeFilter);
    const dailyMap = new Map<string, { cost: number; tokens: number }>();

    filteredLogs.forEach(log => {
      const date = convertUTCToLocal(log.created_at);
      // Usar fuso horário local para evitar problemas de UTC
      const dateKey = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0');
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { cost: 0, tokens: 0 });
      }

      const dailyStats = dailyMap.get(dateKey)!;
      dailyStats.cost += log.cost || 0;
      dailyStats.tokens += (log.tokens_in || 0) + (log.tokens_out || 0);
    });

    // Converter para array e ordenar por data
    const dailyData = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        cost: Number(stats.cost.toFixed(4)),
        tokens: stats.tokens
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dailyData;
  };

  const dailyData = processDailyData(logs, chartTimeFilter || timeFilter);

  // Verificar se há erro
  if (error) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custo</CardTitle>
            <CardDescription>Erro ao carregar dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-red-500 text-center">
              <div>
                <p className="mb-2">Erro ao carregar dados de custo</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens Usados</CardTitle>
            <CardDescription>Erro ao carregar dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-red-500 text-center">
              <div>
                <p className="mb-2">Erro ao carregar dados de tokens</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se está carregando
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custo</CardTitle>
            <CardDescription>Carregando dados...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Carregando dados de custo...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens Usados</CardTitle>
            <CardDescription>Carregando dados...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Carregando dados de tokens...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se há dados
  if (dailyData.length === 0) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custo</CardTitle>
            <CardDescription>Nenhum dado disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-gray-500 text-center">
              <div>
                <p className="mb-2">Nenhum dado de custo disponível</p>
                <p className="text-sm">Tente ajustar o filtro de tempo ou verificar as credenciais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens Usados</CardTitle>
            <CardDescription>Nenhum dado disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-gray-500 text-center">
              <div>
                <p className="mb-2">Nenhum dado de tokens disponível</p>
                <p className="text-sm">Tente ajustar o filtro de tempo ou verificar as credenciais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular totais
  const totalCost = dailyData.reduce((sum, day) => sum + day.cost, 0);
  const totalTokens = dailyData.reduce((sum, day) => sum + day.tokens, 0);

  // Formatar data para exibição
  const formatDate = (dateStr: string) => {
    // dateStr já está no formato "YYYY-MM-DD" e representa a data local (GMT-3)
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    return `${day} ${month}`;
  };

  // Formatar data completa para tooltip
  const formatFullDate = (dateStr: string) => {
    // dateStr já está no formato "YYYY-MM-DD" e representa a data local (GMT-3)
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Customizar tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{formatFullDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'cost' ? 'Custo' : 'Tokens'}: {entry.dataKey === 'cost' ? DataProcessor.formatCurrency(entry.value) : DataProcessor.formatTokens(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Gráfico de Custo */}
      <Card>
        <CardHeader>
          <CardTitle>Custo</CardTitle>
                      <CardDescription>
              Custo total: {DataProcessor.formatCurrency(totalCost)} • {dailyData.length} dias
            </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens Usados</CardTitle>
                      <CardDescription>
              Total: {DataProcessor.formatTokens(totalTokens)} • {dailyData.length} dias
            </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;
                  }
                  return value.toString();
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokens" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
