'use client';

import { useState, useEffect } from 'react';
import { CredentialsForm } from '@/components/credentials-form';
import { Dashboard } from '@/components/dashboard';
import { CloudflareCredentials } from '@/types/cloudflare';
import { Settings, BarChart3, Play } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cloudflare-credentials';

export default function Home() {
  const [credentials, setCredentials] = useState<CloudflareCredentials | null>(null);

  // Carregar credenciais do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.accountId && parsed.gatewayName && parsed.token) {
          setCredentials(parsed);
        }
      } catch {}
    }
  }, []);

  // Salvar credenciais no localStorage sempre que mudarem
  useEffect(() => {
    if (credentials) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [credentials]);

  const isDemoMode = credentials?.accountId === 'demo-account' && 
                    credentials?.gatewayName === 'demo-gateway' && 
                    credentials?.token === 'demo-token';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">CloudDash</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dashboard moderno para monitoramento do consumo de modelos de IA no Cloudflare AI Gateway
          </p>
        </div>

        {!credentials ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Configure suas credenciais
              </h2>
              <p className="text-gray-600">
                Insira suas credenciais do Cloudflare para começar a monitorar o consumo
              </p>
            </div>
            <CredentialsForm onCredentialsSet={setCredentials} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600">
                  Monitorando: {credentials.accountId} / {credentials.gatewayName}
                </p>
                {isDemoMode && (
                  <div className="flex items-center gap-2 mt-2">
                    <Play className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">Modo Demonstração</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCredentials(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Alterar Credenciais
              </button>
            </div>
            <Dashboard credentials={credentials} />
          </div>
        )}
      </div>
    </div>
  );
} 