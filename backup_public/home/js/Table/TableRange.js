import { Table } from "../../../../src/class/Table/Table.js"

export default class TableRange {
  constructor(parent) {
    this.histories = parent.histories;
    this.table = parent.table;
    // this.tableOutput = parent.tableOutput;
    this.date = parent.date.primary;
    // debugger
  }

    //TODO - ยังไม่สมบูรณ์
    create = () => {
        console.warn('Table range ยังไม่เสร็จสมบูรณ์')
        const storage = JSON.parse(localStorage.getItem('range'))
        if(!storage) return console.error('No localstorage')
        const totalColumns = storage.find(range =>  storage.every(r => range.length >= r.length)).length
    
        const table = new Table({ tableId: 'range', newTable: true })
        table.createColGroup().addCol({colSpan: 6, backgroundColor: '#F2F4F4'})
        table.createColGroup().addCol({colSpan: 6, backgroundColor: ''})
        table.createColGroup().addCol({colSpan: 6, backgroundColor: '#F2F4F4'})
    
        table.setTitle('Range ส่วนต่างของตัวเลข max-min เช่น 542 จะได้ 5-2 = 3')
        // debugger
        if(this.date.month){
          const {min: mStart, max: mEnd} = this.date.month;
          table.getHead().setColumns([mStart !== mEnd ? `${mStart}-${mEnd}`: mStart])
        }else{
          table.getHead().setColumns(['unset'])
        }
        table.getHead().setAttribute('style', 'text-align: center;')
        table.getHead().cells[0].setAttribute('colspan',totalColumns)
    
        const body = table.getBody()
        body.setAttribute('style', 'text-align: center;')
    
        storage.map(range => {
          const row = body.addRow()
          for(let i = range.length -1; i >= 0; i--){
            const num = range[i]
            const html = [4,5,6].some(n => n == num) ? `<span style='color:orange'>${num}</span>` 
            : [2,3,7,8].some(n => n == num) ? `<span style='color:#FF3FA4'>${num}</span>` : num ;
            row.addCell().innerHTML = html
          }
        })
        this.table.range = table.tb
    }
}