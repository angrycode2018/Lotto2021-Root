import { findMinMaxInArray, removeSameArray, uniqueArray } from "../../../../../../function/common.js";


export class HML {
    constructor(group = {group: 29, history: null, win: {}}) {
        this.group = group;
        this.getText();
        this.makeIndex();
        this.getLimit();
    }

    makeIndex = () => {
        const group = {high: [], mid: [], low: []};
        const index = this.group.history.map(({prize1}) => {
            const hIndex = [], mIndex = [], lIndex = [];
            prize1.hml.map((txt, i) => (txt === 'H' && hIndex.push(i)) || (txt === 'M' && mIndex.push(i)) || (txt === 'L' && lIndex.push(i)));
            group.high.push(hIndex);
            group.mid.push(mIndex);
            group.low.push(lIndex);
            return {h: hIndex, m: mIndex, l: lIndex}
        })

        group.high.sort((a, b) => a.length - b.length);
        // group.mid.sort((a, b) => a.length === 0 ? -1 : a[0] - b[0]);
        group.mid.sort((a, b) => a.length - b.length);
        group.low.sort((a, b) => a.length - b.length);

        this.index = {origin: index, group};
        // debugger
        return this.index
    }

    getText = () => {
        const hml = this.group.history.map(h => {
            return h.prize1.hml
        });
        this.text = hml
        return hml
    }

    sortText = () => {
        return this.text.map(txt => {
            return txt.toSorted((a,b) => {
                return a === 'H' && b === 'H' ? 0 :
                 a === 'L' && b === 'L' ? 0 :
                 a === 'H' && ['L','M'].some(v => v == b) ? 1 :
                 a === 'L' && ['M'].some(v => v == b) ? 1 :
                 a === 'L' && ['H'].some(v => v == b) ? -1 :
                 a === 'M' ? -1 : -1
             })
        })
    }

    getLimit = () => {
        let h = [], m = [], l = [];
        this.text.map(txt => {
            h.push(txt.filter(t => t === 'H').length)
            m.push(txt.filter(t => t === 'M').length)
            l.push(txt.filter(t => t === 'L').length)
        });

        // const percent = {h: 0, m: 0, l: 0}
        const percent = (some, total) => ((some / total) *100).toFixed(0)*1;
        const percentHML = (one = Number(), many = []) => percent(many.filter(nb => nb == one).length, many.length);

        const uH = uniqueArray(h.sort((a,b) => a - b))
        const uM = uniqueArray(m.sort((a,b) => a - b))
        const uL = uniqueArray(l.sort((a,b) => a - b))

        //filter ตัวที่ออกน้อย หรือ แทบจะไม่ออกเลย ออกไป ค่า default >= 10 || 20
        const pcH = uH.map(n => [ n, percentHML(n, h) ]).filter(([length, pct]) => pct >= 10)
        const pcM = uM.map(n => [ n, percentHML(n, m) ]).filter(([length, pct]) => pct >= 10)
        const pcL = uL.map(n => [ n, percentHML(n, l) ]).filter(([length, pct]) => pct >= 10)
        
        // debugger
        const [minH, maxH=minH] = pcH.length > 0 ? findMinMaxInArray(pcH.map(arr => arr[0])) : [];
        const [minM, maxM=minM] = pcM.length > 0 ? findMinMaxInArray(pcM.map(arr => arr[0])) : [];
        const [minL, maxL=minL] = pcL.length > 0 ? findMinMaxInArray(pcL.map(arr => arr[0])) : [];

        this.limit = {
            high: {min: minH, max: maxH},
            mid: {min: minM, max: maxM},
            low: {min: minL, max: maxL}
        }

        // debugger
        return this.limit

    }

}

export class EO {
    constructor(group = {group: 29, history: null, win: {}}) {
        this.group = group;
        this.main()
    }
    
    main = () => {
        this.getEO();
        this.getIndex();
        this.getLimit();
    }

    getEO = () => {
        this.eo = this.group.history.map(({prize1}) => {
            return prize1.eo
        })
    }

    getIndex = () => {
        const group = {e: [], o: []};
        const index = this.eo.map(arr => {
            const e = [], o = [];
            arr.map((char,i) => char === 'E' ? e.push(i) : o.push(i));
            group.e.push(e);
            group.o.push(o);
            return {e, o}
        })

        index.sort((a,b) => a.e.length - b.e.length)
        group.e.sort((a,b) => a.length - b.length)
        group.o.sort((a,b) => a.length - b.length)

        this.index = {origin: index, group};
        // debugger
    }

