import express from 'express';
import connectDB from '#root/src/mongoDB/db/db';  // Import ฟังก์ชันเชื่อมต่อ
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // 1. Import the middleware
import userRoutes from '#root/src/api/routes/user.routes';
import playgroundRoutes from '#root/src/api/routes/playground.routes';
import performanceRoutes from '#root/src/api/routes/performance.routes'
import funcRoutes from '#root/src/api/routes/func.routes';
import productRoutes from '#root/src/api/routes/product.routes';//ใช้ทดสอบ รับ-ส่งข้อมูล จาก MongoDB
import outputRoutes from '#root/src/api/routes/output.routes';//
import dbRoutes from '#root/src/api/routes/db.routes';
// import homeRoutes from '#root/src/api/routes/home.routes';

// เชื่อมต่อฐานข้อมูลทันทีที่เริ่ม Server
connectDB();

// ES Module ไม่มี __dirname ให้สร้างเอง
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Static files
const home = path.join(__dirname, 'public')
app.use(express.static(home));
// Parse JSON body
app.use(express.json());
// Enable CORS for your specific frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5500' 
}));


// Routes
app.use('/users', userRoutes);
// app.use('/home', homeRoutes);//lotto_result_table
app.use('/playground', playgroundRoutes);
app.use('/performance', performanceRoutes);
app.use('/func', funcRoutes);//เรียกใช้ function จาก Server
app.use('/products', productRoutes);//ใช้ทดสอบ รับ-ส่งข้อมูล จาก MongoDB
app.use('/output', outputRoutes);//ผลลัพธ์จาก class ต่างๆ
app.use('/db', dbRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Access the playground at http://localhost:${port}/playground`);
});
