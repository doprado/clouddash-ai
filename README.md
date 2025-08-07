# CloudDash - Dashboard de Consumo IA

Dashboard moderno para monitoramento do consumo de modelos de IA no Cloudflare AI Gateway.

## 🚀 Funcionalidades

- **Configuração de Credenciais**: Interface intuitiva para inserir Account ID, Gateway Name e Token de autenticação
- **Filtros de Período**: Visualização de dados por diferentes períodos (24h, 3d, 7d, 14d, 30d)
- **Análise por Usuário**: Custo total, tokens consumidos e modelos utilizados por usuário
- **Análise por Modelo**: Custo total, tokens consumidos e usuários por modelo
- **Ranking de Modelos**: Lista dos modelos mais utilizados
- **Interface Moderna**: Design responsivo com shadcn/ui

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos (futuro)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd clouddash
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração

### Credenciais do Cloudflare

Para usar o dashboard, você precisará das seguintes credenciais:

1. **Account ID**: Seu ID da conta Cloudflare
2. **Gateway Name**: Nome do seu AI Gateway
3. **Token de Autenticação**: Token de API do Cloudflare

### Como obter as credenciais:

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá para "AI Gateway" no menu lateral
3. Selecione seu gateway
4. Copie o Account ID e Gateway Name
5. Gere um token de API em "My Profile" > "API Tokens"

## 📊 Uso

1. **Configuração Inicial**: Insira suas credenciais na tela inicial
2. **Teste de Conexão**: O sistema testará automaticamente a conexão
3. **Visualização de Dados**: Após a conexão bem-sucedida, o dashboard será exibido
4. **Filtros**: Use os filtros de período para analisar diferentes intervalos de tempo
5. **Abas**: Navegue entre as diferentes visualizações:
   - **Custo por Usuário**: Análise detalhada por usuário
   - **Custo por Modelo**: Análise detalhada por modelo
   - **Modelos Mais Usados**: Ranking dos modelos

## 📈 Dados Exibidos

### Resumo Geral
- Custo total do período
- Total de requisições
- Número de usuários únicos
- Número de modelos únicos

### Análise por Usuário
- Email do usuário
- Custo total
- Total de tokens consumidos
- Número de requisições
- Modelos utilizados

### Análise por Modelo
- Nome do modelo
- Custo total
- Total de tokens consumidos
- Número de requisições
- Usuários que utilizaram

## 🔒 Segurança

- As credenciais são armazenadas apenas na memória do navegador
- Não há persistência de dados sensíveis
- Todas as comunicações com a API do Cloudflare são feitas via HTTPS

## 🚧 Desenvolvimento

### Estrutura do Projeto

```
src/
├── app/                 # Páginas Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   ├── credentials-form.tsx
│   ├── dashboard.tsx
│   └── time-filter.tsx
├── lib/                 # Utilitários
│   ├── cloudflare-api.ts
│   ├── data-processor.ts
│   └── utils.ts
└── types/               # Definições TypeScript
    └── cloudflare.ts
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se suas credenciais estão corretas
2. Confirme se o AI Gateway está ativo
3. Verifique se o token tem as permissões necessárias
4. Abra uma issue no repositório

---

Desenvolvido com ❤️ para monitoramento eficiente de consumo de IA
