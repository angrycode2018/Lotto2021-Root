import Settings from "../../settings.js";
import Base from "./Base.js"

const {setFP} = Settings;


export default class MatchModel extends Base{
    constructor(Model, watch) {
        super()
        this.Model = Model;
        this.watch = watch;
    }

     match = (firstprize = [5,5,7,9,9,0]) => {
        if(!firstprize || firstprize.length !== 6) throw new Error('firstprize is required.');
        this.pass = undefined;
        this.firstprize = setFP(firstprize)
        
        this.matchSum();
        // this.matchHML();
        this.matchEO();
        if([true, false].every(v => v !== this.pass )) throw new Error('pass value is invalid.');
        return this.pass
    }

    matchSum = () => {
        if(this.pass === false) return false;
        const {number, sum: {total}} = this.firstprize;

        this.pass = this.Model.matchSum(total)
        if(this.break()) debugger;
        // debugger
    }

    matchHML = () => {
        if(this.pass === false) return false;
        const {number, hml} = this.firstprize;

        const high = hml.filter(txt => txt === 'H')
        const mid = hml.filter(txt => txt === 'M')
        const low = hml.filter(txt => txt === 'L')

        // if(this.watch.length === 6 && isTod(number, this.watch)) debugger;
        this.pass = this.Model.matchHML(high, mid, low)
        if(this.break()) debugger;
        // debugger
    }

    matchEO = () => {
        if(this.pass === false) return false;
        const {number, hml, eo} = this.firstprize;

        const even = eo.filter(txt => txt === 'E')
        const odd = eo.filter(txt => txt === 'O')

        this.pass = this.Model.matchEO(even.length, odd.length)
        if(this.break()) debugger;
        // debugger
    }
}