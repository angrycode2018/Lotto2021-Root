import { isTod } from "../../../../../../function/lottery.js";
import NumberPosition from "./NumberPosition.js";


export default class Formula1 {
    constructor({six, Model, watch}) {
        this.six = six;
        this.Model = Model;
        this.watch = watch;
        this.position = new NumberPosition({six: this.six, Model: this.Model, watch: this.watch});
        this.main();
    }

    main = () => {
        const arrange = this.position.arrange();
        const complete = [];
        const nearby = [];
        
        arrange.map(({completely, nearly}) => {
            completely.length > 0 && complete.push(...completely);
            nearly.length > 0 && nearby.push(...nearly);
        });

        const completeSix = complete.map(six => six.map(val => val[0]))
        const nearbySix = nearby.map(six => six.map(val => val[0]))

        const found1 = completeSix.findIndex(six => isTod(six, this.watch))
        const found2 = nearbySix.findIndex(six => isTod(six, this.watch))

        if(found1 > -1) {
            const couple = this.position.couple.arrange(completeSix[found1]);
            const match = couple.map(six => six.filter((n, i) => this.watch[i] == n).length)
            debugger
        }
        debugger
    }
}