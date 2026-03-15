

//หาตัวเลขที่ยังออกรางวัลได้อีก (ยังไม่เกินโควต้า)
export default findPotentialNumbers = () => {
        //TODO - reportHistory.findPotentialNumbers ยังต้องได้รับการพัฒนา
        console.warn('reportHistory.findPotentialNumbers ยังต้องได้รับการพัฒนา')
        return [];
        if(!this.currentWinNumber) throw new Error('No currentWinNumber, require calling countWinNumber() to create currentWinNumber.')
        const { countNum: number } = this.currentWinNumber //ข้อมูลการออกรางวัลของปีนี้ แสดงตัวเลขแต่ละตัวว่าออกรางวัลกี่ครั้ง
        const { advance } = this.upgradeData //ข้อมูลการออกรางวัลของปีก่อนๆ
        
        let belowMin = advance.filter(({ num, avg, min }) => number[num] < min || (!number[num] ? true : false))
        let belowAVG = advance.filter(({ num, avg, min }) => (number[num] >= min && number[num] < avg))
        let aboveAVG = advance.filter(({ num, avg, max }) => number[num] >= avg && number[num] <= 9)
        let top = advance.filter(({ num, avg, max }) => number[num] > 9)

        belowMin = belowMin.map(({ num }) => ({ num, thisYearCount: number[num] || 0 }))
        belowAVG = belowAVG.map(({ num }) => ({ num, thisYearCount: number[num] || 0 }))
        aboveAVG = aboveAVG.map(({ num }) => ({ num, thisYearCount: number[num] || 0 }))
        top = top.map(({num}) => ({ num, thisYearCount: number[num] || 0 }) )
        // this.potentialNumbers = [...belowAVG, ...aboveAVG].sort((a,b) => a-b)
        // this.potentialNumbers = belowMin.map(({num}) => num)
        this.potentialNumbers = []
        // stat.reportHistory.potentialNumbers.push('no value assigned')
        // debugger
        return this.potentialNumbers
    }