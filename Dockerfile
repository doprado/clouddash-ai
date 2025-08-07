# Estágio de construção
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json ./

# Instalar dependências completas (incluindo dev)
RUN npm ci --no-cache --no-audit

# Copiar o restante do código
COPY . .

# Gerar build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Definir diretório de trabalho
WORKDIR /app

# Copiar tudo do builder, incluindo node_modules e arquivos compilados
COPY --from=builder /app ./

# Expor a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
