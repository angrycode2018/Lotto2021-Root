import { isDuplicateArray } from "../../../../src/function/common.js"
import TableEvenOdd from "./TableEvenOdd.js"
import TableLottery from "./TableLottery.js"
import TableNumber from "./TableNumber.js"
import TableNumberFlat from "./TableNumberFlat.js"
import TableRange from "./TableRange.js"


export default class LottoTable {//NOTE - ยกเลิก extends ProcessTableOutput
  table = { lottery: null, evenOdd: null, number: null, numberFlat: null, range: null }

  constructor({ record = null, histories = null, tableOutput = null, divLottery = '', divEvenOdd = '', divNumber = '', divNumberFlat = '', divRange = '', showTable = true, upDown = true,}){

    this.histories = histories.map(history => Object.freeze(history.groups))
    this.tableOutput = tableOutput;
    this.date = record.dates;
    this.#setTables({divLottery, divEvenOdd, divNumber, divNumberFlat, divRange}, showTable, upDown);
    // this.Data = new Data({histories: this.histories});//ข้อมูลสำหรับแต่ละตาราง
  }

  #setTables = ({divLottery, divEvenOdd, divNumber, divNumberFlat, divRange}, showTable=true, upDown=true) => {
    this.TB = {
      evenOdd: new TableEvenOdd(this),
      lottery: new TableLottery(this),
      number: new TableNumber(this),
      numberFlat: new TableNumberFlat(this),
      range: new TableRange(this),
    };

    divLottery ? this.TB.evenOdd.create() : false;
    divEvenOdd ? this.TB.lottery.create(upDown) : false;
    divNumber ? this.TB.number.create(upDown) : false;
    divNumberFlat ? this.TB.numberFlat.create() : false;
    divRange ? this.TB.range.create() : false;
    showTable ? this.displayTable({divLottery, divEvenOdd, divNumber, divNumberFlat, divRange}) : false;
    // debugger;
  }

  displayTable = ({ divLottery, divEvenOdd, divNumber, divNumberFlat, divRange }) => {
      const { lottery: tb_lotto, evenOdd: tb_eo, number: tb_nb, numberFlat: tb_nbFlat, range: tb_range } = this.table
      tb_lotto ? document.getElementById(divLottery).appendChild(tb_lotto) : false;
      tb_eo ? document.getElementById(divEvenOdd).appendChild(tb_eo) : false;
      tb_nb ? document.getElementById(divNumber).appendChild(tb_nb) : false;
      tb_nbFlat ? document.getElementById(divNumberFlat).appendChild(tb_nbFlat) : false;
      tb_range ? document.getElementById(divRange).appendChild(tb_range) : false;
  }

  handleEvent = () => {
    //บันทึกข้อมูลลง local storage
    const saveBtn = document.getElementById('save-result')
    saveBtn && saveBtn.addEventListener('click', () => {
      if(localStorage.myResult && saveResult.length > 0){
        let myResult = JSON.parse(localStorage.getItem('myResult'))

        //เลือกเฉพาะ saveResult ที่มีค่าไม่ซ้ำกับ local storage
        const unduplicated = saveResult.filter(({ numbers: nb1 }) => 
        myResult.find(({ numbers: nb2 }) => isDuplicateArray(nb2, nb1)) ? false: true)

          if(unduplicated.length > 0){
            myResult = [...myResult, ...unduplicated]
            localStorage.setItem('myResult', JSON.stringify(myResult))
            console.log('Save to local storage', unduplicated) 
          }else{
            alert('Nothing to save.')
          }
      }else if(saveResult.length > 0){
        localStorage.setItem('myResult', JSON.stringify(saveResult))
        console.log('Save to local storage', saveResult)
      }else if(saveResult.length === 0){
        alert('SaveResult.length = 0')
      }
    });


    //ดูข้อมูลที่บันทึกไว้
    const viewBtn = document.getElementById('view')
    viewBtn && viewBtn.addEventListener('click', e => {
      const myResult = JSON.parse(localStorage.getItem('myResult'))
      if(!myResult) return alert('no data')
      //  const filterResult = (myResult) => {
      //     return myResult.filter(({ text, numbers, EO, sum }) => 
      //     // (EO[0] === 'O' && EO[1] === 'E') && 
      //     //(text[1] !== 'M')
      //     // && numbers.find(num => num === 9 || num === 6)
      //     // oddEven(sum) === 'E'
      //     // text.find(txt => txt === 'M') //เลือกเฉพาะข้อมูลที่มีตัวเลข 4 หรือ ตัวเลข 5
      //     // && [4,6].every(v => numbers[0] !== v) //หลักร้อย ต้องไม่ใช่ 4และ6
      //     // && [1,4,6].every(v => numbers[1] !== v) //หลักสิบ ต้องไม่ใช่ 1, 4, 6
      //     ).map(({numbers}) => numbers)
      //  }
      
      console.log('ไม่มีการ filter ผลลัพธ์', myResult.map(({numbers}) => numbers))
      //  console.log('มีการ filter ผลลัพธ์', filterResult(myResult))
    });

    const clearBtn = document.getElementById('clear-btn')
    clearBtn && clearBtn.addEventListener('click', e => {
      localStorage.removeItem('myResult')
      console.log('Storage remove item myResult=', localStorage.myResult)
    })
  }

}


    



