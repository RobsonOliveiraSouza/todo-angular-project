# Usa a imagem oficial do Node.js
FROM node:lts

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (para melhor uso do cache)
COPY package*.json ./

# Instala o Angular CLI e dependências do projeto
RUN npm install -g @angular/cli \
    && npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expondo a porta 4200
EXPOSE 4200

# Define o comando de inicialização
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
