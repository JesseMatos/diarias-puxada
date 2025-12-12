function calcularDiaria(saida, chegada) {
  const inicio = new Date(saida);
  const fim = new Date(chegada);

  const ms = fim - inicio;
  const horasTotais = ms / 1000 / 60 / 60;

  let diarias = 1;
  let horasExcedentes = horasTotais > 24 ? horasTotais - 24 : 0;

  let refeicoes = 0;
  if (horasExcedentes > 0) {
    const diaSeguinte = new Date(inicio);
    diaSeguinte.setDate(diaSeguinte.getDate() + 1);

    const refeicao1 = new Date(diaSeguinte);
    refeicao1.setHours(7, 0, 0);

    const refeicao2 = new Date(diaSeguinte);
    refeicao2.setHours(12, 0, 0);

    const refeicao3 = new Date(diaSeguinte);
    refeicao3.setHours(18, 0, 0);

    if (fim >= refeicao1) refeicoes++;
    if (fim >= refeicao2) refeicoes++;
    if (fim >= refeicao3) refeicoes++;

    if (refeicoes >= 3) {
      diarias++;
      refeicoes = 0;
    }
  }

  const valorFinal = diarias * 100 + refeicoes * 33 + 2;

  return { horasTotais, diarias, refeicoes, valorFinal };
}

console.log(calcularDiaria("2025-12-04T07:00:00", "2025-12-05T19:00:00"));
