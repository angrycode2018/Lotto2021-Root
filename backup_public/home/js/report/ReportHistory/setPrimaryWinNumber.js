import { isObject, } from "../../../../../src/function/common.js";

const minMax = (val) => {
    const isNumber = typeof val === 'number';
    const isString = typeof val === 'string';
    const isArray = Array.isArray(val);
    const isObj = isObject(val);
    if(isArray) throw new Error('unhandle condition');
    return isNumber ? [val, val] : isString ? val.split('-').map(v => v*1) : isObj ? [val.min, val.max] : [];
}

//winNumber ของ primary date
export default async function setPrimaryWinNumber() {
        if(!this.date) throw new Error('primary date is required.');
        let {day, month, year} = this.record.dates.primary;

        const [dMin, dMax] = minMax(day)
        const [mMin, mMax] = minMax(month);
        const [yMin, yMax] = minMax(year);
        // debugger
        let histories = [];
        if(dMin > dMax && mMin > mMax) {
            const app1 = await this.record.app({y: yMin === yMax ? yMin : `${yMin}-${yMax}`, m: mMin, d: dMin}, {digit: 3});
            const app2 = await this.record.app({y: yMin === yMax ? yMin : `${yMin}-${yMax}`, m: mMax, d: dMax}, {digit: 3});
            histories = [...app1.histories, ...app2.histories];
            // debugger
            if(histories.length === 0) 
                return console.error('fail to set primary win number for date='+day+month+year);
            return this.primaryWinNumber = this.countPrimary(histories, {day, month, year});
        }
        // debugger
        const app = await this.record.app({ 
            y: yMin === yMax ? yMin : `${yMin}-${yMax}`, 
            m: mMin === mMax ? mMin : `${mMin}-${mMax}`, 
            d: dMin === dMax ? dMin : `${dMin}-${dMax}`,  
        }, {digit: 3});

        if(!app || app?.histories?.length === 0) 
            return console.error('fail to set primary win number for date='+day+month+year);
        
        // debugger
        return this.primaryWinNumber = this.countPrimary(app.histories, {day, month, year});
    }