import Archive from "../archive/Archive.js";

export default class Year extends Archive{
    constructor() {
        super();
        this.history = this.past.archive;
        this.presentYear = this.present.archive;
        // this.review([57, 67])
        // debugger
    }

    manyYears = (years = [48, 67]) => {
        const [min, max=min] = years.sort((a, b) => a - b);
        const allYears = [];
        for(let y = min; y <= max; y++) {
            const oneYear = this.getYear(y);
            allYears.push({year: y, history: oneYear})
        }
        this.allYears = allYears;
        return allYears
    }

    getYear = (year=67) => {
        const history = year === this.presentYear[0].date[2] ? this.presentYear : this.history;
        const filter = history.filter(({date, prize1}) => {
            const [d, m, y] = date;
            const is30Dec = (d, m, y, year) => {
                return [30,31].some(n => n == d) && m === 'ธ.ค.' && y == year;
            }
            return(y === year && !is30Dec(d,m,y, year) || is30Dec(d, m, y, year-1)) 
        });
        // debugger
        return filter
    }

    // review = (year = [50, 67]) => {
    //     if(!Array.isArray(year)) throw new Error('year must be Array.');
        
    //     const review = new Review(this)
    //     const group = review.group(year)
    //     const hml = review .hml(year)
    //     debugger
    //     return {group}
    // }

}











