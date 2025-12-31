import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// 配置环境
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

// 🌟 关键修改：智能判断连接方式
// 如果有 DATABASE_URL (云端模式)，就用 connectionString
// 否则用原来的本地配置
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // 云端连接必须开启 SSL
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(dbConfig);

async function initDb() {
  try {
    console.log('🔌 正在连接数据库...');
    
    // 读取 SQL 文件内容
    const sqlPath = path.join(__dirname, 'seed_real_data.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ 错误：找不到 setup/seed_real_data.sql 文件！');
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 执行 SQL
    console.log('🚀 正在注入真实数据...');
    await pool.query(sql);
    
    console.log('✅ 成功！真实食物数据已注入数据库。');
    
    // 验证一下
    const res = await pool.query('SELECT count(*) FROM food_library');
    console.log(`📊 当前食物库总数: ${res.rows[0].count} 条`);

  } catch (err) {
    console.error('❌ 注入失败:', err);
  } finally {
    await pool.end();
  }
}

initDb();