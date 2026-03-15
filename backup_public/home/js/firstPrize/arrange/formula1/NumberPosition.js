import { isTod } from "../../../../../../function/lottery.js";
// import Match from "./filter/Config.js"
import Settings from "../../settings.js";
import Arrange from "./Arrange.js"
import MatchFirstPrize from "./MatchFirstPrize.js"


// const {sum, review, range, mostWinGroup, hml, couple} = config;
// const setEO = (num) => num % 2 === 0 ? 'E' : 'O';
// const setHML = (num) => [0,1,2,3].some(n => num === n) ? 'L' : [4,5].some(n => num === n) ? 'M' : 'H';
const {setHML, setEO, setFP} = Settings;


export default class NumberPosition extends Arrange{
    constructor({ six = [], Model = {}, watch = [] }) {
        super();
        // const {pass} = firstPrize.filter;
        // this.group = new Match().setGroup(group)
        this.Model = Model;
        this.six = six;
        this.watch = watch;
        // debugger
    }

    selectHistoryNumbers = (fp) => {
        if(!this.Model) return [];//ถ้าเป็น group ที่ไม่เคยออกรางวัล
        const group = this.Model.sum;//group ที่ถูกนำมาใช้ match
        
        const Six = new MatchFirstPrize(fp);
        if(this.watch.length === 6 && isTod(fp, this.watch)) debugger;

        //if results.length == 0 แสดงว่าตัวเลข fp(ปัจจุบัน) ไม่ match กับ p1(อดีต) 
        const results = this.Model.review.mix.sort.number.filter(p1 => {
            const m1 = Six.matchHML(p1);
            // const m2 = Six.matchHMLRange(this.Model, p1);//NOTE - ฟังค์ชั่นนี้ทำให้ตัวเลขเพิ่มขึ้นจำนวนมาก
            // const m3 = Six.matchEO(p1);
            // const m4 = Six.matchRange(p1)
            return m1

        });
        // debugger
        return results
    }

    //แทนตัวเลขจาก history ด้วย ตัวเลขปัจจุบัน และ แบ่ง zone low, mid, high
    //fp:ตัวเลขปัจุบัน, p1:ตัวเลขจาก history
    replaceHistoryNumbers = (fp, p1) => {
        const low = [], mid = [], high = [];

        const newP1 = p1.map((nb, i) => {
            const [num, txt1, txt2, idx] = nb;
            const zone = [0,1].some(k => k == i) ? low : [2,3].some(k => k == i) ? mid : high;
            zone.push([fp[i], txt1, txt2, idx]);//เปลี่ยนตัวเลข
            return [fp[i], txt1, txt2, idx]
        });

        return [low, mid, high]
    }

    //switch num, hml, index แต่ไม่สลับ eo
    switchNumbers = (zone) => {
        const eoIndex = [];//ถ้าต้องสลับตำแหน่ง EO

        const [num1, hml1 , eo1, idx1] = zone[0];
        const [num2, hml2 , eo2, idx2] = zone[1];

        //สลับตัวเลข hml และ index
        const isSwitchable = () =>  {
            const n1 = (setEO(num1) !== eo1 && setEO(num1) === eo2) 
            const n2 = (setEO(num2) !== eo2 && setEO(num2) === eo1)
            return n1 && n2
        };
        let [n1, n2, h1, h2, x1, x2] = isSwitchable() ? [num2, num1, hml2, hml1, idx2, idx1] : [num1, num2, hml1, hml2, idx1, idx2];

        const newZone = [];
        newZone[0] = [n1, h1, eo1, x1];
        newZone[1] = [n2, h2, eo2, x2];

        setEO(n1) !== eo1 && eoIndex.push(idx1);
        setEO(n2) !== eo2 && eoIndex.push(idx2);
        return { newZone, eoIndex }
    }

    handleHML = (low, mid, high) => {
        const eoIndex = [];//ถ้าต้องสลับตำแหน่ง EO

        const newHML = [low, mid, high].map(zone => {
            const {newZone, eoIndex: eoIDX} = this.switchNumbers(zone);
            eoIndex.push(...eoIDX);
            return newZone
        });

        return {hml: {low: newHML[0], mid: newHML[1], high: newHML[2]}, eoIndex}
    }

    
} 