// export function showNumberTable(histories) {
//     histories = histories.map(history => history.groups)
//     const nb = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[] }

//     for(let i = 0; i < histories.length; i++) {
//         //for(let [key, value] of Object.entries(histories[i])){
//         //if(key === 'combined'){
//             histories[i].combined.map(v => typeof v === 'string' ? nb[v].push(Number(v)) : nb[v].push('X'))
//         //}
//         //}
//     }
//     // console.log('combined', nb)
//     const numTable = new Table({ tableId: 'number', newTable: true })
//     numTable.setTitle('บน - ล่าง')
//     const numBody = numTable.getBody()
//     numBody.setAttribute('style', 'text-align: center;')
//     const randomNum = []

//     for(let i = 0; i <= 9; i++) {
//         const row = numBody.addRow()
//         nb[i].map(n => {
//         n = typeof n === 'number' ? '<span style="color:blue; font-size:1.2rem">'+n+'</span>' : n;
//         const cell = row.addCell()
//         cell.innerHTML = n
//         })
//         // Returns a random integer from 0 to n:
//         const random = Math.floor(Math.random() * nb[i].length);
//         randomNum.push(nb[i][random])
//     }
//     // console.log('Random', randomNum)
//     document.getElementById('table-combined-number').appendChild(numTable.tb)
//     return nb
// }


// export function showEvenOddTable(histories, firstPrizeOnly = false) {
//     histories = histories.map(history => history.groups)
//     const setLMH = (num) => {
//       const group = Number(num) >= 0 && Number(num) <= 3 ? 'L' :
//       Number(num) >= 4 && Number(num) <= 5 ? 'M' :
//       Number(num) >= 6 && Number(num) <= 9 ? 'H' : '';
//       if(!group) throw new Error('Can not set group as num='+num)
//       return group
//     }

//     const table = new Table({ tableId: 'even-odd', newTable: true })
//     table.setTitle('Even Odd')
//     if(firstPrizeOnly === true){
//       table.getHead().setColumns(['วันที่', 'f_HML', 'b_HML', 'f_OE', 'b_OE', 'f_sum','b_sum', 'total'])
//     }else{
//       table.getHead().setColumns(['วันที่', 'first-prize', 'HML', 'two', 'OE', 'three', 'two', 'sum3', 'sum2'])
//     }
//     table.getHead().setAttribute('style', 'text-align: center;')
//     const body = table.getBody()
//     body.setAttribute('style', 'text-align: center;')

//     const data = []

