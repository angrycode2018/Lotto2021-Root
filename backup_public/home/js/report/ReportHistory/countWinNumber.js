
//report แบบรายปี นับจำนวนครั้งที่ตัวเลขนั้นออกรางวัล เช่น ปี 55 ตัวเลข 0 ออกจำนวนกี่ครั้ง
//**ใช้เพิ่มข้อมูลลง storage ทีละปี
//ตัวอย่าง await report.countWinNumber({year: '66'})
export default async function countWinNumber({ year = '55', month = '11', day = '1-16', saveData = false }) {
        //FIXME - month 0-10
        console.warn('การทำงานของ method countWinNumber ต้องการการตรวจสอบ');
        if(typeof year !== 'string' || year.split('-').length !== 1) throw new Error('invalid year. year must be String like "65" only');
        const previousMonths = Number(month) > 1 ? '0-'+(Number(month)-1) : Number(month) == 0 ? '11': '0';
        const previousDate = {y: Number(month) == 0 ? (year-1) : year, m: previousMonths, d: day};//d: Number(month) == 0 ? '1-16': '1-31'
        const previous = await this.record.app(previousDate, {digit: 3}); //new App({y: year, m: previousMonths, d: '1-31'}, {digit: 3});
        const thisMonth = day === '1' ? await this.record.app({y: year, m: month, d: day}, {digit:3})  : [];//new App({y: year, m: month, d: day}, {digit:3})
        // debugger

        if(thisMonth.length > 0)
        thisMonth.histories.map((his, i) => {
            let {date} = his['groups']
            const sameDate = previous.histories.some((h, j) => {
                let { date: d } = h['groups']
                date = date.replace(/\s/g, '')
                d = d.replace(/\s/g, '')
                if(date == d) previous.histories.splice(j, 1)
            })
        })
        const histories = thisMonth.histories ? [...thisMonth.histories, ...previous.histories] : previous.histories
    
        const numb = {}
        histories.map((his, i) => {
            let { date, digit3Up, prize1 } = his['groups'];
            const three = digit3Up.split('').map(num => Number(num))
            three.map(nb => {
                if(!numb[nb]) numb[nb] = 0
                numb[nb]++
            })
        })
        this.currentWinNumber = { y: Number(previous.y), countNum: numb };
        if(saveData) 
            this.saveStorage(this.currentWinNumber)
        // stat.reportHistory.currentWinNumber.push(this.currentWinNumber)
        // debugger
        return this.currentWinNumber
    }