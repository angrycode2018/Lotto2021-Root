import Group from "./group/Group.js";
import HML from "./HML.js";
import Month from "./Month.js";
import Year from "./Year/Year.js";
import Review from "./review/Review.js";
import { DateTime } from "../../../../../class/utils/DateTime/DateTime.js";
import Archive from "./archive/Archive.js";

const dt = new DateTime()

class Instance extends Archive{
    constructor() {
        super();
        const {results, reviewGroup, getGroup} = new Group();//
        const {getYear, manyYears,} = new Year();//
        this.Review = new Review();//
        this.Month = new Month();//
        this.Group = {results, reviewGroup, getGroup};
        this.Year = {getYear, manyYears,};
        // debugger
    }
}
 

class InspectGroup {
    constructor(parent) {
        const {Group, Review, past} = parent;
        Object.assign(this, {Group, Review, past});
        // debugger
    }
    group = (group = 29) => {
        const review = this.Group.reviewGroup(group);
        const his = this.Group.getGroup(group);
        return {...review, ...his}
    }

    inspectGroup = () => {
        const {report, odds, multiWinGroups, lostGroups, division} = this.Review.group([...this.past.year])
        const {classify, neverWinGroups, groups, present} = this.Group.results;
        report, 
        odds,// group 20-29 ออกเฉลี่ย 12 ครั้งต่อปี
        multiWinGroups,// group ที่มีโอกาสออกมากกว่า 1 ครั้งต่อปี (popular สูง ยิ่งมีโอกาสออกสูง)
        lostGroups,// groups ที่สามารถตัดทิ้งไปได้เพราะออกน้อยมาก หรือไม่ออกเลย
        division,
        classify,// group ที่ออกบ่อยที่สุด - น้อยที่สุด
        neverWinGroups,// group ที่ไม่เคยออกรางวัล
        groups;

        return {report, odds, multiWinGroups, lostGroups, division, classify, neverWinGroups, groups, present}
    }
}


class InspectHML {
    constructor(parent) { 
        Object.assign(this, parent)
    }

    inspectHML = () => {
        const past = this.Review.hml([...this.past.year])
        const thisYear = this.Review.hml([this.present.year])
        // debugger
        return {past, thisYear}
    }
    text = (year = 67) => {
        const y = this.Year.getYear(year)
        // const data = new HML(y).H(3).M(1).L(2).get();
        // const data2 = new HML(y).M(5).get();
        return new HML(y)
    }
}

class Inspect extends Instance{
    constructor() {
        super()
        const {group, inspectGroup} = new InspectGroup(this);
        const {text, inspectHML} = new InspectHML(this);
        Object.assign(this, {group, inspectGroup}, {text, inspectHML})
        // debugger
    }
}


class History extends Inspect{
    constructor() {
        super()
        this.inspect();
    }

    inspect = () => {
        const {m} = dt.now({lang: 'en'})
        const detail = this.Month[m].review()
        const groupInfos = this.inspectGroup()
        const {past, thisYear} = this.inspectHML()
        debugger
        return {month: detail, group: groupInfos, hml: {past, thisYear}}
    }
    
}

const PastTime = new History()
export default PastTime;