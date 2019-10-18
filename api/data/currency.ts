export interface Currency {id: number; name: string; code: string; }
export const currencies: { [id: number]: Currency } = {1: {'id': 1, 'name': 'Peso argentino', 'code': 'ARG'}, 2: {'id': 2, 'name': 'Dólar estadounidense', 'code': 'USD'}};
export default currencies;
