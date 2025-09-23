Um sistema simples de gerenciamento de pizzaria feito em Typescript, com funcionalidades de cadastro de clientes, produtos, pedidos e geração de relatórios das vendas.


Ao iniciar o sistema com o comando ( node dist/index.js ), você acesso para um menu interativo via terminal com as seguintes opções: 


1. Clientes -> será usado para pegar as informações ou seja os dados do cliente como (nome, endereço, telefone), terá opções de listar os clientes, remover cliente.

------------------------------------------------------------------------

2. Produtos -> neste opção o sistema irá apresentar para o usuário as opções de adicionar produto, editar produto, remover produto e listar produtos.

-----------------------------------------------------------------------

3. Criar Pedido -> nesta opção o sistema irá pegar ID do cliente atraves do cadastro para começar a montagem do pedido para ser efetuado, logo após o sistema irá pedir para o usuário escolher os produtos seja (pizza, suco, refrigerante, sobremesa), após a escolha dos produtos irá escolher o metodo de pagamento (dinheiro, cartão, pix), depois de escolher o pedido e a forma de pagamento, será gerado um recibo com as informações do pedido como ( dados do cliente, produtos, total a pagar e forma de pagamento), após isso seu pedido será finalizado.

------------------------------------------------------------------------

4. Relatório Diario -> Irá mostrar a quantidade de pedidos (vendas) que foram realizadas no dia, juntando com o faturamento diario.

-----------------------------------------------------------------------

5. Relatorio Mensal -> Irá mostrar a quantidade de pedidos (vendas) que foram realizadas no corrente mes, juntamente com o faturamento mensal.

-----------------------------------------------------------------------

6. Histórico de Vendas -> Essa opção irá mostrar na tela todo o histórico q foi relatato no sistema mostrando a quantidade de vendas dos produtos, que foram vendidas tanto diariamente e mensalmente, assim mostrando um novo relatório com as vendas totais  

-----------------------------------------------------------------------

7. Sair -> Esta opção irá sair do sistema.

----------------------------------------------------------------------
