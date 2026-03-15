import { isTod } from "../../../../function/lottery.js"
import NumberPosition from "./arrange/formula1/NumberPosition.js"
import Creator from "./Creator.js"
import Filter from "./filter/Filter.js"
import Prototype from "./filter/Config.js"
import { removeExactArray } from "../../../../function/common.js"
import Formula1 from "./arrange/formula1/Formula1.js"

function set(six = []) {
    const group = six.reduce((a,b) => a+b, 0);
    return {group, watch: six}
}

const jan1 = [7,3,0,2,0,9];//21
const jan16 = [8,0,7,7,7,9];//38 *ไม่พบ
const feb1 = [5,5,8,7,0,0];//25
const feb16 = [8,4,7,3,7,7];//36
const mar1 = [8,1,8,8,9,4];//38 *ไม่พบ
const mar16 = [7,5,7,5,6,3];//33
const apr1 = [6,6,9,6,8,7];//42*ไม่เคยออก
const apr16 = [2,6,6,2,2,7];//25*ไม่พบ
const may1 = [2,1,3,3,8,8];//25
const may16 = [2,5,1,3,0,9];//20
const jun1 = [5,5,9,3,5,2];//29*ไม่พบ
const jun16 = [5,0,7,3,9,2];//26
const july1 = [9,4,9,2,4,6];//34
const july16 = [2,4,5,3,2,4];//20
const aug1 = [8,1,1,8,5,2];//25

const {group, watch} = set(jun1)

export class Constant {
    static _group = group;
    static _watch = watch;
    static _Model = new Prototype(group).Model;
    
    static get group() {
        return this._group;
    }
    static get watch() {
        return this._watch;
    }
    static get Model() {
        return this._Model;
    }
}

export default class FirstPrize {
    constructor(){
        this.Model = Constant.Model;
        this.watch = Constant.watch;
        // debugger
        this.main()
    }
    
    main = () => {
        this.create();
        this.filter();
        this.arrangeFirstPrize();
    }

    checkWatch = () => {
        if(this.watch.length === 0) return true;
        const found = this.findFirstPrize(this.watch);
        return found ? true : false;
    }

    //สร้างตัวเลข รางวัลที่หนึ่ง
    create = () => {
        this.six = this.Model.review.members.never.map(({six}) => six);//เอาเฉพาะตัวเลขที่ยังไม่เคยออกรางวัล
        if(!this.checkWatch()) {
            const ever = this.watch.length == 6 ? this.Model.review.members.ever.find(({six}) => isTod(six, this.watch)) : null;
            const msg = ever ? 'ตัวเลข '+this.watch+' เคยออกรางวัลไปแล้ว' : 'คาดว่าจะพบรางวัลที่ 1 แต่ไม่พบ';
            debugger;
            throw new Error(msg);
        }
        debugger
    }

    // คัดกรองตัวเลข ให้ตรงกับ config
    filter = () => {
        if(!this.Model) throw new Error('fail to create Filter for group='+this.group);
        this.Selector = new Filter({Model: this.Model, watch: this.watch})
        if(!this.Selector) throw new Error('ไม่สามารถทำการ filter ได้ เนื่องจาก group='+this.group+' ไม่เคยออกรางวัล');
        
        const reduced = this.six.filter(fp => {
            return this.Selector.match(fp)
        });
        debugger;
        this.six = reduced;

        if(!this.checkWatch()) throw new Error('ไม่พบรางวัลที่ 1');
        debugger
    }
    
    //จัดเรียงตัวเลข
    arrangeFirstPrize = () => {
        if(!this.Model) return;
        //จัดเรียงตัวเลขตาม history
        const f1 = new Formula1({six: this.six, Model: this.Model, watch: this.watch})
        debugger
    }


    //ค้นหารางวัลที่ 1
    findFirstPrize = (numbers = [5,5,7,9,9,0]) => {
        // const { filter, reject } = this.six
        //หาจากตัวเลขที่ผ่านการคัดกรอง
        const found = this.six.find(fp => {
            const fp2 = [...fp]
            return numbers.every(nb => fp2.indexOf(nb) !== -1 ? fp2.splice(fp2.indexOf(nb),1) : false)
        })
        
        return found

        //หาจากตัวเลขที่ไม่ผ่านการคัดกรอง
        // if(!found){
        //     const found2 = reject.find(fp => {
        //         const fp2 = [...fp]
        //         return numbers.every(nb => fp2.indexOf(nb) !== -1 ? fp2.splice(fp2.indexOf(nb),1) : false)
        //     })
        //     if(!found2) throw new Error('กรุณาตรวจสอบ คาดหวังว่าจะพบรางวัลที่ 1 แต่ ไม่พบรางวัลที่ 1')
        //     console.log('ค้นเจอรางวัลที่ 1 จากตัวเลขที่ไม่ผ่านการคัดกรอง', found2)
        //     return found2
        // }
    }

}





//คัดกรองรางวัลที่ 1 ที่ตรงกัลเงื่อนไข
    // filterFirstPrize = (firstprize = [5,5,7,9,9,0]) => {
    //     const EO = firstprize.map(nb => this.evenOdd(nb))
    //     const HML = firstprize.map(nb => this.hml(nb))
    //     const sum = {
    //         front: firstprize.filter((n,i) => i >= 0 && i <= 2).reduce((a,b) => a+b), 
    //         back: firstprize.filter((n,i) => i >= 3 && i <= 5).reduce((a,b) => a+b), 
    //         total: firstprize.reduce((a,b) => a+b)
    //     }
    //     const [min, max] = findMinMaxInArray(firstprize)

    //     const E = EO.filter(txt => txt === 'E')
    //     const high = HML.filter(txt => txt === 'H')
    //     const mid = HML.filter(txt => txt === 'M')
    //     const low = HML.filter(txt => txt === 'L')
    //     const match = [3,4,5].some(n => E.length === n) && [1,2,3].some(n => mid.length === n) && (sum >= 20 && sum <= 29)
    //     // return match
    //     // return min === 1 && max === 9 && sum.total === 38
    //     return sum.total === 29 && (high.length >= 2 && high.length <= 4) && (mid.length >= 0 && mid.length <= 3) && (low.length >= 1 && low.length <= 3)
    // }



// buildDigit2 = (init = [0,1,2,3,4,5,6,7,8,9]) => {
    //     this.init.map((sib, j) => this.init.map((nui, k) => {
    //         if(k >= j) this.digit2.push([sib, nui])
    //     }))
    // }

    //สร้าง digit3 จาก digit2
    // buildDigit3 = () => {
    //     for(let i = 0; i <= 9; i++){
    //         const one = this.digit2.filter(([sib, nui]) => sib === i)
    
    //         one.map(([sib, nui]) => {
    //             const combine =  [], double = []
    //             this.init.map(roi => {
    //                 if(roi < nui) return;
    //                 if(roi !== sib && roi !== nui && sib !== nui)
    //                     combine.push([roi, sib, nui])
    //                 else
    //                     double.push([roi, sib, nui])
    //             })
    //             this.digit3.push(...combine)
    //             this.digit3Double.push(...double)
    //         })
    //     }
    // }