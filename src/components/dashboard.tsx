'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimeFilter } from '@/components/time-filter';
import { CloudflareCredentials, TimeFilter as TimeFilterType, LogEntry } from '@/types/cloudflare';
import { CloudflareAPI } from '@/lib/cloudflare-api';
import { DataProcessor } from '@/lib/data-processor';
import { Loader2, Users, Brain, TrendingUp, DollarSign, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Charts } from '@/components/charts';

interface DashboardProps {
  credentials: CloudflareCredentials;
}

export function Dashboard({ credentials }: DashboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('24h');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [emailFilter, setEmailFilter] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = new CloudflareAPI(credentials);
      const data = await api.fetchAllLogs();
      setLogs(data);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique sua conexão.');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [credentials]);

  const userStats = DataProcessor.processUserStats(logs, timeFilter);
  const modelStats = DataProcessor.processModelStats(logs, timeFilter);
  const topModels = DataProcessor.getTopModels(logs, timeFilter, 10);
  const selectedUser = userStats.find(u => u.email === selectedUserEmail) || null;

  // Filtrar usuários por email
  const filteredUserStats = userStats.filter(user =>
    user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  // Debug logs
  useEffect(() => {
    if (selectedUser && showUserModal) {
      console.log('Modal Debug - selectedUser:', selectedUser);
      console.log('Modal Debug - selectedUser.models:', selectedUser.models);
      console.log('Modal Debug - Object.entries(selectedUser.models):', Object.entries(selectedUser.models));
    }
  }, [selectedUser, showUserModal]);

  // Debug logs for modal rendering
  useEffect(() => {
    console.log('Modal Debug - Dialog rendering state:', {
      selectedUserEmail,
      showUserModal,
      selectedUser,
      isOpen: !!selectedUserEmail && showUserModal
    });
  }, [selectedUserEmail, showUserModal, selectedUser]);

  const totalCost = userStats.reduce((sum, user) => sum + user.totalCost, 0);
  const totalRequests = userStats.reduce((sum, user) => sum + user.requestCount, 0);
  const uniqueUsers = userStats.length;
  const uniqueModels = modelStats.length;


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchData}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-2xl font-bold">Dashboard de Consumo</h2>
        <div className="flex items-center gap-2">
          <TimeFilter selectedFilter={timeFilter} onFilterChange={setTimeFilter} />
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="ml-2"
            title="Atualizar dados"
          >
            <Loader2 className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Modal de Detalhamento do Usuário */}
      <Dialog open={!!selectedUserEmail && showUserModal} onOpenChange={(open) => {
        console.log('Modal Debug - Dialog onOpenChange:', open, 'selectedUserEmail:', selectedUserEmail);
        setShowUserModal(open);
        if (!open) setSelectedUserEmail(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhamento de Consumo</DialogTitle>
            <DialogDescription>
              {selectedUser ? (
                <span className="font-semibold">{selectedUser.email}</span>
              ) : (
                <span className="text-muted-foreground">Carregando usuário...</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto">
            {selectedUser ? (
              <div>
                <div className="mb-4">
                  <span className="text-muted-foreground text-sm">Custo total:</span>
                  <span className="ml-2 font-bold">{DataProcessor.formatCurrency(selectedUser.totalCost)}</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Custo</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Requisições</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(selectedUser.models).length > 0 ? (
                      Object.entries(selectedUser.models).map(([model, stats]) => {
                        // Debug log for each model being rendered
                        console.log('Modal Debug - Rendering model:', model, 'stats:', stats);
                        return (
                          <TableRow key={model}>
                            <TableCell className="font-medium">{model}</TableCell>
                            <TableCell>{DataProcessor.formatCurrency(stats.cost)}</TableCell>
                            <TableCell>{DataProcessor.formatTokens(stats.tokens)}</TableCell>
                            <TableCell>{DataProcessor.formatNumber(stats.requests)}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum modelo encontrado para este usuário.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Carregando dados do usuário...
              </div>
            )}
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DataProcessor.formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Requisições</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DataProcessor.formatNumber(totalRequests)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Únicos</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueModels}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gráficos de Consumo Diário</h3>
          <p className="text-sm text-gray-600">Visualização do custo e uso de tokens por dia</p>
        </div>
        <Charts logs={logs} timeFilter={timeFilter} chartTimeFilter="30d" loading={loading} error={error} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Custo por Usuário</TabsTrigger>
          <TabsTrigger value="models">Custo por Modelo</TabsTrigger>
          <TabsTrigger value="top-models">Modelos Mais Usados</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custo por Usuário</CardTitle>
                  <CardDescription>
                    Análise detalhada do consumo por usuário
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filtrar por email..."
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                      className="w-64 pl-9 pr-8"
                    />
                    {emailFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEmailFilter('')}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {emailFilter && (
                <div className="mb-4 text-sm text-muted-foreground">
                  Exibindo {filteredUserStats.length} de {userStats.length} usuários
                  {filteredUserStats.length === 0 && (
                    <span className="text-destructive ml-2">Nenhum usuário encontrado com esse email</span>
                  )}
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Requisições</TableHead>
                    <TableHead>Modelos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserStats.length > 0 ? (
                    filteredUserStats.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">
                          <button
                            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors disabled:opacity-50"
                            onClick={() => {
                              if (user) {
                                setSelectedUserEmail(user.email);
                                setShowUserModal(true);
                              }
                            }}
                            disabled={loading}
                          >
                            {user.email}
                          </button>
                        </TableCell>
                        <TableCell>{DataProcessor.formatCurrency(user.totalCost)}</TableCell>
                        <TableCell>{DataProcessor.formatTokens(user.totalTokens)}</TableCell>
                        <TableCell>{DataProcessor.formatNumber(user.requestCount)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.keys(user.models).slice(0, 3).map((model) => (
                              <Badge key={model} variant="secondary" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                            {Object.keys(user.models).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{Object.keys(user.models).length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {emailFilter ? 'Nenhum usuário encontrado com esse email' : 'Nenhum usuário encontrado'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custo por Modelo</CardTitle>
              <CardDescription>
                Análise detalhada do consumo por modelo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Requisições</TableHead>
                    <TableHead>Usuários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelStats.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-medium">{model.model}</TableCell>
                      <TableCell>{DataProcessor.formatCurrency(model.totalCost)}</TableCell>
                      <TableCell>{DataProcessor.formatTokens(model.totalTokens)}</TableCell>
                      <TableCell>{DataProcessor.formatNumber(model.requestCount)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(model.users).slice(0, 3).map((user) => (
                            <Badge key={user} variant="secondary" className="text-xs">
                              {user}
                            </Badge>
                          ))}
                          {Object.keys(model.users).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{Object.keys(model.users).length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modelos Mais Usados</CardTitle>
              <CardDescription>
                Ranking dos modelos com maior consumo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topModels.map((model, index) => (
                  <div key={model.model} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{model.model}</h3>
                        <p className="text-sm text-muted-foreground">
                          {DataProcessor.formatNumber(model.requests)} requisições
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{DataProcessor.formatCurrency(model.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}