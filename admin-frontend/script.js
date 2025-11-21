// Apenas para testar a API separadamente
async function testarAPI() {
    const response = await fetch("http://localhost:3000/pedidos");
    const dados = await response.json();
    console.log("Pedidos recebidos:", dados);
}

testarAPI();
