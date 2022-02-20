

export const calcularValorParcelas = (montante: number, periodo: number) => montante / periodo;
export const calcularAmortizacaoParcelas = (valorInicial: number, periodo: number) => valorInicial / periodo;
export const converterTaxaJuros = (taxaJuros: number, periodoDesejado: "mes" | "ano") => {
	const expoente = periodoDesejado === "mes" ? 1 / 12 : 12;
	return (Math.pow(1 + taxaJuros / 100, expoente) - 1) * 100;
}

export const calcularMontanteFinal = ({
	periodo,
	valorInicial,
	taxaJuros,
}: {periodo: number, valorInicial: number, taxaJuros: number}) => {
	const montanteFinalCalculado = valorInicial * Math.pow(1 + taxaJuros / 100, periodo);
	const valorParcelas = calcularValorParcelas(montanteFinalCalculado, periodo);
	const amortizacaoPorParcela = calcularAmortizacaoParcelas(valorInicial, periodo);

	return {
		montanteFinalCalculado,
		valorParcelas,
		amortizacaoPorParcela,
	}
};

export const calcularTaxaJuros = ({
	periodo,
	valorInicial,
	montanteFinal,
}: {periodo: number, valorInicial: number, montanteFinal: number}) => {
	const taxaJurosCalculada = (montanteFinal / valorInicial) ** (1 / periodo) - 1;
	return {
		taxaJurosCalculada,
	}
};

interface IAmortizacaoEmprestimo {
	periodo: number, 
	valorInicial: number, 
	montanteFinal: number,
	saldoDevedor: number,
	taxaJuros: number,
	valorAmortizar: number,
	parcelasRestantes: number,
};

export const calcularAmortizacaoEmprestimo = (props: IAmortizacaoEmprestimo) => {
	const { saldoDevedor, parcelasRestantes, valorAmortizar, taxaJuros, periodo } = props;
	const {montanteFinalCalculado} = calcularMontanteFinal({periodo, taxaJuros, valorInicial: (saldoDevedor - valorAmortizar)});
	const valorParcelas = calcularValorParcelas(montanteFinalCalculado, parcelasRestantes);
	const amortizacaoPorParcela = calcularAmortizacaoParcelas(saldoDevedor - valorAmortizar, parcelasRestantes);

	return {
		montanteFinalCalculado,
		valorParcelas,
		amortizacaoPorParcela,
	}
}