# 📦 清脂管家 (LipidGuard)

一个帮助高胆固醇人群控制“饱和脂肪”摄入的每日饮食记录 Web 应用。

## 🚀 核心功能

- ✅ 每日仪表盘：显示热量、饱和脂肪、胆固醇进度条
- ✅ 极简记吃：输入食物名称和分量，自动扣减额度
- ✅ 食物红黑榜：预置常见食物的风险等级
- ✅ 今日已吃列表：查看和删除今日记录
- ✅ 食物库管理：添加、删除和搜索食物

## 🛠 技术栈

- **前端**: React + Vite + TailwindCSS
- **后端**: Node.js (Express)
- **数据库**: PostgreSQL
- **部署**: Render

## 📋 部署说明 (Render)

### 1. 环境变量配置

| 变量名 | 描述 | 默认值 |
|---------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接字符串 (Render 自动提供) | - |
| `PORT` | 服务器端口 | 3000 |

### 2. 部署步骤

1. **Fork 仓库**：将本仓库 Fork 到你的 GitHub 账号
2. **创建 Render 项目**：
   - 登录 Render.com
   - 点击 "New" → "Web Service"
   - 连接 GitHub 账号
   - 选择本仓库
   - 选择分支 (main/master)
3. **配置部署设置**：
   - **Name**: lipid-guard
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: 配置上述环境变量
4. **部署项目**：点击 "Create Web Service"
5. **配置数据库**：
   - 点击 "New" → "PostgreSQL"
   - 设置数据库名称和密码
   - 点击 "Create Database"
   - 将生成的 `DATABASE_URL` 复制到 Web Service 的环境变量中

### 3. 数据初始化

部署完成后，需要初始化数据库：

1. 在 Render 控制台进入 Web Service
2. 点击 "Shell"
3. 运行命令：
   ```bash
   npm run db:init
   ```

## 🔧 本地开发

### 环境要求

- Node.js >= 18.x
- PostgreSQL >= 14.x

### 开发步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/lipid-guard.git
   cd lipid-guard
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，配置数据库连接
   ```

4. **初始化数据库**
   ```bash
   npm run db:init
   ```

5. **启动开发服务器**
   ```bash
   # 终端 1: 启动前端开发服务器
   npm run dev
   
   # 终端 2: 启动后端服务器
   npm run server
   ```

6. **访问应用**
   - 前端：http://localhost:5173
   - 后端 API：http://localhost:3000

## 📊 项目结构

```
lipid-guard/
├── server/
│   └── index.js          # 后端主入口
├── src/
│   ├── components/        # React 组件
│   ├── styles/           # 样式文件
│   ├── main.jsx          # 前端入口
│   └── App.jsx           # 主应用组件
├── setup/
│   ├── init_db.sql       # 数据库初始化脚本
│   ├── seed_real_data.sql # 真实食物数据
│   └── init_db.js        # 数据注入脚本
├── public/               # 静态资源
├── package.json          # 项目配置
├── vite.config.js        # Vite 配置
└── .gitignore           # Git 忽略配置
```

## 📄 API 文档

### 食物库 API
- `GET /api/foods` - 获取所有食物
- `GET /api/foods/search?q=xx` - 搜索食物
- `POST /api/foods` - 添加食物
- `DELETE /api/foods/:id` - 删除食物

### 日志 API
- `GET /api/logs` - 获取所有日志
- `POST /api/logs` - 添加日志
- `DELETE /api/logs/:id` - 删除日志

### 统计 API
- `GET /api/summary` - 获取今日汇总

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 📧 联系方式

如有问题，请通过 GitHub Issues 联系我们。
