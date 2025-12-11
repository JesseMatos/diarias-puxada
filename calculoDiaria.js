function calcularDiaria(saida, chegada) {
    const inicio = new Date(saida);
    const fim = new Date(chegada);

    const ms = fim - inicio;
    const horasTotais = ms / 1000 / 60 / 60;
    let diarias = 1;
    let horasExcedentes = horasTotais > 24 ?  horasTotais - 24 : 0;
    let refeicoes = 0;
    if (horasExcedentes > 0) {
        let refeicoes = 0;
        
    } 
}

console.log(calcularDiaria("2025-12-04T07:00:00", "2025-12-05T19:00:00"));
