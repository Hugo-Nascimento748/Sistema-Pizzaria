const adminUser = {
    usuario: "admin",
    senha: "1234"
};

// Escuta o envio do formulário (funciona com Click ou Enter)
document.getElementById("form-login")?.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita recarregar a página

    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("senha").value;

    if (user === adminUser.usuario && pass === adminUser.senha) {
        // Salva que está logado
        localStorage.setItem("auth", "true");
        
        // Redireciona para o painel
        window.location.href = "index.html";
    } else {
        alert("🚫 Acesso Negado: Usuário ou senha incorretos.");
        // Limpa a senha para tentar de novo
        document.getElementById("senha").value = "";
    }
});

// Função de proteção (para ser usada no index.html se precisar importar)
export function verificarLogin() {
    const logado = localStorage.getItem("auth");
    if (!logado) {
        window.location.href = "login.html";
    }
}