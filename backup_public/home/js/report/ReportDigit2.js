

class ReportDigit2 {
    constructor() {}

    getReportDigit2() {
        console.log('getReportDigit2', this.getDataDown())
    }

    //* NEW * เลขท้าย 2 ตัวล่าง
    handleDigit2 = ({ digit2, time }) => {
        const [ second, first ] = digit2.split('').map(value => Number(value));//* second หลักสิบ , first หลักหน่วย

        //* ถ้าเป็นเลขเบิ้ล เช่น 11
        if(Number(second) === Number(first)) {
        const double = this.getNumber(first);
        double.handleDigit2Double({ digit2, time });

        //* แบบปกติ ไม่ใช่เลขเบิ้ล
        }else if(Number(second) !== Number(first)) {
        const [secondNum, firstNum] = [ this.getNumber(second), this.getNumber(first) ];
    
        firstNum.handleDigit2({ base: 'first', digit2, time });//* ตัวเลขหลักหน่วย : first : 1
        secondNum.handleDigit2({ base: 'second', digit2, time });//* ตัวเลขหลักสิบ : second : 2

        } else {
        isTrue(false, 'Something wrong')
        }
        // debugger;
    }

    //* NEW *
    getDataDown = () => {
        return this.numbers.map(num => num.scope.DOWN);
      }
}