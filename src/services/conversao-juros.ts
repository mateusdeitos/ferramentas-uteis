import { ConversaoJurosTypes } from "../types/conversao-juros";

export const converterTaxaJuros = (
	taxaJuros: number,
	periodo: ConversaoJurosTypes.TPeriodoTaxa
): ConversaoJurosTypes.TResponseConversaoTaxa => {
	return {
		daily: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "daily")) - 1),
		monthly: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "monthly")) - 1),
		"six-monthly": 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "six-monthly")) - 1),
		yearly: 100 * ((1 + taxaJuros / 100) ** (getExpoenteConversaoTaxa(periodo, "yearly")) - 1),
	}
}

const getExpoenteConversaoTaxa = (
	periodo: ConversaoJurosTypes.TPeriodoTaxa,
	periodoDesejado: ConversaoJurosTypes.TPeriodoTaxa
) => {
	const mapExpoentes: Record<ConversaoJurosTypes.TPeriodoTaxa, ConversaoJurosTypes.TResponseConversaoTaxa> = {
		daily: {
			daily: 1,
			monthly: 30,
			yearly: 365,
			"six-monthly": 180,
		},
		monthly: {
			daily: 1 / 30,
			monthly: 1,
			"six-monthly": 6,
			yearly: 12,
		},
		"six-monthly": {
			daily: 1 / 180,
			monthly: 1 / 6,
			"six-monthly": 1,
			yearly: 2,
		},
		yearly: {
			daily: 1 / 365,
			monthly: 1 / 12,
			"six-monthly": 1 / 2,
			yearly: 1,
		}
	}

	return mapExpoentes[periodo][periodoDesejado] ?? 1;
}
