import { Table } from "../../../../src/class/Table/Table.js"


export default class TableNumberFlat {
  constructor(parent) {
    this.histories = parent.histories;
    this.table = parent.table;
    // this.tableOutput = parent.tableOutput;
    // this.addProp = parent.addProp;
    // this.data = parent.Data.setNumberFlat();
    // debugger;
  }

    create = () => {
        const year = [], digit3 = []
        this.histories.map(result => {
          const date = result.date.slice(-2)
          const digit3Up = result.digit3Up.split('').map(num => Number(num))
          year.push(date)
          digit3.push(digit3Up)
        })
        // console.log('Output', digit3)
        const table = new Table({ tableId: 'number-flat', newTable: true })
        table.setTitle('เลขท้าย 3 ตัว แนวนอน')
        const body = table.getBody()
        body.setAttribute('style', 'text-align: center;')
        table.getHead().setColumns([ 'หลัก', ...year])
        table.getHead().setAttribute('style', 'text-align: center;')
        // console.log(table.getHead())
    
        // const roi = [], sib = [], nui = [];//ใช้ this.data แทน
        //สร้างแถว 3 แถว ร้อย สิบ หน่วย
        for(let i = 0; i < 3; i++){
          const row = body.addRow()
          row.addCell(0).textContent = i === 0 ? 'ร้อย' : i === 1 ? 'สิบ' : i === 2 ? 'หน่วย' : '';
          digit3.map(val => {
            const num = i === 0 ? val[0] : i === 1 ? val[1] : i === 2 ? val[2] : '';
            // i === 0 ? roi.push(val[0]) : i === 1 ? sib.push(val[1]) : i === 2 ? nui.push(val[2]) : '';
            row.addCell().textContent = num
          })
        }
    
        // document.getElementById(elementID).appendChild(table.tb)
        this.table.numberFlat = table.tb
        // this.output.rsn = { roi, sib, nui }
        // await this.addProp('rsn', this.data)
      }
}