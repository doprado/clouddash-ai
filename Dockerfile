# Estágio de construção
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários do estágio de construção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Expor a porta que o Next.js usa por padrão
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]