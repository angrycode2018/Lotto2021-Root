// import { findMinMaxInArray, removeSameArray } from "../../../../../function/common.js";
import MatchModel from "./match/MatchModel.js";
import MatchGroup from "./match/MatchGroup.js"
import MatchHML from "./match/MatchHML.js";
import MatchMonth from "./match/MatchMonth.js";

export default class Filter {
    constructor({Model = {}, watch = []}) {
        this.Model = Model;
        this.watch = watch;
    }

   match = (firstprize = [5,5,7,9,9,0]) => {
    const m1 = new MatchModel(this.Model, this.watch).match(firstprize)
    const m2 = new MatchGroup(this.watch).match(firstprize)
    const m3 = new MatchHML(this.watch).match(firstprize)
    const m4 = new MatchMonth(this.watch).match(firstprize)
    // debugger
    return m1 && m2 && m3 && m4
   }


}



    // matchCouple = () => {
    //     if(this.pass === false) return false;
    //     // if(isTod(this.firstprize.number, [5,0,7,3,9,2])) debugger
    //     const {number} = this.firstprize;

    //     this.pass = this.Model.matchCouple(number)
    //     if(this.break()) debugger;
    // }

    // matchRange = () => {
    //     if(this.pass === false) return false;
    //     const {number, range: {min, max}} = this.firstprize;

    //     if(isTod(this.firstprize.number, this.watch)) debugger;
    //     this.pass = this.Model.matchRange([min, max]);
    //     if(this.break()) debugger;
    //     // debugger
    // }

    // evenOdd = (num) => num % 2 === 0 ? 'E' : 'O';
    // hml = (num) => [0,1,2,3].some(n => num === n) ? 'L' : [4,5].some(n => num === n) ? 'M' : 'H';
    
    // #develop = (firstprize = [5,5,7,9,9,0]) => {
    //     const eo = firstprize.map(nb => this.evenOdd(nb))
    //     const hml = firstprize.map(nb => setHML(nb))
    //     const mix = firstprize.map((nb, i) => [nb, setHML(nb) , this.evenOdd(nb), i])
    //     const sum = {
    //         front: firstprize.filter((n,i) => i >= 0 && i <= 2).reduce((a,b) => a+b), 
    //         back: firstprize.filter((n,i) => i >= 3 && i <= 5).reduce((a,b) => a+b), 
    //         total: firstprize.reduce((a,b) => a+b)
    //     }
    //     const [min, max] = findMinMaxInArray(firstprize)
    //     this.firstprize = {number: firstprize, eo, hml, mix, sum, range: {min, max}};
    //     // debugger
    // }


 //คัดกรองรางวัลที่ 1 ที่ตรงกัลเงื่อนไข
    // filter = () => {
    //     const {number, eo, hml, sum, range: {min, max}} = this.firstprize;
    //     const E = eo.filter(txt => txt === 'E')
    //     const high = hml.filter(txt => txt === 'H')
    //     const mid = hml.filter(txt => txt === 'M')
    //     const low = hml.filter(txt => txt === 'L')
    //     const match = [3,4,5].some(n => E.length === n) && [1,2,3].some(n => mid.length === n) && (sum >= 20 && sum <= 29)
    //     // return match
    //     // return min === 1 && max === 9 && sum.total === 38
    //     return sum.total === 29 && (high.length >= 2 && high.length <= 4) && (mid.length >= 0 && mid.length <= 3) && (low.length >= 1 && low.length <= 3)
    // }