import { isTod } from "../../../../../../function/lottery.js";


export default class Base {

    break =() => {
        if(!this.watch || this.watch.length !== 6) return false;
        const fp = this.firstprize || this.fp;
        if(!fp) throw new Error('firstPrize is not set');
        return (!this.pass && isTod(fp.number, this.watch)) 
    }

    setTextFormat = (fp) => {
        if(!fp?.hml) throw new Error('fp.hml is required.');
        return [
            fp.hml.filter(char => char == 'L').length, 
            fp.hml.filter(char => char == 'M').length, 
            fp.hml.filter(char => char == 'H').length,
        ];
    }
}