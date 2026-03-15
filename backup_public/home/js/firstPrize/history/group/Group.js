import { findMinMaxInArray, genArr, uniqueArray } from "../../../../../../src/function/common.js"
import { DateTime } from "../../../../../../src/class/utils/DateTime/DateTime.js";
import ReviewGroup from "./ReviewGroup.js";
import Archive from "../archive/Archive.js";
import Creator from "../../Creator.js";
import { isTod } from "../../../../../../src/function/lottery.js";

const dt = new DateTime();

class GroupHistory {
    constructor(history) {
        this.history = history;
        this.allYears = uniqueArray(history.map(({date}) => date[2]));

        this.initGroups();
        this.setHistory();
    }

    initGroups = () => {
        const groups = genArr(0, (9*6)).map(n => {
            const members = Creator.group(n).map(six => ({six, win: []}));//สมาชิกทั้งหมดของ group นี้
            // debugger
            return {
                group: n, 
                members: {all: members, ever: [], never: []},
                getSix: (fp = []) =>  members.find(({six}) => isTod(six, fp)),
                history: [], 
                win: {years: [], months: [], percent: 0},
            }
        });
        this.groups = groups
    }
    
    setHistory = () => {
        this.history.map(({date, prize1}) => {
            this.addHistory({date, prize1})
        });
        
        this.groups.map(({members}) => {
            const ever = members.all.filter(({win}) => win.length > 0);
            const never = members.all.filter(({win}) => win.length == 0);
            members.ever = ever;
            members.never = never;
        })
    }

    addHistory = ({date, prize1}) => {
        const [d, m, y] = date;
        const group = this.getGroup(prize1.sum.total)
        group.history.push({date, prize1})
        group.win.years = uniqueArray([...group.win.years, y])
        group.win.months = [...group.win.months, m].toSorted((a,b) => dt.getMonthIndex(a) - dt.getMonthIndex(b))
        group.win.percent = ((group.win.years.length / this.allYears.length) * 100).toFixed(0)*1
        // if(group.win.percent > 90)
        const six = group.getSix(prize1.number);//เลือกตัวเลขที่ถูกรางวัล
        six.win.push({date, six: prize1.number})
        // debugger
    }

    getGroup = (group = 9) => {
        const obj = this.groups.find(({group: g}) => g === group );
        if(!obj) throw new Error('not found group='+group);
        return obj
    }
}

class GroupPresentYear {
    constructor(presentYear) {
        this.presentYear = presentYear;
        this.present = this.setPresentYear();
    }
    setPresentYear = () => {
        const classify = [];
        const all = this.presentYear.map(({date, prize1}) => {
            const group = prize1.sum.total;
            const key = [10,20,30,40,50,60].findIndex(v => group < v);
            if(!classify[key]) classify[key] = [];
            classify[key].push(group);
            return {date, group }
        })
        // debugger
        return {all, classify}
    }
}

class Root extends Archive {
    constructor() {
        super()
        const {groups, getGroup} = new GroupHistory(this.past.archive);
        const {present} = new GroupPresentYear(this.present.archive)
        Object.assign(this, {groups, getGroup}, {present})
    }
}



export default class Group extends Root{
    results = {}
    constructor() {
        super()
        this.main();
    }

    main = () => {
        this.groups.sort((a,b) => b.win.percent - a.win.percent);
        this.results.neverWinGroups = this.groups.filter(({history}) => history.length === 0)
        this.results.groups = this.groups;
        this.results.present = this.present;
        this.classifyGroups()
        // this.reviewGroup(29)
    }

    reviewGroup = (group = 29) => {
        const g = this.getGroup(group)
        const {results} = new ReviewGroup(g)
        const {history, members, win} = g;
        debugger
        return {...results, history, members, win}
    }

    //group ที่มีโอกาสออกทุกปี
    classifyGroups = () => {
        // group ที่ออกบ่อยที่สุด คือ group 29 ออก 17/20 ปี
        const king = this.groups.filter(({win}) => win.percent >= 80 )
        //percent 70 - 79
        const p7079 = this.groups.filter(({win}) => win.percent >= 70 && win.percent <= 79);
        //percent 60 - 69
        const p6069 = this.groups.filter(({win}) => win.percent >= 60 && win.percent <= 69);
        //percent 50 - 59
        const p5059 = this.groups.filter(({win}) => win.percent >= 50 && win.percent <= 59);

        const p4049 = this.groups.filter(({win}) => win.percent >= 40 && win.percent <= 49);

        const p3039 = this.groups.filter(({win}) => win.percent >= 30 && win.percent <= 39);

        const p2029 = this.groups.filter(({win}) => win.percent >= 20 && win.percent <= 29);

        const p1019 = this.groups.filter(({win}) => win.percent >= 10 && win.percent <= 19);

        const p19 = this.groups.filter(({win}) => win.percent >= 1 && win.percent <= 9);

        const p0 = this.groups.filter(({win}) => win.percent === 0);


        const classify = {80: king, 70: p7079, 60: p6069, 50: p5059, 40: p4049, 30: p3039, 20: p2029, 10: p1019, 1: p19, 0: p0};
        this.results.classify = classify;
        // debugger
    }

}




