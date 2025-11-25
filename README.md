# 🍕 Sistema de Pizzaria

Um sistema completo de gerenciamento de pizzaria desenvolvido em
TypeScript, com *frontend, **servidor backend local* e **banco de
dados PostgreSQL**, garantindo uma operação integrada, persistente e
escalável.

------------------------------------------------------------------------

## 👥️ Integrantes

-   Hugo Nascimento Gonçalves - RA: 2509669\
-   Stefano de Paola Garcia Garcia Scuderi - RA: 2503418\
-   Alex Sandro Teles Silveira - RA: 2510122\
-   Pedro Pereira de Oliveira - RA: 2505860\
-   Caio Felipe Martins de Camargo - RA: 2522475

------------------------------------------------------------------------

## 📖 Interfaces e Fluxo de Ações

O sistema agora opera com *duas interfaces separadas*, cada uma com
permissões distintas:

### 👤 Cliente

-   Cadastrar cliente\
-   Fazer login\
-   Criar pedido

### 🛠️ Admin

-   Fazer login\
-   Adicionar produto\
-   Editar produto\
-   Remover produto\
-   Confirmar pedido para o histórico de vendas

------------------------------------------------------------------------

## 🖥️ Infraestrutura do Sistema

### 🔌 Backend Local

Responsável pela comunicação central entre frontend e banco de dados,
tratando cadastros, autenticação, pedidos e gestão do cardápio.

### 🗄️ Banco de Dados PostgreSQL

Armazena clientes, produtos, credenciais, pedidos e histórico de vendas
com persistência completa.

### 🌐 Frontend Cliente

Interface onde o usuário visualiza cardápio, cria pedidos e acompanha
sua experiência.\
Atualmente rodando via:

------------------------------------------------------------------------

## 🗂 Estrutura do Projeto

    Sistema-Pizzaria/
    │
    ├── src/
    │   ├── models/
    │   ├── services/
    │   ├── reports/
    │   ├── utils/
    │   ├── server/             # Servidor backend local
    │   ├── database/           # Configurações do PostgreSQL
    │   └── index.ts            # Menu interativo (modo CLI, se utilizado)
    │
    ├── frontend/               # Interface cliente
    │   └── ...                 # HTML, CSS, JS
    │
    ├── package.json
    └── tsconfig.json

------------------------------------------------------------------------

## 📦 Tecnologias Utilizadas

-   *TypeScript*\
-   *Node.js*\
-   *PostgreSQL*\
-   *pg / pg-promise*\
-   *readline-sync*\
-   *live-server*

------------------------------------------------------------------------

## ⚙️ Instalação e Execução

### 1. Clonar o repositório

 bash
git clone https://github.com/Hugo-Nascimento748/Sistema-Pizzaria.git
cd Sistema-Pizzaria


### 2. Instalar dependências

 bash
npm install


### 3. Configurar o PostgreSQL

Ajustar credenciais no arquivo:

    src/database/connection.ts

### 4. Iniciar o backend

 bash
npx ts-node src/server/server.ts


### 5. Rodar o frontend

Dentro da pasta do front:

 bash
live-server


------------------------------------------------------------------------

## 📂 Categorias de Produto

-   Pizza 🍕\
-   Sobremesa 🍨\
-   Bebida 🥤

------------------------------------------------------------------------

## 📌 Observações

-   A arquitetura está modularizada e pronta para evoluir para um
    ambiente cloud ou microserviços futuramente.\
-   A separação Cliente/Admin garante segurança e organização da
    operação.
