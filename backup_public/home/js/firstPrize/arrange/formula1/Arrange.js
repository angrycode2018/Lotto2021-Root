import { isTod } from "../../../../../../function/lottery.js";
import Couple from "./Couple.js";
import FB from "../FB.js"
import Index from "../Index.js";

export default class Arrange {
    constructor() {
        this.couple = new Couple()
        this.FB = new FB();
        this.Index = new Index();
    }

    isWatch = (fp) => {
        return (this.watch.length === 6 && isTod(fp, this.watch))
    }

    notFoundHistory = (fp, history) => {
        if(this.isWatch(fp) && (!history || history.length === 0)){
            debugger;
            throw new Error('ไม่พบ history สำหรับ firstPrize='+this.watch)
        }

        return (!history || history.length === 0) ? true : false;
        
    }

    shuffle = (currentSix, historySix) => {
        const fp = currentSix;
        const p1 = historySix;
        // if(this.isWatch(fp)) debugger;

        //ใช้ตัวเลขปัจจุบัน แทนตัวเลขจาก history
        const [low, mid, high] = this.replaceHistoryNumbers(fp, p1);

        //สลับตำแหน่งตัวเลข
        const {hml, eoIndex} = this.handleHML(low, mid, high);

        //เรียงตาม index
        const newP1 = [...hml.low, ...hml.mid, ...hml.high].toSorted((a,b) => a[3] - b[3]);

        const six = newP1.map(arr => arr[0]);
        const pass = this.FB.test(six);
        if(!pass) {
            const alternative = this.FB.repair(six)
            const results = this.Index.arrange(six)
            // debugger
            // const [n0, n1, n2, n3, n4, n5] = this.Index.preferdIndex(six)
            // // if(this.isWatch(fp)) debugger;
            // const f0 = this.Index.assignNumber(null, n0)
            // const f1 = this.Index.assignNumber(f0, n1);
            // const f2 = this.Index.assignNumber(f1, n2);
            // const f3 = this.Index.assignNumber(f2, n3);
            // const f4 = this.Index.assignNumber(f3, n4);
            // const f5 = this.Index.assignNumber(f4, n5);
            
            debugger
            return {}
        }
        
        if(this.isWatch(fp)) debugger;
        // if(!pass) debugger;

        if(eoIndex.length === 0) 
            return { completely: newP1 }

        if(![0,2,4,6].some(n => n === eoIndex.length)) 
            throw new Error('eoIndex.length ต้องเป็นเลขคู่ 0 หรือ 2 หรือ 4 เท่านั้น');

        //สลับตำแหน่ง EO
        newP1.filter(pz1 => eoIndex.some(n => n === pz1[3])).map(n => n[2] = n[2] === 'O' ? 'E' : 'O');
        // debugger
        return { nearly: newP1}
    }

    arrange = () => {
        const newFirstPrize = this.six.map(fp => {
            fp = fp.toSorted((a,b) => a - b);
            const matches = {
                completely: [], //ตรงกับทุกเงื่อนไข
                nearly: [],//ตรงเกือบทั้งหมดของทุกเงื่อนไข
            };

            const history = this.selectHistoryNumbers(fp);
            if(this.notFoundHistory(fp, history)) return null;
                
            //จัดเรียงตัวเลข
            history.map(p1 => {
                const {completely, nearly} = this.shuffle(fp, p1)
                completely && matches.completely.push(completely);
                nearly && matches.nearly.push(nearly)
            });

            if(this.isWatch(fp)) debugger;
            return matches
        }).filter(v => v !== null)

        alert('จัดเรียงตัวเลข รางวัลที่หนึ่ง สำเร็จ')
        // debugger
        return newFirstPrize;

    }
}