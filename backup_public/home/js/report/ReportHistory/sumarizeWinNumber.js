import { findMinMaxInArray, } from "../../../../../src/function/common.js";


export default function sumarizeWinNumber(data = null) {
        //REVIEW - reportHistory.sumarizeWinNumber ยังต้องได้รับการพัฒนา
        console.warn('reportHistory.sumarizeWinNumber ยังต้องได้รับการพัฒนา');

        data = data || this.storage;
        if(!data || data.length === 0) throw new Error('data countWinNumber is required.')
        
        const groupNumber = {}
        data.map(({countNum}) => {
            Object.entries(countNum).map(([key, value]) => {
                if(!groupNumber[key]) groupNumber[key] = []
                groupNumber[key].push(value)
            })
        })
        
        const final = []
        Object.entries(groupNumber).map(([key, arr]) => {
            const [min, max] = findMinMaxInArray(arr)
            const sum = arr.reduce((a,b) => a+b)
            const findAVG = arr.filter(nb => nb !== min && nb < 10 )
            const avg = (findAVG.reduce((a,b) => a+b) / findAVG.length).toFixed(0)*1
            const test = arr.map(n => n >= avg ? n : `${n}`)
            const fc = this.forecast(test)
            // debugger
            final.push({ num: Number(key), count: arr, sum, avg, min, max })
        })
        // console.log('data', data)
        // console.log('group', groupNumber)
        // console.log('final', final)
        this.upgradeData = { basic: groupNumber, advance: final }
        // debugger
        return this.upgradeData;
        // stat.reportHistory.upgradeData.push({ data, basic: groupNumber, advance: final })
    }