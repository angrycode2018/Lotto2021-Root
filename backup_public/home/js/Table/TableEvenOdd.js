import { Table } from "../../../../src/class/Table/Table.js";

export default class TableEvenOdd {
    constructor(parent) {
      this.histories = parent.histories;
      this.table = parent.table;
      // this.tableOutput = parent.tableOutput;
      // this.addProp = parent.addProp;
      this.data = parent.tableOutput.evenOdd;// parent.Data.setEvenOdd();
      // debugger
    }

    create =  (upDown = true) => {    
        const table = new Table({ tableId: 'even-odd', newTable: true })
        table.setTitle('Even Odd')
        if(upDown === false){
          table.getHead().setColumns(['วันที่', 'f_HML', 'b_HML', 'f_OE', 'b_OE', 'f_sum','b_sum', 'total'])
        }else{
          table.getHead().setColumns(['วันที่', 'first-prize', 'HML', 'two', 'OE', 'three', 'two', 'sum3', 'sum2'])
        }
        table.getHead().setAttribute('style', 'text-align: center;')
        const body = table.getBody()
        body.setAttribute('style', 'text-align: center;')
    
        for(let i = 0; i < this.data.length; i++) {
          const {date, LMH, OE, sum3, sum2, frontSum, total} = this.data[i];
          const {first: firstLMH, front: frontLMH, three: threeLMH, two: twoLMH} = LMH;
          const {first: firstOE, front: frontOE, three: threeOE, two: twoOE} = OE;

          const row = body.addRow()
          let rowData = [];
          if(upDown === false){
            rowData = [date, frontLMH, threeLMH, frontOE, threeOE, frontSum, sum3, total]
          }else{
            rowData = [date, firstLMH, threeLMH, twoLMH, firstOE, threeOE, twoOE, sum3, sum2]
          }
          const result = rowData.map(val => {
            const cell = row.addCell()
            cell.innerText = val.toString().replace(/,/g,' ')
          })
    
        }
        // document.getElementById(elementID).appendChild(table.tb)
        this.table.evenOdd = table.tb
        // this.output.evenOdd = data
        // await this.addProp('evenOdd', this.data)
    }
}