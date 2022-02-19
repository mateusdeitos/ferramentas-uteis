

export const numeroBr = (numero: number, casas: number = 2) => {
	return numero.toLocaleString('pt-BR', {
		minimumFractionDigits: casas,
		maximumFractionDigits: casas
	});
}