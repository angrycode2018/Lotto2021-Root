
class Standard {
    rules = {};
    //NOTE - ต้องทำการ setConfig ก่อนใช้งาน method อื่นๆ
    setConfig(config) {
        if(!config?.Text?.hml) throw new Error('Config is required');
        this.rules.HML = config.Text.hml;
        // debugger;
    }
    //Convert Number to HML
    toHML(n=9) {
        if(!this.rules.HML) throw new Error('rules.HML is not set. Please run setConfig(config) first.');
        if(n < 0 || n > 9) throw new Error('invalid number='+n);
        const [key] = Object.entries(this.rules.HML).find(([k, range]) => {
            return range.includes(n)
        }) || [];
        if(!key) throw new Error('no matching HML for number='+n);
        return key;
    }
    //NOTE - เพิ่ม method อื่นๆ ที่นี่ ตามต้องการ
}

const Std = new Standard();
export default Std;