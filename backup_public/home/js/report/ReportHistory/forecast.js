

export default function forecast (array = []) {
        const fraction = []
        for(let i = 1; i < array.length; i++){
            const pick = array.filter((num, x) => x <= i)
            const above = pick.filter(num => typeof num === 'number').length
            const below = pick.filter(num => typeof num === 'string').length
            const diff = above > below ? above - below : below > above ? below - above : 0
            const obj = { 
                above, 
                below,
                diff,
                divide: [above, below].indexOf(0) === -1 ? (above >= below ? (above/below) : (below/above)).toFixed(1)*1 : [above, below].find(n => n !== 0)
            }
            fraction.push(obj)
        }
        const { above: thisAb, below: thisBl, diff, divide } = fraction[fraction.length -1]//เลือกข้อมูลล่าสุด
        const select = fraction.map((obj, x, arr) =>  obj.diff === diff && arr[x+1] ? [obj, arr[x+1]] : null ).filter(obj => obj !== null)
        //หาค่าที่ใกล้เคียงกับ divide(ล่าสุด) มากที่สุด
        const selectDivide = fraction.filter(({divide: dv}) => divide !== dv && dv >= Math.floor(divide) && dv <= Math.floor(divide)+1)
        const subtract = selectDivide.map(({divide: dv}) => (dv > divide ? dv - divide : divide - dv).toFixed(1)).map(n => Number(n))
        const min = Math.min(...subtract)
        const nearestDivide = subtract.map((nb, ix) => nb === min ? selectDivide[ix] : null).filter(obj => obj !== null)
        const next = nearestDivide.map(({above, below, diff, divide}) => {
            const idx = fraction.findIndex((fc, x) => fc.above === above && fc.below === below && fc.diff === diff && fc.divide === divide)
            return fraction[idx+1].above > above ? 'above' : fraction[idx+1].below > below ? 'below' : undefined;
        })
        // const minIdx = subtract.findIndex((num,x) => subtract.every((nb, y) => x===y ? true : num < nb ))
        // const nearestDivide = selectDivide.filter(obj => ) //ค่า devide ที่ใกล้เคียงกับ ค่า divide(ล่าสุด) มากที่สุด
        const alwaysBelow = fraction.every(({above, below}) => below > above ) && (thisBl - thisAb === 1)
        const alwaysAbove = fraction.every(({above, below}) => above > below ) && (thisAb - thisBl === 1)
        // debugger
        return fraction
    }