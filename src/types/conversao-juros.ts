export declare module ConversaoJurosTypes {
	type TPeriodoTaxa = "daily" | "monthly" | "six-monthly" | "yearly";
	type TConversaoTaxaJuros = {
		daily: number;
		monthly: number;
		"six-monthly": number;
		yearly: number;
	};

	type TResponseConversaoTaxa = Record<TPeriodoTaxa, number>;
}