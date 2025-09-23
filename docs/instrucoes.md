# Manual de Instruções para Rodar o Projeto no Terminal

Este manual explica como executar o projeto usando **Node.js** tanto no **Git Bash** quanto no **PowerShell**.

---

## 1. Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão recomendada >= 16)
- **NPM** (Node Package Manager, normalmente instalado junto com Node.js)

Para verificar se estão instalados, abra o terminal e digite:

```bash
node -v
npm -v
```
Se aparecerem as versões, você está pronto para prosseguir.

## 2. Abrindo o terminal na pasta do projeto

Abra o Terminal.  
Navegue até a pasta do projeto usando o comando cd:  
```bash
cd "C:\caminho\da\pasta\do\projeto"
```



## 3. Rodando o projeto
#### 3.1. Se quiser rodar em JavaScript (.js)  
No terminal, execute:
```bash
node dist/index.js
```  
Isso irá rodar seu projeto e você verá a saída diretamente no terminal.

#### 3.2. Se quiser rodar em TypeScript (.ts)
Instale o TypeScript e o ts-node globalmente (se ainda não tiver):  
```bash
npm install -g typescript ts-node
```


Execute o arquivo TypeScript diretamente:  
```bash
ts-node src/index.ts
```


Alternativamente, você pode compilar para JavaScript e rodar com Node.js:  
```bash
tsc index.ts  
node dist/index.js
```


## 4. Conclusão
Seguindo este manual, você poderá rodar nosso projeto Node.js ou TypeScript facilmente tanto no Git Bash quanto no PowerShell (Ou vscode).