//     for(let i = 0; i < histories.length; i++) {
//       const {date, prize1, digit3Up, digit2} = histories[i]
//       let sum3 = 0, sum2 = 0, frontSum = 0, total = 0;
//       const firstLMH = prize1.split('').map(num => setLMH(num))
//       const threeLMH = firstLMH.slice(3) //สามตัวท้าย
//       const frontLMH = firstLMH.slice(0,3)// สามตัวหน้า
//       const firstOE = prize1.split('').map(num => oddEven(Number(num)))
//       const threeOE = firstOE.slice(3)
//       const frontOE = firstOE.slice(0, 3)
//       const twoLMH = digit2.split('').map(num => setLMH(num))
//       const twoOE = digit2.split('').map(num => oddEven(Number(num)))
//       prize1.split('').slice(3).map(num => sum3 += Number(num))
//       prize1.split('').slice(0,3).map(num => frontSum += Number(num))
//       digit2.split('').map(num => sum2 += Number(num))
//       total = frontSum + sum3
//       if(firstPrizeOnly === true){
//         data.push({
//           LMH: { first: firstLMH, front: frontLMH, three: threeLMH }, 
//           OE: { first: firstOE, front: frontOE, three: threeOE },
//           frontSum,
//           sum3,
//           total
//         })
//       }else{
//         data.push({
//           LMH: {first: firstLMH, front: frontLMH, three: threeLMH, two: twoLMH}, 
//           OE: {first: firstOE, front: frontOE, three: threeOE, two: twoOE}, 
//           sum3,
//           frontSum,
//           total,
//           sum2
//         })
//       }

//       const row = body.addRow()
//       let rowData = []
//       if(firstPrizeOnly === true){
//         rowData = [date, frontLMH, threeLMH, frontOE, threeOE, frontSum, sum3, total]
//       }else{
//         rowData = [date, firstLMH, threeLMH, twoLMH, firstOE, threeOE, twoOE, sum3, sum2]
//       }
//       const result = rowData.map(val => {
//         const cell = row.addCell()
//         cell.innerText = val.toString().replace(/,/g,' ')
//       })

//     }
//     document.getElementById('table-even-odd').appendChild(table.tb)
//     return data
//   }


  // export function showLotteryResultTable(histories) {
  //   histories = histories.map(history => history.groups)
  //   const historyTable = new Table({ tableId: 'histories', newTable: true })
  //   const historyHead = historyTable.getHead()
  //   historyHead.setAttribute('style', 'text-align: center;')
  //   historyHead.setColumns(['วันที่', 'รางวัลที่ 1', '3ตัวบน', '2ตัวบน', '2ตัวล่าง', 'บน-ล่าง'])
  //   const historyBody = historyTable.getBody()
  //   historyBody.setAttribute('style', 'text-align: center;')

  //   //numbers รับอาเรย์ตัวเลข 0 - 9
  //   const groupNumbers = (numbers) => {
  //     const low = [], mid = [], high = [];
  //     numbers.map(num => {
  //       typeof num === 'string' && Number(num) <= 3 ? low.push(Number(num)) : false;
  //       typeof num === 'string' && Number(num) >= 4 && Number(num) <= 5 ? mid.push(Number(num)) : false;
  //       typeof num === 'string' && Number(num) >= 6 && Number(num) <= 9 ? high.push(Number(num)) : false;
  //     })
  //     return { low, mid, high }
  //   } 
  //   const winNumbers = []
    
  //   for(let i = 0; i < histories.length; i++){
  //     const dataRow = historyBody.addRow()
  //     for(let [key, value] of Object.entries(histories[i])){
  //       if(key === 'digit3') continue;
  //       const cell = dataRow.addCell()
  //       if(key === 'combined'){
  //         winNumbers.push(groupNumbers(value))
  //         value = value.map(v => typeof v === 'string' ? '<td style="padding:5px;"><span style="color: green; font-size:1.3rem; ">'+v+'</span></td>' : '<td style="padding:5px;"><span style="font-size:1.3rem; color:#e0dede;">'+v+'</span></td>')
  //         const html = `<table style="margin: auto;"><tbody><tr>${value.toString().replace(/,/g, '')}</tr></tbody></table>`
  //         cell.innerHTML = html
  //       }else{
  //         cell.innerText = cell ? value : '';
  //       }
  //     }
  //   }
  //   document.getElementById('table-lottery-result').appendChild(historyTable.tb)
  //   // console.log('history', histories)
  //   return winNumbers
  // }