import { currencies } from '../data/currency';

export function durationHelper(duration: number) {
    if (duration === 0) return 'instantánea';
    else if (duration % 30 === 0) return `${duration / 30} meses`;
    else if (duration % 7 === 0) return `${duration / 7} semanas`;
    else return `${duration} días`;
  }
  
  export function priceHelper(price: number, currency: number) {
    return currencies[currency].code + ' ' + price;
  }
  
  export function stringify(val: any): string {
    let tail = JSON.stringify(val),
      base = '';
    const matches = tail.match(/"\d+":/g);
    if (matches)
      for (const match of matches) {
        const i = tail.search(/"\d+":/g);
        base += tail
          .substr(0, i)
          .concat(match.substring(1, match.length - 2))
          .concat(':');
        tail = tail.substr(match.length + i);
      }
    base += tail;
    return base;
  }
  
  export function parse(text: string): any {
    let tail = text,
      base = '';
    const matches = tail.match(/\d+:/g);
    if (matches)
      for (const match of matches) {
        const i = tail.search(/\d+:/g);
        base += tail
          .substr(0, i)
          .concat('"')
          .concat(match.substring(0, match.length - 1))
          .concat('":');
        tail = tail.substr(match.length + i);
      }
    base += tail;
  
    return JSON.parse(base);
  }