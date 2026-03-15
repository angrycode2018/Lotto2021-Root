// /shared/index.ts

// เพื่อให้มั่นใจว่าเมื่อใครดึง shared ไปใช้ จะมีการโหลด metadata เสมอ:
import 'reflect-metadata';
export * from './models/User.js'; 
// export * from './models/Product.js'; (ถ้ามีเพิ่มในอนาคต)

