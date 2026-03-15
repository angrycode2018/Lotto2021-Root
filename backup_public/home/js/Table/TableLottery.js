import { Table } from "../../../../src/class/Table/Table.js";
import { exit } from "../../../../src/function/common.js";
import Converter from "../../../../src/class/global/Converter.js";

class Row {
    newRow = (index) => {
      const draw = Object.entries(this.histories[index]).filter(([key]) => !['digit3', 'digit2Up'].some(k => k === key));
      const dataRow = this.historyBody.addRow();
      const mapKeys = this.mapKeys();
      let html = null;
      // debugger
      for(let [colName, hisName] of mapKeys) {
        const cell = dataRow.addCell();
        
        if(colName === 'HML') {
          const [, digit3] = draw.find(([key]) => key === 'digit3Up');
          cell.innerHTML = this.handleColumnHML(digit3);
          continue
        }
        
        const [key, value] = draw.find(([k, v]) => k === hisName) || exit('hisName must have value.');

        if(key !== 'commbined')
          cell.innerText = cell ? value : '';

        html = html ? html : key === 'prize1' && this.setHtml(key, value, cell,);
        // key === 'combined' && this.handleCombined(key, value, cell, html);
        if(key == 'combined') cell.innerHTML = html;
      }

    }
    //NOTE - ยกเลิก
    // handleCombined = (key, value, cell, html) => {
    //     if(key !== 'combined') return;
    //       this.winNumbers.push(this.groupNumbers(value))
    //       cell.innerHTML = html
    //       // debugger
    // }


    handleColumnHML = (three = []) => {
      three = typeof three === 'string' ? three.split('').map(n => n*1) : three.map(n => n*1);
      if(three.length !== 3) throw new Error('three.length must be 3');
      const text = this.HML(three);
      const td = ['H', 'M', 'L'].map(txt => text.some(t => t === txt) ? this.td({font: 'green'}, txt) : this.td({font:'#e0dede'}, txt));
      const table = `<div class="mytooltip">
                      <span class="mytooltiptext">L:0-2 M:3-6 H:7-9</span>
                      <table style="margin: auto;">
                        <tbody>
                          <tr>
                          ${td.toString().replace(/,/g, '')}
                          </tr>
                        </tbody>
                      </table>
                    </div>`
      return table
    }

    td = (color={font: '', bg: ''}, value = null) => {
      return `<td style="padding:5px; background-color: ${color.bg}">
                <span style="color: ${color.font}; font-size:1.3rem;">${value}</span>
              </td>`
    }

    setHtml = (key, value, cell,) => {
        if(key !== 'prize1') return null;
        const arr = [null, null, null, null, null, null, null, null, null, null ];
          const p1 = value.split('').map(n => arr[n] = n);
          // debugger
          const list = arr.map((v, i) => 
            v !== null ? this.td({font: 'green'}, v) //'<td style="padding:5px;"><span style="color: green; font-size:1.3rem; ">'+v+'</span></td>' 
            : this.td({font: '#e0dede'}, i) //'<td style="padding:5px;"><span style="font-size:1.3rem; color:#e0dede;">'+i+'</span></td>'
          );
          const html = `<table style="margin: auto;"><tbody><tr>${list.toString().replace(/,/g, '')}</tr></tbody></table>`
          return html
    }

 
}


export default class TableLottery extends Row{
  constructor(parent) {
    super()
    this.histories = parent.histories;
    this.table = parent.table;
    // this.tableOutput = parent.tableOutput;
    // this.addProp = parent.addProp;
    // this.winNumbers = parent.Data.setLottery();
    // this.text = parent.Data.text;
    // this.HML = parent.Data.HML;
    const c = new Converter()
    this.HML = c.HML;//แปลง [9,2,5] เป็น [H,L,M]
    // debugger;
  }

  // [ชื่อคอลัมน์, historyKey]
  mapKeys = () => {
    return [
      ['วันที่', 'date'],
      ['รางวัลที่ 1', 'prize1'],
      ['3ตัวบน', 'digit3Up'],
      ['HML', ''],
      ['2ตัวล่าง', 'digit2'],
      ['บน-ล่าง', 'combined'],
    ]
  }

  create = () => {
      this.historyTable = new Table({ tableId: 'histories', newTable: true })
      this.historyHead = this.historyTable.getHead()
      this.historyHead.setAttribute('style', 'text-align: center;')
      this.historyHead.setColumns([ ...this.mapKeys().map(([colName]) => colName) ])
      this.historyBody = this.historyTable.getBody()
      this.historyBody.setAttribute('style', 'text-align: center;')
      // debugger
      
      for(let i = 0; i < this.histories.length; i++){
        this.newRow(i)
      }
      // debugger
      // document.getElementById(elementID).appendChild(historyTable.tb)
      // console.log('history', histories)
      this.table.lottery = this.historyTable.tb
      // this.output.lottery = winNumbers
      // debugger;
      // await this.addProp('lottery', this.winNumbers)
  }
} 


