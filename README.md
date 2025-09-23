# 🍕 Sistema de Pizzaria  

Um sistema simples de gerenciamento de pizzaria feito em **TypeScript**, com funcionalidades de cadastro de clientes, produtos, pedidos e geração de relatórios de vendas.  

---

## 👥️ Integrantes 

- Hugo Nascimento Gonçalves - RA: 2509669
- Stefano de Paola Garcia Scuderi - RA: 2503418
- Alex Sandro Teles Silveira - RA: 2510122
- Pedro Pereira de Oliveira - RA: 2505860
- Caio Felipe Martins de Camargo - RA: 2522475

## 📖 Manual de Utilização  

Ao executar o sistema, você terá acesso a um **menu interativo** via terminal com as seguintes opções:  

1. **Cadastrar Cliente** → insere um novo cliente com nome, endereço e telefone.  
2. **Cadastrar Produto** → adiciona novos produtos ao cardápio com nome, valor e categoria.  
   - As categorias disponíveis são: **Pizza**, **Sobremesa** e **Bebida**.  
   - Essa divisão facilita a organização do cardápio e os relatórios.  
3. **Criar Pedido** → permite selecionar um cliente e incluir vários produtos em um pedido.  
   - O sistema calcula automaticamente o valor total.  
   - É exibido um **recibo formatado** com informações do cliente, data, produtos e valor final.  
4. **Relatório Diário** → mostra a quantidade de pedidos e faturamento do dia.  
5. **Relatório Mensal** → mostra a quantidade de pedidos e faturamento do mês.
6. **Histórico de Vendas** → mostra todos os pedidos feitos.
7. **Sair** → encerra o sistema.  

---

## 🗂 Estrutura do Projeto  

```
Sistema-Pizzaria/
│
├── src/
│   ├── models/           # Interfaces das entidades principais
│   │   ├── Cliente.ts    # Estrutura de Cliente
│   │   ├── Produto.ts    # Estrutura de Produto (com categoria)
│   │   └── Pedido.ts     # Estrutura de Pedido
│   │
│   ├── services/         # Regras de negócio
│   │   ├── ClienteService.ts
│   │   ├── ProdutoService.ts
│   │   └── PedidoService.ts
│   │
│   ├── reports/          # Relatórios do sistema
│   │   ├── Recibo.ts         # Geração de recibo detalhado
│   │   ├── VendasDiarias.ts  # Relatório diário
│   │   └── VendasMensais.ts  # Relatório mensal
│   │
│   ├── utils/            # Funções auxiliares (ex: formatar data e moeda)
│   │   └── Formatador.ts
│   │
│   └── index.ts          # Ponto de entrada do sistema (menu interativo)
│
├── package.json
└── tsconfig.json
```

### 📦 Dependências principais  
- **TypeScript** – linguagem utilizada.  
- **readline-sync** – para entrada de dados via terminal.  

---

## ⚙️ Histórico de Vendas em CSV

Cada pedido realizado é automaticamente salvo em um arquivo .csv.

O arquivo contém colunas como: Data, Cliente, Produtos, Quantidade, Valor Total.

Isso facilita análise externa em planilhas ou BI (Business Intelligence).


## ⚙️ Instruções de Instalação e Execução  

### 🔽 1. Clonar o repositório  
```bash
git clone https://github.com/Hugo-Nascimento748/Sistema-Pizzaria.git
cd Sistema-Pizzaria
```

### 📥 2. Instalar dependências  
```bash
npm install
```

### ▶️ 3. Executar o sistema  
Compilar e rodar:  
```bash
npx ts-node src/index.ts
```

Ou, se quiser compilar antes:  
```bash
npm run build
node dist/index.js
```

---

## ✅ Exemplo de Fluxo  

```
--------- Menu de ações ---------

1 - Cadastrar Cliente
2 - Cadastrar Produto
3 - Criar Pedido
4 - Ver relatório diário
5 - Ver relatório mensal
6 - Histórico de Vendas
7 - Sair
```

👉 Cadastra cliente → adiciona produto (pizza, sobremesa ou bebida) → cria pedido → gera recibo → consulta relatórios.  

---

## 📂 Categorias de Produto  
- Pizza 🍕  
- Sobremesa 🍨  
- Bebida 🥤  

---

## 📌 Observações  

- O sistema roda totalmente no **terminal**, sem interface gráfica.  
- Estruturado de forma modular (models, services, reports).

