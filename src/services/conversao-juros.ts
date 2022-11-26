import { ConversaoJurosTypes } from "../types/conversao-juros";

export const converterTaxaJuros = (
	taxaJuros: number,
	periodo: ConversaoJurosTypes.TPeriodoTaxa
): ConversaoJurosTypes.TResponseConversaoTaxa => {
	return {
		dia: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "dia")) - 1),
		mes: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "mes")) - 1),
		semestre: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "semestre")) - 1),
		ano: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "ano")) - 1),
	}
}

const getExpoenteConversaoTaxa = (
	periodo: ConversaoJurosTypes.TPeriodoTaxa,
	periodoDesejado: ConversaoJurosTypes.TPeriodoTaxa
) => {
	const mapExpoentes: Record<ConversaoJurosTypes.TPeriodoTaxa, ConversaoJurosTypes.TResponseConversaoTaxa> = {
		dia: {
			dia: 1,
			mes: 30,
			ano: 365,
			semestre: 180,
		},
		mes: {
			dia: 1 / 30,
			mes: 1,
			semestre: 6,
			ano: 12,
		},
		semestre: {
			dia: 1 / 180,
			mes: 1 / 6,
			semestre: 1,
			ano: 2,
		},
		ano: {
			dia: 1 / 365,
			mes: 1 / 12,
			semestre: 1 / 2,
			ano: 1,
		}
	}

	return mapExpoentes[periodo][periodoDesejado] ?? 1;
}
