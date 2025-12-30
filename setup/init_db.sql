CREATE TABLE IF NOT EXISTS food_library (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fat_per_100g FLOAT,
    cholesterol_mg INTEGER,
    risk_level VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    log_date DATE DEFAULT CURRENT_DATE,
    food_id INTEGER REFERENCES food_library(id),
    actual_fat FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 真实食物数据
INSERT INTO food_library (name, fat_per_100g, cholesterol_mg, risk_level) VALUES
-- 🔴 红灯区 (高风险 - 尽量不吃)
('猪脑', 9.8, 2571, 'HIGH'),
('炸油条', 17.6, 0, 'HIGH'),
('烤羊肉串', 20.0, 100, 'HIGH'),
('红烧肉', 30.0, 100, 'HIGH'),
('咸鸭蛋黄', 33.0, 1576, 'HIGH'),
('黄油', 81.0, 215, 'HIGH'),
('猪肝', 3.5, 288, 'HIGH'),
('奶油蛋糕', 14.0, 160, 'HIGH'),

-- 🟡 黄灯区 (中风险 - 限量吃)
('鸡蛋 (全蛋)', 8.8, 585, 'MEDIUM'),
('猪瘦肉', 6.2, 81, 'MEDIUM'),
('去皮鸡腿肉', 3.9, 87, 'MEDIUM'),
('全脂牛奶', 3.2, 15, 'MEDIUM'),
('牛肉 (牛腩)', 29.0, 90, 'MEDIUM'),
('淡水鱼 (草鱼)', 2.6, 86, 'MEDIUM'),

-- 🟢 绿灯区 (低风险 - 放心吃)
('燕麦片', 6.7, 0, 'LOW'),
('西兰花', 0.3, 0, 'LOW'),
('鸡胸肉', 1.9, 60, 'LOW'),
('深海鱼 (三文鱼)', 6.3, 50, 'LOW'),
('豆腐', 3.0, 0, 'LOW'),
('脱脂牛奶', 0.1, 2, 'LOW'),
('苹果', 0.2, 0, 'LOW'),
('米饭', 0.2, 0, 'LOW'),
('玉米', 1.2, 0, 'LOW'),
('海带', 0.1, 25, 'LOW');