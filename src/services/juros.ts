export const calcularMontanteFinal = ({
	periodo,
	valorInicial,
	taxaJuros,
}: { periodo: number, valorInicial: number, taxaJuros: number }) => {
	const montanteFinalCalculado = valorInicial * Math.pow(1 + taxaJuros / 100, periodo);

	return {
		montanteFinalCalculado,
	}
};

export const calcularTaxaJuros = ({
	periodo,
	valorInicial,
	montanteFinal,
}: { periodo: number, valorInicial: number, montanteFinal: number }) => {
	const taxaJurosCalculada = (montanteFinal / valorInicial) ** (1 / periodo) - 1;
	return {
		taxaJurosCalculada,
	}
};

