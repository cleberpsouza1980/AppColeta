export const VersaoApp = 2.00;

export function isNumber(n: string) {
    return !isNaN(parseFloat(n));
}

export function dataFormatada(dt: Date) {
    let data = new Date(dt),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

export function formatarMoeda(vl: string,isMoney:boolean) {
    let valor = vl;

    if(valor.length == 1) return valor;

    valor = valor + '';
    //valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    if(isMoney)
        return "R$ " + valor;
    else
        return  valor;
}