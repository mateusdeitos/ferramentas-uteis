export declare module ConversaoJurosTypes {
	type TPeriodoTaxa = "dia" | "mes" | "semestre" | "ano";
	type TConversaoTaxaJuros = {
		dia: number;
		mes: number;
		semestre: number;
		ano: number;
	};

	type TResponseConversaoTaxa = Record<TPeriodoTaxa, number>;
}