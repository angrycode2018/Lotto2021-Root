import { Table } from "../../../../src/class/Table/Table.js"


export default class TableNumber {
  constructor(parent) {
    this.histories = parent.histories;
    this.table = parent.table;
    // this.tableOutput = parent.tableOutput;
    // this.addProp = parent.addProp;
    this.data = parent.tableOutput.number;// parent.Data.setNumber();
  }

    //upDown = true แสดงผล บน-ล่าง  upDown = false แสดงเฉพาะ บน
      create = ( upDown = true) => {
        const nb = upDown ? this.data.upDown : this.data.up;
    
        const numTable = new Table({ tableId: 'number', newTable: true })
        numTable.setTitle(upDown ? 'บน - ล่าง' : 'บน')
        const numBody = numTable.getBody()
        numBody.setAttribute('style', 'text-align: center;')
        const randomNum = [];
    
        for(let i = 0; i <= 9; i++) {
            const row = numBody.addRow()
            nb[i].map(n => {
            n = typeof n === 'number' ? '<span style="color:blue; font-size:1.2rem">'+n+'</span>' : n;
            const cell = row.addCell()
            cell.innerHTML = n
            })
            // Returns a random integer from 0 to n:
            const random = Math.floor(Math.random() * nb[i].length);
            randomNum.push(nb[i][random])
        }
        // console.log('Random', randomNum)
        // document.getElementById(elementID).appendChild(numTable.tb)
        this.table.number = numTable.tb
        // this.output.number = nb
        // await this.addProp('number', nb)
    }
}