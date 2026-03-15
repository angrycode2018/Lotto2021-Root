import { findMax, findMinMaxInArray, uniqueArray } from "../../../../../../function/common.js";


export default class Group {
    constructor({getYear}) {
        // this.parent = parent
        // this.manyYears(60, 67)
        this.getYear = getYear;
    }
    
    oneYear = (year = 67) => {
        const oneYear = this.getYear(year)
        const all = oneYear.map(({prize1}) => prize1.sum.total)
        const division = [10,20,30,40,50,60].map(g => all.filter(sum => sum >= (g - 10) && sum < g).sort((a,b) => a - b));
        //group ที่ออกมากกว่า 1 ครั้งใน 1 ปี
        const same = uniqueArray(all).map(sum => all.filter(val => val === sum)).filter(arr => arr.length > 1);
        // debugger
        return {year, all, division, same}
    }

    manyYears = (start = 60, end = 67) => {
        if(start > end) throw new Error('start must be less than end.');
        const report = [];
        
        for(let y = start; y <= end; y++) {
            report.push(this.oneYear(y))
        }
        // debugger
        const {division, odds, lostGroups} = this.#division(report)
        const groups = this.#multiWinGroups(report)
        return {report, multiWinGroups: groups, division, odds, lostGroups}
    }

    //แบ่งกลุ่มตามช่วง เช่น 10-19, 20-29
    #division = (report) => {
        const division = []
        report.map(({division: year}) => {
            year.map((val, idx) => {
                if(!division[idx]) division[idx] = [];
                division[idx] = [...division[idx], val].sort((a,b) => b.length - a.length);
            })
        });

        //group 20-29 ออกเฉลี่ย 12 ครั้งต่อปี
        const odds = division.map((div, idx) => {
            const count = div.map(arr => arr.length);
            const [min, max=min] = findMinMaxInArray(count);
            const total = count.reduce((a,b) => a + b);
            const average = ((total / div.length).toFixed(0))*1;// ครั้งต่อปี
            const group = idx === 0 ? [0,9] : idx === 1 ? [10, 19] : idx === 2 ? [20,29] : idx === 3 ? [30,39] : idx === 4 ? [40,49] : idx === 5 ? [50,59] : null;
            // debugger
            return {group: [group[0], 'to', group[1]], min: [min, 'ครั้งต่อปี'], avg: [average, 'ครั้งต่อปี'], max: [max, 'ครั้งต่อปี']}
        })

        //กลุ่มที่สามารถตัดทิ้งออกไปได้ avg === 0
        const lostGroups = odds.filter(obj => obj.avg[0] === 0)
        // debugger
        return {division, odds, lostGroups}
    }

    //group ที่ออกมากกว่า 1 ครั้งใน 1 ปี
    #multiWinGroups = (report = []) => {
        const same = report.map((obj) => obj.same).flat().sort((a,b) => a[0] - b[0]);
        const keys = uniqueArray(same.map(arr => arr[0]));
        const groups = keys.map(group => {
            const one = same.filter(arr => arr[0] === group)
            const count = one.map(arr => arr.length);
            const popular = count.reduce((a,b) => a + b);//แต้มยิ่งสูง ยิ่งมีโอกาสที่จะออกมากกว่า 1 ครั้งสูง
            const max = findMax(count, 1).find((v,i) => i === 0);
            const win = uniqueArray(count).sort((a,b) => a - b);
            // const str = win.toString().replace(/,/g, ' or ') + ' ครั้งต่อปี';
            // debugger
            return {group, win: [win, 'ครั้งต่อปี'], popular}
        });
        
        return groups.sort((a,b) => b.popular - a.popular)
    }

}