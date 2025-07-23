export function calculateIMC(peso: number, altura: number) {
  if (altura <= 0) {
    throw new Error('Altura deve ser maior que zero.');
  }

  const imcValue = peso / (altura * altura);
  const imc = parseFloat(imcValue.toFixed(2));
  let classificacao = '';

  if (imc < 18.5) {
    classificacao = 'Abaixo do peso';
  } else if (imc >= 18.5 && imc <= 24.9) {
    classificacao = 'Peso normal';
  } else if (imc >= 25 && imc <= 29.9) {
    classificacao = 'Sobrepeso';
  } else if (imc >= 30 && imc <= 34.9) {
    classificacao = 'Obesidade grau I';
  } else if (imc >= 35 && imc <= 39.9) {
    classificacao = 'Obesidade grau II';
  } else {
    classificacao = 'Obesidade grau III';
  }

  return { imc, classificacao };
}