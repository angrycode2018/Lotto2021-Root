import { findMax, findMinMaxInArray, removeSameArray, uniqueArray } from "../../../../../function/common.js";
import { DateTime } from "../../../../../class/utils/DateTime/DateTime.js";
import Archive from "./archive/Archive.js";

const dt = new DateTime();

const months = {};
dt.monthEN.map(name => {
    months[name] = class {
        detail = {}
        constructor(history) {
            const mIndex = dt.getMonthIndex(name)
            this.name = dt.getMonthText(mIndex)
            this.setHistory(history)
        }

        setHistory = (history) => {
            const name = this.name;
            this.history = history.filter(({date}) => {
                const [d, m, y] = date;
                const is30Dec = ([30,31].some(n => n == d) && m === 'ธ.ค.');
                const addDay = name === 'ม.ค.' && is30Dec
                if(name === 'ม.ค.') {
                    return m === name || addDay;
                }
                else if(name === 'ธ.ค.') {
                    return m === name && !is30Dec
                }
                return m === name
            })
        }

        review = (filter = {d: [], y: []}) => {
            let history = this.history;
            const {d=[], y=[]} = filter;
            if(d.length > 0) {
                const [min, max=min] = [d[0], d[1]];
                history = history.filter(({date}) => {
                    return date[0] >= min && date[0] <= max
                })
            }

            this.detailDate(history)
            this.detailSum(history)
            this.detailMinMax(history)
            this.detailHML(history)
            this.detailEO(history)
            // debugger
            return this.detail
        }

        detailDate = (history) => {
            const dates = history.map(({date}) => date);
            this.detail.dates = dates;
        }

        detailSum = (history) => {
            const sum = history.map(his => {
                const {front, back, total} = his.prize1.sum;
                return [front, back, total]
            }).toSorted((a,b) => a[2] - b[2]);
    
            const group = [ [0,19], [20,29], [30,39], [40,49] ].map(([min, max]) => sum.filter(([front, back, total]) => total >= min && total <= max))
    
            const front = history.map(his => {
                return his.prize1.sum.front
            }).toSorted((a,b) => a - b);
    
            const back = history.map(his => {
                return his.prize1.sum.back
            }).toSorted((a,b) => a - b);

            //หา group ที่ออกบ่อยที่สุด
            const output = [10,20,30].map(sib => {
                const output = [ [1,2,3], [4,5,6], [7,8,9] ].map(nui => {
                    const groups = nui.map(n => sib + n);
                    return sum.filter((arr) => groups.some(g => g == arr[2]))
                });
                return output
            }).flat();

            //group ที่ออกบ่อยที่สุด
            const [max] = findMax(output.map(arr => arr.length), 1);
            const most = output.filter(arr => arr.length == max);
            const first = most.map(arr => uniqueArray(arr.map(([,,sum]) => sum))).flat();

            //group ที่ออกรองลงมา
            const [sub] = findMax(output.filter(arr => arr.length !== max).map(arr => arr.length), 1);
            const test = output.filter(arr => arr.length == sub);
            const second = test.map(arr => uniqueArray(arr.map(([,,sum]) => sum))).flat();

            this.detail.mostWinGroups = {gold: first, silver: second}
            this.detail.sum = { sum, group, front, back }
            // debugger
        }

        detailMinMax = (history) => {
            const minmax = history.map(his => {
                const {min, max} = his.prize1.range
                return [min, max]
            }).toSorted((a,b) => a[0] - b[0] );
    
            const unique = removeSameArray(minmax);
            const diff = unique.map(([min, max]) => min > max ? min - max : max - min).toSorted((a,b) => a - b)
            const diffSort = uniqueArray(diff).toSorted((a,b) => a - b)
            this.detail.range = { minMax: minmax, unique, diff: diffSort }
            // debugger
        }

        detailHML = (history) => {
            const hml = history.map(his => {
                // console.log(his.prize1.hml)
                return his.prize1.hml
            });

            //ขั้นที่หนึ่ง หาจำนวน Min Max
            const h = [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0] ]; // [ จำนวนตัว, จำนวนครั้งที่ออก ]
            const m = [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0] ];
            const l = [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0] ];

            hml.map(text => {
                const countH = (text.filter(txt => txt === 'H').length);
                const countM = (text.filter(txt => txt === 'M').length);
                const countL = (text.filter(txt => txt === 'L').length);

                h.find(arr => arr[0] === countH && arr[1]++)
                m.find(arr => arr[0] === countM && arr[1]++)
                l.find(arr => arr[0] === countL && arr[1]++)
            });

           const percentH = h.map(([a,b]) => [a, ((b / hml.length)*100).toFixed(0)*1] ).toSorted((a,b) => b[1] - a[1])
           const percentM = m.map(([a,b]) => [a, ((b / hml.length)*100).toFixed(0)*1] ).toSorted((a,b) => b[1] - a[1])
           const percentL = l.map(([a,b]) => [a, ((b / hml.length)*100).toFixed(0)*1] ).toSorted((a,b) => b[1] - a[1])

           const select = (percent) => {
            let sum = 0;
            const plus = (value) => sum += value;
            return percent.filter(([a,b]) => b >= 10 && sum < 70 && plus(b) )
           }

            const selectH = select(percentH).map(([a,b]) => a);// b >= 10 เปอร์เซนต์
            const selectM = select(percentM).map(([a,b]) => a);// b >= 10 เปอร์เซนต์
            const selectL = select(percentL).map(([a,b]) => a);// b >= 10 เปอร์เซนต์

            const [hMin, hMax] = findMinMaxInArray(selectH)
            const [mMin, mMax] = findMinMaxInArray(selectM)
            const [lMin, lMax] = findMinMaxInArray(selectL)

            const minMax = {h: {min: hMin, max: hMax}, m: {min: mMin, max: mMax}, l: {min: lMin, max: lMax}}


            //ขั้นที่สอง หา Index
            const index = {h: [], m: [], l: []};
            hml.map(arr => {
                const idxH = arr.map((char, i) => char === 'H' ? i : null).filter(val => val !== null)
                const idxM = arr.map((char, i) => char === 'M' ? i : null).filter(val => val !== null)
                const idxL = arr.map((char, i) => char === 'L' ? i : null).filter(val => val !== null)

                index.h.push(idxH)
                index.m.push(idxM)
                index.l.push(idxL)
            });

            let uniqueH = [1,2,3,4,5,6].map(n => index.h.filter(arr => arr.length === n).sort((a,b) => a[0] - b[0]))
            let uniqueM = [1,2,3,4,5,6].map(n => index.m.filter(arr => arr.length === n).sort((a,b) => a[0] - b[0]))
            let uniqueL = [1,2,3,4,5,6].map(n => index.l.filter(arr => arr.length === n).sort((a,b) => a[0] - b[0]))

            const [ h1, h2, h3, h4, h5 ]  = uniqueH.map(arr => removeSameArray(arr)).filter(arr => arr.length > 0)
            const [ m1, m2, m3, m4, m5 ] = uniqueM.map(arr => removeSameArray(arr)).filter(arr => arr.length > 0)
            const [ l1, l2, l3, l4, l5 ] = uniqueL.map(arr => removeSameArray(arr)).filter(arr => arr.length > 0)

           const winIndex = {
                high: {h1, h2, h3, h4, h5},
                mid: {m1, m2, m3, m4, m5},
                low: {l1, l2, l3, l4, l5},
            }

            this.detail.hml = {text: hml, minMax, index: winIndex}
            // debugger
        }

        detailEO = (history) => {
            const eo = history.map(his => {
                return his.prize1.eo
            })
            const [E, O] = ['E', 'O'].map(char => {
                return eo.map(arr => arr.filter(txt => txt === char).length)
            });

            E.sort((a,b) => a - b);
            O.sort((a,b) => a - b);

            const [e0, e1, e2, e3, e4, e5, e6] = [0,1,2,3,4,5,6].map(n => ((E.filter(nb => nb === n).length / eo.length)*100).toFixed(0)*1 )
            const [o0, o1, o2, o3, o4, o5, o6] = [0,1,2,3,4,5,6].map(n => ((O.filter(nb => nb === n).length / eo.length)*100).toFixed(0)*1 )

            const percent = {even: {e0, e1, e2, e3, e4, e5, e6}, odd: {o0, o1, o2, o3, o4, o5, o6}};
            const selectE = Object.entries(percent.even).filter(([k,v]) => v >= 10)
            const selectO = Object.entries(percent.odd).filter(([k,v]) => v >= 10)
            const [minE, maxE] = findMinMaxInArray(selectE.map(([k, v]) => k.split('')[1]*1))
            const [minO, maxO] = findMinMaxInArray(selectO.map(([k, v]) => k.split('')[1]*1))
            const minMax = {even: {min: minE, max: maxE}, odd: {min: minO, max: maxO} }



            let eIndex = [ [], [], [], [], [], [], [] ];
            let oIndex = [ [], [], [], [], [], [], [] ];
            eo.map(arr => {
                const e = arr.map((char, i) => char === 'E' ? i : null).filter(v => v !== null)
                const o = arr.map((char, i) => char === 'O' ? i : null).filter(v => v !== null)
                // debugger
                e.length > 0 && eIndex[e.length].push(e);
                o.length > 0 && oIndex[o.length].push(o);
                // debugger
            });

            eIndex = eIndex.map(arr => removeSameArray(arr).sort((a,b) => a[0] - b[0]))
            oIndex = oIndex.map(arr => removeSameArray(arr).sort((a,b) => a[0] - b[0]))

            const [, ei1, ei2, ei3, ei4, ei5, ei6] = eIndex;
            const [, oi1, oi2, oi3, oi4, oi5, oi6] = oIndex;
            const index = {
                even: {e1: ei1, e2: ei2, e3: ei3, e4: ei4, e5: ei5, e6: ei6 },
                odd: {o1: oi1, o2: oi2, o3: oi3, o4: oi4, o5: oi5, o6: oi6},
            }

            this.detail.eo = {text: eo, minMax, index}
            // debugger
        }
    }
})


export default class Month extends Archive{
    constructor() {
        super()
        this.history = this.past.archive;
        this.init(this.history)
        // debugger
    }
    
    init = (history) => {
        const {Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Oct, Nov, Sep, Dec} = months;
        // debugger
        this.Jan = new Jan(history);
        this.Feb = new Feb(history);
        this.Mar = new Mar(history);
        this.Apr = new Apr(history);
        this.May = new May(history);
        this.Jun = new Jun(history);
        this.Jul = new Jul(history);
        this.Aug = new Aug(history)
        this.Sep = new Sep(history);
        this.Oct = new Oct(history);
        this.Nov = new Nov(history);
        this.Dec = new Dec(history);
        // const jan = new Jan(history)
        // jan.review()
    }
    
}