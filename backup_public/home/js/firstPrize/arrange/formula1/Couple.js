import { removeExactArray, removeSameArray } from "../../../../../../function/common.js";
import { isTod } from "../../../../../../function/lottery.js";
import { Constant } from "../../FirstPrize.js";
import { developFP } from "../function.js";
import Settings from "../../settings.js";
const {setHML, setEO, options} = Settings;

//**** ขั้นตอนนี้จะไม่ทำการสลับตำแหน่งตัวเลขแล้ว เนื่องจากตัวเลขได้ถูกจัดเรียงไว้แล้ว ****
class Reducer {

    //คุณอาจไม่ใช้ฟังค์ชั่นนี้ เนื่องจากผลลัพธ์ไม่น่าพอใจ
    reduceByEO = ({six, infos, eo}) => {
        const e1 = [...eo[0], ...eo[1], ...eo[2]].filter(char => char == 'E');
        const o1 = [...eo[0], ...eo[1], ...eo[2]].filter(char => char == 'O');
        const eoIndex = infos.review.eo.index.origin.filter(({e, o}) => e.length == e1.length && o.length == o1.length);//ข้อมูลสถิติ

        const result = six.filter(d6 => {
            const indexE = d6.map((n, i) => setEO(n) == 'E' ? i : null).filter(v => v !== null);
            const indexO = d6.map((n, i) => setEO(n) == 'O' ? i : null).filter(v => v !== null);
            const match = eoIndex.some(({e, o}) => isTod(indexE, e) && isTod(indexO, o) );
            // debugger;
            return match
        });
        return result
    }
}

export default class Couple extends Reducer{
    constructor() {
        super()
        this.Model = Constant.Model;
        this.watch = Constant.watch;
        this.collectInfos();
    }
    collectInfos = () => {
        const {hml, eo, couple, range, review} = this.Model;
        this.infos = {hml, eo, couple, range, review};
        this.Model.review.mix.sort.number;
        // debugger
    }

    prepareIndex = (fp) => {
        const { hml } = developFP(fp);
        const {review: {mix: {couple}}} = this.infos;
        const [pickLow, pickMid, pickHigh] = hml.map(([txt1, txt2], i) => {
            const x = i === 0 ? 'l' : i === 1 ? 'm' : 'h';
            return couple.hml[x].filter(([a, b]) => {
                const [nb1, txtA] = a;
                const [nb2, txtB] = b;
                return isTod([txt1, txt2], [txtA, txtB])
            })
        });

        const [lowIndex, midIndex, highIndex] = [pickLow, pickMid, pickHigh].map(pack => pack.map(([a,b]) => [a[3], b[3]]));
        const [lowKey, midKey, highKey] = [lowIndex, midIndex, highIndex].map(arr => removeSameArray(arr));
        
        //เก็บ index ที่เหมือนกันไว้ด้วยกัน
        const low = lowKey.map(key => lowIndex.filter(k => isTod(key, k)));
        const mid = midKey.map(key => midIndex.filter(k => isTod(key, k)));
        const high = highKey.map(key => highIndex.filter(k => isTod(key, k)));
        // debugger
        return {low, mid, high}
    }

    //รวม number และ index เข้าด้วยกัน
    mixNumberIndex = ([num1, num2], index = []) => {
        const mix = index.map(arr => {
            if(arr.length < 2 && options.compactIndex == 1) return;//NOTE - ใช้คำสั่งนี้เพื่อลดจำนวนตัวเลข
            const reduced = arr.length > 1 ? removeExactArray(arr) : arr;
            const numIndex = reduced.map(([a, b]) => {
                const [n1, n2] = [num1, num2].map((nb, i) => new Map([ ['num', nb] ]));
                n1.set('idx', a);
                n2.set('idx', b);
                return [n1, n2]
            })
            // debugger
            return numIndex
        }).flat().filter(v => v)
        return mix
    }

    arrange = (fp = []) => {
        const {number, hml, eo, range} = developFP(fp);
        const {low, mid, high} = this.prepareIndex(fp);

        const [numLow, numMid, numHigh] = number;
        const mixLow = this.mixNumberIndex(numLow, low);
        const mixMid = this.mixNumberIndex(numMid, mid);
        const mixHigh = this.mixNumberIndex(numHigh, high);

        //ประกอบ low และ mid เข้าด้วยกัน
        const lowMid = mixLow.map(couple => {
            const lowIdx = couple.map(map => map.get('idx'));
            const select = mixMid.filter(cp => {
                const midIdx = cp.map(map => map.get('idx'));
                return midIdx.every(n => !lowIdx.some(v => n == v))
            });
            if(select.length === 0) return;

            const combine = select.map(arr => {
                const combine = [...couple, ...arr];
                return combine
            })
            // debugger
            return combine
        }).filter(v => v).flat();

        //ประกอบ low และ mid และ high เข้าด้วยกัน
        const lowMidHigh = lowMid.map(couple => {
            const index = couple.map(map => map.get('idx'));
            const select = mixHigh.filter(cp => {
                const highIdx = cp.map(map => map.get('idx'));
                return highIdx.every(n => !index.some(v => n == v))
            });
            if(select.length === 0) return;

            const combine = select.map(arr => {
                const combine = [...couple, ...arr];
                return combine
            })
            // debugger
            return combine

        }).filter(v => v).flat();

        //ถ้าไม่สามารถจัดเรียงตัวเลขได้ (* บางกรณี อาจไม่สามารถจัดเรียงตัวเลขได้)
        if(lowMidHigh.length === 0) debugger;

        //sort index
        lowMidHigh.map(prize1 => prize1.sort((a,b) => a.get('idx') - b.get('idx')));
        const six = lowMidHigh.map(arr => arr.map(map => map.get('num')));
        const uniqSix = removeExactArray(six);//บางครั้งอาจมีตัวที่ซ้ำกัน

        const reduced = options.reduceByEO == 1 ? this.reduceByEO({six: uniqSix, infos: this.infos, eo: eo}) : undefined;
        debugger
        return reduced || uniqSix
    }
}