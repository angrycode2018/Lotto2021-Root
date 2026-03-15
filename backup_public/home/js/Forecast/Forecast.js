import FilterDigit3 from "../../../../src/class/Filter/Line3/FilterDigit3.js";
import { RandomByHistory } from "../random/RandomByHistory.js";
import { Formula } from "../../../../src/class/formula/Formula.js";
// import summary from "../../../../class/Summary.js";

export default class Forecast {
    constructor() {}

    randomByHistory = async ({H, M, L}) => {
        const {instance: {batchPromise}} = await import('../initApp.js');
        if([H, M, L].every(val => val !== true && val !== false)) throw new Error('คุณต้องระบุ H M L เช่น H: true, M: false, L: true');
         //L: 0,1,2 M: 3,4,5,6, H: 7,8,9
         const results = new RandomByHistory().recipe1({ H, M, L }).compound();
        //  console.log('random results=', results)
         // debugger
         const filters = await batchPromise([...results], 'randomHistory');
         console.log('ตัวเลข 3ตัวตรงที่คาด =', filters);
        //  debugger
         return filters
    }


    newTriangle = async () => {
      const {instance: {newTriangle, batchPromise}} = await import('../initApp.js');
        let ever = newTriangle.forcast({ baseOnHistory: true });//เอาเลขที่เคยออกรางวัลไปแล้ว
        let never = newTriangle.forcast({ baseOnHistory: false });//เอาเลขที่ยังไม่เคยออกรางวัล
        ever = !ever ? [] : ever;
        never = !never ? [] : never;
        debugger

        const reduceNumbers = async(groupNumbers, fname="") => {
          const newArray = [];
          for(let {group, numbers} of groupNumbers) {
            const newNumbers = await batchPromise([...numbers], fname);
            const obj = { group,  numbers: newNumbers };
            newArray.push(obj);
          }
          return newArray;
        }

        async function reduce({group, numbers}) {
          const f = await new FilterDigit3(numbers, 'newTriangle');
          const nb = f.matchLine3().currentMatches;
          return nb
        }
        
        //match Line3
        // const [ Ev, Nv ] = [ever, never].map(each => {
            const Ev = [];
            for(let {group, numbers} of ever) {
              const numb = await reduce({numbers})
               Ev.push({ group, numbers: numb })
            };
            const Nv = [];
            for(let {group, numbers} of ever) {
              const numb = await reduce({numbers})
               Nv.push({ group, numbers: numb })
            };
        
        debugger

        //match reducer
        const test3 = await reduceNumbers(Ev, 'newTriangle');
        const test4 = await reduceNumbers(Nv, 'newTriangle');
        debugger
        return {ever: test3, never: test4}
    }

    getArea = async([r,s,n]) => {
      const {instance: {triangle}} = await import('../initApp.js');
     return { three: [r,s,n].toString(), area: triangle.triangleArea([r,s,n]).area }
    }

    formula = async () => {
        const fm = await new Formula({});
        let {addSubtract, kradanga, newPlusOne, plusOne, line3} = await fm.runAll();
        const {left, right, midL, midR} = newPlusOne;
        // debugger
        return {addSubtract, kradanga, newPlusOne, plusOne, line3}
    }

}




// addSubtract = {
//   asBefore: addSubtract.asBefore.map(three => this.getArea(three)),
//   notSame: addSubtract.notSame.map(three => this.getArea(three)),
// }

// kradanga = {
//   single: {...kradanga.single, unique: kradanga.single.unique.map(three => this.getArea(three))},
//   twin: {...kradanga.twin, unique: kradanga.twin.unique.map(three => this.getArea(three))},
// }

// const Lup = Object.entries(left.up).map(([k, arr]) => {
//   return arr.map(three => this.getArea(three))
// })
// const LDown = Object.entries(left.down).map(([k, arr]) => {
//   return arr.map(three => this.getArea(three))
// })
// const Rup = Object.entries(right.up).map(([k, arr]) => {
//   return arr.map(three => this.getArea(three))
// })
// const RDown = Object.entries(right.down).map(([k, arr]) => {
//   return arr.map(three => this.getArea(three))
// })