# Use uma imagem oficial do Go como base
FROM golang:1.23-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos do seu código fonte para o contêiner
COPY . .

# Instalar dependências (por exemplo, se você usa o godotenv ou outras dependências)
RUN go mod tidy

# Exponha a porta 8080 para o servidor Gin
EXPOSE 8080

# Defina o comando para rodar a aplicação (pode variar dependendo do seu arquivo principal)
CMD ["go", "run", "cmd/gateway/main.go"]
