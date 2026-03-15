// import {parse} from 'https://cdn.jsdelivr.net/npm/date-fns/+esm';//NOTE - สำหรับ Client
import { parse, format, setMonth } from 'https://esm.sh/date-fns/';
import { th } from 'https://esm.sh/date-fns/locale/th';

export function getMonthIndex(monthName='ม.ค.') {
    // 'MMM' สำหรับชื่อย่อ (ม.ค.) หรือ 'MMMM' สำหรับชื่อเต็ม (มกราคม)
    const parsedDate = parse(monthName, 'MMM', new Date(), { locale: th });
    // ดึง index ของเดือน (0 = มกราคม, 1 = กุมภาพันธ์, ...)
    const monthIndex = parsedDate.getMonth();
    return monthIndex
}

export function getMonthName(monthIndex = 0) {
    // 1. สร้างวันที่จำลอง (ใช้วันที่ 1 เพื่อเลี่ยงปัญหาเดือนที่มีจำนวนวันไม่เท่ากัน)
    // 2. ใช้ setMonth เพื่อกำหนดเดือนตาม Index
    const date = setMonth(new Date(2026, 0, 1), monthIndex);

    // 3. ฟอร์แมตเป็นชื่อเดือน
    const monthFull = format(date, 'MMMM', { locale: th }); // "มกราคม"
    const monthShort = format(date, 'MMM', { locale: th });  // "ม.ค."
    return {short: monthShort, full: monthFull}
}