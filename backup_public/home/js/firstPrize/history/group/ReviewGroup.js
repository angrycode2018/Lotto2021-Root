import {HML, EO, Mix, Range} from "./Property.js"

export default class ReviewGroup {
    results = { group: Number() };
    constructor(group = {group: 29, history: null, win: {}}) {
        this.group = group;
        this.results.group = group.group;
        this.main();
    }

    main = () => {
        this.hml().eo().mix().range()
    }

    hml = () => {
        const hml = new HML(this.group)
        const {text, index, limit} = hml;
        const sortText = hml.sortText();
        this.results.hml = {text: {origin: text, sorted: sortText}, index, limit}
        // debugger
        return this
    }

    eo = () => {
        const {eo, index, limit} = new EO(this.group)
        this.results.eo = {text: eo, index, limit};
        // debugger
        return this
    }

    mix = () => {
        const {results} = new Mix(this.group)
        this.results.mix = results;
        // debugger
        return this
    }

    range = () => {
        const {results} = new Range(this.group)
        this.results.range = results.range
        // debugger
        return this
    }

}