import HML from "./HML.js";
import Group from './Group.js';
import { isTod } from "../../../../../../function/lottery.js";
import { removeExactArray, sortNumber } from "../../../../../../function/common.js";
import Year from "../Year/Year.js";

class Extension {
    constructor() {
        this.Year = new Year()
        const {manyYears, oneYear} = new Group({getYear: this.Year.getYear})
        // const {textFormat, reviewTextFormat, L, M, H, history: his, setHistory} = new HML({getYear: this.Year.getYear})
        
        this.Group = {manyYears, oneYear};
        // this.HML = {textFormat, reviewTextFormat, L, M, H, history: his, setHistory}
    }
}

export default class Review extends Extension{
    constructor() {
        super()
        // this.parent = parent;
    }

    group = (year = []) => {
        if(!Array.isArray(year)) throw new Error('year must be Array.');
        year = year.sort((a,b) => a - b);
        const [start, end] = year.length === 2 ? year : [];
        // const {manyYears, oneYear} = new Group({getYear: this.getYear})
        
        if(start && end) {
            const report = this.Group.manyYears(start, end)
            // debugger
            return report
        }else {
            const report = year.map(y => this.Group.oneYear(y))
            // debugger
            return report
        }
    }

    hml = (year = []) => {
        if(!Array.isArray(year)) throw new Error('year must be Array.');
        const {textFormat, reviewTextFormat, L, M, H, setHistory, history} = new HML({getYear: this.Year.getYear})
        setHistory(year);

        const sortedText = textFormat.map(format => sortNumber(format));
        // debugger
        
        const [hi, mid, low] = [H, M, L].map(char => {
            const reviewIndex = [0,1,2,3,4,5].map(index => char.reviewIndex(index).sort((a,b) => b.win - a.win));
            const reviewNumber = char.member.map(nb => {
                const review = char.reviewNumber(nb);
                const [low, high] = [[0,2], [3,5]].map(pair => review.filter(obj => obj.index >= pair[0] && obj.index <= pair[1]));
                low.sort((a,b) => b.win - a.win) && high.sort((a,b) => b.win - a.win);
                return { number: nb, index: {low, high} }
            });
            // debugger
            return {index: reviewIndex, number: reviewNumber}
        });

        //ออกบ่อย
        const [ L1, L2, L3, ] = [1,2,3,].map(n => L.reviewLength(n))
        const [ M1, M2, M3, ] = [1,2,3,].map(n => M.reviewLength(n))
        const [ H1, H2, H3, ] = [1,2,3,].map(n => H.reviewLength(n))

        //ออกน้อย
        const [ L0, L4, L5, L6 ] = [0,4,5,6].map(n => L.reviewLength(n))
        const [ M0, M4, M5, M6 ] = [0,4,5,6].map(n => M.reviewLength(n))
        const [ H0, H4, H5, H6 ] = [0,4,5,6].map(n => H.reviewLength(n))

        function inspectTextFormat(sortedText, totalYear) {
            const stat = sortedText.map(arr => {
                const uniq = removeExactArray(arr)
                const variant = uniq.map(([k1, k2, k3]) => {
                    const count = [arr.filter(([f1, f2, f3]) => k1 == f1 && k2 == f2 && k3 == f3).length, 'ครั้ง'];
                   return {
                        format: [k1,k2,k3],
                        total: count,
                        avg: [(count[0] / totalYear).toFixed(1)*1, 'ครั้งต่อปี'],
                   }
                })
                return {format: uniq, variant}
            })
            // debugger;
            return stat
        }

        const allFormat = sortedText.map(arr =>  removeExactArray(arr));
        
        // Format LMH ที่ออกบ่อย [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1], [2,2,2]
        const {byFormat, byYear, byDetail} = reviewTextFormat(allFormat.flat());
        const totalYear = byYear.length;
        const stat = inspectTextFormat(sortedText, totalYear);

        //format ที่ออกมากกว่า 1ครั้งต่อปี
        const favorite = stat.map(({variant}) => {
            const pick = variant.filter(({avg}) => avg[0] >= 1)
            return pick.length > 0 ? pick : undefined
        }).filter(v => v);

        //format ที่ออกมากกว่า 2ครั้งต่อปี
        const fiveStars = stat.map(({variant}) => {
            const pick = variant.filter(({avg}) => avg[0] >= 1.8)
            return pick.length > 0 ? pick : undefined
        }).filter(v => v);

        // debugger
        return {
            textFormat: sortedText,
            textFormat2: {all: stat, favorite, fiveStars},
            report1: {hi, mid, low}, 
            report2: {
                L: {L0, L1, L2, L3, L4, L5, L6},
                M: {M0, M1, M2, M3, M4, M5, M6},
                H: {H0, H1, H2, H3, H4, H5, H6}
            },
            report3:  {byFormat, byYear, byDetail},
        }
    }

}