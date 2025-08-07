'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudflareCredentials } from '@/types/cloudflare';
import { CloudflareAPI } from '@/lib/cloudflare-api';
import { Loader2, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';

interface CredentialsFormProps {
  onCredentialsSet: (credentials: CloudflareCredentials) => void;
}

export function CredentialsForm({ onCredentialsSet }: CredentialsFormProps) {
  const [accountId, setAccountId] = useState('');
  const [gatewayName, setGatewayName] = useState('');
  const [token, setToken] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestConnection = async () => {
    if (!accountId || !gatewayName || !token) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      const api = new CloudflareAPI({ accountId, gatewayName, token });
      const success = await api.testConnection();
      
      if (success) {
        setTestResult('success');
        onCredentialsSet({ accountId, gatewayName, token });
      } else {
        setTestResult('error');
        setErrorMessage('Falha na conexão. Verifique suas credenciais.');
      }
    } catch (error: unknown) {
      setTestResult('error');
      
      // Mensagens de erro mais específicas
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('401')) {
        setErrorMessage('Token de autenticação inválido. Verifique se o token está correto e tem as permissões necessárias.');
      } else if (errorMessage.includes('403')) {
        setErrorMessage('Acesso negado. Verifique se o token tem permissões para acessar o AI Gateway.');
      } else if (errorMessage.includes('404')) {
        setErrorMessage('Account ID ou Gateway Name não encontrado. Verifique se estão corretos.');
      } else if (errorMessage.includes('400')) {
        setErrorMessage('Credenciais inválidas. Verifique Account ID, Gateway Name e Token.');
      } else if (errorMessage.includes('Failed to fetch')) {
        setErrorMessage('Erro de conexão. Verifique sua conexão com a internet e tente novamente.');
      } else {
        setErrorMessage(`Erro: ${errorMessage}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleDemoMode = () => {
    // Usar credenciais de demonstração
    onCredentialsSet({
      accountId: 'demo-account',
      gatewayName: 'demo-gateway',
      token: 'demo-token'
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Configuração do Cloudflare
        </CardTitle>
        <CardDescription>
          Insira suas credenciais para acessar os logs da AI Gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">Account ID</Label>
          <Input
            id="accountId"
            type="text"
            placeholder="Seu Account ID do Cloudflare"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gatewayName">Gateway Name</Label>
          <Input
            id="gatewayName"
            type="text"
            placeholder="Nome do seu AI Gateway"
            value={gatewayName}
            onChange={(e) => setGatewayName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="token">Token de Autenticação</Label>
          <Input
            id="token"
            type="password"
            placeholder="Seu token de API"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erro de Conexão</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {testResult === 'success' && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Conexão estabelecida com sucesso!
          </div>
        )}

        {testResult === 'error' && !errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Falha na conexão
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !accountId || !gatewayName || !token}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando conexão...
              </>
            ) : (
              'Testar e Conectar'
            )}
          </Button>

          <Button
            onClick={handleDemoMode}
            variant="outline"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" />
            Modo Demonstração
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Como obter as credenciais:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Acesse o <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudflare Dashboard</a></li>
            <li>Vá para &quot;AI Gateway&quot; no menu lateral</li>
            <li>Selecione seu gateway</li>
            <li>Copie o Account ID e Gateway Name</li>
            <li>Gere um token de API em &quot;My Profile&quot; → &quot;API Tokens&quot;</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 