import "reflect-metadata"; // เพิ่มไว้บรรทัดบนสุดของไฟล์ User.ts หรือ index.ts
import { Expose } from 'class-transformer';
// import { Type } from 'class-transformer';

export class User {
  @Expose() // ใส่ไว้เพื่อให้ TS สร้าง Metadata
  id!: number;
  @Expose() 
  firstName!: string;
  @Expose() 
  lastName!: string;

  // Method ที่คุณต้องการใช้ทั้งสองฝั่ง
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  getGreeting() {
    return `สวัสดีครับ ผมคือ ${this.getFullName()}`;
  }
}
