import App from "../../../../../../class/System/App.js";
import Settings from "../../settings.js";
import { DateTime } from "../../../../../../class/utils/DateTime/DateTime.js";

const dt = new DateTime();
const {setHML, setFP} = Settings;

const now = dt.now({})
// debugger

const app = new App({y: '44-'+now.y, m: '0-11', d: '1-16'}, {digit: 3})
const {histories, sortHistoryAsc, sortHistoryDesc} = app;
const history = histories.map(his => {
    let {date, prize1} = his['groups'];
    date = date.split(' ').map(v => v*1 > 0 ? v*1 : v);
    prize1 = setFP(prize1.split('').map(v => v*1));
    return {date, prize1}
});

// const app1 = new App({y: '68', m: '0-11', d: '1-16'}, {digit: 3})
// const presentYear = app1.histories.map(his => {
//     let {date, prize1} = his['groups'];
//     date = date.split(' ').map(v => v*1 > 0 ? v*1 : v);
//     prize1 = setFP(prize1.split('').map(v => v*1));
//     return {date, prize1}
// });

export {
    history,
}