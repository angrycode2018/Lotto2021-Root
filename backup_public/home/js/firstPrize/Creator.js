import { genArr, removeSameArray } from "../../../../function/common.js"
import { isTod } from "../../../../function/lottery.js"
import { N2 } from "../build/N2.js"
import { N3 } from "../build/N3.js"

// generate ตัวเลขรางวัลที่หนึ่ง
class Engine {
    init = [0,1,2,3,4,5,6,7,8,9]
    digit2 = [] //Tod เช่น มี 15 แต่ไม่มี 51
    digit3 = [] //Tod เช่น มี 812 แต่ไม่มี [182, 128, 821, 218, 281]
    digit3Double = [] // Tod เช่น มี 112 แต่ไม่มี [121, 211]
    results = {origin: [], unique: [], filter: {pass: [], reject: []} }

    constructor() {
        this.digit2 = new N2().buildDigit2(this.init);
        const {three, double} = new N3().buildDigit3({digit2: this.digit2});
        this.digit3 = three;
        this.digit3Double = double;
        this.create()
    }

    //สร้าง รางวัลที่ 1
    create = () => {
        const combineDigit3 = [...this.digit3, ...this.digit3Double];
        const group = Object.assign({}, genArr(0,54).map(n => []));

        combineDigit3.map((front, i) => combineDigit3.map((back, j) => {
            const fp = [...front, ...back].toSorted((a,b) => a - b);// sort Min - Max
            const g = fp.reduce((a,b) => a + b);
            !group[g].some(f => isTod(f, fp)) && group[g].push(fp);
        }));

        this.groups = group;
        
        // const winNum = fprize.filter(fp => isTod(fp, [8,1,8,8,9,4]))
        alert('สร้าตัวเลข รางวัลที่หนึ่ง สำเร็จ')
        // debugger
    }

    group = (group = 29) => {
        return this.groups[group]
    }
}

const Creator = new Engine();
export default Creator;