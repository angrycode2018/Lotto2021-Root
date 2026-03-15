 import { findMinMaxInArray, uniqueArray, oddEven, isDuplicateArray, removeDuplicate, getRandomInt, genArr } from "../../../../function/common.js" 
import { genLekTod } from "../../../../function/lottery.js";

 const getPercent = (parcial, total) => Number(((parcial / total) * 100).toFixed(0))

    export class RANDOM {
        output;
        constructor(output){
            this.output = output
        }

        cheatRandom = ({limit = 5, lekDub = [0,1,9], lekWing = [3,6,7]}) => {
            const message = 'cheatRandom ค่า limit ถูกกำหนดให้มีค่า default = 5 คุณแน่ใจหรือว่าต้องการใช้ค่าที่คุณกำหนดเอง'
            if(limit !== 5 && !confirm(message)) return false; 
            if(!(limit >= 1 && limit <= 10)) return console.error('ค่า limit ไม่ถูกต้อง ')
            limit = (10 - lekDub.length) < limit ? (10 - lekDub.length) : limit;//แก้ infinite loop

            const randomDigit = () => {
                let result = [], randomNum = null;
                do{
                    randomNum = getRandomInt(9)
                    const match = result.every(num => num !== randomNum) && lekDub.every(n => randomNum !== n )
                    match ? result.push(randomNum) : false;
                }while(result.length < limit)
                return result
            }

            const roi = getRandomInt(1) === 0 ? [0,1,2,3,4] : [5,6,7,8,9]
            const sib = getRandomInt(1) === 0 ? [0,1,2,3,4] : [5,6,7,8,9]
            const nui = getRandomInt(1) === 0 ? [0,1,2,3,4] : [5,6,7,8,9]

            const digit3 = [], noHML = [], noLekWing = [];
            roi.map(r => sib.map(s => nui.map(n => {
                const hml = [r,s,n].map(num => [0,1,2,3].some(n => num === n) ? 'L' : [4,5].some(n => num === n) ? 'M' : 'H' )
                const [ H, M, L ] = [ hml.filter(txt => txt === 'H'), hml.filter(txt => txt === 'M'), hml.filter(txt => txt === 'L') ];
                const matchHML = ([0,1,2].some(num => H.length === num) && [0,1,2].some(num => M.length === num) && [0,1,2].some(num => L.length === num))
                const matchLekWing = lekWing.length > 0 ? lekWing.some(num => [r,s,n].some(nb => num === nb)) : true;
                const duplicate = digit3.some(arr => {
                    const temp = [r,s,n]
                    return arr.every(num => temp.indexOf(num) !== -1 ? temp.splice(temp.indexOf(num), 1) : false) 
                })
                // if(duplicate) debugger
                if(matchHML && matchLekWing && !duplicate){
                    digit3.push([r,s,n])
                }else if(!matchHML && !duplicate){
                    noHML.push([r,s,n])
                }else if(!matchLekWing && !duplicate){
                    noLekWing.push([r,s,n])
                }
            })))
            debugger
            return digit3
        }

        //สุ่มตัวเลขหวย ใช้คู่กับตาราง LotteryResult
        //limit = 5 ทำการสุ่มไม่เกิน 5 ตัวเลข
        randomByGroup = (limit = 5) => {
            const low = [0,1,2,3]
            const mid = [4,5]
            const high = [6,7,8,9]
            const winNumbers = this.output.lottery

            //random จาก 0 ถึงจำนวน n
            const random = (n) => Math.floor(Math.random() * (n+1))

            //สุ่มเลือกตัวเลขจากอาเรย์ จำนวน min - max 
            const selectNumberFromArray = (arr, min, max) => {
            let result = [], round;
            max = max > limit ? limit : max
            //กำหนดจำนวนรอบของลูป ถ้าจำนวนรอบน้อยกว่า min ให้ทำการ random ใหม่
            do { 
                round = random(max)
            } while(round < min)

            for(let i = 0; i < round; i++){
                let idx, found;
                do {
                idx = random(arr.length - 1)
                found = result.find(v => Number(v) === Number(arr[idx]))
                } while(typeof found === 'number')//ไม่เอาเลขซ้ำ
                result.push(arr[idx])
            }
            limit = limit - result.length
            return result
            }

            //รับค่า winNumbers มาจาก showLotteryResultTable
            //filter ถ้ามีการระบุเข้ามา จะเป็นการเลือกเฉพาะข้อมูลที่ต้องการ แต่ถ้าไม่ระบุเข้ามาจะเลือกทั้งหมด
            const setMinMaxForMidHigh = (winNumbers = [], filter={lowLength: undefined, midLength: undefined}) => {
                const _default = []
                const setMinMax = (winNumbers = [], group = 'low') => {
                    const countWin = {}
                    let min = undefined, max = undefined
                    winNumbers.map((win) => {
                        countWin[win[group].length] = !countWin[win[group].length] ? 0 : countWin[win[group].length]
                        countWin[win[group].length]++
                    })

                    const keys = Object.keys(countWin).map(n => Number(n))
                    if(keys.length === 0) throw new Error('unexpected result')

                    if(keys.length === 1){
                        return [min, max] = [ keys[0] , keys[0] ]

                    }else if( keys.length === 2){
                        const pk0 = getPercent(countWin[keys[0]], winNumbers.length);
                        const pk1 = getPercent(countWin[keys[1]], winNumbers.length);
                        if(pk1 > pk0){
                            return [min, max] =  pk1 >= 80 ? [keys[1], keys[1]] : keys[0] > keys[1] ? [keys[1], keys[0]] : [keys[0], keys[1]];
                        }else if(pk0 > pk1){
                            return [min, max] =  pk0 >= 80 ? [keys[0], keys[0]] : keys[0] > keys[1] ? [keys[1], keys[0]] : [keys[0], keys[1]];
                        }else{
                            return [min, max] = [keys[0], keys[1]]
                        }

                    }else if(keys.length === 3){
                        const kmax = keys.find((k,idx) => keys.every((ky,i) => idx === i ? true : countWin[k] > countWin[ky]))
                        const kmin = keys.find((k,idx) => keys.every((ky,i) => idx === i ? true : countWin[k] < countWin[ky]))
                        const kmid = keys.find(k => k !== kmax && k !== kmin)

                        const error1 = [kmax, kmin].every(val => !val && val !== 0)
                        const error2 = !error1 && (!kmin && kmin !== 0)
                        const error3 = !error1 && !error2 && (!kmax && kmax !== 0)
                    
                        if(error1){//ไม่มี kmax และไม่มี kmin (ทุกตัวเท่ากัน)
                            const equal = keys.every((k,i) => countWin[keys[0]] === countWin[k])
                            if(equal) return [min, max] = findMinMaxInArray(keys)
                            if(!equal) throw new Error('unexpected result')
                        }else if(error2){//มี kmax แต่ไม่มี kmin (มี max 1ตัว และตัวที่เหลือเท่ากัน)
                            if(Number(getPercent(countWin[kmax], winNumbers.length)) >= 80) 
                            return [min, max] = [kmax, kmax]
                            const restKeys = keys.filter(k => k !== kmax)
                            const equal = restKeys.every(k => countWin[restKeys[0]] === countWin[k])
                            if(equal) return findMinMaxInArray(keys)
                            if(!equal) throw new Error('unexpected result')
                        }else if(error3){//ไม่มี kmax แต่มี kmin
                            const restKeys = keys.filter(k => k !== kmin)
                            const [count1, count2] = restKeys.map(k => countWin[k])
                            if(getPercent(count1 + count2, winNumbers.length) >= 80)
                            return [min, max] = findMinMaxInArray(restKeys)
                            return [min, max] = findMinMaxInArray(keys)
                        }
                        const percent = getPercent(countWin[kmax] + countWin[kmid], winNumbers.length)
                        if(Number(percent) >= 80 ) {
                            return [min, max] =  (kmid < kmax ? [kmid, kmax] : [kmax, kmid]) 
                        }else{
                            return [min, max] = findMinMaxInArray([kmax, kmid, kmin])
                        }

                    }else if(keys.length === 4) {
                        const kmax = keys.find((k,idx) => keys.every((ky,i) => idx === i ? true : countWin[k] >= countWin[ky]))
                        const kmax2 = keys.find((k,idx) => keys.every((ky,i) => idx === i || kmax === ky ? true : countWin[k] >= countWin[ky]))
                        const error = (!kmax && kmax !== 0) || (!kmax2 && kmax2 !== 0)
                        // debugger
                        if(error) {
                            const equal = keys.every((k,i) => countWin[keys[0]] === countWin[k]) //ถ้าทุกตัวเท่ากัน
                            if(!equal) debugger //throw new Error('unexpected result')
                            if(equal) return [min, max] = findMinMaxInArray(keys)
                        }

                        const percent = getPercent(countWin[kmax] + countWin[kmax2], winNumbers.length)
                        if(Number(percent) >= 80 ) {
                            return [min, max] = kmax2 < kmax ? [kmax2, kmax] : [kmax, kmax2]
                        }else{
                            return [min, max] = findMinMaxInArray(keys)
                        }
                    }

                    if((!min && min !== 0) || (!max && max !== 0)) throw new Error('unexpected result min = '+ min + ' max = '+max)
                    // return [min, max]
                }

                const [lMin, lMax] = setMinMax(winNumbers, 'low')
                if(lMin === undefined || lMax === undefined) throw new Error('Can not set Min and Max')

                for(let i = lMin; i <= lMax; i++){
                    const winLow = winNumbers.filter(win => win.low.length === i)
                    let [mMin, mMax = mMin] = setMinMax(winLow, 'mid')
                    let [hMin, hMax = hMin] = setMinMax(winLow, 'high')

                    if((mMin === undefined && mMax === undefined) || (hMin === undefined && hMax === undefined)) throw new Error('Can not set Min and Max')
                    _default.push({ length: i, low: {min: lMin, max: lMax}, mid: {min: mMin, max: mMax}, high: {min: hMin, max: hMax} })
                }
                
                //กรณีมีการระบุ filter เข้ามา
                if(filter.lowLength !== undefined && filter.midLength !== undefined) {
                    const {lowLength, midLength} = filter
                    const custom = winNumbers.filter(win => win.low.length === lowLength && win.mid.length === midLength)
                    if(custom.length === 0) return _default
                    
                    let [hMin, hMax = hMin] = setMinMax(custom, 'high')
                    if(hMin === undefined || hMax === undefined) throw new Error('Can not set value for HighMin & HighMax')
                    return [hMin, hMax]

                }else{//ถ้าไม่ได้ระบุ filter เข้ามาจะส่งกลับ _default
                    return _default
                }
            }

            const settings = setMinMaxForMidHigh(winNumbers);
            const { low: {min: lmin, max: lmax} } = settings[0];
            console.log('settings',settings);

            const lowResult = selectNumberFromArray(low, lmin, lmax)
            
            const { mid: {min: mMin, max: mMax}, high: {min: hMin, max: hMax} } = settings.find(({length}) => length === lowResult.length)
            const midResult = selectNumberFromArray(mid, mMin, mMax);// 0, 2 สุ่มตัวเลขจำนวน 0 - 2 ตัว
            
            // let [hMin, hMax] = setMinMaxForMidHigh(winNumbers, {lowLength: lowResult.length, midLength: midResult.length})
            // let { high: {min: hMin, max: hMax} } = settings.find(({mid}) => midResult.length >= mid.min && midResult.length <= mid.max)
            const highResult = selectNumberFromArray(high, hMin, hMax);// 1, 2 สุ่มตัวเลขจำนวน 1 - 2 ตัว

            const resultRandom = {low: lowResult, mid: midResult, high: highResult }
            // console.log(`ทำการสุ่มตัวเลขจากกรุ๊ป low จำนวน ${lowMin}-${lowMax} ตัว กรุ๊ป mid จำนวน ${mMin}-${mMax} ตัว กรุ๊ป high จำนวน ${hMin}-${hMax} ตัว`, resultRandom)
            return resultRandom

        }

        //สุ่มตัวเลข 3ตัว จากผลการออกรางวัลในอดีต
        newRandom = ({amount = 10}) => {
            const newRandom = []
            while(newRandom.length < amount){
                const random = Object.entries(this.output.rsn).map(([key, numbers]) => {
                const num = numbers[ getRandomInt(numbers.length -1) ]
                const txt = num >= 0 && num <= 3 ? 'L' : num >= 4 && num <= 5 ? 'M' : 'H'
                return num
                })
                //ไม่เอาตัวที่ซ้ำกัน แบบตรง และ โต๊ด
                const same = newRandom.some(numbers => {
                const random2 = [...random]
                return numbers.every((nb) => random2.some((n, idx) => n === nb ? random2.splice(idx,1) : false))
                })
                if(!same) newRandom.push(random)
            }
            console.log('newRandom', [...newRandom].sort((a,b) => a[0]-b[0]))
        }


        genDigit3FromRandom = ({ resultRandom = [], range = [4,5,6], tod = true }) => {
            const output = []
            resultRandom.map(n1 => resultRandom.map(n2 => {
              const diff = n1 > n2 ? n1 - n2 : n2 - n1;
              if(range.some(nb => Number(nb) === diff)){
                const [min, max = min] = findMinMaxInArray([n1, n2])
                if((!min && min !== 0) || (!max && max !== 0) ) throw new Error('Can not set min or max')
                const rest = resultRandom.filter(nb => nb >= min && nb <= max)
                if(rest.length > 0){
                  rest.map(numb => {
                    const same = output.some(three => { 
                      const digits = [min, numb, max]
                      return three.every(nb => digits.some((d, i) => d === nb ? digits.splice(i,1) : false) )
                    });
                    !same ? output.push([min, numb, max]) : false;
                  })
                } 
              }
            }))
            
            if(tod){
              return output.map(three => genLekTod(three).map(arr => arr.split('').map(nb => Number(nb)) )).flat()
            }else{
              console.log('OUTPUT Range '+range, output)
              return output
            }
        }
    }
    

