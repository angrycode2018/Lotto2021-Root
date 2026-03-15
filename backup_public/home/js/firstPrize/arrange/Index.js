import PastTime from "../history/history.js"
import { exit, findMax } from "../../../../../function/common.js";
import Settings from "../settings.js";

const {setFP} = Settings;
const {archive} = PastTime.past;


export default class Index {
    constructor() {}
    //จัดเรียงตัวเลข ตาม index ที่ออกบ่อย
    arrange = (firstPrize = [1,2,3,4,5,6]) => {
        const [n0, n1, n2, n3, n4, n5] = this.preferdIndex(firstPrize)

        const f0 = this.assignNumber(null, n0)
        const f1 = this.assignNumber(f0, n1);
        const f2 = this.assignNumber(f1, n2);
        const f3 = this.assignNumber(f2, n3);
        const f4 = this.assignNumber(f3, n4);
        const f5 = this.assignNumber(f4, n5);
        return f5
    }
    //สรุปสถิติรางวัลที่หนึ่ง จะได้ preferedIndex(index ที่ออกบ่อย) และ preferedEO(eo ที่ออกบ่อย)
    preferdIndex(firstPrize = []) {
        const fp = setFP(firstPrize.toSorted((a,b) => a - b));
        const [fH, fM, fL] = ['H', 'M', 'L'].map(char => fp.hml.filter(txt => txt === char).length)
        // debugger
        //เลือกตัวที่ h m l ตรงกัน
        const ref = archive.filter(({prize1}) => {
            const [H, M, L] = ['H', 'M', 'L'].map(char => prize1.hml.filter(txt => txt === char).length)
            return fH === H && fM === M && fL === L
        }).map(({prize1}) => prize1);

        const mix = ref.map(({mix}) => mix.toSorted((a,b) => a[0] - b[0]));
        const summary = [];
        for(let i = 0; i < mix[0].length; i++ ) {
            const same = mix.map(arr => arr[i]);
            const text = same.every((arr,i,self) => arr[1] === self[0][1]) ? same[0][1] : exit('expect all text are the same');
            const byIndex = [0,1,2,3,4,5].map(n => same.filter(arr => arr[3] === n));
            const byEO = ['E', 'O'].map(txt => same.filter(arr => arr[2] === txt));
            const maxIndex = findMax(byIndex.map(arr => arr.length), 2);
            const max1 = byIndex.filter(arr => maxIndex.some(v => v === arr.length));
            const max2 = byEO.find((arr, i, self) => self.every(val => arr.length >= val.length))
            const max22 = byEO.find((arr) => arr.length !== max2.length && arr.length > (max2.length - 10));//เอาตัวใกล้เคียงด้วย (ถ้ามี)
            const preferIndex = max1.map(max => {
                return max.reduce(((a,b) => !a && a !==0 ? b[3] : a == b[3] ? a : b[3]));
            })
            const preferEO = max2.reduce(((a,b) => !a ? b[2] : a == b[2] ? a : b[2]));
            const preferEO2 = max22 ? max22.reduce(((a,b) => !a ? b[2] : a == b[2] ? a : b[2])) : undefined;
            summary[i] = {text, number: fp.number[i], index: preferIndex, eo: preferEO2 ? [preferEO, preferEO2] : [preferEO] }
            // debugger
        }
        // debugger
        return summary
    }

    assignNumber(manyFP=[], {number=5, index= [2,5]}) {
        if(!manyFP || manyFP.length == 0) {
            return index.map(i => {
                const newFP = [ null, null, null, null, null, null ];
                newFP[i] = number;
                return newFP
            });
        }

        const results = manyFP.map(fp => {
            const idx = index.filter(i => (fp[i] === null))
            // if(idx.length === 0) return [fp];
            return idx.map(i => {
                const six = [...fp];
                if(six[i] !== null) debugger;
                six[i] = number 
                return six;
            })
        }).flat();
        // debugger
        return results
    }
}