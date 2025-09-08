export function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function formatarData(data: Date): string{
    return data.toLocaleDateString("pt-BR");
}