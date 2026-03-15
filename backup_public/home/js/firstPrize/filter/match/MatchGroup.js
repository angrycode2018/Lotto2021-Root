import PastTime from "../../history/history.js";
import Settings from "../../settings.js";
import Base from "./Base.js";

const past = PastTime.inspect();
const {setFP, options: {mode}} = Settings;


class Group {
    constructor() {
        const {classify, lostGroups, odds, multiWinGroups, present, report} = past.group;
        this.lostGroups = lostGroups.map(({group}) => group)
        const [gold, silver, bronze] = [[80,70], [60,50], [40,30]].map(([k0, k1]) => {
            return {[k0]: classify[k0], [k1]: classify[k1]}
        })
        this.rating = {gold, silver, bronze};
        this.present = present;
        this.multiWinGroups = multiWinGroups;
        this.report = report;
        // debugger
    }

    odd = (group = 29) => {
        const {odds} = past.group;
        const found = odds.find(({group: [from,,to]}) => group >= from && group <= to);
        if(!found) throw new Error('not found odds for group='+group);
        return found
    }

}


export default class MatchGroup extends Base{
    constructor(watch) {
        super()
        this.watch = watch;
        this.Group = new Group()
    }

    match = (firstprize = [5,5,7,9,9,0]) => {
        this.pass = undefined;
        this.firstprize = setFP(firstprize)
        this.isLostGroup()
        this.quota()
        this.multiWin()
        this.goldSiverBronze()
        // debugger
        if([true, false].every(v => v !== this.pass )) throw new Error('pass value is invalid.');
        return this.pass
    }

    isLostGroup = () => {
        if(this.pass === false) return false;
        const {lostGroups} = this.Group;
        const group = this.firstprize.sum.total;
        const lost = lostGroups.some(([from,,to]) => group >= from && group <= to);
        if(lost) throw new Error(`group=${group} เป็นกรุ๊ปที่ไม่มีความสำคัญ คุณไม่จำเป็นต้องสนใจกรุ๊ปนี้`)
        this.pass = !lost;
        if(this.break()) debugger;
    }

    quota = () => {
        if(this.pass === false) return false;
        const group = this.firstprize.sum.total;
        const { group: [from,, to], min, avg, max} = this.Group.odd(group);
        const {present} = this.Group;
        // debugger
        const found = present.classify.find(arr => {
            if(!arr) return false;
            return arr[0] >= from && arr[0] <= to
        });
        if(!found) throw new Error('not found group='+group);
        const msg = `ปีนี้ group ${from}-${to} ออกไปแล้ว ${found.length} ครั้ง `;
        const msg1 = ['min', 'avg', 'max'].find((txt,i) => {
            const val = i == 0 ? min[0] : i == 1 ? avg[0] : max[0];
            return found.length < val
        });
        // debugger
        if(!msg1) throw new Error(msg + 'ซึ่งได้ออกจนครบเต็มจำนวนแล้ว');
        const msg2 = 'ซึ่งยังคงน้อยกว่า จำนวน '+msg1;
        console.log(msg+msg2)
        this.pass = msg1 ? true : false;
        // debugger
        if(this.break()) debugger;
    }

    multiWin = () => {
        if(this.pass === false) return false;
        const group = this.firstprize.sum.total;
        const {present, multiWinGroups} = this.Group;
        const isMultiWin = multiWinGroups.find(gp => gp.group == group);
        
        //group นี่้ออกไปกี่ครั้งแล้ว ในปีนี้
        const found = (present.classify.find(arr => {
            if(!arr) return false;
            return arr.some(gp => gp == group)
        }) || []).filter(gp => gp == group);

        //ถ้าโหมดใช้งานจริง 
        if(mode.test == false) {
            const err = () =>  {throw new Error('group='+group+' ออกครบเต็มจำนวน limit แล้ว')};
            //ถ้าเป็น group ทั่วไป ไม่ใช่ multiWin จะไม่ออกมากกว่า 1ครั้งต่อปี
            (!isMultiWin && found.length > 0) && err();
            //group นั้น ออกเกิน limit แล้ว
            (isMultiWin && !isMultiWin.win[0].some(v => v > found.length)) && err();
        }
        
        this.pass = true
        // debugger
        if(this.break()) debugger;
    }

    goldSiverBronze = () => {
        if(this.pass === false) return false;
        const group = this.firstprize.sum.total;
        const {gold, silver, bronze} = this.Group.rating;
        const gName = ['gold', 'silver', 'bronze'].find((name, i) => {
            const rating = i == 0 ? gold : i == 1 ? silver : bronze;
            const found = Object.values(rating).some(arr => {
                return arr.some(obj => obj.group == group)
            });
            return found
        });
        if(!gName) throw new Error('คุณควรเลือกใช้เฉพาะ Group gold, silver, bronze groupของคุณคือ group='+group);

        this.pass = true;
        // debugger
        if(this.break()) debugger;
    }

}