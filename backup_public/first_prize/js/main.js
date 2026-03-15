import {hello} from './func.js'
import { App } from "../../../class/App.js"
import { showEvenOddTable, showLotteryResultTable } from '../../lotto_result_table/js/dom.js';
import { getRandomInt } from '../../../function/common.js';


hello()
const present = new App({y: '66', m: '6', d: '16'}, {digit:3})
document.getElementById('present-result').textContent = 'รางวัลที่ 1 '+present.histories[0].groups.prize1

const app1 = new App({y: `56-65`, m: '6', d: '16'}, {digit: 3});
// const x = showLotteryResultTable(app1.histories)
const result_EO = showEvenOddTable(app1.histories, true)
const text = result_EO.map(({ LMH, OE }) => ({ LMH: LMH.first, OE: OE.first }))
// console.log(result_EO)

const lmh = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[] }
const oe = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[] }
const hSum = [], mSum = [], lSum = []

const firstPrize = app1.histories.map(({groups}, idx) => { 
    let {date, prize1} = groups
    let h = 0, m = 0, l = 0;
    prize1 = prize1.split('').map(num => Number(num))
    const sum = prize1.reduce((a,b) => a + b )
    const {LMH, OE} = text[idx]
    LMH.map((char, i) =>  lmh[i].push(char))
    OE.map((char, i) => oe[i].push(char))
    LMH.map(char => char === 'H' ? h++ : char === 'M' ? m++ : char === 'L' ? l++ : false)
    hSum.push(h)
    mSum.push(m)
    lSum.push(l)
    return {date, prize1, LMH, OE, sum, h, m, l}
 })
 console.log(firstPrize)
 console.log({hSum, mSum, lSum})

 const _lmh = [], _oe = [];
 //นับจำนวน L M H และ O E ว่ามีอย่างละกี่ตัว
 for(let i = 0; i <=5; i++){
    let h = 0, m = 0, l = 0;
    let e = 0, o = 0;
    const a = lmh[i]
    const x = oe[i]
    a.map(char => char === 'H' ? h++ : char === 'M' ? m++ : char === 'L' ? l++ : false )
    x.map(char => char === 'O' ? o++ : char === 'E' ? e++ : false )
    _lmh.push({char: a, h, m, l})
    _oe.push({char: x, e, o})
 }
 console.log(_lmh)
 console.log(_oe)

const randomLMH = _lmh.map(({char}) => char[getRandomInt(char.length -1)])
const randomOE = _oe.map(({char}) => char[getRandomInt(char.length -1)] )
console.log({randomLMH, randomOE})
