// setup/init_db.js 
import pg from 'pg'; 
import fs from 'fs'; 
import path from 'path'; 
import dotenv from 'dotenv'; 
import { fileURLToPath } from 'url'; 

// 配置环境 
dotenv.config(); 
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
const { Pool } = pg; 

// 连接配置 
const pool = new Pool({ 
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT, 
}); 

async function initDb() { 
  try { 
    console.log('🔌 正在连接数据库...'); 
    
    // 1. 读取 SQL 文件内容 
    // 注意：这里我们读取的是 seed_real_data.sql (真实数据)，而不是旧的 init_db.sql 
    const sqlPath = path.join(__dirname, 'seed_real_data.sql'); 
    
    if (!fs.existsSync(sqlPath)) { 
      console.error('❌ 错误：找不到 setup/seed_real_data.sql 文件！'); 
      process.exit(1); 
    } 

    const sql = fs.readFileSync(sqlPath, 'utf8'); 

    // 2. 执行 SQL 
    console.log('🚀 正在注入真实数据...'); 
    await pool.query(sql); 
    
    console.log('✅ 成功！真实食物数据已注入数据库。'); 
    
    // 3. 验证一下 
    const res = await pool.query('SELECT count(*) FROM food_library'); 
    console.log(`📊 当前食物库总数: ${res.rows[0].count} 条`); 

  } catch (err) { 
    console.error('❌ 注入失败:', err); 
  } finally { 
    await pool.end(); 
  } 
} 

initDb();
