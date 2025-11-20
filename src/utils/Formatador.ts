export function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function formatarData(data: Date | string): string {
    return new Date(data).toLocaleDateString("pt-BR");
}