    getLimit = () => {
        let e = [], o = [];
        this.eo.map(arr => {
            e.push(arr.filter(t => t === 'E').length)
            o.push(arr.filter(t => t === 'O').length)
        });

        const percent = (some, total) => ((some / total) *100).toFixed(0)*1;
        const percentEO = (one = Number(), many = []) => percent(many.filter(nb => nb == one).length, many.length);

        const keyE = uniqueArray(e).sort((a,b) => a - b)
        const keyO = uniqueArray(o).sort((a,b) => a - b)

        //filter ตัวที่ออกน้อย หรือ แทบจะไม่ออกเลย ออกไป ค่า default >= 10 || 20
        const pcE = keyE.map(key => [ key, percentEO(key, e) ]).filter(([length, pct]) => pct >= 10)
        const pcO = keyO.map(key => [ key, percentEO(key, o) ]).filter(([length, pct]) => pct >= 10)

        const [minE, maxE=minE] = pcE.length > 0 ? findMinMaxInArray(pcE.map(arr => arr[0])) : [];
        const [minO, maxO=minO] = pcO.length > 0 ? findMinMaxInArray(pcO.map(arr => arr[0])) : [];

        this.limit = {
            even: {min: minE, max: maxE},
            odd: {min: minO, max: maxO},
        }
        // debugger
    }
}

//ข้อมูลผสมผสาน [firstPrize, HML, EO, Index]
export class Mix {
    results = { 
        origin: null, 
        sort: {number: null}, 
        couple: {
            hml: {h: [], m: [], l: []}, 
            priority: {h: null, m: null, l: null},
        }
    };
    constructor(group = {group: 29, history: null, win: {}}) {
        this.group = group;
        this.main()
    }

    main = () => {
        this.mix().sort().couple()
    }

    mix = () => {
        this.results.origin = this.group.history.map(({prize1}) => {
            return prize1.mix
        });
        debugger
        return this
    }

    sort = () => {
        const {sort, origin} = this.results;
        sort.number = origin.map(arr => {
            return arr.toSorted((a,b) => a[0] - b[0])
        });
        // debugger
        return this
    }

    // คู่ตัวเลข สูง กลาง ต่ำ [8,1,8,8,9,4] sorted => [1,4,8,8,8,9] => low = [1,4] mid = [8,8] high = [8,9]
    couple = () => {
        const {couple: {hml}, sort} = this.results;
        sort.number.map(arr => {
            hml.l.push([arr[0], arr[1]])
            hml.m.push([arr[2], arr[3]])
            hml.h.push([arr[4], arr[5]])
        })

        this.couplePriority()
        // debugger
        return this
    }

    //minimum มีค่าระหว่าง 0 - 100 ค่า default = 10 หรือ 30 (ไม่ควรต่ำกว่า 10)
    couplePriority = (minimum = 30) => {
        const hml = this.results.couple.hml;
        
        for(let key in hml) {
            const text = hml[key].map(arr => [ arr[0][1], arr[1][1] ]);
            const unique = removeSameArray(text);
            const filter = unique.map(txt => text.filter(t => t[0] === txt[0] && t[1] === txt[1]));
            const priority = filter.map(arr => {
                const txt = arr[0];
                const percent = ((arr.length / text.length) * 100).toFixed(0)*1;
                return { text: txt, percent, priority: percent < 39 ? 'low' : percent >= 40 && percent <= 69 ? 'mid' : percent >= 70 ? 'high' : null }
            });

            //NOTE - ทำการตัดกลุ่มที่มี priority น้อยที่สุดออกไป
            const selectPriority = priority.filter(({priority, percent}) => { 
                return ['high', 'mid'].some(pri => priority === pri) || (priority === 'low' && percent >= minimum)
            });
            if(selectPriority.length === 0) throw new Error('priority ต้องมีสมาชิกมากกว่า 0 ตัว');

            this.results.couple.priority[key] = selectPriority;
            // debugger
        }

        // debugger
    }
}

export class Range {
    results = {}
    constructor(group = {group: 29, history: null, win: {}}) {
        this.group = group;
        this.range()
    }

    range = () => {
        this.results.range = this.group.history.map(({prize1}) => {
            const {min, max} = prize1.range;
            return [min, max]
        }).toSorted((a,b) => a[0] - b[0])
        // debugger
    }
}

