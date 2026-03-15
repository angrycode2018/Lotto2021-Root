import Settings  from "../../settings.js";
import { history } from "./initHistory.js";
import { EvenOdd, findMinMaxInArray, uniqueArray } from "../../../../../../function/common.js";


const {historyYear} = Settings;


class Past {
    constructor() {
        this.year = this.setYear()
        this.archive = this.query()
    }
    setYear = () => {
        const years = historyYear;
        if(!years || years.length === 0) throw new Error('history years is not set.');
        return years
    }
    query = () => {
        const [start, end] = this.year.length === 2 ? this.year : [];
        const picked = (start && end) ? 
        history.filter(draw => draw.date[2] >= start && draw.date[2] <= end) : 
        history.filter(draw => this.year.some(y => y === draw.date[2]));
        // debugger
        return picked
    }
}

class Present {
    constructor() {
        this.year = this.setYear();
        this.archive = this.query();
    }
    setYear = () => {
        const years = historyYear;
        if(!years || years.length === 0) throw new Error('history years is not set.');
        const [min, max=min] = findMinMaxInArray(years);
        return max+1;
    }

    query = () => {
        const picked = history.filter(draw => draw.date[2] === this.year);
        return picked
    }
}

//ผลการออกรางวัล
export default class Archive {
    constructor() {
        const {year: pastYear, archive: pastArchive} = new Past();
        const {year, archive} = new Present();

        this.past = {year: pastYear, archive: pastArchive}
        this.present = {year, archive};
    }
}