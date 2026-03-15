import  {playGroundConfig as config} from "../script/config/config.global.js";
import { changeKey } from "../script/object.js";
import { getReports } from "../script/api.js";
import { Base } from "../script/filter/Base.js";
import { initLayout } from "../script/layout/layout.js";
import Std from "../script/global/standard.js";
import start from "./playground.js";

const upcomingDate = {d:16, m:1, y:69};//โปรแกรมจะทำการคำณวณหวยงวดนี้
config.Date.setUpcomingDraw(upcomingDate);
config.Numbers.setPosition('up');
config.Numbers.setDigit(3);
config.Text.setHML({H: [7,8,9], M: [3,4,5,6], L: [0,1,2]});//
config.Policy = 'risk';
config.Base.enable = 1;
// config.Base.eeeooo = 0;
// config.Base.group = 0;
// config.Base.m03 = 0;
// config.Base.oppositeNumber = 1;
// debugger;
Std.setConfig(config);

//สร้าง layout หน้า HTML
const { wrapper, main, menu, info, h4, content1, content2 } = initLayout({
  menu: 1,
  info: 1,
  h4: 1,
  content1: 1,
}); 
h4.textContent = "Playground";
document.body.appendChild(wrapper);

const layout = { wrapper, main, menu, info, h4, content1, content2 };
let reports = null;
let base = null;


config.ready(async () => {
    const date = changeKey(upcomingDate, {y: 'thisYear', m: 'month', d: 'day'})
    reports = await getReports(date);//allYear, yearly, thisYear
    console.log('reports', reports);
    base = await new Base({y: upcomingDate.y, reports});
    start({reports, config, base, layout});
})

export { reports, base, layout };