
//config for date
export default class Date {
    constructor(setDraw) {
        // this.event = event;
        this.setDraw = setDraw;//นำเข้ามาจาก Numbers
    }
    /** หวยงวดนี้ ถ้าต้องการคำนวณหวยงวด 16 ธ.ค. 68 ให้ระบุวันที่ 16 ธ.ค. 68
     * @param {object} object {d: number, m: number, y: number} */
    setUpcomingDraw({d=1, m=11, y=68}) {
        if(this._upcoming) throw new Error('Config upcoming draw is already set.');
        if([d,m,y].some(v => !Number.isFinite(v))) throw new Error('invalid d m y');
        this._upcoming = {d, m, y};
        this.setDraw({d, m, y})
        // this.event.fire('upcomingDraw', {d,m,y})
    }

    get upcoming() {
        if(!this._upcoming) throw new Error('upcoming draw is not set.');
        return this._upcoming
    }
}